document.addEventListener("DOMContentLoaded", function () {
  var toggler = document.querySelector(".navbar-toggler");
  var navbarCollapse = document.querySelector("#navbarNav");

  toggler.addEventListener("click", function () {
    navbarCollapse.classList.toggle("show");
  });
});
const popularValuesDiv = document.getElementById("popular-values");

fetch("https://api.coinlore.net/api/tickers/")
  .then((response) => response.json())
  .then((data) => {
    const cryptocurrencies = data.data;

    cryptocurrencies.sort((a, b) => a.rank - b.rank);

    const table = document.createElement("table");

    const headerRow = table.insertRow();
    const headers = ["Rank", "Name", "Symbol", "Price (USD)"];
    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    for (let i = 0; i < 10; i++) {
      const crypto = cryptocurrencies[i];
      const row = table.insertRow();
      row.insertCell().textContent = crypto.rank;
      row.insertCell().textContent = crypto.name;
      row.insertCell().textContent = crypto.symbol;
      row.insertCell().textContent = `$${crypto.price_usd}`;
    }

    popularValuesDiv.appendChild(table);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

// document.addEventListener("DOMContentLoaded", function () {
//   const dropdownBtns = document.querySelectorAll(".dropdown-btn");

//   dropdownBtns.forEach((btn) => {
//     btn.addEventListener("click", function () {
//       const dropdownContent = this.nextElementSibling;
//       dropdownContent.classList.toggle("show");
//     });
//   });

//   window.addEventListener("click", function (event) {
//     dropdownBtns.forEach((btn) => {
//       const dropdownContent = btn.nextElementSibling;
//       if (
//         !event.target.matches(".dropdown-btn") &&
//         !event.target.matches(".dropdown-content")
//       ) {
//         dropdownContent.classList.remove("show");
//       }
//     });
//   });
// });

let dropdownBtns = document.querySelectorAll(".dropdown-btn");
let dropdownContent = document.querySelectorAll(".dropdown-content");

document.addEventListener("DOMContentLoaded", function () {
  const dropdownBtns = document.querySelectorAll(".dropdown-btn");

  dropdownBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const dropdownContent = this.nextElementSibling;

      if (dropdownContent.style.display === "flex") {
        dropdownContent.style.display = "none";
      } else {
        dropdownContent.style.display = "flex";
      }
    });
  });
});
window.addEventListener("click", function (event) {
  dropdownBtns.forEach((btn) => {
    const dropdownContent = btn.nextElementSibling;
    if (
      !btn.contains(event.target) &&
      !dropdownContent.contains(event.target)
    ) {
      dropdownContent.style.display = "none";
    }
  });
});
