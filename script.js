// Immediately Invoked Function Expression to avoid polluting global scope
(function() {
  // Utility function to parse query params
  function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
  }

  // Utility function to fetch JSON with headers
  async function fetchStockData(cik) {
    const url = 'https://data.sec.gov/api/xbrl/companyconcept/CIK' + cik + '/dei/EntityCommonStockSharesOutstanding.json';
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ExampleBot/1.0; +https://example.com/bot)', // SEC Guidance
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      return null;
    }
  }

  // Load uid.txt content (simulated as it's attached in the environment)
// Since environment not fully defined, simulate uid.txt content as provided:
  const uidTxtContent = "RmFrZSBVbml0cyB0ZXh0IGZpbGUgZm9yIGF0dGFja2V0IHdpdGggdGhpcyB1c2Vkc3M="; // placeholder
  // In real environment, uid.txt would be loaded via server or embedded; here, assume it's loaded

  // Function to update HTML elements
  function updateUI(entityName, max, min) {
    document.getElementById('share-entity-name').textContent = entityName;
    document.getElementById('share-max-value').textContent = max.val;
    document.getElementById('share-max-fy').textContent = max.fy;
    document.getElementById('share-min-value').textContent = min.val;
    document.getElementById('share-min-fy').textContent = min.fy;
  }

  // Function to process data and update JSON and UI
  function processData(data) {
    if (!data || !data.entityName || !data.units || !data.units.shares) {
      console.error('Invalid data structure');
      return;
    }
    const entityName = data.entityName;
    const shares = data.units.shares;
    const filtered = shares.filter(s => {
      // Check fy > '2020' and val is numeric
      return s.fy > '2020' && !isNaN(s.val);
    });
    if (filtered.length === 0) {
      console.warn('No data after filtering');
      return;
    }
    // Find max and min by val, break ties arbitrarily
    const max = filtered.reduce((a, b) => (b.val > a.val ? b : a), { val: -Infinity });
    const min = filtered.reduce((a, b) => (b.val < a.val ? b : a), { val: Infinity });
    // Save to data.json
    const finalData = {
      entityName: entityName,
      max: { val: max.val, fy: max.fy },
      min: { val: min.val, fy: min.fy }
    };
    localStorage.setItem('data.json', JSON.stringify(finalData));
    // Update UI
    updateUI(entityName, finalData.max, finalData.min);
  }

  // Function to fetch data json (simulate download)
  async function loadDataJSON() {
    const storedData = localStorage.getItem('data.json');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        // Validate data
        if (data.entityName && data.max && data.min && typeof data.max.val === 'number' && typeof data.min.val === 'number') {
          updateUI(data.entityName, data.max, data.min);
        }
      } catch (e) {
        console.error('Invalid stored data');
      }
    }
  }

  // Function to fetch data by CIK and process
  async function fetchAndProcess(cik) {
    const rawData = await fetchStockData(cik);
    if (rawData) {
      processData(rawData);
    } else {
      // fallback to default data if fetch fails
      // For demo, can load default or show error
      // Here, do nothing
    }
  }

  // Initialize: load existing data
  loadDataJSON();

  // Check if URL has CIK param
  const paramCik = getQueryParam('CIK');
  const cik = paramCik || '00010795'; // default CIK
  fetchAndProcess(cik);

  // Optional: If dynamic changes needed, setup event listeners
  // (none specified in task), so static load.

})();