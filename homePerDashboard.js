import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, onSnapshot, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDlrbumKo34d3Hel__bA1Xj6TG_ClFOF0g",
    authDomain: "login-form-4c66d.firebaseapp.com",
    projectId: "login-form-4c66d",
    storageBucket: "login-form-4c66d.appspot.com",
    messagingSenderId: "9677626952",
    appId: "1:9677626952:web:4f55f083e1cdf36f77c27d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

// Populate dropdown with months and years
const populateMonthYearDropdown = () => {
    const dropdown = document.getElementById("monthYearDropdown");
    const years = [2024, 2025];
    const months = [
        "January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October",
        "November", "December"
    ];

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    years.forEach((year) => {
        months.forEach((month, index) => {
            const option = document.createElement("option");
            const monthValue = index + 1;
            option.value = `${year}-${monthValue}`;
            option.textContent = `${month} ${year}`;
            if (year === currentYear && monthValue === currentMonth) {
                option.selected = true;
            }
            dropdown.appendChild(option);
        });
    });
};

// Fetch and update monthly totals in real-time
const fetchMonthlyTotals = async (userId, year, month) => {
    const totalIncomeElement = document.getElementById("totalIncome");
    const totalExpenseElement = document.getElementById("totalExpense");

    let totalIncome = 0;
    let totalExpense = 0;

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    try {
        // Income query with real-time updates using onSnapshot
        const incomeQuery = query(
            collection(db, "users", userId, "incomes"),
            where("timestamp", ">=", startOfMonth),
            where("timestamp", "<=", endOfMonth)
        );

        // Listen to income changes in real-time
        onSnapshot(incomeQuery, (snapshot) => {
            totalIncome = 0;
            snapshot.forEach((doc) => {
                const data = doc.data();
                totalIncome += data.amount || 0;
            });
            totalIncomeElement.textContent = `$${totalIncome.toFixed(2)}`;
        });

        // Expense query with real-time updates using onSnapshot
        const expenseQuery = query(
            collection(db, "users", userId, "expenses"),
            where("timestamp", ">=", startOfMonth),
            where("timestamp", "<=", endOfMonth)
        );

        // Listen to expense changes in real-time
        onSnapshot(expenseQuery, (snapshot) => {
            totalExpense = 0;
            snapshot.forEach((doc) => {
                const data = doc.data();
                totalExpense += data.amount || 0;
            });
            totalExpenseElement.textContent = `$${totalExpense.toFixed(2)}`;
        });
    } catch (error) {
        console.error("Error fetching totals:", error);
    }
};

// Event listener for dropdown change
const initializeAppListeners = (userId) => {
    const dropdown = document.getElementById("monthYearDropdown");
    const refreshTotals = () => {
        const [year, month] = dropdown.value.split("-");
        fetchMonthlyTotals(userId, parseInt(year, 10), parseInt(month, 10));
    };

    dropdown.addEventListener("change", refreshTotals);

    document.getElementById("incomePopupBtn").addEventListener("click", () => {
        window.open("incomeForm.html", "Income Entry", "width=400,height=400");
    });

    document.getElementById("expensePopupBtn").addEventListener("click", () => {
        window.open("expenseForm.html", "Expense Entry", "width=400,height=400");
    });

    refreshTotals(); // Initial load for current month/year
};

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        populateMonthYearDropdown();
        initializeAppListeners(user.uid);
    } else {
        window.location.href = "homePerDashboard.html";
    }
});

// Logout functionality
document.getElementById("logout").addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            window.location.href = "welcompage.html";
        })
        .catch(console.error);
});
