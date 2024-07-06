console.log("haii");
const cryptoApi = "https://api.coinlore.net/api/tickers/";


let originalData = [];
let filteredData = [];


let currentPage = {
  growthFutureTable: 1,
  bestGrowingTable: 1,
  bestFallingTable: 1
};
const itemsPerPage = 10;

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

      const growthFutureTable = "growthFutureTable";
      const bestGrowingTable = "bestGrowingTable";
      const bestFallingTable = "bestFallingTable";

      // Sort by price_usd descending for growthFutureTable
      const sortedGrowthFutureData = data.data.slice().sort((a, b) => b.price_usd - a.price_usd);
      const growthFutureElement = document.getElementById(growthFutureTable);
      growthFutureElement.setAttribute("data-total-items", sortedGrowthFutureData.length);
      growthFutureElement.setAttribute("data-array", JSON.stringify(sortedGrowthFutureData));
      populateTable(sortedGrowthFutureData, growthFutureTable, currentPage[growthFutureTable]);

      // Sort by percent_change_7d descending for bestGrowingTable
      const sortedBestGrowingData = data.data.slice().sort((a, b) => b.percent_change_7d - a.percent_change_7d);
      const bestGrowingElement = document.getElementById(bestGrowingTable);
      bestGrowingElement.setAttribute("data-total-items", sortedBestGrowingData.length);
      bestGrowingElement.setAttribute("data-array", JSON.stringify(sortedBestGrowingData));
      populateTable(sortedBestGrowingData, bestGrowingTable, currentPage[bestGrowingTable]);

      // Sort by percent_change_7d ascending for bestFallingTable
      const sortedBestFallingData = data.data.slice().sort((a, b) => a.percent_change_7d - b.percent_change_7d);
      const bestFallingElement = document.getElementById(bestFallingTable);
      bestFallingElement.setAttribute("data-total-items", sortedBestFallingData.length);
      bestFallingElement.setAttribute("data-array", JSON.stringify(sortedBestFallingData));
      populateTable(sortedBestFallingData, bestFallingTable, currentPage[bestFallingTable]);

      originalData = data.data; 
      //>>>>>>>>>>>>>>>>>>>>>>>>> Initialize filtered data with original
      filteredData = [...originalData]; 
      //>>>>>>>>>>>>>>>>>>>>>>>>>>> Initial population of tables with original data
      populateTables(filteredData); 
    })
    .catch(error => {
      console.error('Error fetching crypto data:', error);
    });
}

function populateTable(array, tableId, page = 1) {
  const table = document.getElementById(tableId);
  table.innerHTML = "";

  // Create table headers
  const headers = ["Name", "Price In USD", "percent_change_7d"];
  const trHeader = document.createElement("tr");

  headers.forEach((headerText, index) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    th.setAttribute("scope", "col");

    // Add event listeners to headers for sorting
    th.addEventListener("click", () => {
      sortTable(tableId, index);
    });

    trHeader.appendChild(th);
  });

  table.appendChild(trHeader);

  
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = page * itemsPerPage;
  const paginatedItems = array.slice(startIndex, endIndex);
  const tbody = document.createElement("tbody");

  paginatedItems.forEach(element => {
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

  
  updateNavigationButtons(tableId, array.length);
}

function updateNavigationButtons(tableId, totalItems) {
  const prevButton = document.getElementById(`${tableId}-prev`);
  const nextButton = document.getElementById(`${tableId}-next`);
  const firstPageButton = document.getElementById(`${tableId}-first`);

  prevButton.disabled = currentPage[tableId] === 1;
  nextButton.disabled = currentPage[tableId] * itemsPerPage >= totalItems;
  firstPageButton.disabled = currentPage[tableId] === 1;
}

function goToPage(tableId, direction) {
  const table = document.getElementById(tableId);
  const totalItems = table.getAttribute("data-total-items");
  const array = JSON.parse(table.getAttribute("data-array"));

  currentPage[tableId] += direction;
  if (currentPage[tableId] < 1) {
    currentPage[tableId] = 1;
  } else if ((currentPage[tableId] - 1) * itemsPerPage >= totalItems) {
    currentPage[tableId] = Math.ceil(totalItems / itemsPerPage);
  }

  populateTable(array, tableId, currentPage[tableId]);
}

function goToFirstPage(tableId) {
  currentPage[tableId] = 1;
  const table = document.getElementById(tableId);
  const array = JSON.parse(table.getAttribute("data-array"));
  populateTable(array, tableId, currentPage[tableId]);
}

fetchCryptoData();

const sortDirection = {};

function sortTable(tableId, columnIndex) {
  const table = document.getElementById(tableId);

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

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   SEARCH

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   Function to populate tables with filtered data

function populateTables(data) {
  populateTable(sortAndLimit(data, 'price_usd', 'desc'), "growthFutureTable");
  populateTable(sortAndLimit(data, 'percent_change_7d', 'desc'), "bestGrowingTable");
  populateTable(sortAndLimit(data, 'percent_change_7d', 'asc'), "bestFallingTable");
}

// //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   Function to sort data and limit results
function sortAndLimit(data, sortBy, sortOrder) {
  const sortedData = data.slice().sort((a, b) => {
    if (sortBy === 'price_usd') {
      return sortOrder === 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
    }
    else if (sortBy === 'percent_change_7d') {
      return sortOrder === 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
    }
  });
  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Limit to top 10
  return sortedData; 
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Event listener for search input

const searchInput = document.getElementById('cryptoSearch');
searchInput.addEventListener("input", function() {
const searchText = this.value.trim().toLowerCase();

  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Filter original data based on search text
  filteredData = originalData.filter(item => {
    return item.name.toLowerCase().includes(searchText);
  });

  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Repopulate tables with filtered data
  populateTables(filteredData);


  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Stop refreshing when user searches 
  stopRefreshInterval();
  startRefreshInterval();
});

// >>>>>>>>>>>>>> Refresh data every 30 seconds
// setInterval(fetchCryptoData, 3000);

let refreshIntervalId;
function startRefreshInterval() {
  refreshIntervalId = setInterval(() => {

    //>>>>>>>>>> Only fetch data if filteredData is empty (No active search)
    if (filteredData.length === 0) {
      fetchCryptoData();
    } 
    else {
      //>>>>>>>>>>>> Populate tables with filtered data
      populateTables(filteredData); 
    }
  }, 30000);
}
startRefreshInterval()

//>>>>>>>>>>>>>>>>>>>>> Function to stop the refresh interval
function stopRefreshInterval() {
  clearInterval(refreshIntervalId);
}
