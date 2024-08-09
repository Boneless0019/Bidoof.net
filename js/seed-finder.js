document.addEventListener("DOMContentLoaded", function() {
    const versionSelect = document.getElementById('version-select');
    const starSelect = document.getElementById('star-select');
    const mapSelect = document.getElementById('map-select');
    const pokemonSelect = document.getElementById('pokemon-filter');
    const rewardSelect = document.getElementById('reward-filter');
    const resultsBody = document.getElementById('results-body');

    versionSelect.addEventListener('change', refreshData);
    starSelect.addEventListener('change', refreshData);
    mapSelect.addEventListener('change', fetchSeeds);
    pokemonSelect.addEventListener('change', displaySeeds);
    rewardSelect.addEventListener('change', displaySeeds);

    let seedsData = [];

    function refreshData() {
        if(versionSelect.value && starSelect.value && mapSelect.value) {
            fetchSeeds();
        }
    }

    function fetchSeeds() {
        const version = versionSelect.value;
        const star = starSelect.value;
        const map = mapSelect.value;
        const filePath = `https://raw.githubusercontent.com/yourusername/yourrepository/main/data/${star}/${version}/${map}.json`;

        fetch(filePath)
            .then(response => response.json())
            .then(data => {
                seedsData = data.seeds;
                populateDropdowns();
                displaySeeds();
            })
            .catch(error => {
                console.error('Error fetching the seeds:', error);
                seedsData = [];
                populateDropdowns();
                displaySeeds();
            });
    }

    function populateDropdowns() {
        const pokemonSet = new Set();
        const rewardsSet = new Set();

        seedsData.forEach(seed => {
            pokemonSet.add(seed.species);
            seed.rewards.forEach(reward => rewardsSet.add(reward.name));
        });

        pokemonSelect.innerHTML = '<option value="">Filter Pokémon</option>';
        rewardSelect.innerHTML = '<option value="">Filter Reward</option>';

        pokemonSet.forEach(pokemon => {
            const option = document.createElement('option');
            option.value = pokemon;
            option.textContent = pokemon;
            pokemonSelect.appendChild(option);
        });
        rewardsSet.forEach(reward => {
            const option = document.createElement('option');
            option.value = reward;
            option.textContent = reward;
            rewardSelect.appendChild(option);
        });

        if (!pokemonSet.size) pokemonSelect.add(new Option('No Pokémon found', ''));
        if (!rewardsSet.size) rewardSelect.add(new Option('No rewards found', ''));
    }

    function displaySeeds() {
        resultsBody.innerHTML = '';
        const pokemonFilter = pokemonSelect.value;
        const rewardFilter = rewardSelect.value;

        const filteredSeeds = seedsData.filter(seed => {
            const pokemonMatches = !pokemonFilter || seed.species === pokemonFilter;
            const rewardMatches = !rewardFilter || seed.rewards.some(reward => reward.name === rewardFilter);
            return pokemonMatches && rewardMatches;
        });

        filteredSeeds.forEach(seed => {
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
            resultsBody.appendChild(row);
        });
    }

    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard: ' + text);
        }).catch(err => {
            console.error('Error in copying text: ', err);
        });
    }
});
