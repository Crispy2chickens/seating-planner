document.addEventListener('DOMContentLoaded', () => {
    let teacherData = [];  // Store the fetched exam data here

    // Fetch exam data and render table
    fetch('get-teachers.php')
    .then(response => response.json())
    .then(data => {
        teacherData = data;  // Store data for later use in filtering

        renderTable(data);  // Initial table rendering

        // Search bar input listener
        document.querySelector('.search-bar').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();  // Convert to lowercase for case-insensitive search

            const filteredData = teacherData.filter(teacher => 
                `${teacher.firstname} ${teacher.lastname}`.toLowerCase().includes(searchTerm)
            );

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
            tr.innerHTML = `<td>${row.firstname} ${row.lastname}</td>
                            <td>${row.email}</td>
                            <td>
                                <button class="operation-buttons edit-btn"><img src="../img/edit-icon.png"></button>
                                <button class="operation-buttons trash-btn"><img src="../img/trash-icon.png"></button>
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
        if (currentRowCount < 9) {
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
