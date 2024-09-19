document.addEventListener('DOMContentLoaded', () => {
    fetch('get-archived-exams.php')
    .then(response => response.json())
    .then(data => {
        data.sort((a, b) => {
            let dateComparison = new Date(b.date) - new Date(a.date);
        
            if (dateComparison === 0) {
                let timeA = new Date(`1970-01-01T${a.starttime}`);
                let timeB = new Date(`1970-01-01T${b.starttime}`);
                return timeB - timeA;
            }
            
            return dateComparison;
        });

        let tableBody = document.querySelector("#data-table tbody");
        
        data.forEach(row => {
            let tr = document.createElement('tr');
            tr.innerHTML = `<td>${row.title}</td>
                            <td>${row.date}</td>
                            <td>${row.starttime}</td>
                            <td>
                                <button class="operation-buttons"><img src="../img/unarchive-icon.svg"></button>
                                <button class="operation-buttons"><img src="../img/trash-icon.png"></button>
                            </td>`;
            tableBody.insertBefore(tr, tableBody.firstChild);

            console.log(tr.querySelector('.operation-buttons'));
        });
        
        // Notify that the table has been updated
        document.dispatchEvent(new Event('tableUpdated'));
    })
    .catch(error => console.error('Error:', error));
});
