document.querySelector('#data-table').addEventListener('click', function(e) {
    const button = e.target.closest('.operation-buttons');
    if (button) {
        let examSessionId = button.getAttribute('data-id');
        let action = button.getAttribute('data-action');

        if (action === 'archive' || action === 'unarchive') {
            let confirmationMessage = action === 'archive' 
                ? 'Are you sure you want to archive this session?' 
                : 'Are you sure you want to unarchive this session?';

            if (confirm(confirmationMessage)) {
                let endpoint = action === 'archive' ? 'archive.php' : 'unarchive.php';
                
                fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ idexamsession: examSessionId })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        location.reload();
                    } else {
                        alert(`Failed to ${action} the session.`);
                    }
                })
                .catch(error => console.error('Error:', error));
            }
        }
    }
});
