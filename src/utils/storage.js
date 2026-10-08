import { MOCK_SPECIES } from '../data/mockSpecies';

const STORAGE_KEY = 'lifedex_collection_v1';
const SETTINGS_KEY = 'lifedex_settings_v1';

// Initial pre-seeded collection items so the Dex feels alive
const INITIAL_COLLECTION = [
  {
    ...MOCK_SPECIES[0], // Monarch Butterfly
    discoveredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    userPhotoUrl: MOCK_SPECIES[0].imageUrl,
    userLocation: 'Silver Meadow Park'
  },
  {
    ...MOCK_SPECIES[1], // Monstera Deliciosa
    discoveredAt: new Date(Date.now() - 86400000).toISOString(),
    userPhotoUrl: MOCK_SPECIES[1].imageUrl,
    userLocation: 'Botanical Greenhouse'
  }
];

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  hapticEnabled: true,
  rangerName: 'Bio-Explorer',
  rangerRank: 'Apprentice Naturalist',
  scanEngine: 'mock', // 'mock' | 'cloud_vision' | 'plant_net'
  visionApiKey: ''
};

export const getSavedCollection = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COLLECTION));
      return INITIAL_COLLECTION;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_COLLECTION;
  }
};

export const saveCollectionItem = (species, userPhotoUrl, location = 'Field Observation') => {
  try {
    const current = getSavedCollection();
    // Check if species already logged
    const existingIndex = current.findIndex(item => item.id === species.id);
    const entry = {
      ...species,
      userPhotoUrl: userPhotoUrl || species.imageUrl,
      discoveredAt: new Date().toISOString(),
      userLocation: location,
      timesEncountered: existingIndex >= 0 ? (current[existingIndex].timesEncountered || 1) + 1 : 1
    };

    let updated;
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = entry;
    } else {
      updated = [entry, ...current];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return { updated, isNew: existingIndex < 0 };
  } catch (e) {
    console.error('Failed to save to LifeDex', e);
    return { updated: [], isNew: false };
  }
};

export const removeCollectionItem = (id) => {
  try {
    const current = getSavedCollection();
    const updated = current.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

export const resetCollection = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COLLECTION));
    return INITIAL_COLLECTION;
  } catch {
    return INITIAL_COLLECTION;
  }
};

export const getSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
};
