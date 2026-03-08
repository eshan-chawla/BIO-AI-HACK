"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function Analyse() {
  const [proteinFile, setProteinFile] = useState<File | null>(null);
  const [ligandFile, setLigandFile] = useState<File | null>(null);
  const createAnalysis = useMutation(api.analysis.create);
  const generateUploadUrl = useMutation(api.analysis.generateUploadUrl);
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

  const handleAnalyse = async () => {
    if (proteinFile && ligandFile) {
      try {
        // 1. Get separate upload URLs for both files
        const proteinUploadUrl = await generateUploadUrl();
        const ligandUploadUrl = await generateUploadUrl();

        // 2. Upload the protein file
        const proteinResult = await fetch(proteinUploadUrl, {
          method: "POST",
          headers: { "Content-Type": proteinFile.type || "application/octet-stream" },
          body: proteinFile,
        });

        if (!proteinResult.ok) {
          throw new Error(`Protein file upload failed: ${await proteinResult.text()}`);
        }
        const { storageId: proteinFileId } = await proteinResult.json();

        // 3. Upload the ligand file
        const ligandResult = await fetch(ligandUploadUrl, {
          method: "POST",
          headers: { "Content-Type": ligandFile.type || "application/octet-stream" },
          body: ligandFile,
        });

        if (!ligandResult.ok) {
          throw new Error(`Ligand file upload failed: ${await ligandResult.text()}`);
        }
        const { storageId: ligandFileId } = await ligandResult.json();

        if (!proteinFileId || !ligandFileId) {
          throw new Error("File upload succeeded, but Storage ID was missing.");
        }

        // 4. Create the analysis record
        const analysisId = await createAnalysis({
          proteinFileId,
          ligandFileId,
        });
        router.push(`/analysis/${analysisId}`);
      } catch (error) {
        console.error("Analysis creation failed:", error);
        alert("Error: Could not upload files. Please check the console for details.");
      }
    } else {
      alert('Please upload both a protein and a ligand file.');
    }
  };

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
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start" style={{ marginLeft: isMenuOpen ? '250px' : '0', transition: 'margin-left 0.3s ease-in-out' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Analyse</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Protein (PDB):</label>
            <input type="file" accept=".pdb" onChange={(e) => setProteinFile(e.target.files?.[0] || null)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Ligand (SDF):</label>
            <input type="file" accept=".sdf" onChange={(e) => setLigandFile(e.target.files?.[0] || null)} />
          </div>
          <button 
            onClick={handleAnalyse}
            style={{ padding: '10px 20px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Analyse
          </button>
        </div>
      </main>
    </div>
  );
}
