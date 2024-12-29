const addEmployeeForm = document.getElementById("add-emp-form");

addEmployeeForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Create FormData object inside the event listener to capture data at submission
  const formData = new FormData(addEmployeeForm);

  // Convert FormData to a plain object for JSON payload
  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value;
  });

  try {
    response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObject),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Success:", result);

    // Optionally, display success message to the user
    alert("Employee added successfully!");
  } catch (error) {
    console.error("Error:", error);

    // Optionally, display error message to the user
    alert("Failed to add employee. Please try again.");
  }
});
