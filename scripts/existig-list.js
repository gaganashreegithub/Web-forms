import {
  getEmployeeData,
  saveEmployeeData,
  makeElement,
  getElement,
  getTimeDiff,
} from "../index.js";

const tableBody = getElement("tbody#existingTableBody");

    setInterval(() => {
      document.querySelectorAll(".date-modified").forEach((el) => {
        let date = el.getAttribute("data-date-modified");
        el.innerHTML = dateTransform(date);
      });
    }, 60000);

function dateTransform(modifiedDate) {
  let modifiedD = new Date(modifiedDate);
  let diff = Math.round(getTimeDiff(modifiedDate) * 60);


  if (diff <= 0) {
    return "Just Now";
  }

  if (diff > 0 && diff < 60) {
    return `${diff} min ago`;
  }
  console.log(diff);
  if (diff >= 60 && diff <= 1440) {
    return `${ Math.round(diff/60) } hr ago`;
  }

  return `${modifiedD.getMonth()}/${modifiedD.getDate()}/${modifiedD.getFullYear()}`;
}

// return a table row with existing single data populated
function makeTabelRow(rowData) {
    let tr = makeElement('tr')

        if (rowData) {
            let timeDiff = getTimeDiff(rowData.lastModified);

            // rendreing edit button dynamically if modified time is less tahn 6 hours
            let editButton =
              timeDiff <= 6
                ? `
        <td class='action'>
            <a class="btn btn-sm btn-outline-primary" 
                href="/pages/registration-form.html?id=${rowData.id}&edit=true"> 
                Edit
            </a>
        </td>`
                : " <td class='action'></td>";
          let innerHtml = `
                <td>${rowData.employeeName}</td>
                <td>${rowData.employeeID}</td>
                <td>${rowData.employeeEmailAddress}</td>
                <td>${rowData.employeePhone}</td>
                <td>${rowData.employeeCountry}</td>
                <td>${rowData.employeeState}</td>
                <td>${rowData.isWheelChairSupportNeeded}</td>
                <td class='date-modified' data-date-modified=${
                  rowData.lastModified
                }>${dateTransform(rowData.lastModified)}</td>
                ${editButton}
            `;

          tr.innerHTML = innerHtml;
        }else{
             tr.innerHTML = "<td class='text-center' colspan='9'> No Data Found</td>";
        }
        return tr;
    
}


let employeeData = getEmployeeData()
if (employeeData&& employeeData.length) {
    tableBody.innerHTML = '';
    employeeData.forEach((employee)=>{
        tableBody.append(makeTabelRow(employee));
    })
}else{
    tableBody.append(makeTabelRow());
}

