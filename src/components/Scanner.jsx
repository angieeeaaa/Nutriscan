import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

function Scanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const isRunning = useRef(false);

  useEffect(() => {
    const html5Qrcode = new Html5Qrcode('reader');
    scannerRef.current = html5Qrcode;

    html5Qrcode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        onScan(decodedText);
        if (isRunning.current) {
          html5Qrcode.stop().catch(() => {});
          isRunning.current = false;
        }
      },
      () => {}
    ).then(() => {
      isRunning.current = true;
    }).catch(err => console.log(err));

    return () => {
      if (scannerRef.current && isRunning.current) {
        scannerRef.current.stop().catch(() => {});
        isRunning.current = false;
      }
    };
  }, [onScan]);

  return (
    <div className="scanner-wrap">
      <p className="subtitle">Point your camera at a barcode</p>
      <div id="reader" style={{ width: '100%' }}></div>
      <button className="btn-secondary" onClick={onClose} style={{ marginTop: '1rem' }}>
        Cancel
      </button>
    </div>
  );
}

export default Scanner;