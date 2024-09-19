document.addEventListener('DOMContentLoaded', () => {
    // Event delegation for archive button
    document.querySelector('#data-table').addEventListener('click', function(e) {
        // Check if the clicked element is an archive button
        const archiveButton = e.target.closest('.archive-btn');
        if (archiveButton) {
            let examSessionId = archiveButton.getAttribute('data-id');
            
            if (confirm('Are you sure you want to archive this session?')) {
                fetch('archive.php', {
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
                        alert('Failed to archive the session.');
                    }
                })
                .catch(error => console.error('Error:', error));
            }
        } else {
            console.log('No archive button clicked');
        }
    });
});
