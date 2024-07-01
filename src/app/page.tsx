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
        if (window.tableau && window.tableau.Viz) {
          console.log("Tableau API already loaded");
          setTableauLoaded(true);
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://public.tableau.com/javascripts/api/tableau-2.min.js';
        script.onload = () => {
          console.log("Tableau API script loaded");
          setTableauLoaded(true);
          resolve();
        };
        script.onerror = () => reject(new Error('Failed to load Tableau API'));
        document.body.appendChild(script);
      });
    };

    const fetchToken = async () => {
      const response = await fetch('/api/getToken');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Token fetched successfully");
      return data.token;
    };

    const initializeTableau = async () => {
      try {
        await loadTableauAPI();
        const fetchedToken = await fetchToken();
        setToken(fetchedToken);

        // Add a small delay to ensure everything is ready
        setTimeout(() => {
          if (!vizRef.current) {
            throw new Error('Viz container not ready');
          }
          if (!window.tableau || !window.tableau.Viz) {
            throw new Error('Tableau API not ready');
          }

          console.log("Initializing Tableau viz");
          const vizUrl = `${process.env.NEXT_PUBLIC_TABLEAU_VIEW_URL}`;
          const options = {
            hideTabs: true,
            hideToolbar: true,
            width: '100%',
            height: '600px',
            token: fetchedToken,
          };

          new window.tableau.Viz(vizRef.current, vizUrl, options);
        }, 500);  // 500ms delay

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