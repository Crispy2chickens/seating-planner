document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementsByClassName("teacher-modal")[0];
    var btn = document.getElementsByClassName("add")[0];
    var span = document.getElementsByClassName("close")[0];

    var modalTitle = document.querySelector(".modal-h2");
    var submitButton = document.querySelector(".submit-new-teacher");
    var emailFieldContainer = document.querySelector('#new-teacher-email').parentNode; 

    let currentAction = '';  

    document.addEventListener('click', function(e) {
        const button = e.target.closest('.operation-buttons');
        const addButton = e.target.closest('.add');

        if (button) {
            let action = button.getAttribute('data-action');

            if (action === 'edit-teacher') {
                const teacherId = button.getAttribute('data-id'); // Get ID from button
                document.getElementById('teacher-id').value = teacherId; // Set ID in the hidden input

                modalTitle.innerText = "Edit Teacher";
                submitButton.innerText = "Save Changes";
                
                emailFieldContainer.style.display = "none"; 
                document.getElementById('new-teacher-email').removeAttribute('required');

                currentAction = 'edit-teacher';  
                submitButton.style.width = "22%";
                modal.style.display = "block"; 
            }
        }

        if (addButton) {
            document.getElementById('teacher-id').value = '';

            modalTitle.innerText = "Add New Teacher";
            submitButton.innerText = "Add Teacher";

            emailFieldContainer.style.display = "block"; 
            document.getElementById('new-teacher-email').setAttribute('required', 'required');

            currentAction = 'add-teacher';  
            submitButton.style.width = "20%";
            modal.style.display = "block";  
        }
    });  

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
            id: document.getElementById('teacher-id').value,
            firstname: document.getElementById('new-teacher-firstname').value,
            lastname: document.getElementById('new-teacher-lastname').value,
            email: document.getElementById('new-teacher-email').value,
            password: document.getElementById('new-teacher-password').value,
            coordinator: document.getElementById('new-teacher-coordinator').checked ? 1 : 0
        };        

        console.log(formData);

        fetch(currentAction === 'edit-teacher' ? 'edit-teacher.php' : 'add-teacher.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Teacher ' + (currentAction === 'edit-teacher' ? 'updated' : 'added') + ' successfully!');
                modal.style.display = "none";  // Close the modal on success
                location.reload();  // Reload the page to reflect the new teacher
            } else {
                alert('Failed to process request: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
