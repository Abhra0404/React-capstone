import { useCallback, useState } from 'react';
import BarcodeScanner from './components/BarcodeScanner.jsx';
import ManualBarcodeInput from './components/ManualBarcodeInput.jsx';
import ProductDisplay from './components/ProductDisplay.jsx';
import { fetchProductByBarcode } from './api/openFoodFacts.js';

export default function App() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [goal, setGoal] = useState('none');

  const lookup = useCallback(async (code) => {
    setLoading(true);
    setError('');
    setProduct(null);
    try {
      const data = await fetchProductByBarcode(code);
      setProduct(data);
    } catch (e) {
      setError(e.message || 'Lookup failed.');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = () => {
    setProduct(null);
    setError('');
  };

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__logo">🥗</span>
          <div>
            <h1>NutriScan</h1>
            <p>Scan. Analyze. Decide better.</p>
          </div>
        </div>
      </header>

      <main className="app__main">
        {!product && (
          <section className="hero">
            <h2>Smart Food Barcode Analyzer</h2>
            <p>
              Scan any packaged food barcode to get instant nutrition facts, a smart health score,
              ingredient warnings, and personalized tips.
            </p>

            <BarcodeScanner onDetected={lookup} onError={setError} />

            <div className="divider"><span>or enter manually</span></div>

            <ManualBarcodeInput onSubmit={lookup} disabled={loading} />

            {loading && <p className="status">Looking up product…</p>}
            {error && <p className="status status--error">{error}</p>}
          </section>
        )}

        {product && (
          <ProductDisplay
            product={product}
            goal={goal}
            onGoalChange={setGoal}
            onReset={reset}
          />
        )}
      </main>

      <footer className="app__footer">
        <p>
          Data from{' '}
          <a href="https://world.openfoodfacts.org" target="_blank" rel="noreferrer">
            Open Food Facts
          </a>
          . Health scores are heuristic estimates and not medical advice.
        </p>
      </footer>
    </div>
  );
}
