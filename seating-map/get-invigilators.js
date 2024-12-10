// Get the value of idvenue (assuming it's already set in the page, such as from a hidden input)
const idvenue = document.getElementById('idvenue').value;

fetch(`get-invigilators.php?idvenue=${idvenue}`)
    .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.text(); // Use text() to check raw output first
    })
    .then(text => {
        const data = text ? JSON.parse(text) : {}; // Parse if not empty
        if (data.status === 'success') {
            const userListDiv = document.getElementById('user-list');
            userListDiv.innerHTML = ''; // Clear any previous content

            data.data.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.classList.add('user-container'); // Flex container
                
                // Create a sub-container for name and checkbox
                const contentContainer = document.createElement('div');
                contentContainer.classList.add('content-container'); // Flex container for name and checkbox
                
                // Create user info
                const userInfo = document.createElement('p');
                userInfo.textContent = `${user.firstname} ${user.lastname}`;
                
                // Create attendance checkbox
                const attendanceCheckbox = document.createElement('input');
                attendanceCheckbox.type = 'checkbox';
                attendanceCheckbox.checked = (user.attendance === 1);
            
                attendanceCheckbox.addEventListener('change', () => {
                    const attendanceStatus = attendanceCheckbox.checked ? 1 : 0;
                    updateAttendance(user.staffinvigilationid, attendanceStatus);
                });
            
                // Append userInfo and checkbox to contentContainer
                contentContainer.appendChild(userInfo);
                contentContainer.appendChild(attendanceCheckbox);
            
                // Create delete button
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-button'); // Add class for styling
                deleteButton.style.opacity = 0; // Hide by default
                deleteButton.style.width = '20px'; // Fixed width for delete button
                
                // Create and append the trash icon image
                const trashIcon = document.createElement('img');
                trashIcon.src = '../img/trash-icon.png'; // Path to the trash icon image
                trashIcon.alt = 'Delete'; // Alternative text for accessibility
                trashIcon.classList.add('trash-icon'); // Optional: Add a class for styling the image
            
                deleteButton.appendChild(trashIcon);
            
                deleteButton.addEventListener('click', () => {
                    if (confirm(`Are you sure you want to delete ${user.firstname} ${user.lastname}?`)) {
                        deleteInvigilator(user.staffinvigilationid, userDiv);
                    }
                });
            
                // Show/hide the delete button on hover
                userDiv.addEventListener('mouseenter', () => {
                    deleteButton.style.opacity = 1;
                });
                userDiv.addEventListener('mouseleave', () => {
                    deleteButton.style.opacity = 0;
                });
            
                // Append contentContainer and deleteButton to userDiv
                userDiv.appendChild(contentContainer); // Flex container for name and checkbox
                userDiv.appendChild(deleteButton);     // Delete button last
                
                userListDiv.appendChild(userDiv);
            });                             
        } else {
            console.error("Error:", data.message);
        }
    })
    .catch(error => console.error("Fetch error:", error));

function updateAttendance(staffinvigilationid, attendanceStatus) {
    fetch('update-attendance.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            staffinvigilationid: staffinvigilationid,
            attendance: attendanceStatus
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log("Attendance updated successfully");
        } else {
            console.error("Failed to update attendance", data.message);
        }
    })
    .catch(error => console.error("Error updating attendance:", error));
}

function deleteInvigilator(staffinvigilationid, userDiv) {
    console.log(staffinvigilationid, userDiv)

    fetch('delete-invigilator.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            staffinvigilationid: staffinvigilationid
        })        
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log("Invigilator deleted successfully");
            userDiv.remove(); // Remove the user row from DOM
        } else {
            console.error("Failed to delete invigilator", data.message);
        }
    })
    .catch(error => console.error("Error deleting invigilator:", error));
}
