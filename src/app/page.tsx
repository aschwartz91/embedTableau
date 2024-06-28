// src/app/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    tableau: any;
    loadTableauAPI: () => Promise<void>;
  }
}

export default function TableauEmbed() {
  const vizRef = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenAndLoadTableau = async () => {
      try {
        // Fetch token
        const response = await fetch('/api/getToken');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setToken(data.token);

        // Load Tableau API
        await window.loadTableauAPI();
      } catch (e) {
        console.error('Error:', e);
        setError(`Failed to initialize: ${e.message}`);
      }
    };

    fetchTokenAndLoadTableau();
  }, []);

  useEffect(() => {
    if (!token || !vizRef.current || !window.tableau || !window.tableau.Viz) return;

    const vizUrl = process.env.NEXT_PUBLIC_TABLEAU_VIEW_URL;
    
    if (!vizUrl) {
      setError('Tableau view URL is not set');
      return;
    }

    const options = {
      token: token,
      height: '600px',
      width: '100%',
      hideTabs: true,
      hideToolbar: true,
    };

    try {
      new window.tableau.Viz(vizRef.current, vizUrl, options);
    } catch (e) {
      console.error('Error creating Tableau viz:', e);
      setError(`Failed to create Tableau visualization: ${e.message}`);
    }
  }, [token]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!token) {
    return <div>Loading...</div>;
  }

  return <div ref={vizRef}></div>;
}