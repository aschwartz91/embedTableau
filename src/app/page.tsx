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
        if (data.token) {
          setToken(data.token);
        } else {
          throw new Error('Token not found in response');
        }
      } catch (e) {
        console.error('Error fetching token:', e);
        setError('Failed to fetch token. Please try again later.');
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (!token || !vizRef.current) return;

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

    const viz = new window.tableau.Viz(vizRef.current, vizUrl, options);

    return () => {
      viz.dispose();
    };
  }, [token]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!token) {
    return <div>Loading...</div>;
  }

  return <div ref={vizRef}></div>;
}