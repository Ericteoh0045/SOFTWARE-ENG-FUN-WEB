document.addEventListener("DOMContentLoaded", () => {
    const saveColorButton = document.getElementById("saveColor");
    const favoriteColorInput = document.getElementById("favoriteColor");
    const colorFeedback = document.getElementById("colorFeedback");
    const logoutButton = document.getElementById("logout");

    // Handle Save Color button click
    saveColorButton.addEventListener("click", () => {
        const favoriteColor = favoriteColorInput.value.trim();
        if (favoriteColor) {
            colorFeedback.innerText = `Color "${favoriteColor}" saved for this session!`;
            colorFeedback.style.color = "green";
            sessionStorage.setItem("guestFavoriteColor", favoriteColor);
        } else {
            colorFeedback.innerText = "Please enter a valid color.";
            colorFeedback.style.color = "red";
        }
    });

    // Handle Logout button click
    logoutButton.addEventListener("click", () => {
        sessionStorage.removeItem("guestFavoriteColor");
        window.location.href = "index.html";
    });
});
