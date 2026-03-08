'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  namespace $3Dmol {
    function createViewer(element: any, config: any): any;
  }
}

interface ThreeDMolViewerProps {
  fileContent: string | null;
  format: 'pdb' | 'sdf';
}

export default function ThreeDMolViewer({ fileContent, format }: ThreeDMolViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);
  const [isLibLoaded, setIsLibLoaded] = useState(false);

  useEffect(() => {
    if (window.$3Dmol) {
      setIsLibLoaded(true);
    } else {
      const script = document.createElement('script');
      script.src = 'https://3dmol.org/build/3Dmol-min.js';
      script.async = true;
      script.onload = () => setIsLibLoaded(true);
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    // Wait until the 3Dmol library is loaded, content is available, and the viewer is mounted
    if (!isLibLoaded || !fileContent || !viewerRef.current) {
      return; // Exit if not ready
    }

    // Initialize viewer instance if it doesn't exist
    if (!viewerInstanceRef.current) {
      viewerInstanceRef.current = $3Dmol.createViewer(viewerRef.current, {
        backgroundColor: 'white',
      });
    }

    const viewer = viewerInstanceRef.current;
    viewer.clear();
    viewer.addModel(fileContent, format);

    if (format === 'pdb') {
      viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
    } else {
      viewer.setStyle({}, { stick: { colorscheme: 'element' } });
    }

    viewer.zoomTo();
    viewer.render();

  }, [isLibLoaded, fileContent, format]); // Re-run when content or format changes

  return (
    <div ref={viewerRef} style={{ height: '400px', width: '400px', position: 'relative', border: '1px solid #ccc' }} />
  );
}

