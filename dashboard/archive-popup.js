function confirmArchive() {
    document.getElementById('confirmArchivePopup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closePopup() {
    document.getElementById('confirmArchivePopup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function archiveItem() {
    const itemId = 1;

    fetch('archive.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: itemId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Item archived successfully!');
            currentItemId = null;
            location.reload(true);
        } else {
            alert('Failed to archive item.');
        }
        closePopup();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred.');
        closePopup();
    });
}
