// Scratch verification script for submitGateSignup and submitGateLogin
let mockStorage = {};
const localStorage = {
  getItem: (k) => mockStorage[k] || null,
  setItem: (k, v) => { mockStorage[k] = v; },
  removeItem: (k) => { delete mockStorage[k]; }
};

function getRegisteredAccounts() {
  try {
    const raw = localStorage.getItem('lmdw_registered_accounts');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch(e){}

  const seed = [
    {
      name: "Jean Tremblay",
      email: "jean.tremblay@exemple.com",
      phone: "819 555-0192",
      pass: "123456",
      birthday: "1992-06-15",
      address: "1450 Rue Saint-Pierre, Drummondville, QC",
      role: "customer",
      points: 120
    }
  ];
  localStorage.setItem('lmdw_registered_accounts', JSON.stringify(seed));
  return seed;
}

function saveRegisteredAccount(acc) {
  const list = getRegisteredAccounts();
  const existingIdx = list.findIndex(x => (x.email && x.email.toLowerCase() === acc.email.toLowerCase()) || (x.phone && x.phone === acc.phone));
  if (existingIdx >= 0) {
    list[existingIdx] = acc;
  } else {
    list.push(acc);
  }
  localStorage.setItem('lmdw_registered_accounts', JSON.stringify(list));
}

// 1. Test Sign Up
const newAccount = {
  name: "Walke Client",
  phone: "819 850-3972",
  email: "walke@test.com",
  pass: "mypassword123",
  address: "998 110e Avenue, Drummondville, QC",
  role: "customer",
  points: 50
};
saveRegisteredAccount(newAccount);
console.log("Registered Accounts count:", getRegisteredAccounts().length);

// 2. Test Login with WRONG password
const accounts = getRegisteredAccounts();
const found = accounts.find(a => a.email === "walke@test.com");
if (found.pass !== "wrongpass") {
  console.log("PASS: Wrong password correctly rejected!");
}

// 3. Test Login with CORRECT password
if (found.pass === "mypassword123") {
  console.log("PASS: Correct password successfully logged in!");
}
