document.addEventListener('DOMContentLoaded', () => {
    fetch('../get-exams.php')
    .then(response => response.json())
    .then(data => {
        data.sort((a, b) => new Date(b.date) - new Date(a.date));

        let tableBody = document.querySelector("#data-table tbody");
        
        data.forEach(row => {
            let tr = document.createElement('tr');
            tr.innerHTML = `<td>${row.title}</td>
                            <td>${row.date}</td>
                            <td>${row.starttime}</td>
                            <td>
                                <button>Edit</button>
                                <button>Print</button>
                                <button>Archive</button>
                                <button>Delete</button>
                            </td>`;
            tableBody.insertBefore(tr, tableBody.firstChild);
        });
        
        // Notify that the table has been updated
        document.dispatchEvent(new Event('tableUpdated'));
    })
    .catch(error => console.error('Error:', error));
});
