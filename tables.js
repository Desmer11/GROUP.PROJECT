// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> CONNECT TO HTML
//                <script src="tables.js"></script>

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>FETCH DATA
const cryptoApi = "https://api.coinlore.net/api/tickers/";

function fetchCryptoData() {
  fetch(cryptoApi)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log("Request successful", data);

      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Sort data and populate each table
      const growthFutureTable = "growthFutureTable";
      const bestGrowingTable = "bestGrowingTable";
      const bestFallingTable = "bestFallingTable";

      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Sort by price_usd descending for growthFutureTable
      if (growthFutureTable === "growthFutureTable") {
        const sortedData = data.data.slice().sort((a, b) => b.price_usd - a.price_usd);
        populateTable(sortedData, growthFutureTable);
      }

      // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><>>>>Sort by percent_change_7d descending for bestGrowingTable
      if (bestGrowingTable === "bestGrowingTable") {
        const sortedData = data.data.slice().sort((a, b) => b.percent_change_7d - a.percent_change_7d);
        populateTable(sortedData, bestGrowingTable);
      }

      // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Sort by percent_change_7d ascending for bestFallingTable
      if (bestFallingTable === "bestFallingTable") {
        const sortedData = data.data.slice().sort((a, b) => a.percent_change_7d - b.percent_change_7d);
        populateTable(sortedData, bestFallingTable);
      }
    })
    .catch(error => {
      console.error('Error fetching crypto data:', error);
    });
}

function populateTable(array, tableId) {
  const table = document.getElementById(tableId);
  table.innerHTML = "";

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Create table headers
  const headers = ["Name", "Price In USD", "percent_change_7d"];
  const trHeader = document.createElement("tr");

  headers.forEach((headerText, index) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    th.setAttribute("scope", "col");

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Add event listeners to headers for sorting
    th.addEventListener("click", () => {
      sortTable(tableId, index);
    });

    trHeader.appendChild(th);
  });

  table.appendChild(trHeader);

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Populate table rows
  const tbody = document.createElement("tbody");
  array.slice(0, 10).forEach(element => {
    const tr = document.createElement("tr");
    const rowData = [
      element.name,
      `$ ${parseFloat(element.price_usd).toFixed(2)}`,
      `${parseFloat(element.percent_change_7d).toFixed(2)}`
    ];

    rowData.forEach((cellData, index) => {
      const td = document.createElement("td");
      td.textContent = cellData;
      if (index === 0) {
        const th = document.createElement("th");
        th.setAttribute("scope", "row");
        th.textContent = cellData;
        tr.appendChild(th);
      } else {
        td.textContent = cellData;
        tr.appendChild(td);
      }
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
}

// >>>>>>>>>>>>>>Initial fetch and table population
fetchCryptoData();

// >>>>>>>>>>>>>>>>>>>>><<Refresh data every 30 seconds
setInterval(fetchCryptoData, 30000);

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<Sorting function
const sortDirection = {};

function sortTable(tableId, columnIndex) {
  const table = document.getElementById(tableId);

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Exclude header row
  const rows = Array.from(table.rows).slice(1); 

  if (sortDirection[columnIndex] === 'asc') {
    sortDirection[columnIndex] = 'desc';
  } else {
    sortDirection[columnIndex] = 'asc';
  }

  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].textContent.trim();
    const cellB = rowB.cells[columnIndex].textContent.trim();

    if (columnIndex === 1 || columnIndex === 2) {
      const valueA = parseFloat(cellA.replace(/[^\d.-]/g, ''));
      const valueB = parseFloat(cellB.replace(/[^\d.-]/g, ''));

      if (isNaN(valueA) || isNaN(valueB)) {
        return 0;
      }

      return (sortDirection[columnIndex] === 'asc') ? valueA - valueB : valueB - valueA;
    } else {
      return (sortDirection[columnIndex] === 'asc') ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
    }
  });

  const tbody = table.querySelector('tbody');
  tbody.innerHTML = "";
  rows.forEach(row => tbody.appendChild(row));
}








