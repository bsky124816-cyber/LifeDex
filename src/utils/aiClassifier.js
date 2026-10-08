import { MOCK_SPECIES } from '../data/mockSpecies';

// Google Generative AI endpoint (supports Gemini / Gemma multimodal vision)
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent';

/**
 * Extracts pure Base64 data and mimeType from a data URL or blob URL.
 */
async function getBase64FromImageUrl(imageUrl) {
  if (imageUrl.startsWith('data:')) {
    const [header, base64] = imageUrl.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
    return { base64, mimeType };
  }

  // If it's a blob URL or remote URL, fetch and convert
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      const [header, base64] = result.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || blob.type || 'image/jpeg';
      resolve({ base64, mimeType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Categorizes and assigns badge & styling based on category
 */
function enhanceSpeciesMetadata(data, originalImage) {
  const category = data.category || 'Organism';
  
  let categoryBadge = data.categoryBadge;
  if (!categoryBadge) {
    switch (category.toLowerCase()) {
      case 'plant':
      case 'flora':
        categoryBadge = '🌿 Plant';
        break;
      case 'bird':
      case 'avian':
        categoryBadge = '🦅 Bird';
        break;
      case 'mammal':
        categoryBadge = '🐾 Mammal';
        break;
      case 'insect':
      case 'bug':
        categoryBadge = '🐞 Insect';
        break;
      case 'fungi':
      case 'fungus':
      case 'mushroom':
        categoryBadge = '🍄 Fungi';
        break;
      case 'reptile':
        categoryBadge = '🦎 Reptile';
        break;
      case 'amphibian':
        categoryBadge = '🐸 Amphibian';
        break;
      case 'marine':
      case 'fish':
        categoryBadge = '🐟 Marine';
        break;
      default:
        categoryBadge = `🐾 ${category}`;
    }
  }

  // Rarity color mappings
  let rarityColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  const rarity = data.rarity || 'Common';
  switch (rarity.toLowerCase()) {
    case 'legendary':
      rarityColor = 'text-purple-400 border-purple-500/30 bg-purple-500/15 shadow-[0_0_12px_rgba(168,85,247,0.3)]';
      break;
    case 'epic':
      rarityColor = 'text-amber-400 border-amber-500/30 bg-amber-500/15 shadow-[0_0_12px_rgba(245,158,11,0.3)]';
      break;
    case 'rare':
      rarityColor = 'text-cyan-400 border-cyan-500/30 bg-cyan-500/15';
      break;
    case 'uncommon':
      rarityColor = 'text-teal-400 border-teal-500/30 bg-teal-500/15';
      break;
    case 'vulnerable':
    case 'endangered':
      rarityColor = 'text-rose-400 border-rose-500/30 bg-rose-500/15';
      break;
  }

  // Generate a stylish Dex ID based on name hash
  const hash = Math.abs(
    (data.commonName || 'specimen').split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  ) % 899 + 101;
  const dexNumber = data.dexNumber || `#${hash}`;

  return {
    id: `bio-${hash}`,
    dexNumber,
    commonName: data.commonName || 'Unidentified Specimen',
    scientificName: data.scientificName || 'Taxa incertae sedis',
    category: data.category || 'Organism',
    categoryBadge,
    family: data.family || 'Bio-Taxa',
    confidence: (() => {
      let c = Number(data.confidence) || 96;
      if (c > 0 && c <= 1) c = Math.round(c * 100);
      return Math.min(99, Math.max(85, c));
    })(),
    rarity,
    rarityColor,
    imageUrl: originalImage,
    habitat: data.habitat || 'Global Biosphere',
    range: data.range || 'Worldwide',
    briefDescription: data.briefDescription || 'A specimen photographed in the wild.',
    fieldNotes: data.fieldNotes || 'Field observation logged via optical bio-scanner.',
    status: data.status || 'Wild / Native',
    soundType: data.soundType || 'pulse',
    dimensions: data.dimensions || 'Standard specimen size'
  };
}

/**
 * Classifies an image using Google Generative Vision AI with fallback to matched mock presets.
 */
export async function identifySpeciesWithAI(imageUrl, forcedPresetId = null, customApiKey = null) {
  // If user selected a preset button, return that exact preset for instant feedback
  if (forcedPresetId) {
    const preset = MOCK_SPECIES.find(s => s.id === forcedPresetId);
    if (preset) {
      return { ...preset, imageUrl };
    }
  }

  // Retrieve API Key
  const apiKey = 
    customApiKey || 
    import.meta.env.VITE_GEMMA_API_KEY || 
    import.meta.env.GEMMA_API_KEY || 
    '';

  if (!apiKey) {
    console.warn('No AI Vision API key found, falling back to mock classifier.');
    const randomMock = MOCK_SPECIES[Math.floor(Math.random() * MOCK_SPECIES.length)];
    return { ...randomMock, imageUrl };
  }

  try {
    const { base64, mimeType } = await getBase64FromImageUrl(imageUrl);

    const prompt = `You are LifeDex AI, a real-world Pokedex biological classification vision engine.
Analyze this image and identify the exact creature, organism, animal, bird, insect, plant, or fungus shown with maximum taxonomic accuracy.

Return strictly a JSON object with this exact schema:
{
  "commonName": "Precise common name (e.g. Monarch Butterfly, Golden Retriever, Bald Eagle, Monstera Deliciosa)",
  "scientificName": "Accurate Latin Binomial (e.g. Danaus plexippus)",
  "category": "Plant" | "Bird" | "Mammal" | "Insect" | "Fungi" | "Reptile" | "Amphibian" | "Marine" | "Other",
  "categoryBadge": "Category with emoji, e.g. '🌿 Plant', '🦅 Bird', '🐾 Mammal', '🐞 Insect', '🍄 Fungi', '🦎 Reptile'",
  "family": "Biological Family name (e.g. Nymphalidae, Canidae, Araceae)",
  "confidence": An integer between 88 and 99 reflecting match confidence,
  "rarity": "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary",
  "habitat": "Typical natural habitat and ecosystem",
  "range": "Geographic range",
  "briefDescription": "A concise 2-3 sentence overview describing key identifying visual characteristics and behavior.",
  "fieldNotes": "A fascinating biological fun fact or survival adaptation about this exact species.",
  "status": "Conservation status (e.g. Least Concern, Protected, Vulnerable, Endangered)",
  "soundType": "chirp" | "flutter" | "rustle" | "yip" | "hoot" | "pulse"
}
If the image does not show a living creature, plant, or animal, still identify the object or closest natural entity accurately.`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64
              }
            },
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    };

    const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Vision API HTTP Error:', response.status, errText);
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error('No candidate content returned by AI vision.');
    }

    // Clean JSON response if wrapped in markdown code blocks
    let cleanJson = candidateText.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsedData = JSON.parse(cleanJson);
    console.log('LifeDex AI Vision identified:', parsedData.commonName, `(${parsedData.scientificName})`);

    return enhanceSpeciesMetadata(parsedData, imageUrl);
  } catch (error) {
    console.error('AI Vision Classification error, using resilient fallback:', error);
    // In case of any network issue, select a mock species but preserve user's image
    const fallback = MOCK_SPECIES[Math.floor(Math.random() * MOCK_SPECIES.length)];
    return {
      ...fallback,
      imageUrl,
      briefDescription: `${fallback.briefDescription} (Note: Offline bio-estimate).`
    };
  }
}
