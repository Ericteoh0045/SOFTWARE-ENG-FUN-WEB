import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, addDoc, collection } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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
const db = getFirestore();

// document.addEventListener("DOMContentLoaded", () => {
//     const saveColorButton = document.getElementById("saveColor");
//     const favoriteColorInput = document.getElementById("favoriteColor");
//     const colorFeedback = document.getElementById("colorFeedback");

//     // When user authentication state changes
//     onAuthStateChanged(auth, (user) => {
//         if (user) {
//             const userCollection = collection(db, "users", user.uid, "favoriteColors");

//             // Handle Save Color button click
//             saveColorButton.addEventListener("click", async () => {
//                 const favoriteColor = favoriteColorInput.value.trim();
//                 if (favoriteColor) {
//                     try {
//                         await addDoc(userCollection, { color: favoriteColor, timestamp: new Date() });
//                         colorFeedback.innerText = `Color "${favoriteColor}" saved successfully!`;
//                         colorFeedback.style.color = "green";
//                     } catch (error) {
//                         console.error("Error saving color:", error);
//                         colorFeedback.innerText = "Failed to save color.";
//                         colorFeedback.style.color = "red";
//                     }
//                 } else {
//                     colorFeedback.innerText = "Please enter a valid color.";
//                     colorFeedback.style.color = "red";
//                 }
//             });
//         } else {
//             console.log("No user is currently logged in.");
//             window.location.href = "login.html";
//         }
//     });

    // Logout functionality
    const logoutButton = document.getElementById("logout");
    logoutButton.addEventListener("click", () => {
        signOut(auth)
            .then(() => {
                localStorage.removeItem("loggedInUserId");
                window.location.href = "welcompage.html";
            })
            .catch((error) => {
                console.error("Error signing out:", error);
            });
    });

    // When the green '+' button is clicked, open a small pop-up window
    const incomePopupBtn = document.getElementById('incomePopupBtn');
    if (incomePopupBtn) {
        incomePopupBtn.addEventListener('click', function() {
            window.open('incomeForm.html', 'Income Entry', 'width=400,height=400');
        });
    }

    // When the red '-' button is clicked, open a small pop-up window
    const expensePopupBtn = document.getElementById('expensePopupBtn');
    if (expensePopupBtn) {
        expensePopupBtn.addEventListener('click', function() {
            window.open('expenseForm.html', 'Expense Entry', 'width=400,height=400');
        });
    }
// });
