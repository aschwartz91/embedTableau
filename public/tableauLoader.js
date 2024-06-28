function loadTableauAPI() {
    return new Promise((resolve, reject) => {
      if (window.tableau && window.tableau.Viz) {
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = 'https://public.tableau.com/javascripts/api/tableau-2.min.js';
        script.async = true;
        script.onload = () => {
          if (window.tableau && window.tableau.Viz) {
            resolve();
          } else {
            const error = new Error('Tableau API failed to load');
            console.error('Error loading Tableau API:', error);
            reject(error);
          }
        };
        script.onerror = (event) => {
          const error = new Error('Failed to load Tableau API script');
          console.error('Error loading Tableau API script:', event);
          reject(error);
        };
        document.head.appendChild(script);
      }
    });
  }
  
  window.loadTableauAPI = loadTableauAPI;