let currentItemId = null;

document.addEventListener('DOMContentLoaded', () => {
    fetch('get-exams.php')
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
                                <button class="operation-buttons"><img src="../img/edit-icon.png"></button>
                                <button class="operation-buttons"><img src="../img/print-icon.png"></button>
                                <button onclick="confirmArchive(${row.idexamsession})" class="operation-buttons"><img src="../img/archive-icon.png"></button>
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

function confirmArchive(itemId) {
    console.log('confirmArchive called with:', itemId); // Log the incoming itemId
    currentItemId = itemId; 
    document.getElementById('confirmPopup').style.display = 'block'; 
    document.getElementById('overlay').style.display = 'block';
}

function closePopup() {
    document.getElementById('confirmPopup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function archiveItem() {
    console.log('Attempting to archive item with ID:', currentItemId); 
    if (currentItemId === null) {
        console.error('No item ID set.'); 
        return; 
    }

    fetch('archive.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: currentItemId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Item archived successfully!');
            currentItemId = null;
            location.reload(true);
        } else {
            alert('Failed to archive item. Error: ' + (data.error || 'Unknown error'));
        }
        closePopup();
    })
    .catch(error => {
        console.error('Error:', error);
        closePopup();
    });
}
