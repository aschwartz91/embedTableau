'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    tableau: any;
  }
}

export default function TableauEmbed() {
  const vizRef = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tableauLoaded, setTableauLoaded] = useState(false);

  useEffect(() => {
    const loadTableauAPI = () => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://public.tableau.com/javascripts/api/tableau-2.min.js';
        script.onload = () => {
          setTableauLoaded(true);
          resolve();
        };
        script.onerror = () => reject(new Error('Failed to load Tableau API'));
        document.body.appendChild(script);
      });
    };

    const initializeTableau = async () => {
      try {
        await loadTableauAPI();
        const response = await fetch('/api/getToken');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setToken(data.token);

        if (!vizRef.current || !window.tableau || !window.tableau.Viz) {
          throw new Error('Tableau API or container not ready');
        }

        const vizUrl = `${process.env.NEXT_PUBLIC_TABLEAU_VIEW_URL}?:embed=yes`;
        const options = {
          hideTabs: true,
          hideToolbar: true,
          width: '100%',
          height: '600px',
          token: data.token,
        };

        new window.tableau.Viz(vizRef.current, vizUrl, options);
      } catch (e) {
        console.error('Error:', e);
        setError(`Failed to initialize: ${e instanceof Error ? e.message : String(e)}`);
      }
    };

    initializeTableau();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!tableauLoaded || !token) {
    return <div>Loading...</div>;
  }

  return <div ref={vizRef} style={{width: '100%', height: '600px'}}></div>;
}