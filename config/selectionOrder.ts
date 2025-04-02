export const defaultSelectionOrder = {
  use: ["no-code", "low-code", "code"].sort((a, b) => b.localeCompare(a)),
  setup: ["no-code", "low-code", "code"].sort((a, b) => b.localeCompare(a)),
  pricing: ["free", "freemium", "subscription", "credits"].sort((a, b) => b.localeCompare(a)),
};