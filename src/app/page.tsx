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
        const response = await fetch('/api/getToken');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Received token:', data.token); // Log the token
        setToken(data.token);
  
        await window.loadTableauAPI();
        console.log('Tableau API loaded successfully');
      } catch (e) {
        console.error('Error:', e);
        setError(`Failed to initialize: ${e instanceof Error ? e.message : String(e)}`);
      }
    };
  
    fetchTokenAndLoadTableau();
  }, []);

  useEffect(() => {
    console.log('Tableau View URL:', process.env.NEXT_PUBLIC_TABLEAU_VIEW_URL);
    
    if (!token || !vizRef.current || !window.tableau || !window.tableau.Viz) {
      console.log('Not ready to create viz:', { 
        token: !!token, 
        vizRef: !!vizRef.current, 
        tableau: !!window.tableau, 
        tableauViz: !!(window.tableau && window.tableau.Viz) 
      });
      return;
    }

    const vizUrl = process.env.NEXT_PUBLIC_TABLEAU_VIEW_URL;
    
    if (!vizUrl) {
      console.error('Tableau view URL is not set');
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
      console.log('Creating Tableau viz with options:', { vizUrl, ...options });
      new window.tableau.Viz(vizRef.current, vizUrl, options);
    } catch (e) {
      console.error('Error creating Tableau viz:', e);
      setError(`Failed to create Tableau visualization: ${e instanceof Error ? e.message : String(e)}`);
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