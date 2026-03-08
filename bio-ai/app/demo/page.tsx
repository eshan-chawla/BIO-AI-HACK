'use client';

import { useState, useEffect } from 'react';
import ThreeDMolViewer from '../components/ThreeDMolViewer';

// Hardcoded data for the demo page
const ligandSDF = `N3A_ideal
  Mrv2205 03252013492D

  0  0  0     0  0            999 V3000
M  V30 BEGIN CTAB
M  V30 COUNTS 40 42 0 0 0
M  V30 BEGIN ATOM
M  V30 1 C -10.9868 1.9577 0 0
M  V30 2 C -9.5668 1.9577 0 0
M  V30 3 C -8.8568 3.1677 0 0
M  V30 4 C -7.4368 3.1677 0 0
M  V30 5 C -6.7268 1.9577 0 0
M  V30 6 C -7.4368 0.7477 0 0
M  V30 7 C -8.8568 0.7477 0 0
M  V30 8 C -11.6968 0.7477 0 0
M  V30 9 N -10.9868 -0.4623 0 0
M  V30 10 C -11.6968 -1.6723 0 0
M  V30 11 O -12.8568 -1.6723 0 0
M  V30 12 N -10.9868 -2.8823 0 0
M  V30 13 C -11.6968 -4.0923 0 0
M  V30 14 C -10.9868 -5.3023 0 0
M  V30 15 C -9.5668 -5.3023 0 0
M  V30 16 C -8.8568 -6.5123 0 0
M  V30 17 C -7.4368 -6.5123 0 0
M  V30 18 C -6.7268 -5.3023 0 0
M  V30 19 C -7.4368 -4.0923 0 0
M  V30 20 C -8.8568 -4.0923 0 0
M  V30 21 C -13.2368 -4.0923 0 0
M  V30 22 C -13.9468 -5.3023 0 0
M  V30 23 C -15.3668 -5.3023 0 0
M  V30 24 C -16.0768 -4.0923 0 0
M  V30 25 C -15.3668 -2.8823 0 0
M  V30 26 C -13.9468 -2.8823 0 0
M  V30 27 C -13.9468 -6.7223 0 0
M  V30 28 C -13.2368 -7.9323 0 0
M  V30 29 C -13.9468 -9.1423 0 0
M  V30 30 C -15.3668 -9.1423 0 0
M  V30 31 C -16.0768 -7.9323 0 0
M  V30 32 C -15.3668 -6.7223 0 0
M  V30 33 C -4.9468 -5.3023 0 0
M  V30 34 N -4.2368 -6.5123 0 0
M  V30 35 C -2.8168 -6.5123 0 0
M  V30 36 O -2.1068 -5.3023 0 0
M  V30 37 O -2.1068 -7.7223 0 0
M  V30 38 C -4.9468 1.9577 0 0
M  V30 39 F -4.2368 3.1677 0 0
M  V30 40 F -4.2368 0.7477 0 0
M  V30 END ATOM
M  V30 BEGIN BOND
M  V30 1 1 1 2
M  V30 2 2 2 3
M  V30 3 1 3 4
M  V30 4 2 4 5
M  V30 5 1 5 6
M  V30 6 2 6 7
M  V30 7 1 2 7
M  V30 8 1 1 8
M  V30 9 1 8 9
M  V30 10 1 9 10
M  V30 11 2 10 11
M  V30 12 1 10 12
M  V30 13 1 12 13
M  V30 14 1 13 14
M  V30 15 1 14 15
M  V30 16 2 15 16
M  V30 17 1 16 17
M  V30 18 2 17 18
M  V30 19 1 18 19
M  V30 20 2 19 20
M  V30 21 1 15 20
M  V30 22 1 14 20
M  V30 23 1 13 21
M  V30 24 1 21 22
M  V30 25 2 22 23
M  V30 26 1 23 24
M  V30 27 2 24 25
M  V30 28 1 25 26
M  V30 29 2 21 26
M  V30 30 1 22 27
M  V30 31 1 27 28
M  V30 32 2 28 29
M  V30 33 1 29 30
M  V30 34 2 30 31
M  V30 35 1 31 32
M  V30 36 2 27 32
M  V30 37 1 18 33
M  V30 38 1 33 34
M  V30 39 1 34 35
M  V30 40 2 35 36
M  V30 41 1 35 37
M  V30 42 1 5 38
M  V30 END BOND
M  V30 END CTAB
M  END
$$$$
`;

