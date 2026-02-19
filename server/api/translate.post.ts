/**
 * POST /api/translate
 *
 * Server-side translation endpoint called by the Sanity TranslateAction.
 * The OPENAI_API_KEY is ONLY available here (server-side) and is never
 * sent to the browser.
 *
 * Body: {
 *   documentId: string
 *   documentType: string
 *   doc: Record<string, any>
 *   from: 'nl' | 'en'
 *   to: 'nl' | 'en'
 *   textFields: string[]
 *   blockFields: string[]
 * }
 *
 * Response: { patch: Record<string, any> }
 */

import OpenAI from 'openai'

type Locale = 'nl' | 'en'

const LANG_NAMES: Record<Locale, string> = { nl: 'Dutch', en: 'English' }

function getOpenAI(): OpenAI {
  // Read from Nuxt runtime config (server-side) or fall back to process.env
  const config = useRuntimeConfig()
  const key = (config as any).openaiApiKey || process.env.OPENAI_API_KEY
  if (!key) throw new Error('OPENAI_API_KEY is not configured on the server')
  return new OpenAI({ apiKey: key, dangerouslyAllowBrowser: false })
}

async function translateBatch(texts: string[], from: Locale, to: Locale): Promise<string[]> {
  if (!texts.length || from === to) return texts
  const openai = getOpenAI()
  const numbered = texts.map((t, i) => `${i}. ${t}`).join('\n\n')
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Translate from ${LANG_NAMES[from]} to ${LANG_NAMES[to]}. Return a JSON object with numeric string keys. Output ONLY valid JSON.`,
      },
      { role: 'user', content: numbered },
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' },
  })
  const parsed = JSON.parse(res.choices[0].message.content ?? '{}')
  return texts.map((orig, i) => parsed[String(i)] ?? orig)
}

async function translateBlocks(blocks: any[], from: Locale, to: Locale): Promise<any[]> {
  if (!blocks?.length || from === to) return blocks
  const cloned = JSON.parse(JSON.stringify(blocks))
  const segments: { b: number; c: number; text: string }[] = []
  cloned.forEach((block: any, bi: number) => {
    if (block._type === 'block' && Array.isArray(block.children)) {
      block.children.forEach((child: any, ci: number) => {
        if (child._type === 'span' && child.text) segments.push({ b: bi, c: ci, text: child.text })
      })
    }
  })
  if (!segments.length) return cloned
  const translated = await translateBatch(segments.map((s) => s.text), from, to)
  segments.forEach((seg, idx) => { cloned[seg.b].children[seg.c].text = translated[idx] })
  return cloned
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { doc, from, to, textFields, blockFields } = body ?? {}

  if (!doc || !from || !to) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  const config = useRuntimeConfig()
  if (!(config as any).openaiApiKey && !process.env.OPENAI_API_KEY) {
    throw createError({ statusCode: 500, message: 'OPENAI_API_KEY not configured' })
  }

  const patch: Record<string, any> = {}

  // ── Text fields (batch) ──────────────────────────────────────────────────
  const textKeys: string[] = []
  const textValues: string[] = []

  for (const field of (textFields ?? [])) {
    const arr = doc[field]
    if (!Array.isArray(arr)) continue
    const src = arr.find((e: any) => e._key === from)
    if (!src?.value) continue
    textKeys.push(field)
    textValues.push(src.value)
  }

  if (textValues.length) {
    const translated = await translateBatch(textValues, from as Locale, to as Locale)
    textKeys.forEach((key, i) => {
      const existing = (doc[key] ?? []).filter((e: any) => e._key !== to)
      patch[key] = [...existing, { _key: to, value: translated[i] }]
    })
  }

  // ── Block content fields ─────────────────────────────────────────────────
  for (const field of (blockFields ?? [])) {
    const arr = doc[field]
    if (!Array.isArray(arr)) continue
    const src = arr.find((e: any) => e._key === from)
    if (!src?.value?.length) continue
    const translated = await translateBlocks(src.value, from as Locale, to as Locale)
    const existing = (doc[field] ?? []).filter((e: any) => e._key !== to)
    patch[field] = [...existing, { _key: to, value: translated }]
  }

  return { patch }
})
