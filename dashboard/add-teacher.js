document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementsByClassName("teacher-modal")[0];
    var btn = document.getElementsByClassName("add")[0];
    var span = document.getElementsByClassName("close")[0];

    var modalTitle = document.querySelector(".modal-h2");
    var submitButton = document.querySelector(".submit-teacher");

    document.addEventListener('click', function(event) {
        if (event.target && event.target.dataset.action === 'edit-teacher') {
            modalTitle.innerText = "Edit Teacher";  // Change modal title
            submitButton.innerText = "Save Changes";  // Change button text
        }
    });

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

    document.getElementById('new-teacher-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            firstname: document.getElementById('new-teacher-firstname').value,
            lastname: document.getElementById('new-teacher-lastname').value,
            email: document.getElementById('new-teacher-email').value,
            password: document.getElementById('new-teacher-password').value,
            coordinator: document.getElementById('new-teacher-coordinator').checked ? 1 : 0 // This line checks the state of the checkbox
        };        

        console.log('Coordinator checked:', document.getElementById('new-teacher-coordinator').checked);

        fetch('add-teacher.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Teacher added successfully!');
                modal.style.display = "none";  // Close the modal on success
                location.reload();  // Reload the page to reflect the new teacher
            } else {
                alert('Failed to add teacher: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
