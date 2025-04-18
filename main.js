// Firebase Config
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
const auth = firebase.auth();

// Format UGX
function formatUGX(num) {
  return "UGX " + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Update dashboard UI
function updateUI(balances) {
  document.getElementById('fixed-account').textContent = formatUGX(balances.fixed);
  document.getElementById('savings').textContent = "Savings: " + formatUGX(balances.savings);
  document.getElementById('investment').textContent = formatUGX(balances.investment);
  document.getElementById('total-funds').textContent = formatUGX(
    balances.fixed + balances.savings + balances.investment
  );
}

// Get balances from DB
function getBalances() {
  db.ref("balances").once("value", snapshot => {
    if (snapshot.exists()) {
      updateUI(snapshot.val());
    }
  });
}

// Update balances periodically
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

// Login logic
if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();
      const errorDiv = document.getElementById("error-message");

      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          window.location.href = "dashboard.html";
        })
        .catch(() => {
          errorDiv.textContent = "Invalid credentials. Please try again.";
        });
    });
  }
}

// Protect dashboard access
if (window.location.pathname.includes("dashboard.html")) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      getBalances();
      setInterval(updateBalances, 1800000); // every 30 minutes

      // Setup logout button listener
      const logoutBtn = document.getElementById("logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
      }
    } else {
      window.location.href = "index.html";
    }
  });
}

// Logout handler
function logout() {
  auth.signOut()
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Logout error:", error.message);
    });
}

