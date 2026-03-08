"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReportsPage() {
  const reports = useQuery(api.analysis.getAll);
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
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>All Reports</h1>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Report ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Protein File ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Ligand File ID</th>
            </tr>
          </thead>
          <tbody>
            {reports?.map((report) => (
              <tr key={report._id} onClick={() => router.push(`/analysis/${report._id}`)} style={{ cursor: 'pointer' }}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{report._id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{report.proteinFileId}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{report.ligandFileId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
