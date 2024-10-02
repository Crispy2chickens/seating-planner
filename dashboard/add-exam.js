document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementsByClassName("exam-modal")[0];
    var btn = document.getElementsByClassName("add")[0];
    var span = document.getElementsByClassName("close")[0];

    btn.onclick = function() {
        modal.style.display = "block";
    };

    span.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Form submission handler
    document.getElementById('new-exam-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            title: document.getElementById('new-exam-title').value,
            date: document.getElementById('new-exam-date').value,
            starttime: document.getElementById('new-exam-startingtime').value + ":00"
        };

        fetch('add-exam-session.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Exam session added successfully!');
                modal.style.display = "none";  // Close the modal on success
                location.reload();  // Reload the page to reflect new exam session
            } else {
                alert('Failed to add exam session.');
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
