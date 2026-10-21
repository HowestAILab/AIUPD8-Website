/**
 * translations.ts
 *
 * Single source of truth for all UI strings in Dutch (nl) and English (en).
 * Add new keys here first, then use them via `useTranslations()`.
 */

export const translations = {
  nl: {
    // ── Navigation ──────────────────────────────────────────────────────────
    'nav.database': 'database',
    'nav.blog': 'blog',
    'nav.offer': 'ons aanbod',
    'nav.contact': 'contact',

    // ── Hero section ────────────────────────────────────────────────────────
    'hero.cta': 'Naar de database',

    // ── Home page ───────────────────────────────────────────────────────────
    'home.heroTitle': 'Gecureerde database <br> voor genAI tools.',
    'home.heroSubtitle':
      'AIUPD8 is een Howest-initiatief dat je op de hoogte houdt van de nieuwste AI-tools. Via onze cursussen, deskundige docenten en gezamenlijke onderzoeksprojecten geven we creatieve professionals de middelen om de kracht van generatieve AI te benutten.',
    'home.curationTitle': 'Curation',
    'home.curationDesc':
      'De AI-UPD8-database gaat verder dan een eenvoudige lijst van AI-tools. Elke tool in onze database is grondig getest en beoordeeld door ons team van experts, zodat je betrouwbare, praktische inzichten krijgt. <br><br> Beschouw het als jouw betrouwbare gids, waarbij elke vermelding niet alleen informatie vertegenwoordigt, maar gevalideerde kennis van professionals die de behoeften van de creatieve industrie begrijpen.',
    'home.inspirationTitle': 'Inspiratie',
    'home.inspirationDesc':
      'Laat je inspireren door bewezen AI-workflows die bij jouw behoeften passen. Onze database laat je voorbeelden filteren op beroepsprofiel, industrie, projectomvang of specifieke creatieve taken. <br><br> Of je nu een game developer bent die oplossingen voor karakteranimatie zoekt, een marketeer die tools voor contentcreatie zoekt, of een video-editor die post-productieverwerking onderzoekt – je vindt snel relevante voorbeelden die ideeën voor jouw eigen workflow opwekken.',

    // ── Blog ────────────────────────────────────────────────────────────────
    'blog.title': 'Blog',
    'blog.loading': 'Posts worden geladen...',
    'blog.empty': 'Geen blogposts gevonden.',
    'blog.postLoading': 'Post wordt geladen...',

    // ── Offer page ──────────────────────────────────────────────────────────
    'offer.heading': 'ONS AANBOD',
    'offer.intro':
      'Aiupdate helpt creatieve professionals AI praktisch en duidelijk te gebruiken. We kiezen samen de juiste tools, zetten slimme workflows op en geven training zodat je vlot aan de slag kan. Alles stemmen we af op jouw doelen en mogelijkheden, zodat je stap voor stap AI kan invoeren en uitbreiden zonder verrassingen.',
    'offer.contact': 'Contacteer ons',

    // ── Database page ───────────────────────────────────────────────────────
    'database.loading': 'Tools worden geladen...',
    'database.empty':
      'Geen tools gevonden voor de huidige filters. Pas je zoekcriteria aan.',
    'database.comparison.suffix': 'geselecteerd voor vergelijking',
    'database.comparison.button': 'Vergelijk',
    'database.filter.label': 'Filters',
    'database.filters': 'Filters',
    'database.localizedOnly': 'Gelokaliseerd',
    'database.allLanguages': 'Alle talen',
    'database.langFilterHint': 'Toon tools met inhoud in de actieve taal, of alle tools',

    // ── Tool detail labels ───────────────────────────────────────────────────
    'tool.seeMore': 'meer info',
    'tool.addToComparison': 'Toevoegen aan vergelijking',
    'tool.favourite': 'favoriet',
    'tool.outdated': '⚠️ mogelijk verouderd',
    'tool.beta': 'beta',
    'tool.advantages': '✓ Voordelen',
    'tool.disadvantages': '✗ Nadelen',
    'tool.goToWebsite': 'Naar tool website',
    'tool.privacyPolicy': 'Privacybeleid',
    'tool.backToList': 'Terug naar lijst',
    'tool.specifications': 'Specificaties',
    'tool.use': 'gebruik',
    'tool.setup': 'setup',
    'tool.pricing': 'prijs',
    'tool.license': 'licentie',
    'tool.averageTime': 'gemiddelde tijd',
    'tool.averageTimeGenerate': 'gemiddelde tijd om te genereren',
    'tool.dataStorage': 'Dataopslaglocaties',
    'tool.dateAdded': 'Toegevoegd op',
    'tool.lastUpdated': 'Laatste update',
    'tool.additionalInfo': 'Aanvullende informatie',
    'tool.inputTypes': 'Invoertypes',
    'tool.outputTypes': 'Uitvoertypes',
    'tool.tasks': 'Ondersteunde taken',
    'tool.suitableFor': 'Geschikt voor',
    'tool.inputType': 'invoertype',
    'tool.specificTask': 'specifieke taak',
    'tool.outputType': 'uitvoertype',
    'tool.profile': 'profiel',
    'tool.step': 'stap',
    'tool.steps': 'stappen',

    // ── Info tooltips (first card) ──────────────────────────────────────────────
    'info.setup.title': 'Wat betekent setup?',
    'info.setup.noCode': 'Open de website of app en begin meteen — geen installatie of technische kennis nodig.',
    'info.setup.lowCode': 'Een kleine instelling of account aanmaken is nodig, maar je hebt geen programmeerkennis nodig.',
    'info.setup.code': 'Vereist technische kennis of programmeervaardigheden om de tool te installeren en klaar te zetten.',
    'info.use.title': 'Wat betekent gebruik?',
    'info.use.noCode': 'Gewoon klikken en typen — je hebt geen technische achtergrond nodig om resultaten te krijgen.',
    'info.use.lowCode': 'Een beetje technische kennis helpt om het meeste uit de tool te halen, maar is niet strikt vereist.',
    'info.use.code': 'Je moet opdrachten of code schrijven om de tool te gebruiken.',
    'info.pricing.title': 'Wat betekent prijs?',
    'info.pricing.free': 'Volledig gratis te gebruiken, zonder betaling of account.',
    'info.pricing.subscription': 'Je betaalt een vast maandelijks of jaarlijks bedrag voor toegang.',
    'info.pricing.credits': 'Je koopt credits en verbruikt ze per gebruik — je betaalt alleen voor wat je effectief gebruikt.',

    // ── Modals ──────────────────────────────────────────────────────────────
    'modal.review': 'Review',
    'modal.openFullPage': 'Open volledige pagina',
    'modal.comparison': 'Vergelijking',
    'modal.noComparison': 'Geen tools geselecteerd voor vergelijking.',
    'modal.addComparisonHint':
      'Voeg tools toe via "toevoegen aan vergelijking" in de tooldetails.',
    'modal.viewDetails': 'Details bekijken',
    'modal.remove': 'Verwijderen',
    'modal.addToComparison': 'toevoegen aan vergelijking',

    // ── Workflows ────────────────────────────────────────────────────────────
    'workflows.title': 'Workflows',
    'workflows.viewFor': 'Bekijken voor:',
    'workflows.allProfiles': 'Alle profielen',
    'workflows.noWorkflows': 'Nog geen workflows beschikbaar voor deze tool.',

    // ── Research profiles section ────────────────────────────────────────────
    'research.heading': 'Onderzoeksprofielen',
    'research.subtitle':
      'Ontdek AI-tools samengesteld voor specifieke onderzoeksinitiatieven en doelgroepen. Elk profiel biedt gespecialiseerde tools en workflows voor verschillende beroepsgroepen.',
    'research.profileTarget': 'Profielbeschrijving',
    'research.targetAudience': 'Doelgroep',
    'research.partners': 'Partners & Sponsors',
    'research.viewProfileTools': 'Profieltools bekijken',
    'research.viewAllTools': 'Alle tools bekijken',

    // ── Filters ──────────────────────────────────────────────────────────────
    'filter.toolName': 'toolnaam',
    'filter.input': 'invoer',
    'filter.output': 'uitvoer',
    'filter.profile': 'profiel',
    'filter.capabilities': 'Zoeken',
    'filter.capabilitiesPlaceholder': 'Zoeken...',
    'filter.moreFilters': 'meer filters',
    'filter.selectTool': 'Tool selecteren',
    'filter.search': 'zoeken',
    'filter.selectProfile': 'Profiel selecteren',
    'filter.generalUser': 'Algemene gebruiker',
    'filter.advancedTitle': 'Geavanceerde filters',
    'filter.showOldTools': 'Tools tonen die al meer dan 1 jaar niet zijn bijgewerkt',
    'filter.specificFilters': 'Specifieke filters',
    'filter.clearFilters': 'Filters wissen',
    'filter.quickFilters': 'Snelle filters',
    'filter.allFilters': 'Alle filters',
    'filter.applyFilters': 'Filters toepassen',
    'filter.specializedFilters': 'gespecialiseerde filter(s) beschikbaar',

    // ── Outdated badge ────────────────────────────────────────────────────────
    'badge.outdatedTitle': '⚠️ Mogelijk verouderd',
    'badge.outdatedDesc': 'Deze tool werd al een tijdje niet bijgewerkt',
    'badge.lastUpdated': 'Laatste update:',

    // ── Project selector ─────────────────────────────────────────────────────
    'project.viewing': 'Weergave',
    'project.for': 'Voor',
    'project.more': 'meer',
    'project.partners': 'Partners',
    'project.additionalFiltersPre': 'Dit project heeft',
    'project.additionalFiltersSuf': 'extra filters beschikbaar',

    // ── Active filters, empty states, and search UI ──────────────────────────
    'filter.activeFiltersCount': 'Filters ({count} actief)',
    'filter.activeFilterChips': 'Actieve filters:',
    'filter.emptyHeadline': 'Geen tools gevonden',
    'filter.emptyDescription': 'Probeer enkele filters te verwijderen of wis alle filters.',
    'filter.searchPlaceholder': 'Zoek op naam, tags, workflow, profiel...',
    'filter.clearAll': 'Wis alle filters',
    'filter.select': 'Selecteer',

    // ── Filter Titles ────────────────────────────────────────────────────────
    'filter.title.uses': 'Gebruik',
    'filter.title.setups': 'Setup',
    'filter.title.pricings': 'Prijs',
    'filter.title.licenses': 'Licentie',
    'filter.title.inputs': 'Invoer',
    'filter.title.outputs': 'Uitvoer',
    'filter.title.dataStorageLocations': 'Dataopslaglocatie',
    'filter.title.generationTimes': 'Generatietijd',
    'filter.title.tasks': 'Taaktype',
    'filter.title.profiles': 'Profieltype',
    'filter.title.dataDeletionCapabilities': 'Data-verwijdering',
    'filter.title.suitabilityRobustnesses': 'Geschiktheid / Robuustheid',
    'filter.title.onboardingEases': 'Onboarding',
    'filter.title.offlineFunctionalities': 'Offline functionaliteit',

    // ── Localized Filter Options ─────────────────────────────────────────────
    'filter.option.uses.no-code': 'No Code',
    'filter.option.uses.low-code': 'Low Code',
    'filter.option.uses.code': 'Code',

    'filter.option.setups.no-code': 'No Code',
    'filter.option.setups.low-code': 'Low Code',
    'filter.option.setups.code': 'Code',

    'filter.option.pricings.free': 'Gratis',
    'filter.option.pricings.subscription': 'Abonnement',
    'filter.option.pricings.credits': 'Credits',

    'filter.option.licenses.personal': 'Persoonlijk',
    'filter.option.licenses.commercial': 'Commercieel',
    'filter.option.licenses.open-source': 'Open Source',

    'filter.option.inputs.text': 'Tekst',
    'filter.option.inputs.image': 'Afbeelding',
    'filter.option.inputs.video': 'Video',
    'filter.option.inputs.audio': 'Audio',
    'filter.option.inputs.code': 'Code',
    'filter.option.inputs.file': 'Bestand',
    'filter.option.inputs.url': 'URL',
    'filter.option.inputs.json': 'JSON',
    'filter.option.inputs.csv': 'CSV',
    'filter.option.inputs.http': 'HTTP',

    'filter.option.outputs.text': 'Tekst',
    'filter.option.outputs.image': 'Afbeelding',
    'filter.option.outputs.video': 'Video',
    'filter.option.outputs.audio': 'Audio',
    'filter.option.outputs.code': 'Code',
    'filter.option.outputs.file': 'Bestand',
    'filter.option.outputs.json': 'JSON',
    'filter.option.outputs.csv': 'CSV',
    'filter.option.outputs.html': 'HTML',
    'filter.option.outputs.pdf': 'PDF',
    'filter.option.outputs.workflow': 'Workflow',

    'filter.option.dataStorageLocations.eu': 'EU',
    'filter.option.dataStorageLocations.us': 'VS',
    'filter.option.dataStorageLocations.global': 'Wereldwijd',
    'filter.option.dataStorageLocations.local': 'Lokaal',
    'filter.option.dataStorageLocations.unknown': 'Onbekend',

    'filter.option.generationTimes.seconds': 'Seconden',
    'filter.option.generationTimes.minutes': 'Minuten',
    'filter.option.generationTimes.hours': 'Uren',
    'filter.option.generationTimes.real-time': 'Realtime',

    'filter.option.tasks.text-generation': 'Tekstgeneratie',
    'filter.option.tasks.text-editing': 'Tekstbewerking',
    'filter.option.tasks.text-to-speech': 'Tekst-naar-spraak',
    'filter.option.tasks.speech-to-text': 'Spraak-naar-tekst',
    'filter.option.tasks.image-generation': 'Afbeeldingsgeneratie',
    'filter.option.tasks.image-editing': 'Afbeeldingsbewerking',
    'filter.option.tasks.image-to-video': 'Afbeelding-naar-video',
    'filter.option.tasks.image-upscaling': 'Afbeelding opschalen',
    'filter.option.tasks.video-generation': 'Videogeneratie',
    'filter.option.tasks.video-editing': 'Videobewerking',
    'filter.option.tasks.text-to-video': 'Tekst-naar-video',
    'filter.option.tasks.video-to-video': 'Video-naar-video',
    'filter.option.tasks.audio-generation': 'Audiogeneratie',
    'filter.option.tasks.audio-editing': 'Audiobewerking',
    'filter.option.tasks.code-generation': 'Codegeneratie',
    'filter.option.tasks.code-analysis': 'Codeanalyse',
    'filter.option.tasks.3d-generation': '3D-generatie',
    'filter.option.tasks.3d-editing': '3D-bewerking',
    'filter.option.tasks.workflow-automation': 'Workflowautomatisering',
    'filter.option.tasks.data-analysis': 'Data-analyse',

    'filter.option.profiles.content-writer': 'Contentschrijver',
    'filter.option.profiles.copywriter': 'Copywriter',
    'filter.option.profiles.creative-director': 'Creatief directeur',
    'filter.option.profiles.developer': 'Ontwikkelaar',
    'filter.option.profiles.designer': 'Ontwerper',
    'filter.option.profiles.marketer': 'Marketeer',
    'filter.option.profiles.video-editor': 'Videobewerker',
    'filter.option.profiles.audio-producer': 'Audioproducent',
    'filter.option.profiles.data-analyst': 'Data-analist',
    'filter.option.profiles.project-manager': 'Projectmanager',
    'filter.option.profiles.3d-artist': '3D-artiest',
    'filter.option.profiles.business-owner': 'Bedrijfseigenaar',
    'filter.option.profiles.student': 'Student',
    'filter.option.profiles.researcher': 'Onderzoeker',
    'filter.option.profiles.educator': 'Docent',

    'filter.option.dataDeletionCapabilities.ja': 'Ja',
    'filter.option.dataDeletionCapabilities.deels': 'Deels',
    'filter.option.dataDeletionCapabilities.nee': 'Nee',

    'filter.option.suitabilityRobustnesses.volledig-uitgelegd': 'Volledig uitgelegd',
    'filter.option.suitabilityRobustnesses.versimpeld': 'Versimpeld',
    'filter.option.suitabilityRobustnesses.niet-transparant': 'Niet transparant',

    'filter.option.onboardingEases.ja': 'Ja',
    'filter.option.onboardingEases.deels': 'Deels',
    'filter.option.onboardingEases.nee': 'Nee',

    'filter.option.offlineFunctionalities.volledig': 'Volledig',
    'filter.option.offlineFunctionalities.beperkt': 'Beperkt',
    'filter.option.offlineFunctionalities.niet': 'Niet',
  },

  en: {
    // ── Navigation ──────────────────────────────────────────────────────────
    'nav.database': 'database',
    'nav.blog': 'blog',
    'nav.offer': 'our offer',
    'nav.contact': 'contact',

    // ── Hero section ────────────────────────────────────────────────────────
    'hero.cta': 'Go to the database',

    // ── Home page ───────────────────────────────────────────────────────────
    'home.heroTitle': 'Curated database <br> for genAI tools.',
    'home.heroSubtitle':
      'AIUPD8 is a Howest initiative dedicated to keeping you up-to-date with the latest AI tools. Through our courses, expert teachers, and collaborative research projects, we empower creative professionals to harness the power of generative AI.',
    'home.curationTitle': 'Curation',
    'home.curationDesc':
      "The AI-UPD8 database goes beyond a simple listing of AI tools. Every tool in our database has been thoroughly tested and evaluated by our team of experts, ensuring you get reliable, hands-on insights. <br><br> Think of it as your trusted guide, where each entry represents not just information, but validated knowledge from professionals who understand the creative industry's needs.",
    'home.inspirationTitle': 'Inspiration',
    'home.inspirationDesc':
      "Get inspired by real-world AI proven workflows that match your needs. Our database lets you filter examples by professional profile, industry, project scale, or specific creative tasks. <br><br> Whether you're a game developer looking for character animation solutions, a marketer seeking content creation tools, or a video editor exploring post-production automation you'll quickly find relevant examples that spark ideas for your own workflow.",

    // ── Blog ────────────────────────────────────────────────────────────────
    'blog.title': 'Blog',
    'blog.loading': 'Loading posts...',
    'blog.empty': 'No blog posts found.',
    'blog.postLoading': 'Loading post...',

    // ── Offer page ──────────────────────────────────────────────────────────
    'offer.heading': 'OUR OFFER',
    'offer.intro':
      'Aiupdate helps creative professionals use AI practically and clearly. We choose the right tools together, set up smart workflows, and provide training so you can get started smoothly. We align everything with your goals and possibilities, so you can gradually introduce and expand AI without surprises.',
    'offer.contact': 'Contact us',

    // ── Database page ───────────────────────────────────────────────────────
    'database.loading': 'Loading tools...',
    'database.empty':
      'No tools match your current filters. Try adjusting your search criteria.',
    'database.comparison.suffix': 'selected for comparison',
    'database.comparison.button': 'Compare',
    'database.filter.label': 'Filters',
    'database.filters': 'Filters',
    'database.localizedOnly': 'Localized',
    'database.allLanguages': 'All Languages',
    'database.langFilterHint': 'Show tools with content in the active language, or all tools',

    // ── Tool detail labels ───────────────────────────────────────────────────
    'tool.seeMore': 'see more',
    'tool.addToComparison': 'Add to comparison',
    'tool.favourite': 'favorite',
    'tool.outdated': '⚠️ possibly outdated',
    'tool.beta': 'beta',
    'tool.advantages': '✓ Advantages',
    'tool.disadvantages': '✗ Disadvantages',
    'tool.goToWebsite': 'Go to Tool Website',
    'tool.privacyPolicy': 'Privacy Policy',
    'tool.backToList': 'Back to List',
    'tool.specifications': 'Specifications',
    'tool.use': 'use',
    'tool.setup': 'setup',
    'tool.pricing': 'pricing',
    'tool.license': 'license',
    'tool.averageTime': 'average time',
    'tool.averageTimeGenerate': 'average time to generate',
    'tool.dataStorage': 'Data Storage Locations',
    'tool.dateAdded': 'Date Added',
    'tool.lastUpdated': 'Last Updated',
    'tool.additionalInfo': 'Additional Information',
    'tool.inputTypes': 'Input Types',
    'tool.outputTypes': 'Output Types',
    'tool.tasks': 'Supported Tasks',
    'tool.suitableFor': 'Suitable For',
    'tool.inputType': 'input type',
    'tool.specificTask': 'specific task',
    'tool.outputType': 'output type',
    'tool.profile': 'profile',
    'tool.step': 'step',
    'tool.steps': 'steps',

    // ── Info tooltips (first card) ──────────────────────────────────────────────
    'info.setup.title': 'What does setup mean?',
    'info.setup.noCode': 'Just open the website or app and start — no installation or technical knowledge needed.',
    'info.setup.lowCode': 'A small configuration step or account creation is needed, but no coding skills required.',
    'info.setup.code': 'Requires technical knowledge or programming skills to install and configure the tool.',
    'info.use.title': 'What does usage mean?',
    'info.use.noCode': 'Simply point, click and type — no technical background needed to get results.',
    'info.use.lowCode': 'A little technical understanding helps to get the most out of this tool, but is not strictly required.',
    'info.use.code': 'You need to write commands or code to work with this tool.',
    'info.pricing.title': 'What does pricing mean?',
    'info.pricing.free': 'Completely free to use — no payment or account required.',
    'info.pricing.subscription': 'You pay a fixed monthly or yearly fee to access the tool.',
    'info.pricing.credits': 'Buy credits and spend them per use — a pay-as-you-go model, you only pay for what you use.',

    // ── Modals ──────────────────────────────────────────────────────────────
    'modal.review': 'Review',
    'modal.openFullPage': 'Open in Full Page',
    'modal.comparison': 'Comparison',
    'modal.noComparison': 'No tools selected for comparison.',
    'modal.addComparisonHint':
      'Add tools to compare by checking "add to comparison" in the tool details.',
    'modal.viewDetails': 'View Details',
    'modal.remove': 'Remove',
    'modal.addToComparison': 'add to comparison',

    // ── Workflows ────────────────────────────────────────────────────────────
    'workflows.title': 'Workflows',
    'workflows.viewFor': 'View for:',
    'workflows.allProfiles': 'All Profiles',
    'workflows.noWorkflows': 'No workflows available for this tool yet.',

    // ── Research profiles section ────────────────────────────────────────────
    'research.heading': 'Research Profiles',
    'research.subtitle':
      'Explore AI tools curated for specific research initiatives and target audiences. Each profile offers specialized tools and workflows for different professional groups.',
    'research.profileTarget': 'Profile Target',
    'research.targetAudience': 'Target Audience',
    'research.partners': 'Partners & Sponsors',
    'research.viewProfileTools': 'View Profile Tools',
    'research.viewAllTools': 'View All Tools',

    // ── Filters ──────────────────────────────────────────────────────────────
    'filter.toolName': 'tool name',
    'filter.input': 'input',
    'filter.output': 'output',
    'filter.profile': 'profile',
    'filter.capabilities': 'Search',
    'filter.capabilitiesPlaceholder': 'Search...',
    'filter.moreFilters': 'more filters',
    'filter.selectTool': 'Select tool',
    'filter.search': 'search',
    'filter.selectProfile': 'Select Profile',
    'filter.generalUser': 'General User',
    'filter.advancedTitle': 'Advanced Filters',
    'filter.showOldTools': 'Show tools not updated for over 1 year',
    'filter.specificFilters': 'Specific Filters',
    'filter.clearFilters': 'Clear Filters',
    'filter.quickFilters': 'Quick Filters',
    'filter.allFilters': 'All Filters',
    'filter.applyFilters': 'Apply Filters',
    'filter.specializedFilters': 'specialized filter(s) available',

    // ── Outdated badge ────────────────────────────────────────────────────────
    'badge.outdatedTitle': '⚠️ Possibly Outdated',
    'badge.outdatedDesc': "This tool hasn't been updated in a while",
    'badge.lastUpdated': 'Last updated:',

    // ── Project selector ─────────────────────────────────────────────────────
    'project.viewing': 'Viewing',
    'project.for': 'For',
    'project.more': 'more',
    'project.partners': 'Partners',
    'project.additionalFiltersPre': 'This project has',
    'project.additionalFiltersSuf': 'additional filters available',

    // ── Active filters, empty states, and search UI ──────────────────────────
    'filter.activeFiltersCount': 'Filters ({count} active)',
    'filter.activeFilterChips': 'Active filters:',
    'filter.emptyHeadline': 'No tools found',
    'filter.emptyDescription': 'Try removing some filters or clear all filters.',
    'filter.searchPlaceholder': 'Search by name, tags, workflow, profile...',
    'filter.clearAll': 'Clear all filters',
    'filter.select': 'Select',

    // ── Filter Titles ────────────────────────────────────────────────────────
    'filter.title.uses': 'Use Type',
    'filter.title.setups': 'Setup Type',
    'filter.title.pricings': 'Pricing Type',
    'filter.title.licenses': 'License Type',
    'filter.title.inputs': 'Input Type',
    'filter.title.outputs': 'Output Type',
    'filter.title.dataStorageLocations': 'Data Storage Location',
    'filter.title.generationTimes': 'Generation Time',
    'filter.title.tasks': 'Task Type',
    'filter.title.profiles': 'Profile Type',
    'filter.title.dataDeletionCapabilities': 'Data Deletion Capabilities',
    'filter.title.suitabilityRobustnesses': 'Suitability / Robustness',
    'filter.title.onboardingEases': 'Onboarding Ease',
    'filter.title.offlineFunctionalities': 'Offline Functionality',

    // ── Localized Filter Options ─────────────────────────────────────────────
    'filter.option.uses.no-code': 'No Code',
    'filter.option.uses.low-code': 'Low Code',
    'filter.option.uses.code': 'Code',

    'filter.option.setups.no-code': 'No Code',
    'filter.option.setups.low-code': 'Low Code',
    'filter.option.setups.code': 'Code',

    'filter.option.pricings.free': 'Free',
    'filter.option.pricings.subscription': 'Subscription',
    'filter.option.pricings.credits': 'Credits',

    'filter.option.licenses.personal': 'Personal',
    'filter.option.licenses.commercial': 'Commercial',
    'filter.option.licenses.open-source': 'Open Source',

    'filter.option.inputs.text': 'Text',
    'filter.option.inputs.image': 'Image',
    'filter.option.inputs.video': 'Video',
    'filter.option.inputs.audio': 'Audio',
    'filter.option.inputs.code': 'Code',
    'filter.option.inputs.file': 'File',
    'filter.option.inputs.url': 'URL',
    'filter.option.inputs.json': 'JSON',
    'filter.option.inputs.csv': 'CSV',
    'filter.option.inputs.http': 'HTTP',

    'filter.option.outputs.text': 'Text',
    'filter.option.outputs.image': 'Image',
    'filter.option.outputs.video': 'Video',
    'filter.option.outputs.audio': 'Audio',
    'filter.option.outputs.code': 'Code',
    'filter.option.outputs.file': 'File',
    'filter.option.outputs.json': 'JSON',
    'filter.option.outputs.csv': 'CSV',
    'filter.option.outputs.html': 'HTML',
    'filter.option.outputs.pdf': 'PDF',
    'filter.option.outputs.workflow': 'Workflow',

    'filter.option.dataStorageLocations.eu': 'EU',
    'filter.option.dataStorageLocations.us': 'US',
    'filter.option.dataStorageLocations.global': 'Global',
    'filter.option.dataStorageLocations.local': 'Local',
    'filter.option.dataStorageLocations.unknown': 'Unknown',

    'filter.option.generationTimes.seconds': 'Seconds',
    'filter.option.generationTimes.minutes': 'Minutes',
    'filter.option.generationTimes.hours': 'Hours',
    'filter.option.generationTimes.real-time': 'Real-Time',

    'filter.option.tasks.text-generation': 'Text Generation',
    'filter.option.tasks.text-editing': 'Text Editing',
    'filter.option.tasks.text-to-speech': 'Text-to-Speech',
    'filter.option.tasks.speech-to-text': 'Speech-to-Text',
    'filter.option.tasks.image-generation': 'Image Generation',
    'filter.option.tasks.image-editing': 'Image Editing',
    'filter.option.tasks.image-to-video': 'Image-to-Video',
    'filter.option.tasks.image-upscaling': 'Image Upscaling',
    'filter.option.tasks.video-generation': 'Video Generation',
    'filter.option.tasks.video-editing': 'Video Editing',
    'filter.option.tasks.text-to-video': 'Text-to-Video',
    'filter.option.tasks.video-to-video': 'Video-to-Video',
    'filter.option.tasks.audio-generation': 'Audio Generation',
    'filter.option.tasks.audio-editing': 'Audio Editing',
    'filter.option.tasks.code-generation': 'Code Generation',
    'filter.option.tasks.code-analysis': 'Code Analysis',
    'filter.option.tasks.3d-generation': '3D Generation',
    'filter.option.tasks.3d-editing': '3D Editing',
    'filter.option.tasks.workflow-automation': 'Workflow Automation',
    'filter.option.tasks.data-analysis': 'Data Analysis',

    'filter.option.profiles.content-writer': 'Content Writer',
    'filter.option.profiles.copywriter': 'Copywriter',
    'filter.option.profiles.creative-director': 'Creative Director',
    'filter.option.profiles.developer': 'Developer',
    'filter.option.profiles.designer': 'Designer',
    'filter.option.profiles.marketer': 'Marketer',
    'filter.option.profiles.video-editor': 'Video Editor',
    'filter.option.profiles.audio-producer': 'Audio Producer',
    'filter.option.profiles.data-analyst': 'Data Analyst',
    'filter.option.profiles.project-manager': 'Project Manager',
    'filter.option.profiles.3d-artist': '3D Artist',
    'filter.option.profiles.business-owner': 'Business Owner',
    'filter.option.profiles.student': 'Student',
    'filter.option.profiles.researcher': 'Researcher',
    'filter.option.profiles.educator': 'Educator',

    'filter.option.dataDeletionCapabilities.ja': 'Yes',
    'filter.option.dataDeletionCapabilities.deels': 'Partially',
    'filter.option.dataDeletionCapabilities.nee': 'No',

    'filter.option.suitabilityRobustnesses.volledig-uitgelegd': 'Fully Explained',
    'filter.option.suitabilityRobustnesses.versimpeld': 'Simplified',
    'filter.option.suitabilityRobustnesses.niet-transparant': 'Not Transparent',

    'filter.option.onboardingEases.ja': 'Yes',
    'filter.option.onboardingEases.deels': 'Partially',
    'filter.option.onboardingEases.nee': 'No',

    'filter.option.offlineFunctionalities.volledig': 'Fully',
    'filter.option.offlineFunctionalities.beperkt': 'Limited',
    'filter.option.offlineFunctionalities.niet': 'Not',
  },
} as const
