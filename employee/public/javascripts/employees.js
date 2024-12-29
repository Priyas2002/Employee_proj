// DOM Elements
const tableBody = document.querySelector("#all > div > div > table > tbody");
const allBadge = document.querySelector("#all-tab > span");
const activeBadge = document.querySelector("#active-tab > span");
const onLeaveBadge = document.querySelector("#onleave-tab > span");
const inactiveBadge = document.querySelector("#inactive-tab > span");

// Fetch Employees from API
const fetchEmployees = async () => {
  try {
    const response = await fetch("http://localhost:3000/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch employees");
    }

    const employees = await response.json();
    renderEmployees(employees);
    updateBadges(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
  }
};

// Render Employees in Table
const renderEmployees = (employees) => {
  // Clear the table body before rendering
  tableBody.innerHTML = "";

  employees.forEach((employee) => {
    const tableRow = document.createElement("tr");
    tableRow.innerHTML = generateEmployeeRow(employee);
    tableBody.appendChild(tableRow);
  });
};

// Generate Table Row HTML for an Employee
const generateEmployeeRow = (employee) => {
  const badgeClass =
    employee.status === "ACTIVE"
      ? "bg-success"
      : employee.status === "INACTIVE"
      ? "bg-danger"
      : "bg-warning";
  const positionFormatted = formatPosition(employee.position);

  return `
    <td hidden>
      <input class="form-check-input" type="checkbox" value="" >
    </td>
    <td>
      <div class="d-flex align-items-center">
        <img src="${
          employee.profile_image
        }" class="rounded-circle me-3" width="40" height="40">
        <div>
          <div class="fw-bold">${employee.first_name} ${
    employee.last_name
  }</div>
          <div class="text-muted small">${employee.email}</div>
        </div>
      </div>
    </td>
    <td>${employee.department || "N/A"}</td>
    <td>${positionFormatted}</td>
    <td><span class="badge ${badgeClass}">${employee.status.split('_').join(' ')}</span></td>
    <td>${employee.joined_date}</td>
    <td>
      <div class="dropdown action-dropdown">
        <button 
          class="btn btn-sm btn-light border-0"
          type="button" 
          data-bs-toggle="dropdown" 
          aria-expanded="false">
          <i class="fa-solid fa-ellipsis"></i>
        </button>
        <ul class="dropdown-menu px-0 dropdown-menu-end p-1 shadow-sm">
          <li><a class="dropdown-item small py-1 px-2" href="#" onclick="editEmployee('${
            employee.emp_id
          }')">Edit</a></li>
          <li><a class="dropdown-item small py-1 px-2" href="#" onclick="deleteEmployee('${
            employee.emp_id
          }')">Delete</a></li>
          <li><a class="dropdown-item small py-1 px-2" href="#" onclick="viewDetails('${
            employee.emp_id
          }')">View Details</a></li>
        </ul>
      </div>
    </td>
  `;
};

// Format Position for Display
const formatPosition = (position) => {
  if (!position) return "N/A";
  return position
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Update Tab Badges
const updateBadges = (employees) => {
  const totalCount = employees.length;
  const activeCount = employees.filter((emp) => emp.status === "ACTIVE").length;
  const onLeaveCount = employees.filter(
    (emp) => emp.status === "ON_LEAVE"
  ).length;
  const inactiveCount = employees.filter(
    (emp) => emp.status === "INACTIVE"
  ).length;

  allBadge.textContent = totalCount;
  activeBadge.textContent = activeCount;
  onLeaveBadge.textContent = onLeaveCount;
  inactiveBadge.textContent = inactiveCount;
};

// Action Handlers
const editEmployee = (emp_id) => {
  console.log("Edit employee with ID:", emp_id);
  // Logic to edit employee
};

const deleteEmployee = (emp_id) => {
  console.log("Delete employee with ID:", emp_id);
  // Logic to delete employee
};

const viewDetails = (emp_id) => {
  console.log("View details for employee with ID:", emp_id);
  // Logic to view details (e.g., open modal with detailed info)
};

// Initial Fetch
fetchEmployees();
