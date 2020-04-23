const BASE_URL = "https://api.football-data.org/v2/";
const API_KEY = "3cb9a50be7ad4150897a68b1dc8db69b";
const LEAGUE_ID = "2021";
const STANDINGS = `${BASE_URL}competitions/${LEAGUE_ID}/standings`;
const TEAM = `${BASE_URL}teams/`;

var fetchApi = url => {
  return fetch(url, {
    headers: {
      "X-Auth-Token": API_KEY
    }
  });
};

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error :" + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array javascript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-jandle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promis.reject()
  console.log("Error : " + error);
}

function showKlasemen(data) {
  var klasemensHTML = "";
  data.standings[0].table.forEach(standing => {
    klasemensHTML += `
    <tr>
        <td>${standing.position}</td>
        <td class="valign-wrapper"><img src="${
          standing.team.crestUrl
        }" width="20"> &nbsp;&nbsp;&nbsp; 
          <a href="./team.html?id=${standing.team.id}">
            <b>${standing.team.name.substr(0, 3).toUpperCase()}</b>
          </a>
        </td>
        <td>${standing.playedGames}</td>
        <td>${standing.won}</td>
        <td>${standing.draw}</td>
        <td>${standing.lost}</td>
        <td><b>${standing.points}</b></td>
        <td>${standing.goalsFor}</td>
        <td>${standing.goalsAgainst}</td>
        <td>${standing.goalDifference}</td>
    </tr>
    `;
  });
  // Sisipkan komponen ke dalam elemen table dengan id #klasemen
  document.getElementById("klasemen").innerHTML = klasemensHTML;
}

function getKlasemen() {
  if ("caches" in window) {
    caches.match(STANDINGS).then(response => {
      if (response) {
        response.json().then(data => {
          showKlasemen(data);
        });
      }
    });
  }

  fetchApi(STANDINGS)
    .then(status)
    .then(json)
    .then(data => {
      showKlasemen(data);
    })
    .catch(error);
}

function showTeam(data) {
  var bannerTeamHTML = `
  <img src="${data.crestUrl}" width="60"> &nbsp;&nbsp;&nbsp;&nbsp;
  <h4 class="white-text"><b>${data.shortName}<b></h4>
`;

  var overviewTeamHTML = `
    <p class="center-align">
      <b>${data.name}</b>
      <br>
      <small>Address : ${data.address}</small>
      <br>
      <small>Phone : ${data.phone}</small>
    </p>
    <p class="center-align">
      <a href="${data.website}" class="waves-effect waves-light btn" target="_blank"><i
          class="material-icons right">public</i>Website</a>
    </p>
`;

  var playersTeamHTML = "";
  data.squad.forEach(data => {
    if (data.role === "PLAYER") {
      playersTeamHTML += `
        <tr>
          <td>
            <span class="nama">${data.name}</span><br>
            <span class="from">From:</span> <span class="nationality">${data.nationality}</span>
          </td>
          <td><span class="position">${data.position}</span></td>
        </tr>`;
    }
  });

  // Sisipkan komponen banner ke dalam elemen banner-team
  document.getElementById("banner-team").innerHTML = bannerTeamHTML;

  // Sisipkan komponen overview ke dalam elemen overview
  document.getElementById("overview").innerHTML = overviewTeamHTML;

  // Sisipkan komponen players ke dalam elemen kartu-player
  document.getElementById("kartu-player").innerHTML = playersTeamHTML;
}

function getTeam() {
  return new Promise((resolve, reject) => {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParams = urlParams.get("id");

    if ("caches" in window) {
      caches.match(TEAM + idParams).then(response => {
        if (response) {
          response.json().then(data => {
            showTeam(data);
            resolve(data);
          });
        }
      });
    }

    fetchApi(TEAM + idParams)
      .then(status)
      .then(json)
      .then(data => {
        showTeam(data);
        resolve(data);
      });
  });
}

function showMatch(data) {
  var matchHTML = "<p>Upcoming Match</p>";
  data.matches.forEach(match => {
    if (match.competition.name === "Premier League") {
      matchHTML += `
      <div class="card-panel valign-wrapper">
        <div class="col s7">
          <p>${match.homeTeam.name}</p>
          <p>${match.awayTeam.name}</p>
        </div>
        <div class="col s5">
          <p>${convertDate(new Date(match.utcDate))}</p>
        </div>
      </div>
    `;
    }
  });
  // Sisipkan komponen players ke dalam elemen matches
  document.getElementById("matches").innerHTML = matchHTML;
}

function getMatch() {
  // Ambil nilai query parameter (?id=)
  var urlParams = new URLSearchParams(window.location.search);
  var idParams = urlParams.get("id");

  if ("caches" in window) {
    caches
      .match(TEAM + idParams + "/matches?status=SCHEDULED")
      .then(response => {
        if (response) {
          response.json().then(data => {
            showMatch(data);
          });
        }
      });
  }

  fetchApi(TEAM + idParams + "/matches?status=SCHEDULED")
    .then(status)
    .then(json)
    .then(data => {
      showMatch(data);
    });
}

function getSavedFavorite() {
  getAllFavorite().then(teams => {
    var favHTML = `<div class="container"><h6><b>Team Favorite</b></h6></div>`;
    if (teams.length == 0)
      favHTML += `<div class="container">kamu belum punya team favorit<div class="container">`;
    teams.forEach(team => {
      favHTML += `
      <div class="col s6 m6" >
        <div class="card center-align">
          <div class="card-image">
            <img src="${team.crestUrl}" style="padding: 15px; height: 200px;">
          </div>
          <div class="card-content">
            <h5>${team.name}</h5>
          </div>
          <div class="card-action">
            <a onclick="deleteOnClick(${team.id})">Hapus</a>
          </div>
        </div>
      </div>`;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #team-favorite
    document.getElementById("team-favorite").innerHTML = favHTML;
  });
}

var deleteOnClick = idteam => {
  var confir = confirm("Hapus dari team favorite ?");
  if (confir == true) {
    deleteFavorite(idteam);
  }
};
