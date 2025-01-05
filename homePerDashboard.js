import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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

const fetchIncomeExpenseHistory = async (year, month, userId) => {
    const expandableContent = document.getElementById("expandableContent");

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    let historyItems = [];

    try {
        // Income history query
        const incomeQuery = query(
            collection(db, "users", userId, "incomes"),
            where("timestamp", ">=", startOfMonth),
            where("timestamp", "<=", endOfMonth)
        );

        const incomeSnapshot = await getDocs(incomeQuery);
        incomeSnapshot.forEach((doc) => {
            const data = doc.data();
            const incomeDate = new Date(data.timestamp.seconds * 1000);
            const incomeAmount = data.amount || 0;
            const incomeCategory = data.category || "N/A";
            const incomeRemark = data.remarks || "N/A"; // Fetching remark
            historyItems.push({
                type: "Income",
                date: incomeDate,
                amount: incomeAmount,
                category: incomeCategory,
                remarks: incomeRemark // Adding remark to the history item
            });
        });

        // Expense history query
        const expenseQuery = query(
            collection(db, "users", userId, "expenses"),
            where("timestamp", ">=", startOfMonth),
            where("timestamp", "<=", endOfMonth)
        );

        const expenseSnapshot = await getDocs(expenseQuery);
        expenseSnapshot.forEach((doc) => {
            const data = doc.data();
            const expenseDate = new Date(data.timestamp.seconds * 1000);
            const expenseAmount = data.amount || 0;
            const expenseCategory = data.category || "N/A";
            const expenseRemark = data.remarks || "N/A"; // Fetching remark
            historyItems.push({
                type: "Expense",
                date: expenseDate,
                amount: expenseAmount,
                category: expenseCategory,
                remarks: expenseRemark // Adding remark to the history item
            });
        });

        // Sort the items by date
        historyItems.sort((a, b) => a.date - b.date);  // Ascending order of date

        // Build the history display
        let historyHTML = `<h4>Income & Expense History for ${month} ${year}</h4>`;
        historyHTML += `
        <div class="history-item header">
            <div class="history-field" style="font-weight: bold;">Type</div>
            <div class="history-field" style="font-weight: bold;">Date</div>
            <div class="history-field" style="font-weight: bold;">Amount</div>
            <div class="history-field" style="font-weight: bold;">Category</div>
            <div class="history-field" style="font-weight: bold;">Remark</div>
        </div>`;

        historyItems.forEach(item => {
            historyHTML += `
                <div class="history-item">
                    <div class="history-field">${item.type}</div>
                    <div class="history-field">${item.date.toLocaleDateString()}</div>
                    <div class="history-field">$${item.amount.toFixed(2)}</div>
                    <div class="history-field">${item.category}</div>
                    <div class="history-field">${item.remarks}</div> <!-- Adding remark -->
                </div>`;
        });

        expandableContent.innerHTML = `
            <div class="history-container">
                ${historyHTML}
            </div>
        `;
    } catch (error) {
        console.error("Error fetching history:", error);
        expandableContent.innerHTML = "<p>Failed to load income and expense history.</p>";
    }
};



// Event listener for dropdown change
const initializeAppListeners = (userId) => {
    const dropdown = document.getElementById("monthYearDropdown");
    const refreshTotals = () => {
        const [year, month] = dropdown.value.split("-");
        fetchMonthlyTotals(userId, parseInt(year, 10), parseInt(month, 10));
        fetchIncomeExpenseHistory(parseInt(year, 10), parseInt(month, 10), userId);
    };

    dropdown.addEventListener("change", refreshTotals);

    document.getElementById("incomePopupBtn").addEventListener("click", () => {
        window.open("incomeForm.html", "Income Entry", "width=400,height=400");
    });

    document.getElementById("expensePopupBtn").addEventListener("click", () => {
        window.open("expenseForm.html", "Expense Entry", "width=400,height=400");
    });

    // Add event listeners for expanding buttons
    document.getElementById("historyBtn").addEventListener("click", () => {
        toggleExpand('historyExpand');
    });

    document.getElementById("chartBtn").addEventListener("click", () => {
        toggleExpand('chartExpand');
    });

    document.getElementById("budgetBtn").addEventListener("click", () => {
        toggleExpand('budgetExpand');
    });

    refreshTotals(); // Initial load for current month/year
};

// Toggle expansion of the square boxes
const toggleExpand = (id) => {
    const element = document.getElementById(id);
    const allExpands = document.querySelectorAll('.expandable');
    allExpands.forEach((expand) => {
        if (expand !== element) {
            expand.classList.remove('expanded');
        }
    });
    element.classList.toggle('expanded');
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

// Expandable content for the square buttons
document.getElementById("historyBtn").addEventListener("click", () => {
    const [year, month] = document.getElementById("monthYearDropdown").value.split("-");
    fetchIncomeExpenseHistory(year, month, auth.currentUser.uid);
    toggleExpandableContent("History Content");
});

document.getElementById("chartBtn").addEventListener("click", () => {
    toggleExpandableContent("Chart Content");
});

document.getElementById("budgetBtn").addEventListener("click", () => {
    toggleExpandableContent("Budget Content");
});

function toggleExpandableContent(content) {
    const expandableContent = document.getElementById("expandableContent");

    // Show the content and update its text
    expandableContent.classList.toggle("active");
    expandableContent.innerHTML = `<h4>${content}</h4><p>Details and settings related to ${content} can go here.</p>`;
};
