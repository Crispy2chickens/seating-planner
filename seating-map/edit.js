document.addEventListener('DOMContentLoaded', function() {
    var modals = document.querySelectorAll('.edit-section');
    var editIcons = document.querySelectorAll('.edit-icon');
    var closeButtons = document.querySelectorAll('.close');

    editIcons.forEach(function(icon, index) {
        icon.addEventListener('click', function() {
            modals[index].style.display = 'block'; 
        });
    });

    closeButtons.forEach(function(button, index) {
        button.addEventListener('click', function() {
            modals[index].style.display = 'none';  
        });
    });

    window.addEventListener('click', function(event) {
        modals.forEach(function(modal) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    });

    document.getElementById('edit-title-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const newTitle = document.getElementById('edit-title').value;
        const idexamsession = document.getElementById('idexamsession').value;

        fetch('edit-title.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: newTitle, idexamsession: idexamsession })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.querySelector('.exam-title').innerText = newTitle;  // Update title on the page
                modals[0].style.display = 'none';  // Close the title modal
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });

    document.getElementById('edit-date-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const newDate = document.getElementById('edit-date').value;
        const idexamsession = document.getElementById('idexamsession').value; // Get the idexamsession

        fetch('edit-date.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date: newDate, idexamsession: idexamsession }) // Include idexamsession
        })

        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.querySelector('.date-container').innerText = 'Date: ' + newDate;  // Update date on the page
                modals[1].style.display = 'none';  // Close the date modal
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });

    document.getElementById('edit-time-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const newTime = document.getElementById('edit-time').value;
        const idexamsession = document.getElementById('idexamsession').value; // Get the idexamsession

        fetch('edit-time.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ starttime: newTime, idexamsession: idexamsession }) // Include idexamsession
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.querySelector('.start-time').innerText = 'Start Time: ' + newTime;  // Update date on the page
                modals[2].style.display = 'none';  // Close the date modal
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });
});