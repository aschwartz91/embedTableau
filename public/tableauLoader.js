// public/tableauLoader.js
function onTableauApiLoaded() {
    window.dispatchEvent(new Event('tableauApiLoaded'));
  }
  
  if (typeof tableau !== 'undefined' && tableau.Viz) {
    onTableauApiLoaded();
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      var script = document.createElement('script');
      script.onload = onTableauApiLoaded;
      script.src = 'https://public.tableau.com/javascripts/api/tableau-2.min.js';
      document.head.appendChild(script);
    });
  }