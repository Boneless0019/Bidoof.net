document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.getElementById('tableBody');

    function displayPlaceholderData() {
        const placeholderData = [
            { rewards: "3x Exp. Candy M", pokemon: "Pikachu", tera: "Electric", seed: "00001ABC", gender: "Male", action: "Copy" },
            { rewards: "2x Pearl", pokemon: "Charmander", tera: "Fire", seed: "00002DEF", gender: "Female", action: "Copy" },
            { rewards: "5x Bottle Cap", pokemon: "Bulbasaur", tera: "Grass", seed: "00003GHI", gender: "Genderless", action: "Copy" }
        ];

        placeholderData.forEach(data => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.rewards}</td>
                <td>${data.pokemon}</td>
                <td>${data.tera}</td>
                <td>${data.seed}</td>
                <td>${data.gender}</td>
                <td><button onclick="copyToClipboard('${data.seed}')">${data.action}</button></td>
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

    // Placeholder data display
    displayPlaceholderData();

    // Reset Filters
    document.getElementById('resetFilters').addEventListener('click', function() {
        document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
        // Reload placeholder data (or could clear table if actual filtering was implemented)
        tableBody.innerHTML = '';
        displayPlaceholderData();
    });
});
