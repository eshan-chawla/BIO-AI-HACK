'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

declare global {
  namespace $3Dmol {
    function createViewer(element: any, config: any): any;
  }
}

interface ThreeDMolViewerProps {
  fileUrl: string | null;
  format: 'pdb' | 'sdf';
}

export default function ThreeDMolViewer({ fileUrl, format }: ThreeDMolViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Initialize viewer when the script is loaded
    if (isScriptLoaded && viewerRef.current && !viewerInstanceRef.current && window.$3Dmol) {
      viewerInstanceRef.current = $3Dmol.createViewer(viewerRef.current, {
        backgroundColor: 'white',
      });
      viewerInstanceRef.current.render();
    }

    // Load data when the viewer and fileUrl are ready
    if (viewerInstanceRef.current && fileUrl) {
      const loadData = async () => {
        try {
          const response = await fetch(fileUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
          }
          const fileContent = await response.text();

          const viewer = viewerInstanceRef.current;
          viewer.clear();
          viewer.addModel(fileContent, format);

          if (format === 'pdb') {
            viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
          } else {
            viewer.setStyle({}, { sphere: {} });
          }

          viewer.zoomTo();
          viewer.render();
        } catch (error) {
          console.error('Error loading data in 3Dmol viewer:', error);
        }
      };

      loadData();
    }
  }, [isScriptLoaded, fileUrl, format]);

  return (
    <>
      <Script
        src="https://3Dmol.org/build/3Dmol-min.js"
        strategy="lazyOnload"
        onLoad={() => setIsScriptLoaded(true)}
      />
      <div ref={viewerRef} style={{ height: '400px', width: '400px', position: 'relative', border: '1px solid #ccc' }} />
    </>
  );
}
