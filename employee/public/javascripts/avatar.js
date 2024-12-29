document.addEventListener("DOMContentLoaded", () => {
    const avatar = document.getElementById("avatar");
    const dropdown = document.getElementById("dropdown");

    // Toggle dropdown
    avatar.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target) && !avatar.contains(e.target)) {
            dropdown.classList.remove("show");
        }
    });

    // Close dropdown when pressing Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            dropdown.classList.remove("show");
        }
    });

    // Handle dropdown item clicks
    const dropdownItems = dropdown.querySelectorAll("li");
    dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            dropdown.classList.remove("show");
            // Add your click handlers here
            console.log("Clicked:", item.textContent.trim());
        });
    });
});