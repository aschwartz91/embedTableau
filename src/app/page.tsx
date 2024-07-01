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
    const checkTableauLoaded = () => {
      if (window.tableau && window.tableau.Viz) {
        setTableauLoaded(true);
      } else {
        setTimeout(checkTableauLoaded, 100);
      }
    };
    checkTableauLoaded();
  }, []);

  useEffect(() => {
    if (!tableauLoaded) return;

    const fetchTokenAndInitViz = async () => {
      try {
        const response = await fetch('/api/getToken');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setToken(data.token);

        if (!vizRef.current) {
          throw new Error('Viz container not ready');
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

    fetchTokenAndInitViz();
  }, [tableauLoaded]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!tableauLoaded || !token) {
    return <div>Loading...</div>;
  }

  return <div ref={vizRef} style={{width: '100%', height: '600px'}}></div>;
}

/*// src/app/page.tsx
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
  const [tableauApiLoaded, setTableauApiLoaded] = useState(false);

  useEffect(() => {
    const fetchTokenAndLoadTableau = async () => {
      try {
        const response = await fetch('/api/getToken');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Received token:', data.token);
        setToken(data.token);

        // Load the tableauLoader.js script dynamically
        const script = document.createElement('script');
        script.src = '/tableauLoader.js';
        script.async = true;
        script.onload = () => {
          console.log('Tableau API loaded successfully');
          setTableauApiLoaded(true);
        };
        script.onerror = () => {
          throw new Error('Failed to load Tableau API');
        };
        document.head.appendChild(script);
      } catch (e) {
        console.error('Error:', e);
        setError(`Failed to initialize: ${e instanceof Error ? e.message : String(e)}`);
      }
    };

    fetchTokenAndLoadTableau();
  }, []);

  useEffect(() => {
    console.log('Tableau View URL:', process.env.NEXT_PUBLIC_TABLEAU_VIEW_URL);
    
    if (!token || !vizRef.current || !tableauApiLoaded || !window.tableau || !window.tableau.Viz) {
      console.log('Not ready to create viz:', { 
        token: !!token, 
        vizRef: !!vizRef.current, 
        tableauApiLoaded,
        tableau: !!window.tableau, 
        tableauViz: !!(window.tableau && window.tableau.Viz) 
      });
      return;
    }

    const vizUrl = `https://us-east-1.online.tableau.com/trusted/${token}/t/schwartz67b9b2a63b/views/SalesMap/Sheet1`;
    console.log(vizUrl);
    
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
  }, [token, tableauApiLoaded]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!token || !tableauApiLoaded) {
    return <div>Loading...</div>;
  }

  return <div ref={vizRef} style={{width: '100%', height: '600px'}}></div>;
}
  */