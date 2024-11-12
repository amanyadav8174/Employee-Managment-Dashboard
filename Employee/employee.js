const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");

allSideMenu.forEach((item) => {
  const li = item.parentElement;

  item.addEventListener("click", function () {
    allSideMenu.forEach((i) => {
      i.parentElement.classList.remove("active");
    });
    li.classList.add("active");
  });
});

// TOGGLE SIDEBAR
const menuBar = document.querySelector("#content nav .bx.bx-menu");
const sidebar = document.getElementById("sidebar");

menuBar.addEventListener("click", function () {
  sidebar.classList.toggle("hide");
});
let employees = JSON.parse(localStorage.getItem("employees")) || [];
let notificationCount = 0;
let currentPage = 1;
const employeesPerPage = 5;

// Add Employee function
function addEmployee() {
  const empID = document.getElementById("empID").value.trim();
  const empName = document.getElementById("empName").value.trim();
  const empEmail = document.getElementById("empEmail").value.trim();
  const empSalary = document.getElementById("empSalary").value.trim();

  // Reset all warnings
  resetWarnings();

  let isValid = true;

  // Validation
  if (!isValidID(empID)) {
    showWarning("empID", "Employee ID must be a number.");
    isValid = false;
  }
  if (!isValidSalary(empSalary)) {
    showWarning("empSalary", "Salary must be a number.");
    isValid = false;
  }
  if (!isValidEmail(empEmail)) {
    showWarning("empEmail", "Please enter a valid email.");
    isValid = false;
  }

  // If invalid, stop the form submission
  if (!isValid) {
    return;
  }

  const newEmployee = {
    id: empID,
    name: empName,
    email: empEmail,
    salary: empSalary,
  };
  employees.push(newEmployee);

  // Save employees to localStorage
  localStorage.setItem("employees", JSON.stringify(employees));

  // Add employee to the table
  addEmployeeToTable(newEmployee);

  // Show notification
  notificationCount++;
  document.getElementById("notificationCount").textContent = notificationCount;

  // Show success notification
  showNotification("Employee added successfully!");

  // Clear form
  clearForm();

  // Close the add employee form
  closeAddForm();

  // Update pagination after adding a new employee
  updatePagination();
}

// Show warning below a field (as a pop-up style message)
function showWarning(fieldId, message) {
  const field = document.getElementById(fieldId);
  let warning = field.parentElement.querySelector(".warning");

  if (!warning) {
    warning = document.createElement("div");
    warning.classList.add("warning");
    field.parentElement.appendChild(warning);
  }

  warning.textContent = message;
  warning.style.display = "block";
}

// Reset warnings for all fields
function resetWarnings() {
  const warnings = document.querySelectorAll(".warning");
  warnings.forEach((warning) => (warning.style.display = "none"));
}

// Validate Employee ID (only numbers allowed)
function isValidID(id) {
  return !isNaN(id) && id.trim() !== "";
}

// Validate Salary (only numbers allowed)
function isValidSalary(salary) {
  return !isNaN(salary) && salary.trim() !== "";
}

// Validate Email format
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Add employee to the table
function addEmployeeToTable(employee) {
  const employeeTable = document.getElementById("employeeTable");
  const row = document.createElement("tr");

  row.innerHTML = `
        <td>${employee.id}</td>
        <td>${employee.name}</td>
        <td>${employee.email}</td>
        <td>${employee.salary}</td>
        <td>
            <button onclick="openEditForm('${employee.id}')">Edit</button>
            <button onclick="deleteEmployee('${employee.id}')">Delete</button>
        </td>
    `;

  employeeTable.appendChild(row);
}

// Clear form fields
function clearForm() {
  document.getElementById("empID").value = "";
  document.getElementById("empName").value = "";
  document.getElementById("empEmail").value = "";
  document.getElementById("empSalary").value = "";
}

// Open the Add Employee Form
function openAddForm() {
  document.getElementById("addEmployeeForm").style.display = "block";
}

// Close the Add Employee Form
function closeAddForm() {
  document.getElementById("addEmployeeForm").style.display = "none";
}

