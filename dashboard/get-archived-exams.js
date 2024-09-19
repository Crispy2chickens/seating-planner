document.addEventListener('DOMContentLoaded', () => {
    let examsData = [];  // Store the fetched exam data here

    // Fetch exam data and render table
    fetch('get-archived-exams.php')
    .then(response => response.json())
    .then(data => {
        examsData = data;  // Store data for later use in filtering

        // Sort by date and start time initially
        data.sort((a, b) => {
            let dateComparison = new Date(b.date) - new Date(a.date);
            if (dateComparison === 0) {
                let timeA = new Date(`1970-01-01T${a.starttime}`);
                let timeB = new Date(`1970-01-01T${b.starttime}`);
                return timeB - timeA;
            }
            return dateComparison;
        });

        renderTable(data);  // Initial table rendering

        // Search bar input listener
        document.querySelector('.search-bar').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();  // Convert to lowercase for case-insensitive search
            const filteredData = examsData.filter(exam => exam.title.toLowerCase().includes(searchTerm));

            renderTable(filteredData);  // Re-render the table with filtered data
        });
    })
    .catch(error => console.error('Error:', error));

    // Function to render table rows
    function renderTable(data) {
        let tableBody = document.querySelector("#data-table tbody");
        tableBody.innerHTML = '';  // Clear existing table rows

        // Insert rows dynamically based on the provided data
        data.forEach(row => {
            let tr = document.createElement('tr');
            tr.innerHTML = `<td>${row.title}</td>
                            <td>${row.date}</td>
                            <td>${row.starttime}</td>
                            <td>
                                <button class="operation-buttons unarchive-btn" data-id="${row.idexamsession}" data-action="unarchive"><img src="../img/unarchive-icon.svg"></button>
                                <button class="operation-buttons"><img src="../img/trash-icon.png"></button>
                            </td>`;
            tableBody.appendChild(tr);
        });

        // Dispatch tableUpdated event after rendering table rows
        document.dispatchEvent(new Event('tableUpdated'));
    }

    // Event listener for 'tableUpdated' to ensure table has at least 10 rows
    document.addEventListener('tableUpdated', () => {
        let tableBody = document.querySelector("#data-table tbody");
        let currentRowCount = tableBody.rows.length;

        // Add empty rows if the table has fewer than 10 rows
        if (currentRowCount < 10) {
            for (let i = currentRowCount; i < 9; i++) {
                let tr = document.createElement('tr');
                tr.innerHTML = `<td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>`;
                tableBody.appendChild(tr);
            }
        }
    });
});