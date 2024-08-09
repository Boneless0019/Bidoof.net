document.addEventListener("DOMContentLoaded", function() {
    const gameSelect = document.getElementById('game');
    const rewardSelect = document.getElementById('rewardFilter');
    const pokemonSelect = document.getElementById('pokemonFilter');
    const teraSelect = document.getElementById('teraFilter');
    const genderSelect = document.getElementById('genderFilter');
    const shinySelect = document.getElementById('shinyFilter');
    const botPrefixSelect = document.getElementById('botPrefix');
    const tableBody = document.getElementById('tableBody');
    const loading = document.getElementById('loading');

    let seedsData = [];
    let currentPage = 1;
    const rowsPerPage = 10;

    function fetchJsonData() {
        const game = gameSelect.value;
        const baseUrl = 'https://raw.githubusercontent.com/Boneless0019/Bidoof.net/main/data/';
        const filePath = `${baseUrl}${game.split('-')[0].toLowerCase()}/${game.split('-')[1] ? game.split('-')[1].toLowerCase() : game.toLowerCase()}.json`;
        
        loading.style.display = 'block';

        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                seedsData = data.seeds || [];
                populateDropdowns();
                displayRewards();
                loading.style.display = 'none';
            })
            .catch(error => {
                console.error('Error fetching the JSON data:', error);
                loading.style.display = 'none';
            });
    }

    function populateDropdowns() {
        const pokemonSet = new Set();
        const rewardsSet = new Set();
        const teraSet = new Set();

        seedsData.forEach(seed => {
            pokemonSet.add(seed.species);
            seed.rewards.forEach(reward => rewardsSet.add(reward.name));
            teraSet.add(seed.tera_type);
        });

        populateSelect(pokemonSelect, pokemonSet);
        populateSelect(rewardSelect, rewardsSet);
        populateSelect(teraSelect, teraSet);
    }

    function populateSelect(selectElement, dataSet) {
        selectElement.innerHTML = '<option value="all">All</option>';
        dataSet.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            selectElement.appendChild(option);
        });
        selectElement.disabled = false;
    }

    function displayRewards() {
        tableBody.innerHTML = '';
        const filteredSeeds = filterSeeds();

        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const seedsToShow = filteredSeeds.slice(startIndex, endIndex);

        seedsToShow.forEach(seed => {
            const row = document.createElement('tr');
            const rewardsList = seed.rewards.map(r => `${r.count}x ${r.name}`).join(', ');

            row.innerHTML = `
                <td>${rewardsList}</td>
                <td>${seed.species}</td>
                <td>${seed.tera_type}</td>
                <td>${seed.seed}</td>
                <td>${seed.gender}</td>
                <td><button onclick="copyToClipboard('${botPrefixSelect.value} ${seed.seed}')">Copy</button></td>
            `;
            tableBody.appendChild(row);
        });

        if (filteredSeeds.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6">No results found</td></tr>';
        }

        updatePagination(filteredSeeds.length);
    }

    function filterSeeds() {
        const rewardFilter = rewardSelect.value;
        const pokemonFilter = pokemonSelect.value;
        const teraFilter = teraSelect.value;
        const genderFilter = genderSelect.value;
        const shinyFilter = shinySelect.value;

        return seedsData.filter(seed => {
            const rewardMatches = rewardFilter === 'all' || seed.rewards.some(r => r.name === rewardFilter);
            const pokemonMatches = pokemonFilter === 'all' || seed.species === pokemonFilter;
            const teraMatches = teraFilter === 'all' || seed.tera_type === teraFilter;
            const genderMatches = genderFilter === 'all' || seed.gender === genderFilter;
            const shinyMatches = shinyFilter === 'all' || (shinyFilter === 'yes' && seed.shiny === 'Yes') || (shinyFilter === 'no' && seed.shiny !== 'Yes');

            return rewardMatches && pokemonMatches && teraMatches && genderMatches && shinyMatches;
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
        gameSelect.selectedIndex = 0;
        rewardSelect.selectedIndex = 0;
        pokemonSelect.selectedIndex = 0;
        teraSelect.selectedIndex = 0;
        genderSelect.selectedIndex = 0;
        shinySelect.selectedIndex = 0;
        botPrefixSelect.selectedIndex = 0;
        displayRewards();
    }

    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / rowsPerPage);
        const pageInfo = document.getElementById('pageInfo');
        const prevPageButton = document.getElementById('prevPage');
        const nextPageButton = document.getElementById('nextPage');

        pageInfo.textContent = `${currentPage} / ${totalPages}`;
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages;
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            displayRewards();
        }
    }

    function nextPage() {
        const totalItems = filterSeeds().length;
        const totalPages = Math.ceil(totalItems / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayRewards();
        }
    }

    // Initialize the page
    fetchJsonData();
});
