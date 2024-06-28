// public/tableauLoader.js
function loadTableauAPI() {
    return new Promise((resolve, reject) => {
      if (window.tableau && window.tableau.Viz) {
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = 'https://public.tableau.com/javascripts/api/tableau-2.min.js';
        script.onload = () => {
          if (window.tableau && window.tableau.Viz) {
            resolve();
          } else {
            reject(new Error('Tableau API failed to load'));
          }
        };
        script.onerror = () => reject(new Error('Failed to load Tableau API script'));
        document.head.appendChild(script);
      }
    });
  }
  
  window.loadTableauAPI = loadTableauAPI;