// Open the Edit Employee Form
function openEditForm(empID) {
  const employee = employees.find((emp) => emp.id === empID);
  document.getElementById("editEmpID").value = employee.id;
  document.getElementById("editEmpName").value = employee.name;
  document.getElementById("editEmpEmail").value = employee.email;
  document.getElementById("editEmpSalary").value = employee.salary;

  document.getElementById("editEmployeeForm").style.display = "block";
}

// Save changes in the Edit Employee Form
function saveChanges() {
  const empID = document.getElementById("editEmpID").value.trim();
  const empName = document.getElementById("editEmpName").value.trim();
  const empEmail = document.getElementById("editEmpEmail").value.trim();
  const empSalary = document.getElementById("editEmpSalary").value.trim();

  // Reset all warnings
  resetWarnings();

  let isValid = true;

  // Validation
  if (!isValidID(empID)) {
    showWarning("editEmpID", "Employee ID must be a number.");
    isValid = false;
  }
  if (!isValidSalary(empSalary)) {
    showWarning("editEmpSalary", "Salary must be a number.");
    isValid = false;
  }
  if (!isValidEmail(empEmail)) {
    showWarning("editEmpEmail", "Please enter a valid email.");
    isValid = false;
  }

  // If invalid, stop the form submission
  if (!isValid) {
    return;
  }

  // Find the employee and update details
  const employee = employees.find((emp) => emp.id === empID);
  if (employee) {
    employee.name = empName;
    employee.email = empEmail;
    employee.salary = empSalary;

    // Save the updated employees array to localStorage
    localStorage.setItem("employees", JSON.stringify(employees));

    // Update the employee table and pagination
    updateEmployeeTable();
    updatePagination();

    // Show notification
    notificationCount++;
    document.getElementById("notificationCount").textContent =
      notificationCount;

    // Show success notification
    showNotification("Employee updated successfully!");

    // Close the edit form
    closeEditForm();
  } else {
    showNotification("Error: Employee not found.");
  }
}

// Update employee table after edit
function updateEmployeeTable() {
  const employeeTable = document.getElementById("employeeTable");
  employeeTable.innerHTML = "";

  const paginatedEmployees = getPaginatedEmployees(currentPage);
  paginatedEmployees.forEach((emp) => addEmployeeToTable(emp));
}

// Close the Edit Employee Form
function closeEditForm() {
  document.getElementById("editEmployeeForm").style.display = "none";
}

// Delete Employee
function deleteEmployee(empID) {
  const employeeIndex = employees.findIndex((emp) => emp.id === empID);
  if (employeeIndex !== -1) {
    // Remove from employee array
    employees.splice(employeeIndex, 1);

    // Save updated employees to localStorage
    localStorage.setItem("employees", JSON.stringify(employees));

    // Update the employee table
    updateEmployeeTable();

    // Show notification
    notificationCount++;
    document.getElementById("notificationCount").textContent =
      notificationCount;

    // Show success notification
    showNotification("Employee deleted successfully!");
  }
}

// Function to show notification message
function showNotification(message) {
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.textContent = message;

  // Append the notification to the body
  document.body.appendChild(notification);

  // Remove the notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Pagination handling
function changePage(direction) {
  if (direction === "next") {
    if (currentPage * employeesPerPage < employees.length) {
      currentPage++;
    }
  } else if (direction === "prev") {
    if (currentPage > 1) {
      currentPage--;
    }
  }
  updateEmployeeTable();
  document.getElementById("pageNumber").textContent = `Page ${currentPage}`;
}

// Update pagination display
function updatePagination() {
  const totalPages = Math.ceil(employees.length / employeesPerPage);
  document.getElementById("totalPages").textContent = `of ${totalPages}`;
  document.getElementById("pageNumber").textContent = `Page ${currentPage}`;
}

// Get paginated employees
function getPaginatedEmployees(page) {
  const start = (page - 1) * employeesPerPage;
  const end = page * employeesPerPage;
  return employees.slice(start, end);
}

// Initial table population
updateEmployeeTable();
updatePagination();
