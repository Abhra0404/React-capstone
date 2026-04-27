# NutriScan

Smart Food Barcode Analyzer

NutriScan is a React web app that helps users scan packaged-food barcodes, review nutrition details, and make quicker food decisions. It combines product data from Open Food Facts with a simple health scoring system, ingredient warnings, and goal-based recommendations.

## Overview

The app is designed for fast, everyday food checks. A user can scan a barcode with their device camera or enter a barcode manually. NutriScan then displays product details, nutrition values, a health category, ingredient warnings, and optional personalized insights.

## Features

- Barcode scanning with device camera support through `@zxing/browser`
- Manual barcode lookup when camera access is unavailable
- Nutrition breakdown for calories, protein, carbohydrates, fat, sugar, fiber, saturated fat, and salt
- Smart health score from `0` to `100`
- Product categories: Healthy, Moderate, and Unhealthy
- Ingredient warnings for added sugars, preservatives, artificial additives, and selected controversial ingredients
- Personalized insights for weight loss, muscle gain, diabetic-friendly, and heart-health goals
- Free product data from [Open Food Facts](https://world.openfoodfacts.org), with no API key required

## Tech Stack

- React 18
- Vite
- ZXing browser barcode scanner
- Open Food Facts API
- Vanilla CSS

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

Camera access works on `localhost`. For deployed versions, camera access requires HTTPS.

## Demo Barcodes

Use the manual input if you do not want to test with a camera:

| Barcode | Product |
| --- | --- |
| `737628064502` | Thai peanut sauce |
| `3017620422003` | Nutella |
| `5449000000996` | Coca-Cola |

Product availability depends on Open Food Facts coverage.

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
```

- `npm run dev` starts the local Vite server.
- `npm run build` creates a production build.
- `npm run preview` previews the production build locally.

## Project Structure

```text
React Capstone/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/
│   │   └── openFoodFacts.js
│   ├── components/
│   │   ├── BarcodeScanner.jsx
│   │   ├── HealthScore.jsx
│   │   ├── IngredientWarnings.jsx
│   │   ├── ManualBarcodeInput.jsx
│   │   ├── NutritionTable.jsx
│   │   ├── PersonalizedInsights.jsx
│   │   └── ProductDisplay.jsx
│   ├── utils/
│   │   ├── healthScore.js
│   │   ├── ingredientWarnings.js
│   │   └── insights.js
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

## How The Score Works

NutriScan calculates a heuristic health score using available nutrition data. It considers sugar, fat, saturated fat, salt, fiber, protein, additives, and processing level where data is available.

The score is grouped into three simple categories:

- Healthy: `70–100`
- Moderate: `45–69`
- Unhealthy: `0–44`

## Data Source

NutriScan uses the public [Open Food Facts](https://world.openfoodfacts.org) database. Product records are community-maintained, so some products may have incomplete nutrition, ingredient, or image data.

## Disclaimer

Health scores and warnings are estimates based on available product data. NutriScan is not medical advice. Always check the product label and consult a qualified professional for dietary or medical decisions.
