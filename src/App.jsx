import { useCallback, useState } from 'react';
import { ScanLine, Activity, ShieldCheck, BadgeInfo } from 'lucide-react';
import BarcodeScanner from './components/BarcodeScanner.jsx';
import ManualBarcodeInput from './components/ManualBarcodeInput.jsx';
import ProductDisplay from './components/ProductDisplay.jsx';
import { fetchProductByBarcode } from './api/openFoodFacts.js';

export default function App() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [goal, setGoal] = useState('none');
  const [showScanner, setShowScanner] = useState(false);

  const lookup = useCallback(async (code) => {
    setLoading(true);
    setError('');
    setProduct(null);
    try {
      const data = await fetchProductByBarcode(code);
      setProduct(data);
      setShowScanner(false);
    } catch (e) {
      setError(e.message || 'Lookup failed.');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = () => {
    setProduct(null);
    setError('');
    setShowScanner(false);
  };

  return (
    <div className="app">
      <div className="bg-elements">
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>
      </div>

      <header className="app__header">
        <div className="app__brand fade-in-up">
          <div className="app__brand-main">
            <div className="logo-container">
              <img src="/favicon.svg" alt="NutriScan logo" className="logo-image" />
            </div>
            <div>
              <h1>NutriScan</h1>
            </div>
          </div>
          <span className="app__badge">Powered by Open Food Facts</span>
        </div>
      </header>

      <main className="app__main">
        {!product ? (
            <section className="hero fade-in">
              <div className="hero__content">
                <div className="fade-in-up delay-1">
                  <span className="hero__eyebrow">Smart Nutrition Analyzer</span>
                  <h2 className="hero__title">
                    Decode your food in <span className="text-gradient">seconds.</span>
                  </h2>
                  <p className="hero__lede">
                    NutriScan transforms confusing nutrition labels into crystal-clear insights. Instantly evaluate health impacts, track your goals, and make better dietary choices.
                  </p>
                </div>

                <div className="hero__features fade-in-up delay-2">
                  <div className="feature-item">
                    <div className="feature-icon feature-icon-green"><Activity size={20}/></div>
                    <span>Instant Health Score</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon feature-icon-yellow"><ShieldCheck size={20}/></div>
                    <span>Flag Hidden Ingredients</span>
                  </div>
                </div>
                
                <div className="hero__education fade-in-up delay-3">
                  <div className="hero__education-head">
                    <BadgeInfo size={18} className="icon-primary" />
                    <span>How to read the scores</span>
                  </div>
                  <div className="hero__education-grid">
                    <article className="hero-edu-card">
                      <h3>Nutri-Score (A-E)</h3>
                      <p>
                        Measures nutritional quality per 100g/ml. A is generally healthier, while E indicates lower nutritional quality.
                      </p>
                    </article>
                    <article className="hero-edu-card">
                      <h3>NOVA (1-4)</h3>
                      <p>
                        Measures processing level. Group 1 is minimally processed; Group 4 is ultra-processed.
                      </p>
                    </article>
                  </div>
                </div>
              </div>

              <div className="hero__scanner-wrapper fade-in-up delay-2">
                <div className="glass-panel scan-panel">
                  <div className="scan-panel__header">
                    <div className="scan-panel__title-group">
                      <div className="pulse-dot"></div>
                      <h3>Live Lookup</h3>
                    </div>
                  </div>
                  
                  {showScanner ? (
                    <BarcodeScanner
                      onDetected={lookup}
                      onError={setError}
                      onClose={() => setShowScanner(false)}
                    />
                  ) : (
                    <div className="scanner-placeholder" onClick={() => setShowScanner(true)}>
                      <div className="scanner-icon-bg">
                        <ScanLine size={48} className="placeholder-icon" />
                      </div>
                      <p>Tap to activate scanner</p>
                    </div>
                  )}

                  <div className="divider"><span>or manual entry</span></div>

                  <ManualBarcodeInput onSubmit={lookup} disabled={loading} />

                  {loading && (
                    <div className="status-loading fade-in">
                      <div className="loader"></div> Processing barcode...
                    </div>
                  )}
                  {error && (
                    <div className="status-error fade-in">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </section>
          ) : (
            <div className="fade-in-up">
              <ProductDisplay
                product={product}
                goal={goal}
                onGoalChange={setGoal}
                onReset={reset}
              />
            </div>
          )}
      </main>

      <footer className="app__footer">
        <p>Data provided by <a href="https://world.openfoodfacts.org" target="_blank" rel="noreferrer">Open Food Facts</a>. Health scores are heuristic estimates.</p>
      </footer>
    </div>
  );
}
