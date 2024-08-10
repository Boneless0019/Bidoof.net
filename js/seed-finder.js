document.addEventListener("DOMContentLoaded", function() {
    const starCountSelect = document.getElementById('starCount');
    const gameVersionSelect = document.getElementById('gameVersion');
    const mapSelect = document.getElementById('mapSelection');
    const shinyStatusSelect = document.getElementById('shinyStatus');
    const tableBody = document.getElementById('tableBody');

    let seedsData = []; // Placeholder for fetched data

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
            fetchAndDisplayData();
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

        const filePath = `https://raw.githubusercontent.com/Boneless0019/Bidoof.net/main/data/${starCount}/${gameVersion}/${map}.json`;

        fetch(filePath)
            .then(response => response.json())
            .then(data => {
                seedsData = data.seeds || [];
                displayFilteredData();
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function displayFilteredData() {
        tableBody.innerHTML = '';
        const shinyStatus = shinyStatusSelect.value;

        const filteredData = seedsData.filter(seed => {
            return shinyStatus === "" || seed.shiny === (shinyStatus === "yes" ? "Yes" : "No");
        });

        filteredData.forEach(seed => {
            const row = document.createElement('tr');
            const rewardsList = seed.rewards.map(r => `${r.count}x ${r.name}`).join(', ');

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
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard: ' + text);
        }).catch(err => {
            console.error('Error in copying text: ', err);
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

        tableBody.innerHTML = '';
    }

    // Initialize the page with disabled dropdowns and empty table
    resetFilters();
});
