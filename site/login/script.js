document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    const account = accounts.find(acc => acc.email === email && acc.password === password);
    
    const message = document.getElementById('message');
    if (account) {
        message.style.color = 'green';
        message.textContent = 'Login successful!';
    } else {
        message.style.color = 'red';
        message.textContent = 'Invalid email or password.';
    }
});

document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const balance = document.getElementById('signup-balance').value;
    const termsAccepted = document.getElementById('signup-terms').checked;
    const newsletter = document.getElementById('signup-newsletter').checked;
    
    if (!termsAccepted) {
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').textContent = 'You must accept the terms and conditions.';
        return;
    }
    
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    const accountExists = accounts.some(acc => acc.email === email);
    
    const message = document.getElementById('message');
    if (accountExists) {
        message.style.color = 'red';
        message.textContent = 'Account with this email already exists.';
    } else {
        accounts.push({ email, password, balance, newsletter });
        localStorage.setItem('accounts', JSON.stringify(accounts));
        message.style.color = 'green';
        message.textContent = 'Account created successfully!';
    }
});

document.addEventListener("DOMContentLoaded", function () {
  var toggler = document.querySelector(".navbar-toggler");
  var navbarCollapse = document.querySelector("#navbarNav");

  toggler.addEventListener("click", function () {
    navbarCollapse.classList.toggle("show");
  });
});
