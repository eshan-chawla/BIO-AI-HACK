"use client";

import { use, useEffect, useState } from 'react';
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useRouter } from 'next/navigation';
import ThreeDMolViewer from '../../components/ThreeDMolViewer';

export default function AnalysisPage({ params }: { params: Promise<{ id: Id<"analysis"> }> }) {
  const { id } = use(params);
  const analysis = useQuery(api.analysis.get, { id });
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') {
      router.push('/signin');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/signin');
  };

  if (!analysis) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 110, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <span style={{ display: 'block', width: '25px', height: '3px', background: '#333', borderRadius: '3px' }}></span>
        <span style={{ display: 'block', width: '25px', height: '3px', background: '#333', borderRadius: '3px' }}></span>
        <span style={{ display: 'block', width: '25px', height: '3px', background: '#333', borderRadius: '3px' }}></span>
      </button>
      <div style={{ position: 'fixed', top: '0', left: isMenuOpen ? '0' : '-250px', width: '250px', height: '100vh', background: '#fff', boxShadow: '2px 0 8px rgba(0,0,0,0.1)', zIndex: 100, transition: 'left 0.3s ease-in-out', paddingTop: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px 20px' }}>
            <button onClick={() => router.push('/analyse')} style={{ background: 'none', border: 'none', padding: '8px 12px', cursor: 'pointer', textAlign: 'left', color: 'black' }}>Analyse</button>
            <button onClick={() => router.push('/reports')} style={{ background: 'none', border: 'none', padding: '8px 12px', cursor: 'pointer', textAlign: 'left', color: 'black' }}>View Reports</button>
            <button style={{ background: 'none', border: 'none', padding: '8px 12px', cursor: 'pointer', textAlign: 'left', color: 'black' }}>Settings</button>
          </div>
        </div>
        <div style={{ padding: '10px 20px', marginBottom: '20px' }}>
          <button
            onClick={handleLogout}
            style={{ background: 'none', border: 'none', padding: '8px 12px', cursor: 'pointer', textAlign: 'left', color: 'black', width: '100%' }}
          >
            Logout
          </button>
        </div>
      </div>
      <main className="flex min-h-screen w-full flex-col items-center justify-start py-32 px-16 bg-white dark:bg-black sm:items-start" style={{ marginLeft: isMenuOpen ? '250px' : '0', transition: 'margin-left 0.3s ease-in-out' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Analysis Details</h1>
        <p>Analysis ID: {analysis._id}</p>
        
        <div style={{ display: 'flex', gap: '20px', marginTop: '2rem' }}>
          <div>
            <h2>Protein Structure</h2>
            <ThreeDMolViewer fileUrl={analysis.proteinUrl} format="pdb" />
            <p style={{ marginTop: '10px' }}>
              Protein File: <a href={analysis.proteinUrl || '#'} target="_blank" rel="noopener noreferrer">Download</a>
            </p>
          </div>
          <div>
            <h2>Ligand Structure</h2>
            <ThreeDMolViewer fileUrl={analysis.ligandUrl} format="sdf" />
            <p style={{ marginTop: '10px' }}>
              Ligand File: <a href={analysis.ligandUrl || '#'} target="_blank" rel="noopener noreferrer">Download</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
