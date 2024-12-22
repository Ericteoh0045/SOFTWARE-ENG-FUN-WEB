// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDlrbumKo34d3Hel__bA1Xj6TG_ClFOF0g",
    authDomain: "login-form-4c66d.firebaseapp.com",
    projectId: "login-form-4c66d",
    storageBucket: "login-form-4c66d.firebasestorage.app",
    messagingSenderId: "9677626952",
    appId: "1:9677626952:web:4f55f083e1cdf36f77c27d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// HTML Elements for Expense Categories
const manageCategoriesBtn = document.getElementById('manageCategoriesBtn');
const categoriesSection = document.getElementById('categoriesSection');
const expenseCategoryInput = document.getElementById('expenseCategoryInput');
const addExpenseCategoryBtn = document.getElementById('addExpenseCategoryBtn');
const expenseCategoryList = document.getElementById('expenseCategoryList');

// HTML Elements for Income Categories
const incomeCategoryInput = document.getElementById('incomeCategoryInput');
const addIncomeCategoryBtn = document.getElementById('addIncomeCategoryBtn');
const incomeCategoryList = document.getElementById('incomeCategoryList');

// Toggle Categories Section Visibility (Expense and Income Categories)
manageCategoriesBtn.addEventListener('click', () => {
    categoriesSection.classList.toggle('hidden'); // Show or hide both categories section
});

// Fetch and Display Categories
async function displayExpenseCategories() {
    expenseCategoryList.innerHTML = ''; // Clear the list
    const querySnapshot = await getDocs(collection(db, 'expenseCategories'));
    querySnapshot.forEach((docSnapshot) => {
        const category = docSnapshot.data();
        const li = document.createElement('li');
        li.textContent = category.name;

        // Create Edit Button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editExpenseCategory(docSnapshot.id, category.name);

        // Create Delete Button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteExpenseCategory(docSnapshot.id);

        li.appendChild(editButton);
        li.appendChild(deleteButton);
        expenseCategoryList.appendChild(li);
    });
}

async function displayIncomeCategories() {
    incomeCategoryList.innerHTML = ''; // Clear the list
    const querySnapshot = await getDocs(collection(db, 'incomeCategories'));
    querySnapshot.forEach((docSnapshot) => {
        const category = docSnapshot.data();
        const li = document.createElement('li');
        li.textContent = category.name;

        // Create Edit Button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editIncomeCategory(docSnapshot.id, category.name);

        // Create Delete Button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteIncomeCategory(docSnapshot.id);

        li.appendChild(editButton);
        li.appendChild(deleteButton);
        incomeCategoryList.appendChild(li);
    });
}

// Add New Expense Category
addExpenseCategoryBtn.addEventListener('click', async () => {
    const categoryName = expenseCategoryInput.value.trim();
    if (categoryName) {
        try {
            await addDoc(collection(db, 'expenseCategories'), { name: categoryName });
            expenseCategoryInput.value = '';
            displayExpenseCategories(); // Refresh the list
            alert('Expense category added successfully!');
        } catch (error) {
            console.error('Error adding expense category:', error);
            alert('Failed to add expense category. Error: ' + error.message);
        }
    } else {
        alert('Please enter a category name.');
    }
});

// Add New Income Category
addIncomeCategoryBtn.addEventListener('click', async () => {
    const categoryName = incomeCategoryInput.value.trim();
    if (categoryName) {
        try {
            await addDoc(collection(db, 'incomeCategories'), { name: categoryName });
            incomeCategoryInput.value = '';
            displayIncomeCategories(); // Refresh the list
            alert('Income category added successfully!');
        } catch (error) {
            console.error('Error adding income category:', error);
            alert('Failed to add income category. Error: ' + error.message);
        }
    } else {
        alert('Please enter a category name.');
    }
});

// Edit Expense Category
async function editExpenseCategory(categoryId, currentName) {
    const newName = prompt('Edit expense category name:', currentName);
    if (newName && newName.trim() !== '') {
        try {
            const docRef = doc(db, 'expenseCategories', categoryId);
            await updateDoc(docRef, { name: newName });
            displayExpenseCategories(); // Refresh the list
            alert('Expense category updated successfully!');
        } catch (error) {
            console.error('Error updating expense category:', error);
            alert('Failed to update expense category. Error: ' + error.message);
        }
    }
}

// Edit Income Category
async function editIncomeCategory(categoryId, currentName) {
    const newName = prompt('Edit income category name:', currentName);
    if (newName && newName.trim() !== '') {
        try {
            const docRef = doc(db, 'incomeCategories', categoryId);
            await updateDoc(docRef, { name: newName });
            displayIncomeCategories(); // Refresh the list
            alert('Income category updated successfully!');
        } catch (error) {
            console.error('Error updating income category:', error);
            alert('Failed to update income category. Error: ' + error.message);
        }
    }
}

// Delete Expense Category
async function deleteExpenseCategory(categoryId) {
    const confirmDelete = confirm('Are you sure you want to delete this expense category?');
    if (confirmDelete) {
        try {
            const docRef = doc(db, 'expenseCategories', categoryId);
            await deleteDoc(docRef);
            displayExpenseCategories(); // Refresh the list
            alert('Expense category deleted successfully!');
        } catch (error) {
            console.error('Error deleting expense category:', error);
            alert('Failed to delete expense category. Error: ' + error.message);
        }
    }
}

// Delete Income Category
async function deleteIncomeCategory(categoryId) {
    const confirmDelete = confirm('Are you sure you want to delete this income category?');
    if (confirmDelete) {
        try {
            const docRef = doc(db, 'incomeCategories', categoryId);
            await deleteDoc(docRef);
            displayIncomeCategories(); // Refresh the list
            alert('Income category deleted successfully!');
        } catch (error) {
            console.error('Error deleting income category:', error);
            alert('Failed to delete income category. Error: ' + error.message);
        }
    }
}

// Display categories on page load
displayExpenseCategories();
displayIncomeCategories();
