const firebaseConfig = {
  apiKey: "AIzaSyDcxwqjoFEUYKTwiuQKMkAfG9y9HZFPCVg",
  authDomain: "smau-256.firebaseapp.com",
  projectId: "smau-256",
  storageBucket: "smau-256.appspot.com",
  messagingSenderId: "76824679086",
  appId: "1:76824679086:web:938d91f86a44c67ec3533f",
  measurementId: "G-E18K7HRKBQ",
  databaseURL: "https://smau-256-default-rtdb.firebaseio.com/"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function formatUGX(num) {
  return "UGX " + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateUI(balances) {
  document.getElementById('fixed-account').textContent = formatUGX(balances.fixed);
  document.getElementById('savings').textContent = "Savings: " + formatUGX(balances.savings);
  document.getElementById('investment').textContent = formatUGX(balances.investment);
  document.getElementById('total-funds').textContent = formatUGX(
    balances.fixed + balances.savings + balances.investment
  );
}

function getBalances() {
  db.ref("balances").once("value", snapshot => {
    if (snapshot.exists()) {
      updateUI(snapshot.val());
    } else {
      const initialData = {
        fixed: 200000.00,
        savings: 256789.53,
        investment: 50000.00
      };
      db.ref("balances").set(initialData);
      updateUI(initialData);
    }
  });
}

function updateBalances() {
  db.ref("balances").once("value", snapshot => {
    if (snapshot.exists()) {
      let data = snapshot.val();
      const increase = 230;
      const decrease = Math.floor(Math.random() * (120 - 20 + 1)) + 20; // Max 120, Min 20
      data.savings += increase - decrease;

      db.ref("balances").set(data);
      updateUI(data);
    }
  });
}

getBalances();
setInterval(updateBalances, 1800000); // every 30 mins

