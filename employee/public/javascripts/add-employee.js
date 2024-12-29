const avatarPreview = document.getElementById("avatar-preview");
const avatarInput = document.getElementById("avatar");
const avatarError = document.getElementById("avatar-error");

const dateInput = document.getElementById("joined_date");
const today = new Date().toISOString().split("T")[0];
dateInput.value = today;  // Set today's date as the default value
dateInput.setAttribute("min", today); // Prevent selecting past dates


// Drag and drop functionality
avatarPreview.addEventListener("dragover", (e) => {
  e.preventDefault();
  avatarPreview.classList.add("drag-over");
});

avatarPreview.addEventListener("dragleave", () => {
  avatarPreview.classList.remove("drag-over");
});

avatarPreview.addEventListener("drop", (e) => {
  e.preventDefault();
  avatarPreview.classList.remove("drag-over");
  const files = e.dataTransfer.files;
  if (files.length) {
    handleImageSelect({ files: files });
  }
});

avatarPreview.addEventListener("click", () => {
  if (!avatarPreview.classList.contains("has-image")) {
    avatarInput.click();
  }
});

function handleImageSelect(input) {
  const file = input.files[0];
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

  avatarError.style.display = "none";

  if (file) {
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      showError("Please select a valid image file (JPEG, PNG, or GIF)");
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      showError("Image size should not exceed 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      avatarPreview.innerHTML = `
        <img src="${e.target.result}" alt="Selected avatar" />
        <div class="image-actions">
          <button type="button" onclick="removeImage()">
            <i class="fas fa-trash"></i>
          </button>
          <button type="button" onclick="document.getElementById('avatar').click()">
            <i class="fas fa-edit"></i>
          </button>
        </div>
      `;
      avatarPreview.classList.add("has-image");
    };
    reader.readAsDataURL(file);
  }
}

function removeImage() {
  avatarInput.value = "";
  avatarPreview.classList.remove("has-image");
  avatarPreview.innerHTML = `
    <i class="fas fa-cloud-upload-alt upload-icon"></i>
    <div class="upload-text">
      <span>Drag & drop your image here or</span>
      <span class="text-primary">click to browse</span>
    </div>
  `;
}

function showError(message) {
  avatarError.textContent = message;
  avatarError.style.display = "block";
  avatarInput.value = "";
}

const roles = {
  Engineering: [
    "Senior Frontend Developer",
    "Senior Backend Developer",
    "Senior Full Stack Developer",
    "Mid-Level Frontend Developer",
    "Mid-Level Backend Developer",
    "Mid-Level Full Stack Developer",
    "Junior Frontend Developer",
    "Junior Backend Developer",
    "Junior Full Stack Developer",
    "Lead Engineer",
    "DevOps Engineer",
    "QA Engineer",
    "Software Architect",
  ],
  Design: [
    "UI Designer",
    "UX Designer",
    "Product Designer",
    "Graphic Designer",
  ],
  Management: [
    "Project Manager",
    "Product Manager",
    "Technical Lead",
    "Engineering Manager",
    "Chief Technical Officer",
  ],
  Operations: [
    "System Administrator",
    "Network Engineer",
    "Security Engineer",
    "Data Analyst",
    "Data Scientist",
  ],
  Support: [
    "Technical Support Specialist",
    "Customer Success Manager",
    "Technical Writer",
  ],
};

function updateRoles() {
  const departmentSelect = document.getElementById("department");
  const roleSelect = document.getElementById("position");
  const selectedDepartment = departmentSelect.value;

  roleSelect.innerHTML = '<option value="">Select Position</option>';

  if (selectedDepartment) {
    const departmentRoles = roles[selectedDepartment];
    departmentRoles.forEach((role) => {
      const option = document.createElement("option");
      option.value = role.toLowerCase().replace(/ /g, "_");
      option.textContent = role;
      roleSelect.appendChild(option);
    });
  }
}