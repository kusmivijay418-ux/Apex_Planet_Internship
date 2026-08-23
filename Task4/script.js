// ==========================================
// FINANCEFLOW - PERSONAL FINANCE DASHBOARD
// ==========================================


// ==========================================
// VARIABLES
// ==========================================

let transactions =
    JSON.parse(localStorage.getItem("financeTransactions")) || [];

let editingId = null;

let expenseChart;
let incomeExpenseChart;


// ==========================================
// DOM ELEMENTS
// ==========================================

const transactionForm =
    document.getElementById("transactionForm");

const modal =
    document.getElementById("transactionModal");

const transactionList =
    document.getElementById("transactionList");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const typeFilter =
    document.getElementById("typeFilter");

const categoryFilter =
    document.getElementById("categoryFilter");

const monthFilter =
    document.getElementById("monthFilter");


// ==========================================
// INITIAL LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("date").value =
        getTodayDate();

    loadTheme();

    updateDashboard();

    displayTransactions();

});


// ==========================================
// GET TODAY'S DATE
// ==========================================

function getTodayDate() {

    const today = new Date();

    const year = today.getFullYear();

    const month =
        String(today.getMonth() + 1).padStart(2, "0");

    const day =
        String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ==========================================
// SAVE TO LOCAL STORAGE
// ==========================================

function saveTransactions() {

    localStorage.setItem(
        "financeTransactions",
        JSON.stringify(transactions)
    );

}


// ==========================================
// OPEN MODAL
// ==========================================

function openModal() {

    modal.classList.add("show");

    document.getElementById("modalTitle").textContent =
        "Add Transaction";

    editingId = null;

    transactionForm.reset();

    document.getElementById("date").value =
        getTodayDate();
}


// ==========================================
// CLOSE MODAL
// ==========================================

function closeModal() {

    modal.classList.remove("show");

    editingId = null;

    transactionForm.reset();

}


// ==========================================
// CLICK OUTSIDE MODAL
// ==========================================

modal.addEventListener("click", (event) => {

    if (event.target === modal) {
        closeModal();
    }

});


// ==========================================
// ADD / EDIT TRANSACTION
// ==========================================

transactionForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const description =
        document.getElementById("description").value.trim();

    const amount =
        Number(document.getElementById("amount").value);

    const type =
        document.getElementById("type").value;

    const category =
        document.getElementById("category").value;

    const date =
        document.getElementById("date").value;


    if (
        !description ||
        !amount ||
        !type ||
        !category ||
        !date
    ) {

        alert("Please fill all fields.");

        return;
    }


    if (amount <= 0) {

        alert("Amount must be greater than zero.");

        return;
    }


    // EDIT
    if (editingId !== null) {

        const index =
            transactions.findIndex(
                transaction =>
                    transaction.id === editingId
            );

        if (index !== -1) {

            transactions[index] = {

                id: editingId,

                description,

                amount,

                type,

                category,

                date

            };

        }

    }

    // ADD
    else {

        const newTransaction = {

            id: Date.now(),

            description,

            amount,

            type,

            category,

            date

        };

        transactions.unshift(newTransaction);

    }


    saveTransactions();

    updateDashboard();

    displayTransactions();

    closeModal();

});


// ==========================================
// DISPLAY TRANSACTIONS
// ==========================================

function displayTransactions() {

    const search =
        searchInput.value.toLowerCase().trim();

    const type =
        typeFilter.value;

    const category =
        categoryFilter.value;

    const month =
        monthFilter.value;


    let filteredTransactions =
        transactions.filter(transaction => {

            const matchesSearch =
                transaction.description
                    .toLowerCase()
                    .includes(search);

            const matchesType =
                type === "all" ||
                transaction.type === type;

            const matchesCategory =
                category === "all" ||
                transaction.category === category;

            const matchesMonth =
                month === "" ||
                transaction.date.startsWith(month);


            return (
                matchesSearch &&
                matchesType &&
                matchesCategory &&
                matchesMonth
            );

        });


    transactionList.innerHTML = "";


    if (filteredTransactions.length === 0) {

        emptyState.style.display = "block";

        return;

    }


    emptyState.style.display = "none";


    filteredTransactions.forEach(transaction => {

        const row =
            document.createElement("tr");


        const formattedDate =
            formatDate(transaction.date);


        const amount =
            formatCurrency(transaction.amount);


        row.innerHTML = `

            <td>
                <strong>${escapeHTML(transaction.description)}</strong>
            </td>

            <td>
                ${escapeHTML(transaction.category)}
            </td>

            <td>

                <span class="type-badge ${
                    transaction.type === "income"
                        ? "type-income"
                        : "type-expense"
                }">

                    ${
                        transaction.type === "income"
                            ? "Income"
                            : "Expense"
                    }

                </span>

            </td>

            <td>
                ${formattedDate}
            </td>

            <td class="${
                transaction.type === "income"
                    ? "income-amount"
                    : "expense-amount"
            }">

                ${
                    transaction.type === "income"
                        ? "+"
                        : "-"
                }

                ${amount}

            </td>

            <td>

                <button
                    class="action-btn edit-btn"
                    onclick="editTransaction(${transaction.id})"
                    title="Edit"
                >
                    ✏️
                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteTransaction(${transaction.id})"
                    title="Delete"
                >
                    🗑️
                </button>

            </td>

        `;


        transactionList.appendChild(row);

    });

}


