// Populate dropdown with months and years
const populateMonthYearDropdown = () => {
    const dropdown = document.getElementById("monthYearDropdown");
    const years = [2024, 2025]; // Possible years
    const months = [
        "January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October",
        "November", "December"
    ];

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // Populate the dropdown with month-year options
    years.forEach((year) => {
        months.forEach((month, index) => {
            const option = document.createElement("option");
            const monthValue = index + 1; // Adjust to get 1-12 range for months
            option.value = `${year}-${monthValue < 10 ? '0' + monthValue : monthValue}`; // Format value as "YYYY-MM"
            option.textContent = `${month} ${year}`;
            if (year === currentYear && monthValue === currentMonth) {
                option.selected = true;
            }
            dropdown.appendChild(option);
        });
    });
};

// Fetch and update monthly totals in real-time (using localStorage)
const fetchMonthlyTotals = (year, month) => {
    const totalIncomeElement = document.getElementById("totalIncome");
    const totalExpenseElement = document.getElementById("totalExpense");

    let totalIncome = 0;
    let totalExpense = 0;

    const startOfMonth = new Date(year, month - 1, 1).getTime();
    const endOfMonth = new Date(year, month, 0).getTime();

    // Fetch income data from localStorage
    const incomeData = JSON.parse(localStorage.getItem("incomeData")) || [];
    incomeData.forEach(item => {
        if (item.timestamp >= startOfMonth && item.timestamp <= endOfMonth) {
            totalIncome += parseFloat(item.amount) || 0;
        }
    });

    // Fetch expense data from localStorage
    const expenseData = JSON.parse(localStorage.getItem("expenseData")) || [];
    expenseData.forEach(item => {
        if (item.timestamp >= startOfMonth && item.timestamp <= endOfMonth) {
            totalExpense += parseFloat(item.amount) || 0;
        }
    });

    totalIncomeElement.textContent = `$${totalIncome.toFixed(2)}`;
    totalExpenseElement.textContent = `$${totalExpense.toFixed(2)}`;
};

// Function to handle delete icon click and deletion from localStorage
const handleDelete = (id, type) => {
    if (confirm("Are you sure you want to delete this entry?")) {
        const dataKey = type === "Income" ? "incomeData" : "expenseData";
        const data = JSON.parse(localStorage.getItem(dataKey)) || [];

        const updatedData = data.filter(item => item.id !== id);
        localStorage.setItem(dataKey, JSON.stringify(updatedData));

        const [year, month] = document.getElementById("monthYearDropdown").value.split("-");
        fetchMonthlyTotals(parseInt(year, 10), parseInt(month, 10)); // Update totals
        fetchIncomeExpenseHistory(parseInt(year, 10), parseInt(month, 10)); // Update history
    }
};

// Function to fetch and display history (income & expense) from localStorage
const fetchIncomeExpenseHistory = (year, month) => {

    const expandableContent = document.getElementById("expandableContent");

    const startOfMonth = new Date(year, month - 1, 1).getTime();
    const endOfMonth = new Date(year, month, 0).getTime();

    let historyItems = [];

    // Fetch income data
    const incomeData = JSON.parse(localStorage.getItem("incomeData")) || [];
    incomeData.forEach(item => {
        if (item.timestamp >= startOfMonth && item.timestamp <= endOfMonth) {
            historyItems.push({
                type: "Income",
                date: new Date(item.timestamp),
                amount: parseFloat(item.amount),
                category: item.category || "N/A",
                remarks: item.remarks || "N/A"
            });
        }
    });

    // Fetch expense data
    const expenseData = JSON.parse(localStorage.getItem("expenseData")) || [];
    expenseData.forEach(item => {
        if (item.timestamp >= startOfMonth && item.timestamp <= endOfMonth) {
            historyItems.push({
                type: "Expense",
                date: new Date(item.timestamp),
                amount: parseFloat(item.amount),
                category: item.category || "N/A",
                remarks: item.remarks || "N/A"
            });
        }
    });

    // Sort by date
    historyItems.sort((a, b) => a.date - b.date);

    let historyHTML = `<h4>Income & Expense History for ${year}-${month.toString().padStart(2, '0')}</h4>`;
    if (historyItems.length > 0) {
        historyHTML +=
            `<div class="history-item header">
                <div class="history-field" style="font-weight: bold;">Type</div>
                <div class="history-field" style="font-weight: bold;">Date</div>
                <div class="history-field" style="font-weight: bold;">Amount</div>
                <div class="history-field" style="font-weight: bold;">Category</div>
                <div class="history-field" style="font-weight: bold;">Remarks</div>
                <div class="history-field" style="font-weight: bold;">Actions</div>
            </div>`;

        historyItems.forEach(item => {
            historyHTML +=
                `<div class="history-item">
                    <div class="history-field">${item.type}</div>
                    <div class="history-field">${item.date.toLocaleDateString()}</div>
                    <div class="history-field">$${item.amount.toFixed(2)}</div>
                    <div class="history-field">${item.category}</div>
                    <div class="history-field">${item.remarks}</div>
                    <div class="history-field">
                        <button class="delete-btn" data-id="${item.id}" data-type="${item.type}">
                            <i class="fas fa-trash-alt"></i> <!-- Delete icon -->
                        </button>
                    </div>
                </div>`;
        });
    } else {
        historyHTML += `<p>No records found for this month.</p>`;
    }

    expandableContent.innerHTML = `<div class="history-container">${historyHTML}</div>`;

    // Attach delete event listeners after the content has been updated
    attachDeleteEventListeners();
};

// Attach delete button event listeners
function attachDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const id = button.getAttribute('data-id');
            const type = button.getAttribute('data-type');
            handleDelete(id, type);
        });
    });
}

// Toggle expandable content for history and other buttons
function toggleExpandableContent(content) {
    const expandableContent = document.getElementById("expandableContent");

    // Show the content and update its text
    expandableContent.classList.toggle("active");
    expandableContent.innerHTML = `<h4>${content}</h4><p>Details and settings related to ${content} can go here.</p>`;
}

// Initialize the app with listeners
const initializeAppListeners = () => {
    const dropdown = document.getElementById("monthYearDropdown");
    const refreshTotals = () => {
        const [year, month] = dropdown.value.split("-");
        fetchMonthlyTotals(parseInt(year, 10), parseInt(month, 10));
        fetchIncomeExpenseHistory(parseInt(year, 10), parseInt(month, 10));
    };

    dropdown.addEventListener("change", refreshTotals);

    document.getElementById("incomePopupBtn").addEventListener("click", () => {
        window.open("incomeGuest.html", "Income Entry", "width=400,height=400");
    });

    document.getElementById("expensePopupBtn").addEventListener("click", () => {
        window.open("expenseGuest.html", "Expense Entry", "width=400,height=400");
    });

    document.getElementById("historyBtn").addEventListener("click", () => {
        toggleExpandableContent("History Content");
    });

    document.getElementById("chartBtn").addEventListener("click", () => {
        toggleExpandableContent("Chart Content");
    });

    document.getElementById("logout").addEventListener("click", () => {
        localStorage.removeItem("incomeData");
        localStorage.removeItem("expenseData");
        window.location.href = "welcompage.html";
    });

    refreshTotals();
};

// Initialize app
populateMonthYearDropdown();
initializeAppListeners();
