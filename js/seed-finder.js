document.addEventListener("DOMContentLoaded", function () {
  const starCountSelect = document.getElementById("starCount");
  const gameVersionSelect = document.getElementById("gameVersion");
  const mapSelect = document.getElementById("mapSelection");
  const shinyStatusSelect = document.getElementById("shinyStatus");
  const tableBody = document.getElementById("tableBody");

  let db;
  let seedsData = []; // Placeholder for fetched data

  // Open or create the IndexedDB
  const request = indexedDB.open("BonelessPizzaPlanetDB", 1);

  request.onerror = function (event) {
    console.error("IndexedDB error:", event.target.errorCode);
  };

  request.onsuccess = function (event) {
    db = event.target.result;
  };

  request.onupgradeneeded = function (event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains("seeds")) {
      db.createObjectStore("seeds", { keyPath: "id", autoIncrement: true });
    }
  };

  function storeDataInIndexedDB(data, key) {
    const transaction = db.transaction(["seeds"], "readwrite");
    const objectStore = transaction.objectStore("seeds");

    const dataToStore = {
      key: key,
      data: data,
      timestamp: new Date().getTime(),
    };

    objectStore.add(dataToStore);

    transaction.oncomplete = function () {
      console.log("Data stored in IndexedDB successfully.");
    };

    transaction.onerror = function (event) {
      console.error("Error storing data in IndexedDB:", event.target.errorCode);
    };
  }

  function fetchDataFromIndexedDB(key, callback) {
    const transaction = db.transaction(["seeds"]);
    const objectStore = transaction.objectStore("seeds");
    const index = objectStore.index("key");
    const request = index.get(key);

    request.onsuccess = function (event) {
      callback(event.target.result ? event.target.result.data : null);
    };

    request.onerror = function (event) {
      console.error(
        "Error fetching data from IndexedDB:",
        event.target.errorCode,
      );
      callback(null);
    };
  }

  function filterByStarCount() {
    if (starCountSelect.value) {
      gameVersionSelect.disabled = false;
    } else {
      resetFilters();
    }
  }

  function filterByGameVersion() {
    if (gameVersionSelect.value) {
      mapSelect.disabled = false;
    } else {
      mapSelect.disabled = true;
      shinyStatusSelect.disabled = true;
    }
  }

  function filterByMap() {
    if (mapSelect.value) {
      shinyStatusSelect.disabled = false;
      fetchAndDisplayData(); // Fetch data based on the selected filters
    } else {
      shinyStatusSelect.disabled = true;
    }
  }

  function filterByShinyStatus() {
    if (shinyStatusSelect.value) {
      displayFilteredData();
    }
  }

  function fetchAndDisplayData() {
    const starCount = starCountSelect.value;
    const gameVersion = gameVersionSelect.value.toLowerCase();
    const map = mapSelect.value;

    const key = `${starCount}_${gameVersion}_${map}`;
    const filePath = `https://raw.githubusercontent.com/Boneless0019/Bidoof.net/main/data/${starCount}/${gameVersion}/${map}.json`;

    fetchDataFromIndexedDB(key, function (cachedData) {
      if (cachedData) {
        seedsData = cachedData;
        displayFilteredData();
      } else {
        fetch(filePath)
          .then((response) => response.json())
          .then((data) => {
            seedsData = data.seeds || [];
            storeDataInIndexedDB(seedsData, key);
            displayFilteredData();
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            tableBody.innerHTML =
              '<tr><td colspan="6">Error fetching data</td></tr>';
          });
      }
    });
  }

  function displayFilteredData() {
    tableBody.innerHTML = "";
    const shinyStatus = shinyStatusSelect.value;

    const filteredData = seedsData.filter((seed) => {
      return (
        shinyStatus === "" ||
        seed.shiny === (shinyStatus === "yes" ? "Yes" : "No")
      );
    });

    if (filteredData.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6">No results found</td></tr>';
      return;
    }

    filteredData.forEach((seed) => {
      const row = document.createElement("tr");
      const rewardsList = seed.rewards
        .map((r) => `${r.count}x ${r.name}`)
        .join(", ");

      row.innerHTML = `
                <td>${rewardsList}</td>
                <td>${seed.species}</td>
                <td>${seed.tera_type}</td>
                <td>${seed.seed}</td>
                <td>${seed.gender}</td>
                <td><button onclick="copyToClipboard('${seed.seed}')">Copy</button></td>
            `;
      tableBody.appendChild(row);
    });
  }

  function copyToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard: " + text);
      })
      .catch((err) => {
        console.error("Error in copying text: ", err);
      });
  }

  function resetFilters() {
    starCountSelect.selectedIndex = 0;
    gameVersionSelect.selectedIndex = 0;
    mapSelect.selectedIndex = 0;
    shinyStatusSelect.selectedIndex = 0;

    gameVersionSelect.disabled = true;
    mapSelect.disabled = true;
    shinyStatusSelect.disabled = true;

    tableBody.innerHTML = "";
  }

  // Initialize the page with disabled dropdowns and empty table
  resetFilters();
});
