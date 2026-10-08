# LifeDex — Real-World Pokédex for Flora & Fauna 🌿🦅🐞

**LifeDex** is a mobile-first, responsive web application designed as a real-world Pokédex. It empowers nature lovers, hikers, and explorers to identify, register, and catalogue wild plants, animals, birds, insects, and fungi into a gamified collection.

---

## 🌟 Key Features

### 1. Optical Viewfinder HUD & Scanner
- **Target Reticle & Brackets:** Sci-Fi biometric HUD overlay with crosshairs, GPS telemetry coordinates, ISO indicators, and targeting brackets.
- **Dual Capture Methods:**
  - **Take Photo:** Directly triggers the camera input (`accept="image/*" capture="environment"`) or live webcam video stream in the viewfinder.
  - **Upload Image:** Opens the native file browser.
- **One-Click Presets:** Quick specimen samples (Monarch Butterfly, Monstera, Blue Jay, Fly Agaric) for rapid testing without needing immediate photos.

### 2. Futuristic Radar Scanning State
- **Cyber-Biometric Radar Animation:** Superimposed rotating radar cone, pulsating biometric concentric rings, and laser scanline beam sweeping vertically over the specimen.
- **Live Telemetry Ticker:** Realistic scan statuses (`INITIALIZING BIOMETRIC RETICLE...`, `SPECTRAL TEXTURE ANALYSIS...`, `MEASURING MORPHOLOGY & VENATION...`, `CONFIRMING TAXONOMIC CLASSIFICATION...`).
- **Real-Time Audio Synthesizer:** Built with HTML5 Web Audio API to provide futuristic radar pings, shutter snaps, and triumph tones without external audio assets.

### 3. Gamified Analysis Result Card
- **Specimen Overview:** High-resolution thumbnail, common name, and italicized scientific classification (*Danaus plexippus*).
- **Taxonomic Category Badge:** Categorized with badges (🌿 Plant, 🦅 Bird, 🐾 Mammal, 🐞 Insect, 🍄 Fungi, 🦎 Reptile).
- **Match Confidence Gauge:** Dynamic color-coded confidence progress bar (91% – 99%).
- **Rarity Badges:** Common, Rare, Epic, Vulnerable, Protected.
- **Field Notes & Habitat:** Natural history summary and ecology notes.
- **Celebratory Collection Action:** "Add to LifeDex" button triggers confetti particle explosions (`canvas-confetti`) and victory chime, persisting the specimen to LocalStorage.

### 4. "My LifeDex" Regional Field Archive
- **Progress Metrics:** Visual progress bar tracking registered specimens against regional Dex target (e.g., 150 species).
- **Category Filter Tabs:** Filter on demand: **All**, **Plants**, **Animals**, **Birds**, **Insects**.
- **Instant Search:** Search specimens in real-time by common name, Latin binomial, or botanical/zoological family.
- **Interactive Field Guide Modal:** Tap any card to open a full field guide sheet with taxonomy, GPS sighting tags, date logged, and acoustic bio-calls.

### 5. Explorer Settings & Trainer ID Card
- **Bio-Ranger ID Card:** Gamified Trainer card showcasing Ranger Level, Name, and earned field badges (Botanist, Ornithologist, Entomologist, Zoologist).
- **Audio Controls:** Synthesizer SFX toggle.
- **AI Vision Engine Guide:** Built-in guidance and configuration slots for Google Cloud Vision API, Plant.id, and HuggingFace.
- **Catalog Controls:** Load all 8 demo specimens or reset back to starter pack.

---

## 🚀 Running the Project

The application is built with **React**, **Vite**, **Tailwind CSS**, and **Lucide React**.

### Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your mobile or desktop browser.

### Build Production Bundle
```bash
npm run build
```

---

## 🔌 Connecting Real AI Vision APIs (Next Steps)

Currently, LifeDex uses an onboard **Predefined Mock Classification Engine** with realistic species data. When transitioning to a live AI vision backend, connect one of the following recommended APIs:

### Option A: Google Cloud Vision API (General Entities)
Best for detecting animals, birds, insects, and objects across diverse environments.
```javascript
// Example call in a Next.js / Express backend route
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

const [result] = await client.labelDetection(imageBuffer);
const labels = result.labelAnnotations; // Contains entities and confidence scores
```

### Option B: Plant.id / PlantNet API (Flora Taxonomy)
Specialized computer vision trained on botanical databases:
```javascript
const response = await fetch('https://api.plant.id/v2/identify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Api-Key': process.env.PLANT_ID_API_KEY
  },
  body: JSON.stringify({
    images: [base64Image],
    modifiers: ['crops_fast', 'similar_images'],
    plant_details: ['common_names', 'taxonomy', 'url', 'wiki_description']
  })
});
```

### Option C: Hugging Face Inference API (BioCLIP / Custom Vision Models)
Utilize open-source foundation models like BioCLIP (`image-classification`):
```javascript
const response = await fetch(
  "https://api-inference.huggingface.co/models/imageomics/bioclip",
  {
    headers: { Authorization: `Bearer ${HF_TOKEN}` },
    method: "POST",
    body: imageBlob,
  }
);
```
