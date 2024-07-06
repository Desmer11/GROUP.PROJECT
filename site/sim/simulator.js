const cryptoApi = "https://api.coinlore.net/api/tickers/";

function FetchCryptoData() {
  fetch(cryptoApi)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      return data;
    })
    .then(apiData => {
      const cryptoData = apiData.data;
      InitializeWalletAndUI(cryptoData);
    })
    .catch(error => {
      console.error('Error fetching crypto data:', error);
    });
}

function InitializeWalletAndUI(cryptoData) {
  const wallet = new CryptoWallet(cryptoData);
  wallet.InitializeBalances(cryptoData);
  SetupCryptoSelect(cryptoData, wallet);
  SetupTransactionButton(wallet);
}

function SetupCryptoSelect(cryptoData, wallet) {
  const cryptoSelect = document.getElementById('crypto-select');
  cryptoData.forEach(currency => {
    const option = document.createElement('option');
    option.value = currency.symbol;
    option.textContent = `${currency.name} --- Price: $ ${currency.price_usd}`
    cryptoSelect.appendChild(option);
  });
}

function SetupTransactionButton(wallet) {
  const performTransactionBtn = document.getElementById('perform-transaction');
  performTransactionBtn.addEventListener('click', function() {
    const currencySymbol = document.getElementById('crypto-select').value;
    const transactionType = document.getElementById('transaction-type').value;
    const amount = parseFloat(document.getElementById('amount').value);

    try {
      wallet.PerformTransaction(currencySymbol, transactionType, amount);
    } catch (error) {
      DisplayErrorMessage(error.message);
    }
  });
}

function DisplayErrorMessage(message) {
  const errorMessageElement = document.getElementById('error-message');
  errorMessageElement.textContent = message;
}

class CryptoWallet {
  constructor(cryptoData) {
    this.totalBudget = 100000; 
    this.balance = {};
    this.transactions = [];
    this.prices = {};

    cryptoData.forEach(currency => {
      this.prices[currency.symbol] = parseFloat(currency.price_usd);
    });
  }

  InitializeBalances(data) {
    data.forEach(currency => {
      if (currency.hasOwnProperty('symbol')) {
        this.balance[currency.symbol] = 0;
      }
    });
    this.UpdateBalanceUI();
  }

  UpdateBalanceUI() {
    const balanceElement = document.getElementById('balance');
    const walletAmount = document.getElementById("wallet-amount");
    
    const totalValue = Object.keys(this.balance).reduce((total, symbol) => {
      return total + (this.balance[symbol] * this.prices[symbol]);
    }, 0);
  
    walletAmount.innerHTML = `<p>$ ${this.totalBudget.toFixed(2)}</p>`;
  
    balanceElement.innerHTML = Object.keys(this.balance)
      .filter(symbol => this.balance[symbol] > 0)
      .map(symbol => `<div>${symbol}: ${this.balance[symbol]} (${(this.balance[symbol] * this.prices[symbol]).toFixed(2)} USD)</div>`)
      .join('');
  
    if (Object.values(this.balance).every(balance => balance === 0)) {
      balanceElement.style.display = 'none';
    } else {
      balanceElement.style.display = 'block';
    }
  }

  PerformTransaction(currencySymbol, transactionType, amount) {
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Invalid amount entered.');
    }
  
    if (!this.balance.hasOwnProperty(currencySymbol)) {
      throw new Error(`Currency '${currencySymbol}' not found in wallet.`);
    }

    const cost = amount * this.prices[currencySymbol];

    if (transactionType === 'sell' && this.balance[currencySymbol] < amount) {
      throw new Error(`Insufficient balance in '${currencySymbol}' to sell.`);
    }
  
    if (transactionType === 'buy' && this.totalBudget < cost) {
      throw new Error(`Insufficient budget to buy ${amount} ${currencySymbol}.`);
    }
  
    if (transactionType === 'buy') {
      this.balance[currencySymbol] += amount;
      this.totalBudget -= cost;
    } else if (transactionType === 'sell') {
      this.balance[currencySymbol] -= amount;
      this.totalBudget += cost;
    }
  
    const transaction = {
      type: transactionType,
      currency: currencySymbol,
      amount: amount,
      cost: cost,
      timestamp: new Date().toLocaleString()
    };
    this.transactions.unshift(transaction);
    this.UpdateBalanceUI();
    this.UpdateTransactionHistoryUI();
  }

  UpdateTransactionHistoryUI() {
    const transactionListElement = document.getElementById('transaction-list');
    transactionListElement.innerHTML = this.transactions.map(transaction =>
      `<li>${transaction.type.toUpperCase()} ${transaction.amount} ${transaction.currency} - $${transaction.cost.toFixed(2)} - ${transaction.timestamp}</li>`
    ).join('');
  }
}

FetchCryptoData();

// >>>>>>>>>>>>>> Refresh data every 30 seconds

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
//>>>>>>>>>>>>>>>>>>>>> Function to stop the refresh interval (SHOULD BE PROTECTED)
function stopRefreshInterval() {
  clearInterval(refreshIntervalId);
}