const ligandData = {
  "Ligand 1": {
    sdf: `
     RDKit          3D

  9  8  0  0  0  0  0  0  0  0999 V2000
    1.3594   -1.4417   -0.9696 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.8847   -0.1558   -0.6921 O   0  0  0  0  0  0  0  0  0  0  0  0
   -0.1145   -1.2906   -1.2751 C   0  0  2  0  0  0  0  0  0  0  0  0
   -2.2321   -0.6736   -0.0536 C   0  0  0  0  0  0  0  0  0  0  0  0
   -2.4189    2.7649    1.2072 O   0  0  0  0  0  0  0  0  0  0  0  0
   -0.3417   -0.0873   -2.0059 O   0  0  0  0  0  0  0  0  0  0  0  0
   -2.4229    1.7079    0.3084 C   0  0  0  0  0  0  0  0  0  0  0  0
   -0.8934   -1.3574    0.0167 C   0  0  0  0  0  0  0  0  0  0  0  0
   -2.3791    0.3863    1.0084 C   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0
  1  3  1  0
  3  6  1  1
  3  8  1  0
  4  8  1  0
  4  9  1  0
  5  7  1  0
  7  9  1  0
M  END
$$$$
`,
        smiles: "CC(C)C[C@H](C)O",
    radarImg: "/radar_samples_1.png",
  },
  "Ligand 2": {
    sdf: `
     RDKit          3D

 14 14  0  0  0  0  0  0  0  0999 V2000
   -3.8209    0.1508    2.0110 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.3678   -0.0489   -0.5802 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.2450   -1.4482   -1.2208 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.0287    0.3774   -1.6780 O   0  0  0  0  0  0  0  0  0  0  0  0
   -2.6918    2.3966   -1.2652 O   0  0  0  0  0  0  0  0  0  0  0  0
   -4.4367    1.3705    1.7179 C   0  0  0  0  0  0  0  0  0  0  0  0
   -2.4082    0.3875    0.1196 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.6082   -1.0485   -0.8140 C   0  0  0  0  0  0  0  0  0  0  0  0
   -3.0071    1.6146   -0.1762 C   0  0  0  0  0  0  0  0  0  0  0  0
   -0.6213   -1.0386   -0.1777 N   0  0  0  0  0  0  0  0  0  0  0  0
   -2.7994   -0.3192    1.2135 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.1737   -1.8010   -0.0115 O   0  0  0  0  0  0  0  0  0  0  0  0
   -4.0312    2.0868    0.6268 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.0946   -0.0295   -1.2671 O   0  0  0  0  0  0  0  0  0  0  0  0
  1  6  2  0
  1 11  1  0
  2  4  2  0
  2  7  1  0
  2 10  1  0
  3  8  1  0
  3 10  1  0
  5  9  1  0
  6 13  1  0
  7  9  1  0
  7 11  2  0
  8 12  2  0
  8 14  1  0
  9 13  2  0
M  END
$$$$
`,
    smiles: "CN(C)C(=O)NC1=CC=C(C=C1)C(C)=O",
    radarImg: "/radar_samples_3.png",
  },
  "Ligand 3": {
    sdf: `
     RDKit          3D

 13 13  0  0  0  0  0  0  0  0999 V2000
    0.3483   -1.9349   -0.5251 O   0  0  0  0  0  0  0  0  0  0  0  0
    0.1919   -0.9652   -0.9655 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.9728   -1.0980    1.3122 O   0  0  0  0  0  0  0  0  0  0  0  0
   -1.9095    0.4874   -0.3425 C   0  0  0  0  0  0  0  0  0  0  0  0
   -2.7911    1.0374    1.6614 O   0  0  0  0  0  0  0  0  0  0  0  0
   -2.1112    0.1892    0.9354 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.7296    1.3529   -2.9330 C   0  0  0  0  0  0  0  0  0  0  0  0
   -0.9954    0.0341   -1.2343 C   0  0  0  0  0  0  0  0  0  0  0  0
   -2.6348    1.8474   -2.1504 C   0  0  0  0  0  0  0  0  0  0  0  0
   -0.8884    0.4470   -2.4868 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.7847   -0.4281   -0.9492 O   0  0  0  0  0  0  0  0  0  0  0  0
   -2.7078    1.4160   -0.9295 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.7583   -2.3543   -0.2222 C   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0
  1 13  1  0
  2  8  1  0
  2 11  2  0
  3  6  1  0
  4  6  1  0
  4  8  2  0
  4 12  1  0
  5  6  2  0
  7  9  1  0
  7 10  2  0
  8 10  1  0
  9 12  2  0
M  END
$$$$
`,
    smiles: "CC1=CC(=O)C=C(C1)C",
    radarImg: "/radar_samples_4.png",
  },
  "Ligand 4": {
    sdf: `
     RDKit          3D

 11 10  0  0  0  0  0  0  0  0999 V2000
   -1.1145   -0.8835   -0.7659 C   0  0  0  0  0  0  0  0  0  0  0  0
   -0.8543    0.1662   -1.7043 O   0  0  0  0  0  0  0  0  0  0  0  0
    2.4239   -2.1880    0.0887 O   0  0  0  0  0  0  0  0  0  0  0  0
   -1.8855    1.8122    0.9042 O   0  0  0  0  0  0  0  0  0  0  0  0
   -2.4832    0.7770    0.5809 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.8211   -0.1479   -0.5300 O   0  0  0  0  0  0  0  0  0  0  0  0
   -2.1014   -1.8404   -1.4479 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.7237   -0.4683    0.5948 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.5408   -1.3176   -0.2738 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.1074   -1.7759   -0.3745 C   0  0  0  0  0  0  0  0  0  0  0  0
   -3.6964    0.7222    0.2607 O   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0
  1  7  1  0
  1  8  1  0
  1 10  1  0
  3  9  2  0
  4  5  1  0
  5  8  1  0
  5 11  2  0
  6  9  1  0
  9 10  1  0
M  END
$$$$
`,
    smiles: "COC1=CC=C(C=C1)C(C)C(=O)O",
    radarImg: "/radar_samples_5.png",
  },
};

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('Protein Structure');
  const [activeLigand, setActiveLigand] = useState<keyof typeof ligandData>('Ligand 1');
  const [proteinContent, setProteinContent] = useState<string | null>(null);
  const [ligandContent, setLigandContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchProtein = async () => {
      try {
        const response = await fetch('/6W70.pdb');
        if (response.ok) {
          const content = await response.text();
          setProteinContent(content);
        } else {
          console.error("Failed to fetch protein PDB");
        }
      } catch (error) {
        console.error("Error fetching protein PDB:", error);
      }
    };

    fetchProtein();
    setLigandContent(ligandSDF);
  }, []);

  return (
    <div style={{ backgroundColor: '#111', color: '#eee', padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Drug Prediction Analysis</h1>
        <p style={{ color: '#aaa' }}>About: Generate drug candidates for your target protein</p>
        <p style={{ color: '#aaa' }}>Goal: Rank drug predictions based on RMSD score and toxicity levels</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        <div style={{ backgroundColor: '#222', padding: '1rem', borderRadius: '8px' }}>
          <label htmlFor="question-input" style={{ display: 'block', marginBottom: '0.5rem' }}>Ask questions about your report</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input id="question-input" type="text" placeholder="Ask a question..." style={{ flexGrow: 1, padding: '0.5rem', borderRadius: '4px', border: 'none', backgroundColor: '#333', color: '#eee' }} />
            <button style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', backgroundColor: '#0070f3', color: '#fff', cursor: 'pointer' }}>Send</button>
          </div>
        </div>
        <div style={{ backgroundColor: '#222', padding: '1rem', borderRadius: '8px', height: '100%' }}>
          <p style={{ fontStyle: 'italic', color: '#aaa' }}>AI Agent: before questions, after questions</p>
          <div style={{ marginTop: '1rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
            <p><span style={{ fontWeight: 'bold', color: '#0070f3' }}>User:</span> What is RMSD?</p>
            <p style={{ marginTop: '0.5rem' }}><span style={{ fontWeight: 'bold', color: '#eee' }}>AI:</span> Root Mean Square Deviation (RMSD) score is a value that shows how much two 3D structures differ...</p>
          </div>
        </div>
      </div>

      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Input data</h2>
        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
          <div>
            {proteinContent && <ThreeDMolViewer fileContent={proteinContent} format="pdb" />}
            <p style={{ textAlign: 'center', color: '#eee', marginTop: '0.5rem' }}>6W70</p>
          </div>
          <div>
            {ligandContent && <ThreeDMolViewer fileContent={ligandContent} format="sdf" />}
            <p style={{ textAlign: 'center', color: '#eee', marginTop: '0.5rem' }}>SO4</p>
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #333' }}>
            <button onClick={() => setActiveTab('Protein Structure')} style={{ background: activeTab === 'Protein Structure' ? '#333' : 'none', border: 'none', color: '#eee', padding: '0.5rem 1rem', cursor: 'pointer' }}>Protein Structure</button>
            <button onClick={() => setActiveTab('Ligand Options')} style={{ background: activeTab === 'Ligand Options' ? '#333' : 'none', border: 'none', color: '#eee', padding: '0.5rem 1rem', cursor: 'pointer' }}>Ligand Options</button>
            <button onClick={() => setActiveTab('Parameters')} style={{ background: activeTab === 'Parameters' ? '#333' : 'none', border: 'none', color: '#eee', padding: '0.5rem 1rem', cursor: 'pointer' }}>Parameters</button>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#222', marginTop: '1rem', borderRadius: '8px', minHeight: '150px' }}>
            {activeTab === 'Protein Structure' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#eee' }}>PDB Protein Structure</h3>
                <p style={{ marginTop: '1rem', color: '#aaa' }}>Visit the Protein Data Bank: <a href="https://www.rcsb.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3' }}>https://www.rcsb.org/</a></p>
                <p style={{ marginTop: '0.5rem', color: '#aaa' }}>Enter your protein ID and download the corresponding PDB file.</p>
              </div>
            )}
            {activeTab === 'Ligand Options' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#eee' }}>Ligand Options</h3>
                <p style={{ marginTop: '1rem', color: '#aaa' }}>In the PDB entry, go to the “Ligand” tab.</p>
                <p style={{ marginTop: '0.5rem', color: '#aaa' }}>Click “Ligand Definition and Summary” tab to view available ligand options.</p>
                <p style={{ marginTop: '0.5rem', color: '#aaa' }}>Download the SDF file for your reference ligand.</p>
              </div>
            )}
            {activeTab === 'Parameters' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#eee' }}>Parameters</h3>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginTop: '1rem', color: '#aaa' }}>
                  <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#eee' }}>Number of Samples:</strong> How many ligand candidates DrugFlow will generate. Default: 5 candidates per job.</li>
                  <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#eee' }}>Number of Batches:</strong> How many separate jobs run in parallel.</li>
                  <li><strong style={{ color: '#eee' }}>Distance Cutoff:</strong> Defines the binding pocket radius around the reference ligand. Default: 8 Å, used to score how well the ligand fits in the protein.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Overall ranking</h2>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
          {Object.keys(ligandData).map((key, i) => (
            <li key={key}>{i < 3 ? '⭐' : ''} Top{i+1}: {key}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Score heatmap</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
          <div>
            <p>How to read this heatmap? <a href="#" style={{ color: '#0070f3' }}>Click to expand</a></p>
            <img src="/example_heatmap_black.png" alt="Heatmap" style={{ width: '100%', borderRadius: '8px' }} />
          </div>
          <div>
            <p>How to read this heatmap?</p>
            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Vertical: Ligand candidates<br/>Horizontal: Ranked scores<br/>Top RMSD: BBB, CCC, DDD, EEE<br/>Yellow means its better, Purple means it sucks</p>
          </div>
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #333' }}>
          {(Object.keys(ligandData) as Array<keyof typeof ligandData>).map(key => (
            <button key={key} onClick={() => setActiveLigand(key)} style={{ background: activeLigand === key ? '#333' : 'none', border: 'none', color: '#eee', padding: '0.5rem 1rem', cursor: 'pointer' }}>{key}</button>
          ))}
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#222', marginTop: '1rem', borderRadius: '8px' }}>
          <p>{ligandData[activeLigand].smiles}</p>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
            <ThreeDMolViewer fileContent={ligandData[activeLigand].sdf} format="sdf" />
            <img src={ligandData[activeLigand].radarImg} alt="Radar chart" style={{ borderRadius: '8px', width: '400px', height: '400px' }} />
          </div>
          <p style={{ marginTop: '1rem' }}>How do I read this summary? <a href="#" style={{ color: '#0070f3' }}>Click to expand</a></p>
        </div>
      </section>
    </div>
  );
}
