// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcxwqjoFEUYKTwiuQKMkAfG9y9HZFPCVg",
  authDomain: "smau-256.firebaseapp.com",
  projectId: "smau-256",
  storageBucket: "smau-256.firebasestorage.app",
  messagingSenderId: "76824679086",
  appId: "1:76824679086:web:938d91f86a44c67ec3533f",
  measurementId: "G-E18K7HRKBQ",
  databaseURL: "https://smau-256-default-rtdb.firebaseio.com/"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Auth redirect check for dashboard
if (window.location.pathname.includes("dashboard.html") && sessionStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "index.html";
}

// Format currency
function formatUGX(num) {
  return "UGX " + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Update balances in the UI
function updateUI(balances) {
  document.getElementById('fixed-account').textContent = formatUGX(balances.fixed);
  document.getElementById('savings').textContent = "Savings: " + formatUGX(balances.savings);
  document.getElementById('investment').textContent = formatUGX(balances.investment);
  document.getElementById('total-funds').textContent = formatUGX(
    balances.fixed + balances.savings + balances.investment
  );
}

// Get balances from Firebase
function getBalances() {
  db.ref("balances").once("value", snapshot => {
    if (snapshot.exists()) {
      updateUI(snapshot.val());
    }
  });
}

// Update balances every 30 mins
function updateBalances() {
  db.ref("balances").once("value", snapshot => {
    if (snapshot.exists()) {
      let data = snapshot.val();
      const gain = 230;
      const loss = Math.floor(Math.random() * (280 - 160 + 1)) + 160;

      data.savings += gain;
      data.savings = Math.max(0, data.savings - loss);

      db.ref("balances").set(data);
      updateUI(data);
    }
  });
}

// Run only on dashboard
if (window.location.pathname.includes("dashboard.html")) {
  getBalances();
  setInterval(updateBalances, 1800000); // 30 mins
}

// Login logic
if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
  document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorDiv = document.getElementById("error-message");

    if (username === "MWEZRA" && password === "peacock123") {
      sessionStorage.setItem("isLoggedIn", "true");
      window.location.href = "dashboard.html";
    } else {
      errorDiv.textContent = "Invalid login credentials.";
    }
  });
}

