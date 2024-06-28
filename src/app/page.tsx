// src/app/page.tsx
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

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/getToken');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setToken(data.token);
      } catch (e) {
        console.error('Error fetching token:', e);
        setError('Failed to fetch token. Please try again later.');
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (!token || !vizRef.current) return;

    const initViz = () => {
      if (typeof window.tableau === 'undefined') {
        console.error('Tableau API not loaded');
        setError('Tableau API not loaded. Please refresh the page.');
        return;
      }

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

      new window.tableau.Viz(vizRef.current, vizUrl, options);
    };

    // Check if Tableau API is already loaded
    if (typeof window.tableau !== 'undefined') {
      initViz();
    } else {
      // If not, wait for it to load
      window.addEventListener('tableauApiLoaded', initViz);
      return () => window.removeEventListener('tableauApiLoaded', initViz);
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