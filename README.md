# 🥗 NutriScan – Smart Food Barcode Analyzer

> Scan. Analyze. Decide better.

NutriScan is a React (Vite) web app that lets users scan packaged-food barcodes with their device camera and instantly view detailed nutrition info, a smart health score, ingredient warnings, and personalized goal-based tips.

## ✨ Features

- 🔍 **Barcode scanning** – live camera scanning via [`@zxing/browser`](https://github.com/zxing-js/browser) (supports EAN, UPC, Code-128, etc.)
- ⌨️ **Manual entry** fallback when a camera isn't available
- 📊 **Nutritional analysis** per 100 g – calories, protein, carbs, sugar, fat, saturated fat, fiber, salt
- 🧠 **Smart health score (0–100)** with color-coded category 🟢 Healthy / 🟡 Moderate / 🔴 Unhealthy and reasoning
- ⚠️ **Ingredient warnings** – detects HFCS, trans fats, MSG, artificial colors/sweeteners, risky E-numbers, and more
- 🎯 **Personalized insights** – pick a goal (weight loss, muscle gain, diabetic-friendly, heart-healthy) for tailored tips
- 🌐 Powered by the free [Open Food Facts](https://world.openfoodfacts.org) API – no API key required

## 🚀 Getting started

```bash
npm install
npm run dev
```

Open the URL printed in the terminal (usually http://localhost:5173). Camera access requires HTTPS or `localhost`.

### Build for production

```bash
npm run build
npm run preview
```

## 🧪 Try it without a camera

Use the manual input with a real barcode, e.g.:

- `737628064502` – Thai peanut sauce
- `3017620422003` – Nutella
- `5449000000996` – Coca-Cola

## 📁 Project structure

```
src/
  api/openFoodFacts.js       # API client + product normalization
  components/                # UI components
    BarcodeScanner.jsx
    ManualBarcodeInput.jsx
    ProductDisplay.jsx
    HealthScore.jsx
    NutritionTable.jsx
    IngredientWarnings.jsx
    PersonalizedInsights.jsx
  utils/
    healthScore.js           # smart health score logic
    ingredientWarnings.js    # harmful/controversial ingredient detection
    insights.js              # goal-based personalized tips
  App.jsx
  main.jsx
  styles.css
```

## ⚖️ Disclaimer

Health scores and warnings are heuristic estimates derived from public data and are **not medical advice**. Always check the actual product label and consult a professional for dietary decisions.
