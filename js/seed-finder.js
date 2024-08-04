document.addEventListener("DOMContentLoaded", function() {
    const versionSelect = document.getElementById('version-select');
    const starSelect = document.getElementById('star-select');
    const mapSelect = document.getElementById('map-select');
    const pokemonSelect = document.getElementById('pokemon-select');
    const rewardSelect = document.getElementById('reward-select');
    const resultsBody = document.getElementById('results-body');
    const prefixSelect = document.getElementById('prefix-select');

    versionSelect.addEventListener('change', displayStars);
    starSelect.addEventListener('change', displayMaps);
    mapSelect.addEventListener('change', displayPokemon);
    pokemonSelect.addEventListener('change', displayRewards);
    rewardSelect.addEventListener('change', displaySeeds);

    function navigateToHomePage() {
        window.location.href = 'index.html';
    }

    function displayStars() {
        starSelect.innerHTML = '<option value="">Select Star Count</option>';
        mapSelect.innerHTML = '<option value="">Select Map</option>';
        pokemonSelect.innerHTML = '<option value="">Select Pokémon</option>';
        rewardSelect.innerHTML = '<option value="">Select Reward</option>';
        resultsBody.innerHTML = '';

        const stars = ['1_star', '2_star', '3_star', '4_star', '5_star', '6_star'];
        stars.forEach(star => {
            const option = document.createElement('option');
            option.value = star;
            option.textContent = star.replace('_', ' ');
            starSelect.appendChild(option);
        });
    }

    function displayMaps() {
        mapSelect.innerHTML = '<option value="">Select Map</option>';
        pokemonSelect.innerHTML = '<option value="">Select Pokémon</option>';
        rewardSelect.innerHTML = '<option value="">Select Reward</option>';
        resultsBody.innerHTML = '';

        const maps = ['paldea', 'kitakami', 'blueberry'];
        maps.forEach(map => {
            const option = document.createElement('option');
            option.value = map;
            option.textContent = map.charAt(0).toUpperCase() + map.slice(1);
            mapSelect.appendChild(option);
        });
    }

    function displayPokemon() {
        pokemonSelect.innerHTML = '<option value="">Select Pokémon</option>';
        rewardSelect.innerHTML = '<option value="">Select Reward</option>';
        resultsBody.innerHTML = '';

        const version = versionSelect.value;
        const star = starSelect.value;
        const map = mapSelect.value;

        if (!version || !star || !map) return;

        fetch(`data/${star}/${version}/${map}.json`)
            .then(response => response.json())
            .then(data => {
                const species = [...new Set(data.seeds.map(seed => seed.species))];
                species.forEach(pokemon => {
                    const option = document.createElement('option');
                    option.value = pokemon;
                    option.textContent = pokemon;
                    pokemonSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching the seeds:', error));
    }

    function displayRewards() {
        rewardSelect.innerHTML = '<option value="">Select Reward</option>';
        resultsBody.innerHTML = '';

        const version = versionSelect.value;
        const star = starSelect.value;
        const map = mapSelect.value;
        const species = pokemonSelect.value;

        if (!version || !star || !map || !species) return;

        fetch(`data/${star}/${version}/${map}.json`)
            .then(response => response.json())
            .then(data => {
                const rewards = [...new Set(data.seeds.flatMap(seed => seed.rewards.map(reward => reward.name)))];
                rewards.forEach(reward => {
                    const option = document.createElement('option');
                    option.value = reward;
                    option.textContent = reward;
                    rewardSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching the seeds:', error));
    }

    function displaySeeds() {
        resultsBody.innerHTML = '';

        const version = versionSelect.value;
        const star = starSelect.value;
        const map = mapSelect.value;
        const species = pokemonSelect.value;
        const reward = rewardSelect.value;

        if (!version || !star || !map || !species || !reward) return;

        fetch(`data/${star}/${version}/${map}.json`)
            .then(response => response.json())
            .then(data => {
                const filteredSeeds = data.seeds.filter(seed => seed.species === species && seed.rewards.some(r => r.name === reward));
                showSeeds(filteredSeeds, data.meta.stars);
            })
            .catch(error => console.error('Error fetching the seeds:', error));
    }

    function showSeeds(seeds, stars) {
        seeds.forEach(seed => {
            const row = document.createElement('tr');

            const rewardsCell = document.createElement('td');
            rewardsCell.innerHTML = seed.rewards.map(reward => `${reward.count}x ${reward.name}`).join('<br>');
            row.appendChild(rewardsCell);

            const pokemonCell = document.createElement('td');
            pokemonCell.textContent = seed.species;
            row.appendChild(pokemonCell);

            const teraCell = document.createElement('td');
            teraCell.textContent = seed.tera_type;
            row.appendChild(teraCell);

            const seedCell = document.createElement('td');
            seedCell.textContent = seed.seed;
            row.appendChild(seedCell);

            const genderCell = document.createElement('td');
            genderCell.textContent = seed.gender;
            row.appendChild(genderCell);

            const actionsCell = document.createElement('td');
            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy';
            copyButton.onclick = () => {
                const prefix = prefixSelect.value;
                const raidCommand = `${prefix}ra ${seed.seed} ${stars} <storyprogress>`;
                navigator.clipboard.writeText(raidCommand).then(() => {
                    alert(`Copied to clipboard: ${raidCommand}`);
                }, (err) => {
                    console.error('Failed to copy text: ', err);
                });
            };
            actionsCell.appendChild(copyButton);
            row.appendChild(actionsCell);

            resultsBody.appendChild(row);
        });
    }

    window.navigateToHomePage = navigateToHomePage; // Ensure the function is globally accessible
});
