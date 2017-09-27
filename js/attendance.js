fillGlanceTable();

function fillGlanceTable() {

  var table = document.getElementById("glanceTable");

  table.innerHTML = "";

  tableHeads(table);
  tableRows(table);
  tableTotal(table);

}

function tableHeads(table) {

  var heads = Object.keys(statistics.glance[0]);

  for (var c = 0; c < heads.length; c++) {

    var RowH = document.createElement("th");

    RowH.innerHTML = heads[c];
    table.appendChild(RowH);
  }

}

function tableRows(table) {

  var party = statistics.glance;

  for (var i = 0; i < party.length; i++) {

    var partido = party[i];

    var row = document.createElement("tr");

    createCells(row, partido);
    table.appendChild(row);
  }

}

function createCells(row, partido) {

  getMembersData();

  var content = Object.values(partido);

  for (j = 0; j < content.length; j++) {

    var cell = document.createElement("td")

    cell.innerHTML = content[j];
    row.appendChild(cell);
  }

}

function getMembersData() {

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

function tableTotal(table) {

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

fillLeastTable();

function fillLeastTable() {

  var tableLeast = document.getElementById("leastTable");

  tableLeast.innerHTML = "";

  tableHeads2(tableLeast);
  tableRowsLeast(tableLeast);

}

function tableHeads2(tableLeast) {

  var headsLeast = Object.keys(statistics["least Engaged"]);

  for (var c = 0; c < headsLeast.length; c++) {

    var RowHLeast = document.createElement("th");

    RowHLeast.innerHTML = headsLeast[c];
    tableLeast.appendChild(RowHLeast);
  }

}

function tableRowsLeast(tableLeast) {

  var listLeastEngageds = [];

  getLeastEngaged(listLeastEngageds);


  for (var i = 0; i < listLeastEngageds.length; i++) {

    var leastMember = listLeastEngageds[i];
    var rowLeast = document.createElement("tr");

    createCellsEngaged(rowLeast, leastMember);
    tableLeast.appendChild(rowLeast);
  }

}

function createCellsEngaged(rowLeast, leastMember) {

  var leastEngagedObject = Object.keys(statistics["least Engaged"]);


  for (j = 0; j < leastEngagedObject.length; j++) {

    var cellEngaged = document.createElement("td")

    if (j == 0) {

      cellEngaged.appendChild(obtainName(leastMember));

    } else if (j == 1) {

      cellEngaged.innerHTML = leastMember.missed_votes;

    } else {

      cellEngaged.innerHTML = leastMember.missed_votes_pct+ "%";

    }


    rowLeast.appendChild(cellEngaged);
  }
}

function getLeastEngaged(listLeastEngageds) {

  var member = data.results[0].members

  member.sort(compare);

  member.reverse();

  for (var i = 0; (listLeastEngageds.length < (member.length * 0.1)); i++) {

    var miembro = member[i];

    listLeastEngageds.push(miembro);
  }

}

function compare(a, b) {

  if (parseFloat(a.missed_votes) < parseFloat(b.missed_votes))
    return -1;
  if (parseFloat(a.missed_votes) > parseFloat(b.missed_votes))
    return 1;
  return 0;
}

function obtainName(leastMember) {

  var completeName = "";

  var completeName = document.createElement("a");

  var senatorUrl = leastMember.url;

  var namesArray = ["first_name", "middle_name", "last_name"]

  for (h = 0; h < namesArray.length; h++) {

    var var1 = leastMember[namesArray[0]];
    var var2 = leastMember[namesArray[1]];
    var var3 = leastMember[namesArray[2]];

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

fillMostTable();

function fillMostTable() {

  var tableMost = document.getElementById("mostTable");

  tableMost.innerHTML = "";

  tableHeads3(tableMost);
  tableRowsMost(tableMost);

}

function tableHeads3(tableMost) {

  var headsMost = Object.keys(statistics["most Engaged"]);

  for (var c = 0; c < headsMost.length; c++) {

    var RowHMost = document.createElement("th");

    RowHMost.innerHTML = headsMost[c];
    tableMost.appendChild(RowHMost);
  }

}

function tableRowsMost(tableMost) {

  var listMostEngageds = [];

  getMostEngaged(listMostEngageds);


  for (var i = 0; i < listMostEngageds.length; i++) {

    var mostMember = listMostEngageds[i];
    var rowMost = document.createElement("tr");

    createCellsMost(rowMost, mostMember);
    tableMost.appendChild(rowMost);
  }

}

function createCellsMost(rowMost, mostMember) {

  var mostEngagedObject = Object.keys(statistics["most Engaged"]);


  for (j = 0; j < mostEngagedObject.length; j++) {

    var mostcellEngaged = document.createElement("td")

    if (j == 0) {

      mostcellEngaged.appendChild(obtainName(mostMember));

    } else if (j == 1) {

      mostcellEngaged.innerHTML = mostMember.missed_votes;

    } else {

      mostcellEngaged.innerHTML = mostMember.missed_votes_pct+ "%";

    }


    rowMost.appendChild(mostcellEngaged);
  }
}

function getMostEngaged(listMostEngageds) {

  var memberMost = data.results[0].members

  memberMost.sort(compare);


  for (var i = 0; (listMostEngageds.length < (memberMost.length * 0.1)); i++) {

    var miembroMost = memberMost[i];

    listMostEngageds.push(miembroMost);
  }

}

function compare(a, b) {

  if (parseFloat(a.missed_votes) < parseFloat(b.missed_votes))
    return -1;
  if (parseFloat(a.missed_votes) > parseFloat(b.missed_votes))
    return 1;
  return 0;
}

function obtainName(mostMember) {

  var completeName = "";

  var completeName = document.createElement("a");

  var senatorUrl = mostMember.url;

  var namesArray = ["first_name", "middle_name", "last_name"]

  for (h = 0; h < namesArray.length; h++) {

    var var1 = mostMember[namesArray[0]];
    var var2 = mostMember[namesArray[1]];
    var var3 = mostMember[namesArray[2]];

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

