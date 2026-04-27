import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

export default function BarcodeScanner({ onDetected, onError }) {
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState(null);
  const [active, setActive] = useState(false);

  // List available cameras once.
  useEffect(() => {
    (async () => {
      try {
        const list = await BrowserMultiFormatReader.listVideoInputDevices();
        setDevices(list);
        // Prefer back camera if available
        const back = list.find((d) => /back|rear|environment/i.test(d.label));
        setDeviceId((back || list[0])?.deviceId || null);
      } catch (e) {
        onError?.('Unable to access camera devices. Please grant camera permission.');
      }
    })();
  }, [onError]);

  // Start / stop scanning whenever active or deviceId changes.
  useEffect(() => {
    if (!active || !videoRef.current) return undefined;
    const reader = new BrowserMultiFormatReader();
    let stopped = false;

    reader
      .decodeFromVideoDevice(deviceId || undefined, videoRef.current, (result, err, controls) => {
        if (stopped) return;
        if (controls && !controlsRef.current) controlsRef.current = controls;
        if (result) {
          const code = result.getText();
          stopped = true;
          controls?.stop();
          setActive(false);
          onDetected?.(code);
        }
      })
      .catch((e) => {
        onError?.(e?.message || 'Failed to start camera.');
        setActive(false);
      });

    return () => {
      stopped = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [active, deviceId, onDetected, onError]);

  return (
    <div className="scanner">
      <div className={`scanner__viewport ${active ? 'is-active' : ''}`}>
        <video ref={videoRef} muted playsInline />
        {!active && (
          <div className="scanner__placeholder">
            <span className="scanner__icon">📷</span>
            <p>Tap “Start scanning” and point your camera at a barcode.</p>
          </div>
        )}
        {active && <div className="scanner__reticle" />}
      </div>

      <div className="scanner__controls">
        {devices.length > 1 && (
          <select
            value={deviceId || ''}
            onChange={(e) => setDeviceId(e.target.value)}
            disabled={active}
          >
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || `Camera ${d.deviceId.slice(0, 6)}`}
              </option>
            ))}
          </select>
        )}
        {!active ? (
          <button className="btn btn--primary" onClick={() => setActive(true)}>
            Start scanning
          </button>
        ) : (
          <button className="btn btn--ghost" onClick={() => setActive(false)}>
            Stop
          </button>
        )}
      </div>
    </div>
  );
}
