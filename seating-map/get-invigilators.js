fetch('get-invigilators.php')
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
                
                const attendanceLabel = document.createElement('label');
                attendanceLabel.textContent = 'Attendance: ';
                
                const attendanceCheckbox = document.createElement('input');
                attendanceCheckbox.type = 'checkbox';
                attendanceCheckbox.checked = (user.attendance === 1); // Default to "Present" if attendance is marked

                // Create a container for the user and append it to the user list
                userDiv.appendChild(userInfo);
                userDiv.appendChild(attendanceLabel);
                userDiv.appendChild(attendanceCheckbox);
                userListDiv.appendChild(userDiv);
            });
        } else {
            console.error("Error:", data.message);
        }
    })
    .catch(error => console.error("Fetch error:", error));
