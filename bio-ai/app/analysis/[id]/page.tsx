"use client";

import { use, useEffect, useState } from 'react';
import { useAction, useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useRouter } from 'next/navigation';
import ThreeDMolViewer from '../../components/ThreeDMolViewer';

export default function AnalysisPage({ params }: { params: Promise<{ id: Id<"analysis"> }> }) {
  const { id } = use(params);
  const analysis = useQuery(api.analysis.get, { id });
  const predictAlternateLigands = useAction(api.tamarind.predictAlternateLigands);
  const addJobNameToAnalysis = useMutation(api.analysis.addJobNameToAnalysis);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [proteinContent, setProteinContent] = useState<string | null>(null);
  const [ligandContent, setLigandContent] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isRetrieving, setIsRetrieving] = useState(false);
  const retrieveResults = useAction(api.tamarind.retrieveResults);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') {
      router.push('/signin');
    }
  }, [router]);

  useEffect(() => {
    const fetchContent = async () => {
      console.log("Analysis data received:", analysis);
      if (analysis && analysis.proteinUrl) {
        try {
          const response = await fetch(analysis.proteinUrl);
          if (response.ok) {
            const content = await response.text();
            setProteinContent(content);
          }
        } catch (error) {
          console.error("Failed to fetch protein content", error);
        }
      }
      if (analysis && analysis.ligandUrl) {
        console.log("Fetching ligand from URL:", analysis.ligandUrl);
        try {
          const response = await fetch(analysis.ligandUrl);
          if (response.ok) {
            const content = await response.text();
            console.log("Ligand content fetched successfully. Length:", content.length);
            setLigandContent(content);
          } else {
            console.error("Failed to fetch ligand file, status:", response.status);
          }
        } catch (error) {
          console.error("Failed to fetch ligand content", error);
        }
      }
    };

    fetchContent();
  }, [analysis]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/signin');
  };

  const handlePredict = async () => {
    if (!proteinContent || !ligandContent || !analysis) return;
    setIsPredicting(true);
    try {
      const jobName = await predictAlternateLigands({
        proteinFileContent: proteinContent,
        proteinFileName: analysis.proteinFileName,
        ligandFileContent: ligandContent,
        ligandFileName: analysis.ligandFileName,
      });
      await addJobNameToAnalysis({ analysisId: analysis._id, jobName });
      alert(`Job submitted successfully! Job Name: ${jobName}`);
    } catch (error) {
      console.error("Prediction failed:", error);
      alert(`Error: ${(error as Error).message}`);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleRetrieve = async () => {
    if (!analysis?.jobName) {
      alert("Please submit a prediction job first.");
      return;
    }
    setIsRetrieving(true);
    try {
      const result = await retrieveResults({ 
        analysisId: analysis._id,
        jobName: analysis.jobName,
        ligandFileName: analysis.ligandFileName 
      });
      alert(result.message);
    } catch (error) {
      console.error("Result retrieval failed:", error);
      alert(`Error: ${(error as Error).message}`);
    } finally {
      setIsRetrieving(false);
    }
  };

  if (!analysis || !analysis.proteinFileName || !analysis.ligandFileName) {
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
        {analysis.jobName && <p>Job Name: {analysis.jobName}</p>}
        
        <div style={{ display: 'flex', gap: '20px', marginTop: '2rem' }}>
          <div>
            <h2>Protein Structure</h2>
            <ThreeDMolViewer fileContent={proteinContent} format={analysis.proteinFileName.split('.').pop() as 'pdb' | 'sdf'} />
            <p style={{ marginTop: '10px' }}>
              Protein File: <a href={analysis.proteinUrl || '#'} target="_blank" rel="noopener noreferrer">Download</a>
            </p>
          </div>
          <div>
            <h2>Ligand Structure</h2>
            <ThreeDMolViewer fileContent={ligandContent} format={analysis.ligandFileName.split('.').pop() as 'pdb' | 'sdf'} />
            <p style={{ marginTop: '10px' }}>
              Ligand File: <a href={analysis.ligandUrl || '#'} target="_blank" rel="noopener noreferrer">Download</a>
            </p>
          </div>
        </div>

        <div style={{ marginTop: '2rem', width: '100%', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button 
            onClick={handlePredict}
            disabled={isPredicting || !!analysis.jobName}
            style={{ 
              padding: '10px 20px', 
              background: isPredicting || !!analysis.jobName ? '#ccc' : '#0070f3', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: isPredicting || !!analysis.jobName ? 'not-allowed' : 'pointer' 
            }}
          >
            {isPredicting ? 'Predicting...' : (analysis.jobName ? 'Prediction Submitted' : 'Predict Alternate Ligands')}
          </button>
          <button 
            onClick={handleRetrieve}
            disabled={isRetrieving || !analysis.jobName}
            style={{ 
              padding: '10px 20px', 
              background: isRetrieving || !analysis.jobName ? '#ccc' : '#0070f3', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: isRetrieving || !analysis.jobName ? 'not-allowed' : 'pointer' 
            }}
          >
            {isRetrieving ? 'Retrieving...' : 'Retrieve Results'}
          </button>
        </div>

        {analysis.resultData && (
          <div style={{ marginTop: '2rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>Predicted Ligands</h2>
            <ThreeDMolViewer fileContent={analysis.resultData} format="sdf" />
          </div>
        )}
      </main>
    </div>
  );
}
