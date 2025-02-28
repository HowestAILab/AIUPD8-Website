import { marked } from 'marked';

export function useRichText() {
  /**
   * Convert Strapi richtext to HTML
   * Handles both string content and structured richtext object
   */
  const parseRichText = (content: any): string => {
    if (!content) {
      return '';
    }
    
    // If content is a string, parse it directly
    if (typeof content === 'string') {
      return marked.parse(content);
    }
    
    // Handle Strapi's structured richtext format
    if (typeof content === 'object') {
      // For Strapi v4 format with blocks
      if (Array.isArray(content.blocks)) {
        return marked.parse(convertBlocksToMarkdown(content));
      }
      
      // For Strapi richtext that's already in markdown format
      if (content.markdown || content.text) {
        return marked.parse(content.markdown || content.text);
      }
    }
    
    return '';
  };
  
  /**
   * Convert Strapi blocks format to markdown
   */
  const convertBlocksToMarkdown = (content: any): string => {
    if (!content.blocks) return '';
    
    return content.blocks.map((block: any) => {
      switch (block.type) {
        case 'paragraph':
          return block.text || '';
        case 'heading':
          const level = block.level || 1;
          return `${'#'.repeat(level)} ${block.text}\n`;
        case 'list':
          return block.items
            .map((item: string) => `- ${item}`)
            .join('\n');
        case 'code':
          return `\`\`\`${block.language || ''}\n${block.text}\n\`\`\``;
        case 'quote':
          return `> ${block.text}\n`;
        case 'image':
          const alt = block.alt || '';
          return `![${alt}](${block.url})`;
        default:
          return block.text || '';
      }
    }).join('\n\n');
  };

  return {
    parseRichText
  };
}
