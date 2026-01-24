import dictionaryData from "@/config/dictionary.json";

/**
 * Maps CV skill IDs to dictionary word IDs
 */
const skillIdToDictionaryId: Record<string, string> = {
  "vue3js": "vue",
  "nodejs": "node",
  // Add more mappings as needed
};

/**
 * Gets the dictionary link for a skill ID
 * @param skillId - The skill ID from cv.json
 * @returns The dictionary word ID if found, null otherwise
 */
export function getDictionaryLink(skillId: string): string | null {
  // First check if there's a direct mapping
  const mappedId = skillIdToDictionaryId[skillId] || skillId;
  
  // Check if the word exists in dictionary
  const word = dictionaryData.words.find((w) => w.id === mappedId);
  
  if (word) {
    return `/dictionary/${word.id}`;
  }
  
  // If not found, try to find by similar terms
  const wordBySimilar = dictionaryData.words.find((w) => 
    w.similar && w.similar.some((similar) => similar.toLowerCase() === skillId.toLowerCase())
  );
  
  if (wordBySimilar) {
    return `/dictionary/${wordBySimilar.id}`;
  }
  
  return null;
}
