document.addEventListener('DOMContentLoaded', function() {
    var addButton = document.getElementById('add-invigilators');
    var modal = document.getElementById('add-invigilators-modal');
    var closeButton = modal.querySelector('.close');
    var invigilatorSelect = document.getElementById('idusers');
    var form = document.getElementById('add-invigilators-form');

    var idvenue = document.getElementById('idvenue').value;
    
    // When the "Add Invigilators" button is clicked, show the modal
    addButton.addEventListener('click', function() {
        modal.style.display = 'block';
        
        // Fetch invigilators list and populate the select dropdown
        fetch(`get-invigilators-list.php?idvenue=${idvenue}`) // This PHP file should return the list of invigilators
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    invigilatorSelect.innerHTML = ''; // Clear existing options
                    data.data.forEach(function(invigilator) {
                        var option = document.createElement('option');
                        option.value = invigilator.idusers;
                        option.textContent = `${invigilator.firstname} ${invigilator.lastname}`;
                        invigilatorSelect.appendChild(option);
                    });
                } else {
                    alert('Error loading invigilators');
                }
            })
            .catch(error => console.error('Error fetching invigilators:', error));
    });

    // Close the modal when the close button is clicked
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close the modal if the user clicks outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle form submission to add invigilator
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const idusers = document.getElementById('idusers').value;
        const idexamsession = document.getElementById('idexamsession').value;
        const idvenue = document.getElementById('idvenue').value;

        fetch('add-invigilator.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idusers: idusers, idexamsession: idexamsession, idvenue: idvenue })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Invigilator added successfully!');
                modal.style.display = 'none'; // Close the modal
                window.location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error adding invigilator:', error));
    });
});
