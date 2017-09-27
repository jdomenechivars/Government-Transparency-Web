var myVar;

function myFunction() {
    myVar = setTimeout(showPage, 3000);
}

function showPage() {
     $('#loading').hide();
  };

var athousepage = "/house-attendance-starter-page.html";
var atsenatepage = "/senate-attendance-starter-page.html";

var DataUrl = getUrl();

$.getJSON(DataUrl, function (data) {

  takeTable(data);

});

function getUrl() {

  var dataHouse = "https://nytimes-ubiqum.herokuapp.com/congress/113/house";

  var dataSenate = "https://nytimes-ubiqum.herokuapp.com/congress/113/senate";

  var atHousePageLoyalty = "house-party-loyalty-starter-page.html";

  if (window.location.pathname == athousepage || window.location.pathname == atHousePageLoyalty) {

    return dataHouse;

  } else {

    return dataSenate;

  }

}

function takeTable(data) {

  var glanceTable = document.getElementById("glanceTable");
  var leastTable = document.getElementById("leastTable");
  var mostTable = document.getElementById("mostTable");

  var allTables = [glanceTable, leastTable, mostTable];

  for (i = 0; i < allTables.length; i++) {

    var eachTable = allTables[i];

    fillTable(eachTable, data);

  }

}

function fillTable(tableIndicated, data) {

  var table = tableIndicated;

  tableHeads(table);

  tableRows(table, data);

  if (table == glanceTable) {

    tableTotals(table);

  }


}

function tableHeads(table) {
  var THead = document.createElement("thead");
  var TRow = document.createElement("tr");

  var heads = "";

  if (table == glanceTable) {

    heads = Object.keys(statistics.glance[0]);

  } else if (table == leastTable || table == mostTable) {

    if (window.location.pathname == athousepage || window.location.pathname == atsenatepage) {

      heads = Object.keys(statistics["least/most Engaged"])

    } else {

      heads = Object.keys(statistics["least/most Loyal"])

    }

  }

  for (var c = 0; c < heads.length; c++) {

    var RowH = document.createElement("th");

    RowH.innerHTML = heads[c];
    TRow.appendChild(RowH);
    THead.appendChild(TRow);
    table.appendChild(THead);
  }

}

function tableRows(table, data) {
  var TBody = document.createElement("tbody");
  var totalRows = "";

  if (table == glanceTable) {

    totalRows = statistics.glance;

  } else if (table == leastTable || table == mostTable || table == leastLoyal || table == mostLoyal) {

    var listEngageds = [];

    getEngaged(listEngageds, table, data);

    totalRows = listEngageds

  }

  for (var i = 0; i < totalRows.length; i++) {

    var everyMember = totalRows[i];

    var row = document.createElement("tr");

    createCells(table, row, everyMember, data);
    TBody.appendChild(row);

    table.appendChild(TBody);
  }

  enableTable(table);


}

function createCells(table, row, everyMember, data) {

  var content = "";

  if (table == glanceTable) {

    getMembersData(data);

    content = Object.values(everyMember);

  } else if (table == leastTable || table == mostTable) {

    content = Object.keys(statistics["least/most Engaged"]);

  }

  for (j = 0; j < content.length; j++) {

    var cell = document.createElement("td")

    if (table == glanceTable) {

      cell.innerHTML = content[j];
      row.appendChild(cell);

    } else if (table == leastTable || table == mostTable) {

      if (j == 0) {

        cell.appendChild(obtainName(everyMember));

      } else if (j == 1) {

        if (window.location.pathname == athousepage || window.location.pathname == atsenatepage) {

          cell.innerHTML = everyMember.missed_votes;

        } else {

          cell.innerHTML = everyMember.total_votes;

        }

      } else {

        if (window.location.pathname == athousepage || window.location.pathname == atsenatepage) {

          cell.innerHTML = everyMember.missed_votes_pct + "%";

        } else {

          cell.innerHTML = everyMember.votes_with_party_pct + "%";

        }

      }

    }

    row.appendChild(cell);

  }

}

function getMembersData(data) {

  var democrats = [];
  var republicans = [];
  var independents = [];

  var member = data.results[0].members;

  for (var i = 0; i < member.length; i++) {

    var miembro = member[i];

    if (miembro.party == "D") {

      democrats.push(miembro);

    } else if (miembro.party == "R") {

      republicans.push(miembro);

    } else {

      independents.push(miembro);
    }

  }

  var totalDemocrats = democrats.length;
  var totalRepublicans = republicans.length;
  var totalIndependents = independents.length;

  statistics.glance[0]["Number of Reps"] = totalDemocrats;
  statistics.glance[1]["Number of Reps"] = totalRepublicans;
  statistics.glance[2]["Number of Reps"] = totalIndependents;

  var percDem = getPercentatge(democrats);
  var percRep = getPercentatge(republicans);
  var percInd = getPercentatge(independents);

  statistics.glance[0]["% Voted with Party"] = percDem + "%";
  statistics.glance[1]["% Voted with Party"] = percRep + "%";
  statistics.glance[2]["% Voted with Party"] = percInd + "%";

}

