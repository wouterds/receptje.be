import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useEffect, useState } from 'react';

export const useFingerprint = () => {
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  useEffect(() => {
    FingerprintJS.load().then((fp) => {
      fp.get().then((result) => {
        setFingerprint(result.visitorId);
      });
    });
  }, []);

  return fingerprint;
};
