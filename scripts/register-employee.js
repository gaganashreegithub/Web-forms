import {
  saveEmployeeData,
  makeElement,
  getElement,
  getOneEmployeeData,
  getTimeDiff,
  editOneEmployee,
  getEmployeeData,
} from "../index.js";

const COUNTRY_STATES = {
  India: [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttarakhand",
    "Uttar Pradesh",
    "West Bengal",
  ],
  USA: [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ],
};

const validationPatterns = {
  employeeName: /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/,
  employeePhone: /[]/,
  employeeEmailAddress: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
};

let registrationForm = getElement("#employeeRegistrationForm");
let registrationSaveBtn = getElement("#employeeRegistrationSaveBtn");

// Adding states to select options dynamically -------------
let countryDropdown = getElement("select#employeeCountry");
let stateDpropdown = getElement("#employeeState");

let employeePhone = getElement("#employeePhone");

// A method to append option element to select element
let appendOptionElement = (attribute, value, innterText) => {
  let option = makeElement("option");
  option.setAttribute(attribute, value);
  option.innerText = innterText || value;
  stateDpropdown.append(option);
};

//

function populateStateOptions(country) {
  let states = COUNTRY_STATES[country] || [];

  if (country === "India") {
    validationPatterns.employeePhone =
      /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/;
  } else {
    validationPatterns.employeePhone = /\(?\d{3}\)?-? *\d{3}-? *-?\d{4}/;
  }
  let phonePattren =
    country === "India"
      ? validationPatterns.indianPhoneNumber
      : validationPatterns.USAPhone;

  employeePhone.setAttribute("pattern", phonePattren);
  //   clearing previous options
  stateDpropdown.innerHTML = "";

  appendOptionElement("selected", true, "Choose the State");

  states.forEach((state) => {
    appendOptionElement("value", state);
  });
}

// registering on change listener to add states based on selected country
countryDropdown.addEventListener("change", (event) => {
  // let country = event.target.value;
  populateStateOptions(event.target.value);
});

// --------------------------------------------------------------------------

let isEditMode = false;
let id = null;
let employeeDetails = null;
const url = new URL(window.location.href);

// check if there are any params 
if (url.searchParams.size) {
  //  get params data from URL
  isEditMode = url.searchParams.get("edit") === "true";
  id = Number.parseInt( url.searchParams.get("id"));

  employeeDetails = getOneEmployeeData(id);

  let diff = getTimeDiff(employeeDetails?.lastModified);

  // preloading employee details to form
  if (diff < 6) {
    Object.entries(employeeDetails).forEach(([name, value]) => {
      let element =
        getElement(`input[name=${name}]`) || getElement(`select[name=${name}]`);

      if (element) {
        if (element.type !== "radio") {
          element.value = value;
          if (element.name === "employeeCountry") {
            populateStateOptions(element.value);
          }
        }
        if (element.type === "radio") {
          document.querySelectorAll("input[type=radio]").forEach((ele) => {
            if (ele.value === value) {
              ele.checked = true;
            }
          });
        }
      }
    });
  }
}


let checkUniqueControls = [
  "employeeID",
  "employeeEmailAddress",
  "employeePhone",
];

function checkFormValidity(event) {
  let formValues = {};
  let invalidElements = {};
  let isInvalid = false;

  // looping all the form controls 
  if (event instanceof Event) {
    for (let ele of event.target) {
      // get only form controls elements like input and select 
      if (ele instanceof HTMLInputElement || ele instanceof HTMLSelectElement) {
      let name = ele.name;
      let pattren = validationPatterns[name] || null;
      let pattrenValidation = pattren ? pattren.test(ele.value) : true;

      // check if value entered is valid or not 
      let isValid =
        (pattrenValidation && ele.value !== "" && ele.value !== " ") ||
        ele?.checked;

        if (isValid) {
          // if radio button then assign value if it's checked only
          if (ele.type === "radio" && ele.checked) {
            formValues[name] = ele.value;
          }

          if (ele.type !== "radio") {
            formValues[name] = ele.value;
          }

          ele.classList.remove("is-invalid");
          invalidElements[name] = null;
    

        } else {
          ele.classList.add("is-invalid");
          invalidElements[name] = ele;
        }

        // check if employee id, email, phone is already exists and throw error
        if (checkUniqueControls.includes(name)) {
          let isExists = getOneEmployeeData(ele.value, name);
          if (!!isExists && employeeDetails?.[name]!==ele.value) {
            ele.classList.add("not-unique");
            invalidElements[name] = ele;
           
          } else {
            ele.classList.remove("not-unique");
            if (!invalidElements[name]) {
              invalidElements[name] = null;
            }

          }
        }
      }
    }
    // Scrolling into error form element
    for (const key in invalidElements) {
      let element = invalidElements[key];
      if (element) {
        let elementRect = element?.getBoundingClientRect();
        window.scrollTo(elementRect.x, elementRect.y + 100);
        break;
      }
    }
  }


  if ( Object.values(invalidElements).some((val) => val)) {
    return null;
  }
  return formValues;
}

// function toasterMessage(message) {
//   const toast = getElement(".toast");
//   const toastBody = getElement(".toast .toast-body");
//   toastBody.innerText = message;
//   toast.classList.add("show");
//   setTimeout(() => {
//     toast.classList.remove("show");
//     window.location.reload();
//   }, 3000);
// }


// listening to form submit event
registrationForm.addEventListener("submit", (event) => {

  event.preventDefault();
  let data = checkFormValidity(event);
  if (data) {
    if (isEditMode) {
      editOneEmployee({ ...employeeDetails, ...data });
      // toasterMessage("Employee data has been edited successfully");
      alert("Employee data has been edited successfully");
    } else {
      data.id = getEmployeeData()?.length + 1;
      data.lastModified = new Date();
      saveEmployeeData(data);
      alert("Employee data has been saved successfully");
      // toasterMessage("Employee data has been saved successfully");
    }
    window.location.reload()
  }
});






