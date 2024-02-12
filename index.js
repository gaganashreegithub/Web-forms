// Defining Header Dynamically ---------------------------------------

const navBar = `
<nav class="nav  bg-dark p-2">
  <a class="nav-link nav-brand" aria-current="page" href="/index.html">
    Salesforce Employees
  </a>
</nav>
`;

const header = document.createElement("header");
header.innerHTML = navBar;
document.body.prepend(header);
// ---------------------------------------------------------------------

const storageKeyName = "employee";

export function getElement(querry) {
  return document.querySelector(querry);
}

export function makeElement(elementName) {
  return document.createElement(elementName);
}

export function getEmployeeData() {
  let data = JSON.parse(localStorage.getItem(storageKeyName));
  return data || [];
}

export function saveEmployeeData(data) {
  let existingData = getEmployeeData()
  if (data) {
    existingData.push(data)
    localStorage.setItem(storageKeyName, JSON.stringify(existingData));
  }
}


export function getOneEmployeeData(value, key = "id") {
  let employee = getEmployeeData();
  if (employee.length) {
    return employee.find((employee) => employee[key] === value);
  }
  return null;
}

export function getTimeDiff(date) {
  let diff =
    new Date().getTime() - new Date(date).getTime();
  return diff / 60 / 60 / 1000;
}

export function editOneEmployee(employeDetails) {
  let id = employeDetails.id
  let allEmployees = getEmployeeData()
  let index = allEmployees.findIndex((emp)=>emp.id === id)
  if (index>=0) {
    allEmployees[index] = employeDetails
  }
  localStorage.setItem(storageKeyName, JSON.stringify(allEmployees));
}