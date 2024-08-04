document.addEventListener("DOMContentLoaded", function() {
    const folderContainer = document.getElementById('folder-container');
    const subfolderContainer = document.getElementById('subfolder-container');
    const fileContainer = document.getElementById('file-container');
    const seedContainer = document.getElementById('seed-container');

    const stars = ['1_star', '2_star', '3_star', '4_star', '5_star', '6_star'];
    const versions = ['scarlet', 'violet'];
    const files = ['paldea.json', 'kitakami.json', 'blueberry.json'];

    stars.forEach(star => {
        const starButton = document.createElement('button');
        starButton.textContent = star;
        starButton.onclick = () => {
            displayVersions(star);
        };
        folderContainer.appendChild(starButton);
    });

    function displayVersions(star) {
        subfolderContainer.innerHTML = '';
        fileContainer.innerHTML = '';
        seedContainer.innerHTML = '';

        versions.forEach(version => {
            const versionButton = document.createElement('button');
            versionButton.textContent = version;
            versionButton.onclick = () => {
                displayFiles(star, version);
            };
            subfolderContainer.appendChild(versionButton);
        });
    }

    function displayFiles(star, version) {
        fileContainer.innerHTML = '';
        seedContainer.innerHTML = '';

        files.forEach(file => {
            const fileButton = document.createElement('button');
            fileButton.textContent = file;
            fileButton.onclick = () => {
                fetchSeeds(`data/${star}/${version}/${file}`);
            };
            fileContainer.appendChild(fileButton);
        });
    }

    function fetchSeeds(filePath) {
        fetch(filePath)
            .then(response => response.json())
            .then(data => displaySeeds(data.seeds))
            .catch(error => console.error('Error fetching the seeds:', error));
    }

    function displaySeeds(seeds) {
        seedContainer.innerHTML = '';
        seeds.forEach(seed => {
            const seedCard = document.createElement('div');
            seedCard.className = 'seed-card';

            const seedName = document.createElement('h2');
            seedName.textContent = seed.species;
            seedCard.appendChild(seedName);

            const ability = document.createElement('p');
            ability.textContent = `Ability: ${seed.ability}`;
            seedCard.appendChild(ability);

            const nature = document.createElement('p');
            nature.textContent = `Nature: ${seed.nature}`;
            seedCard.appendChild(nature);

            const teraType = document.createElement('p');
            teraType.textContent = `Tera Type: ${seed.tera_type}`;
            seedCard.appendChild(teraType);

            const shiny = document.createElement('p');
            shiny.textContent = `Shiny: ${seed.shiny}`;
            seedCard.appendChild(shiny);

            const stats = document.createElement('div');
            stats.className = 'stats';
            stats.innerHTML = `
                <p>HP: ${seed.hp}</p>
                <p>ATK: ${seed.atk}</p>
                <p>DEF: ${seed.def}</p>
                <p>SPA: ${seed.spa}</p>
                <p>SPD: ${seed.spd}</p>
                <p>SPE: ${seed.spe}</p>
            `;
            seedCard.appendChild(stats);

            const rewards = document.createElement('div');
            rewards.className = 'rewards';
            const rewardsTitle = document.createElement('h3');
            rewardsTitle.textContent = 'Rewards:';
            rewards.appendChild(rewardsTitle);

            seed.rewards.forEach(reward => {
                const rewardItem = document.createElement('p');
                rewardItem.textContent = `${reward.count}x ${reward.name}`;
                rewards.appendChild(rewardItem);
            });

            seedCard.appendChild(rewards);
            seedContainer.appendChild(seedCard);
        });
    }
});
