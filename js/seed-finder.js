document.addEventListener("DOMContentLoaded", function() {
    const versionSelect = document.getElementById('version-select');
    const starSelect = document.getElementById('star-select');
    const mapSelect = document.getElementById('map-select');
    const pokemonFilterInput = document.getElementById('pokemon-filter');
    const rewardFilterInput = document.getElementById('reward-filter');
    const resultsBody = document.getElementById('results-body');
    const prefixSelect = document.getElementById('prefix-select');

    let seedsData = [];

    versionSelect.addEventListener('change', displayStars);
    starSelect.addEventListener('change', displayMaps);
    mapSelect.addEventListener('change', fetchSeeds);
    pokemonFilterInput.addEventListener('input', displaySeeds);
    rewardFilterInput.addEventListener('input', displaySeeds);

    function displayStars() {
        starSelect.innerHTML = '<option value="">Select Star Count</option>';
        mapSelect.innerHTML = '<option value="">Select Map</option>';
        pokemonFilterInput.value = '';
        rewardFilterInput.value = '';
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
        pokemonFilterInput.value = '';
        rewardFilterInput.value = '';
        resultsBody.innerHTML = '';

        const maps = ['paldea', 'kitakami', 'blueberry'];
        maps.forEach(map => {
            const option = document.createElement('option');
            option.value = map;
            option.textContent = map.charAt(0).toUpperCase() + map.slice(1);
            mapSelect.appendChild(option);
        });
    }

    function fetchSeeds() {
        const version = versionSelect.value;
        const star = starSelect.value;
        const map = mapSelect.value;

        if (!version || !star || !map) return;

        const filePath = `data/${star}/${version}/${map}.json`;

        fetch(filePath)
            .then(response => response.json())
            .then(data => {
                seedsData = data.seeds;
                displaySeeds();
            })
            .catch(error => console.error('Error fetching the seeds:', error));
    }

    function displaySeeds() {
        resultsBody.innerHTML = '';

        const pokemonFilter = pokemonFilterInput.value.toLowerCase();
        const rewardFilter = rewardFilterInput.value.toLowerCase();

        const filteredSeeds = seedsData.filter(seed => {
            const matchesPokemon = !pokemonFilter || seed.species.toLowerCase().includes(pokemonFilter);
            const matchesReward = !rewardFilter || seed.rewards.some(reward => reward.name.toLowerCase().includes(rewardFilter));
            return matchesPokemon && matchesReward;
        });

        showSeeds(filteredSeeds);
    }

    function showSeeds(seeds) {
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
                const raidCommand = `${prefix}ra ${seed.seed} ${seed.meta.stars} <storyprogress>`;
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

    window.navigateToHomePage = function() {
        window.location.href = 'index.html';
    }
});
