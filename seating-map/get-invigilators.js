fetch('get-invigilators.php')
    .then(response => response.json())
    .then(data => {
        const userList = document.getElementById('user-list');

        if (data.status === 'success') {
            const users = data.data;

            users.forEach(user => {
                // Create the HTML elements for each user
                const userDiv = document.createElement('div');

                const nameP = document.createElement('p');
                nameP.textContent = `${user.firstname} ${user.lastname}`;
                userDiv.appendChild(nameP);

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = Boolean(user.attendance);
                checkbox.dataset.iduser = user.idusers;

                checkbox.addEventListener('change', function() {
                    const attendance = this.checked;

                    // Make an AJAX request to update the attendance in the database
                    fetch('update_invigilation.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                idusers: user.idusers,
                                attendance
                            })
                        })
                        .then(response => response.json())
                        .then(updateData => {
                            if (updateData.status === 'success') {
                                console.log(`Attendance updated for user ${user.idusers}`);
                            } else {
                                console.error(`Error updating attendance: ${updateData.message}`);
                            }
                        })
                        .catch(error => console.error('Error:', error));
                });

                userDiv.appendChild(checkbox);
                userList.appendChild(userDiv);
            });
        } else {
            // Handle error if the PHP response was unsuccessful
            userList.innerHTML = `<p>Error: ${data.message}</p>`;
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        document.getElementById('user-list').innerHTML = `<p>Failed to load user data.</p>`;
    });