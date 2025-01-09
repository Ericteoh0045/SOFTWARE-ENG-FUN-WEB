// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const messagesContainer = document.getElementById('messagesContainer');
const statusMessage = document.getElementById('statusMessage');

// Fetch and display messages
async function fetchMessages(userEmail) {
    try {
        const messagesQuery = query(
            collection(db, "messages"),
            where("recipientEmail", "==", userEmail),
            orderBy("timestamp", "desc")
        );

        const querySnapshot = await getDocs(messagesQuery);
        messagesContainer.innerHTML = ""; // Clear existing messages

        if (querySnapshot.empty) {
            messagesContainer.innerHTML = "<p>No messages found.</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const messageData = doc.data();
            const messageItem = document.createElement("div");
            messageItem.classList.add("message-item");

            messageItem.innerHTML = `
                <p><strong>Message:</strong> ${messageData.message}</p>
                <p class="timestamp">Sent: ${new Date(
                    messageData.timestamp.seconds * 1000
                ).toLocaleString()}</p>
            `;
            messagesContainer.appendChild(messageItem);
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        statusMessage.textContent = "Error loading messages. Please try again.";
    }
}

// Get the logged-in user's email
const userEmail = localStorage.getItem('loggedInUserEmail');
if (userEmail) {
    fetchMessages(userEmail);
} else {
    statusMessage.textContent = "You must be logged in to view messages.";
}
