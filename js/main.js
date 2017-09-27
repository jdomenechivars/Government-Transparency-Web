var myVar;

function myFunction() {
  myVar = setTimeout(showPage, 3000);
}

function showPage() {
  $('#loading').hide();
};

var athousepage = "/house-starter-page.html";
var atsenatepage = "/senate-starter-page.html";

var DataUrl = getUrl();

$.getJSON(DataUrl, function (data) {

  fillTable(data);


});

function getUrl() {

  var dataHouse = "https://nytimes-ubiqum.herokuapp.com/congress/113/house";

  var dataSenate = "https://nytimes-ubiqum.herokuapp.com/congress/113/senate";

  var atHousePageLoyalty = "house-party-loyalty-starter-page.html";

  if (window.location.pathname == athousepage) {

    return dataHouse;

  } else {

    return dataSenate;

  }

}

function fillTable(data) {

  var table = document.getElementById("table-data");

  table.innerHTML = "";

  tableHeads(table);
  tableRows(table, data);

  document.getElementById("Rep").addEventListener("click", function () {
    fillTable(data);
  });

  document.getElementById("Dem").addEventListener("click", function () {
    fillTable(data);
  });

  document.getElementById("Ind").addEventListener("click", function () {
    fillTable(data);
  });

  document.getElementById("state-filter").addEventListener("change", function () {
    fillTable(data);
  });



}

function tableHeads(table) {

  var THead = document.createElement("thead");
  var TRow = document.createElement("tr");

  var HeadsArray = ["Senator", "Party Affillication", "State", "Years in Office", "% Votes With Party"]

  for (var c = 0; c < HeadsArray.length; c++) {

    var RowH = document.createElement("th");

    RowH.innerHTML = (HeadsArray[c]);
    TRow.appendChild(RowH);
    THead.appendChild(TRow);
    table.appendChild(THead);
  }

}

function tableRows(table, data) {

  var member = data.results[0].members;

  var statesArray = [];

  var TBody = document.createElement("tbody");

  for (var i = 0; i < member.length; i++) {

    var miembro = member[i];

    if (getFilter(miembro) && filterStates(miembro)) {


      var row = document.createElement("tr");

      createCells(row, miembro);
      TBody.appendChild(row);
      table.appendChild(TBody);

    }

    obtainStates(miembro, statesArray);

  }

  printStates(statesArray);
  enableTable();

  $("a.ventanita").colorbox({
    iframe: true,
    width: "80%",
    height: "80%"
  });

}

function createCells(row, miembro) {

  var cellFields = ["first_name", "party", "state", "seniority", "votes_with_party_pct"]

  for (j = 0; j < cellFields.length; j++) {

    var cell = document.createElement("td")

    putCellContent(cell, miembro, cellFields)
    row.appendChild(cell);
  }

}

function putCellContent(cell, miembro, cellFields) {

  var myObj = miembro[cellFields[j]];

  if (cellFields[j] == "first_name") {

    cell.appendChild(obtainName(cell, miembro));

  } else if (cellFields[j] == "votes_with_party_pct") {

    cell.innerHTML = myObj + "%";


  } else {

    cell.innerHTML = myObj;

  }

}

function obtainName(cell, miembro) {

  var completeName = "";

  var completeName = document.createElement("a");

  var senatorUrl = miembro.url;

  var namesArray = ["first_name", "middle_name", "last_name"]

  for (h = 0; h < namesArray.length; h++) {

    var var1 = miembro[namesArray[0]];
    var var2 = miembro[namesArray[1]];
    var var3 = miembro[namesArray[2]];



    if (var2 == null) {

      var fullName = var3 + ", " + var1

    } else {

      var fullName = var3 + ", " + var1 + " " + var2;
    }
  }


  completeName.innerHTML = fullName;

  completeName.setAttribute("class", "ventanita");

  completeName.setAttribute("href", senatorUrl);

  return completeName;


}

function getFilter(miembro) {

  var partyArray = [];

  var Republican = document.getElementById("Rep").checked;


  var Democratic = document.getElementById("Dem").checked;


  var Independent = document.getElementById("Ind").checked;


  if (Republican) {

    partyArray.push("R");

  }

  if (Democratic) {

    partyArray.push("D");

  }

  if (Independent) {

    partyArray.push("I");

  }

  if (!Republican && !Democratic && !Independent) {

    partyArray.push("R");
    partyArray.push("D");
    partyArray.push("I");

  }

  if (partyArray.indexOf(miembro.party) != -1) {

    return true;

  } else {

    return false;

  }

}

function filterStates(miembro) {

  var stateValue = document.getElementById("state-filter").value;

  if (stateValue == miembro.state || stateValue == "All") {

    return true;

  } else {

    return false;

  }

}

function obtainStates(miembro, statesArray) {

  if (statesArray.indexOf(miembro.state) == -1) {

    statesArray.push(miembro.state);

  }

}

function printStates(statesArray) {

  var statesArray = statesArray.sort();

  var donwnfilter = document.getElementById("state-filter");

  for (var t = 0; t < statesArray.length; t++) {

    var options = document.createElement("option");

    options.innerHTML = statesArray[t];
    donwnfilter.appendChild(options);

  }

}

function enableTable() {
  $('#table-data').dataTable();
}