function getPercentatge(membersByParty) {

  var totalVotes = 0;

  for (var i = 0; i < membersByParty.length; i++) {

    var eachMember = membersByParty[i];

    totalVotes = totalVotes + parseFloat(eachMember.votes_with_party_pct);

  }

  var percentatge = Math.round((totalVotes / membersByParty.length) * 100) / 100;

  return percentatge;

}

function obtainName(everyMember) {

  var completeName = "";

  var completeName = document.createElement("a");

  var senatorUrl = everyMember.url;

  var namesArray = ["first_name", "middle_name", "last_name"]

  for (h = 0; h < namesArray.length; h++) {

    var var1 = everyMember[namesArray[0]];
    var var2 = everyMember[namesArray[1]];
    var var3 = everyMember[namesArray[2]];

    if (var2 == null) {

      var fullName = var3 + ", " + var1

    } else {

      var fullName = var3 + ", " + var1 + " " + var2;
    }

  }

  completeName.innerHTML = fullName;

  completeName.setAttribute("href", senatorUrl)

  return completeName;

}

function getEngaged(listEngageds, table, data) {

  var member = data.results[0].members

  if (table == leastTable) {

    member.sort(compare);

    member.reverse();

  } else if (table == mostTable) {

    member.sort(compare);

  }

  //  for (var i = 0;
  //    (listEngageds.length < (member.length * 0.1)); i++) {
  //
  //    var miembro = member[i];
  //
  //    if (miembro.total_votes == member[i + 1].total_votes) {
  //
  //      listEngageds.push(miembro);
  //
  //    }
  //
  //  }

  for (var i = 0; i < member.length; i++) {


    if (window.location.pathname == athousepage || window.location.pathname == atsenatepage) {

      if (i <= member.length * 0.1) {

        listEngageds.push(member[i]);

      } else {

        if (member[i].missed_votes == member[i + 1].missed_votes) {

          listEngageds.push(member[i + 1]);

        } else {

          break;

        }

      }

    } else {

      if (i <= member.length * 0.1) {

        listEngageds.push(member[i]);

      } else {

        if (member[i].votes_with_party_pct == member[i + 1].votes_with_party_pct) {

          listEngageds.push(member[i + 1]);

        } else {

          break;

        }

      }

    }

  }

}

function compare(a, b) {

  if (window.location.pathname == athousepage || window.location.pathname == atsenatepage) {

    if (parseFloat(a.missed_votes) < parseFloat(b.missed_votes))
      return -1;
    if (parseFloat(a.missed_votes) > parseFloat(b.missed_votes))
      return 1;
    return 0;

  } else {

    if (parseFloat(a.votes_with_party_pct) < parseFloat(b.votes_with_party_pct))
      return -1;
    if (parseFloat(a.votes_with_party_pct) > parseFloat(b.votes_with_party_pct))
      return 1;
    return 0;

  }

}

function tableTotals(table) {

  var rowTotal = document.createElement("tfoot");

  var cellTot = document.createElement("td");

  cellTot.innerHTML = "Total";
  rowTotal.appendChild(cellTot);

  var totals = Object.keys(statistics.glance[0]);

  // Estamos cogiendo los valores de los porcentajes una vez actualizados y pasandolos a números para poder sumarlos y que nos de el total. con el substring le eliminamos el %.
  var percent1 = statistics.glance[0]["% Voted with Party"];
  var percent11 = parseFloat(percent1.substring(0, percent1.length - 1));

  var percent2 = statistics.glance[1]["% Voted with Party"];
  var percent22 = parseFloat(percent2.substring(0, percent2.length - 1));

  var percent3 = statistics.glance[2]["% Voted with Party"]
  var percent33 = parseFloat(percent3.substring(0, percent3.length - 1));

  var totalmembers = statistics.glance[0]["Number of Reps"] + statistics.glance[1]["Number of Reps"] + statistics.glance[2]["Number of Reps"];

  var totalVotesPercent = percent11 + percent22 + percent33;

  for (var c = 0; c < totals.length - 1; c++) {

    var totalCell = document.createElement("td")

    if (c == 0) {

      totalCell.innerHTML = totalmembers;

    } else {

      totalCell.innerHTML = Math.round(((totalVotesPercent) / 3) * 100) / 100 + "%";

    }

    rowTotal.appendChild(totalCell);
    table.appendChild(rowTotal);

  }

}

function enableTable(table){
    $(table).dataTable();
}
