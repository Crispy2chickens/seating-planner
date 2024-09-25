document.querySelector('#data-table').addEventListener('click', function(e) {
    const button = e.target.closest('.operation-buttons');
    if (button) {
        // Get ID and action
        let id = button.getAttribute('data-id');
        let action = button.getAttribute('data-action');

        // Handle the delete actions
        if (action === 'delete-exam') {
            let confirmationMessage = 'Are you sure you want to delete this session?';

            if (confirm(confirmationMessage)) {
                let endpoint = 'delete-examsession.php';  // PHP script to handle deletion of the exam session
                
                // Send the DELETE request for exam session
                fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ idexamsession: id })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        location.reload();  // Reload page after successful deletion
                    } else {
                        alert('Failed to delete the session.');
                    }
                })
                .catch(error => console.error('Error:', error));
            }
        } else if (action === 'delete-teacher') {
            let confirmationMessage = 'Are you sure you want to delete this teacher?';

            if (confirm(confirmationMessage)) {
                let endpoint = 'delete-teacher.php';  // PHP script to handle deletion of the teacher
                
                // Send the DELETE request for the teacher
                fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ idusers: id })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        location.reload();  // Reload page after successful deletion
                    } else {
                        alert('Failed to delete the teacher.');
                    }
                })
                .catch(error => console.error('Error:', error));
            }
        }
    }
});
