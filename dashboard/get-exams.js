document.addEventListener('DOMContentLoaded', () => {
    let fetchUrl = ''; // Initialize the URL variable

    // Check if the user is a coordinator or not
    if (isCoordinator === 1) {
        fetchUrl = 'get-exams.php';  // Coordinator fetches exams data
    } else {
        fetchUrl = 'get-invigilator-exams.php';  // Non-coordinator fetches invigilator exams data
    }

    // Fetch exam data and render table
    fetch(fetchUrl)
    .then(response => response.json())
    .then(data => {
        // console.log(data);
        examsData = data;  // Store data for later use in filtering

        // Sort by date and start time initially
        data.sort((a, b) => {
            let dateComparison = new Date(a.date) - new Date(b.date);
            if (dateComparison === 0) {
                let timeA = new Date(`1970-01-01T${a.starttime}`);
                let timeB = new Date(`1970-01-01T${b.starttime}`);
                return timeA - timeB;
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
            if (isCoordinator){
                tr.innerHTML = `<td>
                                <button class="operation-buttons" onclick="setSessionAndRedirect('${row.title}', '${row.date}', '${row.starttime}', '${row.idexamsession}', '../seating-map/seating-map-1.php')">
                                    ${row.title}
                                </button>
                            </td>
                            <td>${row.date}</td>
                            <td>${row.starttime}</td>
                            <td>
                                <button class="operation-buttons" onclick="setSessionAndRedirect('${row.title}', '${row.date}', '${row.starttime}', '${row.idexamsession}', '../seating-map/seating-map-1.php')">
                                    <img src="../img/edit-icon.png">
                                </button>
                                <button class="operation-buttons" onclick="setSessionAndRedirect('${row.title}', '${row.date}', '${row.starttime}', '${row.idexamsession}', '../seating-map/print/seating-map-1.php')"><img src="../img/print-icon.png"></button>
                                <button class="operation-buttons" data-id="${row.idexamsession}" data-action="archive"><img src="../img/archive-icon.png"></button>
                                <button class="operation-buttons" data-id="${row.idexamsession}" data-action="delete-exam"><img src="../img/trash-icon.png"></button>
                            </td>`;
            } else {
                tr.innerHTML = `<td>
                                    <button class="operation-buttons" onclick="setSessionAndRedirect('${row.title}', '${row.date}', '${row.starttime}', '${row.idexamsession}', '../seating-map/seating-map-1.php')">
                                        ${row.title}
                                    </button>
                                </td>
                                <td>${row.date}</td>
                                <td>${row.starttime}</td>
                                <td>
                                    <button class="operation-buttons" onclick="setSessionAndRedirect('${row.title}', '${row.date}', '${row.starttime}', '${row.idexamsession}', '../seating-map/seating-map-1.php')">
                                        <img src="../img/view-icon.png">
                                    </button>
                                </td>`;
            }
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
