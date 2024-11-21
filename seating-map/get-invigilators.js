// Get the value of idvenue (assuming it's already set in the page, such as from a hidden input)
var idvenue = document.getElementById('idvenue').value;

fetch(`get-invigilators.php?idvenue=${idvenue}`)
    .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.text(); // Use text() to check raw output first
    })
    .then(text => {
        console.log("Raw response text:", text); // Check raw output in console
        const data = text ? JSON.parse(text) : {}; // Parse if not empty
        if (data.status === 'success') {
            console.log("Data received:", data.data);
            const userListDiv = document.getElementById('user-list');
            userListDiv.innerHTML = ''; // Clear any previous content

            // Iterate over each invigilator data and create HTML for each one
            data.data.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.classList.add('user-container'); // Add a class for styling if needed
                
                const userInfo = document.createElement('p');
                userInfo.textContent = `${user.firstname} ${user.lastname}`;
                
                const attendanceCheckbox = document.createElement('input');
                attendanceCheckbox.type = 'checkbox';
                attendanceCheckbox.checked = (user.attendance === 1); // Default to "Present" if attendance is marked

                attendanceCheckbox.addEventListener('change', () => {
                    const attendanceStatus = attendanceCheckbox.checked ? 1 : 0;
                    updateAttendance(user.staffinvigilationid, attendanceStatus); // Use user.staffinvigilationid here
                });

                // Create a container for the user and append it to the user list
                userDiv.appendChild(userInfo);
                userDiv.appendChild(attendanceCheckbox);
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