// ==========================================
// EDIT TRANSACTION
// ==========================================

function editTransaction(id) {

    const transaction =
        transactions.find(
            transaction =>
                transaction.id === id
        );


    if (!transaction) {
        return;
    }


    editingId = id;


    document.getElementById("modalTitle").textContent =
        "Edit Transaction";


    document.getElementById("description").value =
        transaction.description;

    document.getElementById("amount").value =
        transaction.amount;

    document.getElementById("type").value =
        transaction.type;

    document.getElementById("category").value =
        transaction.category;

    document.getElementById("date").value =
        transaction.date;


    modal.classList.add("show");

}


// ==========================================
// DELETE TRANSACTION
// ==========================================

function deleteTransaction(id) {

    const transaction =
        transactions.find(
            transaction =>
                transaction.id === id
        );


    if (!transaction) {
        return;
    }


    const confirmed =
        confirm(
            `Delete "${transaction.description}"?`
        );


    if (!confirmed) {
        return;
    }


    transactions =
        transactions.filter(
            transaction =>
                transaction.id !== id
        );


    saveTransactions();

    updateDashboard();

    displayTransactions();

}


// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard() {

    let totalIncome = 0;

    let totalExpense = 0;


    transactions.forEach(transaction => {

        if (transaction.type === "income") {

            totalIncome += Number(transaction.amount);

        }

        else {

            totalExpense += Number(transaction.amount);

        }

    });


    const balance =
        totalIncome - totalExpense;


    document.getElementById("totalBalance")
        .textContent =
        formatCurrency(balance);


    document.getElementById("totalIncome")
        .textContent =
        formatCurrency(totalIncome);


    document.getElementById("totalExpense")
        .textContent =
        formatCurrency(totalExpense);


    document.getElementById("netSavings")
        .textContent =
        formatCurrency(balance);


    updateCharts();

}


// ==========================================
// EXPENSE DATA FOR CHART
// ==========================================

function getExpenseData() {

    const categories = {};

    transactions.forEach(transaction => {

        if (transaction.type !== "expense") {
            return;
        }


        if (!categories[transaction.category]) {

            categories[transaction.category] = 0;

        }


        categories[transaction.category] +=
            Number(transaction.amount);

    });


    return categories;

}


// ==========================================
// UPDATE CHARTS
// ==========================================

function updateCharts() {

    const expenseData =
        getExpenseData();


    const expenseLabels =
        Object.keys(expenseData);


    const expenseValues =
        Object.values(expenseData);


    const income =
        transactions

            .filter(
                transaction =>
                    transaction.type === "income"
            )

            .reduce(
                (sum, transaction) =>
                    sum + Number(transaction.amount),
                0
            );


    const expense =
        transactions

            .filter(
                transaction =>
                    transaction.type === "expense"
            )

            .reduce(
                (sum, transaction) =>
                    sum + Number(transaction.amount),
                0
            );


    // Destroy old expense chart
    if (expenseChart) {

        expenseChart.destroy();

    }


    // Destroy old income/expense chart
    if (incomeExpenseChart) {

        incomeExpenseChart.destroy();

    }


    // Expense chart
    const expenseCanvas =
        document.getElementById("expenseChart");


    expenseChart =
        new Chart(expenseCanvas, {

            type: "doughnut",

            data: {

                labels: expenseLabels,

                datasets: [{

                    data: expenseValues,

                    borderWidth: 0

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }

            }

        });


    // Income vs Expense chart
    const incomeExpenseCanvas =
        document.getElementById(
            "incomeExpenseChart"
        );


    incomeExpenseChart =
        new Chart(incomeExpenseCanvas, {

            type: "bar",

            data: {

                labels: [
                    "Income",
                    "Expenses"
                ],

                datasets: [{

                    label: "Amount",

                    data: [
                        income,
                        expense
                    ],

                    borderRadius: 8

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    y: {

                        beginAtZero: true

                    }

                }

            }

        });

}


// ==========================================
// SEARCH & FILTERS
// ==========================================

searchInput.addEventListener(
    "input",
    displayTransactions
);


typeFilter.addEventListener(
    "change",
    displayTransactions
);


categoryFilter.addEventListener(
    "change",
    displayTransactions
);


monthFilter.addEventListener(
    "change",
    displayTransactions
);


// ==========================================
// DARK MODE
// ==========================================

const themeToggle =
    document.getElementById("themeToggle");


themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle("dark");


        const isDark =
            document.body.classList.contains("dark");


        localStorage.setItem(
            "financeDarkMode",
            isDark
        );


        themeToggle.textContent =
            isDark
                ? "☀️ Light Mode"
                : "🌙 Dark Mode";

    }
);


// ==========================================
// LOAD THEME
// ==========================================

function loadTheme() {

    const darkMode =
        localStorage.getItem(
            "financeDarkMode"
        );


    if (darkMode === "true") {

        document.body.classList.add("dark");

        themeToggle.textContent =
            "☀️ Light Mode";

    }

}


// ==========================================
// FORMAT CURRENCY
// ==========================================

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(amount);

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(date) {

    const dateObject =
        new Date(date + "T00:00:00");


    return dateObject.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ==========================================
// SECURITY: ESCAPE HTML
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}