const map = document.querySelector('#map');

const isCoordinator = JSON.parse(map.dataset.isCoordinator);

const className = map.className;

let rows, columns;

let selectedSeatNumber = null;

let studentIDs = {};

// Correct the mapping to match CSS grid
if (className === 'map-1') {
    rows = 8;    
    columns = 13; 
} else if (className === 'map-2') {
    rows = 3;     
    columns = 7;  
} else if (className === 'map-3') {
    rows = 1;
    columns = 5;
}

let seatNumber = 1;

for (let row = 0; row < rows; row++) {         // Outer loop: Rows
    for (let col = 0; col < columns; col++) {  // Inner loop: Columns
        createSeat(row, col);
    }
}

function createSeat(row, col) {
    let seatNumber;
    if (col % 2 == 0) {
        seatNumber = col * rows + row + 1;
    } else {
        seatNumber = (col + 1) * rows - (row);
    }

    const seat = document.createElement('div');
    seat.className = 'seat';

    seat.draggable = true;
    seat.id = `${seatNumber}`;

    // seat.textContent = `${seatNumber}`;

    // Always fetch student data, regardless of coordinator status
    fetchStudentData(seat, seatNumber).then(() => {
        // Check if the seat is still only an integer (unassigned seat)
        if (/^\d+$/.test(seat.textContent)) {            
            if (isCoordinator) {
                const plusButton = document.createElement('button');
                plusButton.className = 'plus-btn';
                plusButton.textContent = '+';

                // Position buttons based on class names (map-1, map-2, map-3)
                if (map.classList.contains('map-1')) {
                    plusButton.style.top = 'calc(10% * -1)';
                    plusButton.style.right = 'calc(10% * -1)';
                } else if (map.classList.contains('map-2')) {
                    plusButton.style.top = 'calc(5% * -1)';
                    plusButton.style.right = 'calc(7% * -1)';
                } else if (map.classList.contains('map-3')) {
                    plusButton.style.top = 'calc(2% * -1)';
                    plusButton.style.right = 'calc(5% * -1)';
                }

                const addstudentmodal = document.querySelector('.addstudent-modal');
                const addstudentmodalcontent = document.querySelector('.addstudent-modal-content');

                plusButton.addEventListener('click', function () {
                    plusButton.style.opacity = 0;
                    const seatElement = plusButton.parentElement;
                    selectedSeatNumber = seatElement.id;  

                    // Get the position of the plus button
                    const buttonRect = plusButton.getBoundingClientRect();

                    // Position the modal content based on the button's position
                    addstudentmodalcontent.style.left = `${buttonRect.left}px`;  // Left of the button
                    addstudentmodalcontent.style.top = `${buttonRect.bottom + window.scrollY}px`;  // Bottom of the button + scroll offset
                    
                    // Show the modal (background)
                    addstudentmodal.style.display = 'block'; 
                });

                window.addEventListener('click', function (event) {
                    if (event.target === addstudentmodal) {
                        plusButton.style.opacity = 1;

                        // Reset modal display
                        addstudentmodal.style.display = 'none';
                
                        // Reset buttons
                        addStudentButton.style.display = 'block';
                        addSubjectButton.style.display = 'block';
                
                        // Clear dropdowns and submit buttons
                        const studentDropdown = document.querySelector('#student-dropdown');
                        const submitStudent = document.querySelector('#submit-student');
                        const subjectDropdown = document.querySelector('#subject-dropdown');
                        const submitSubject = document.querySelector('#submit-subject');
                
                        if (studentDropdown) studentDropdown.remove();
                        if (submitStudent) submitStudent.remove();
                        if (subjectDropdown) subjectDropdown.remove();
                        if (submitSubject) submitSubject.remove();
                    }
                });
                
                // Append the buttons after data is fetched
                seat.appendChild(plusButton);
            }
        } else {
            // Assigned seats

            if (isCoordinator) {
                const deletebutton = document.createElement('button');
                deletebutton.className = 'delete-btn';
                deletebutton.textContent = '-';

                if (map.classList.contains('map-1')) {
                    deletebutton.style.top = 'calc(10% * -1)';
                    deletebutton.style.right = 'calc(10% * -1)';
                } else if (map.classList.contains('map-2')) {
                    deletebutton.style.top = 'calc(5% * -1)';
                    deletebutton.style.right = 'calc(7% * -1)';
                } else if (map.classList.contains('map-3')) {
                    deletebutton.style.top = 'calc(2% * -1)';
                    deletebutton.style.right = 'calc(5% * -1)';
                }
    
                deletebutton.addEventListener('click', () => {
                    // Clear the seat's content
                    seat.innerHTML = `${seatNumber}`;
    
                    var examSessionValue = document.getElementById('idexamsession').value;
    
                    // Data to send to the PHP backend
                    const data = {
                        idexamsession: examSessionValue,
                        idvenue: idvenue,
                        seatno: `${seatNumber}`
                    };
    
                    // Send DELETE request to PHP script
                    fetch('delete-seat.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            console.log('Seat deleted successfully.');
                            window.location.reload();
                        } else {
                            console.error('Failed to delete seat:', result.error);
                        }
                    })
                    .catch(error => console.error('Error:', error));
                });
                seat.appendChild(deletebutton);
            }
        }
    }).catch(error => {
        console.error("Error fetching student data:", error);
        seat.textContent = `${seatNumber}`;  // Fallback if fetching fails
    });

    // Append the seat to the map
    map.appendChild(seat);

    // Add drag event listeners
    seat.addEventListener('dragstart', handleDragStart);
    seat.addEventListener('dragend', handleDragEnd);
}

// Handle drag-and-drop events based on the coordinator status
if (isCoordinator) {
    // Add event listeners for the map (drag over and drop)
    map.addEventListener('dragover', handleDragOver);
    map.addEventListener('drop', handleDrop);

    console.log('Drag and drop enabled for coordinators.');
} else {
    console.log('Drag and drop disabled for non-coordinators.');
}

// Function to fetch student data and update seat content
async function fetchStudentData(seat, seatNumber) {
    try {
        const response = await fetch(`get-student-details.php?seatNumber=${seatNumber}`);
        const data = await response.json();

        // Check if student data is returned
        if (data.firstname && data.lastname && data.candidateno) {
            let additionalInfo = '';

            if (data.wordprocessor !== 0) {
                additionalInfo += `<span style="color: red; font-size: 0.7em;">WP</span> <br>`;
            }
            if (data.extratime !== 0) {
                additionalInfo += `<span style="color: red; font-size: 0.7em;">ET: ${data.extratime}</span> <br>`;
            }
            if (data.restbreak !== 0) {
                additionalInfo += `<span style="color: red; font-size: 0.7em;">Rest Break</span> <br>`;
            }

            // Update the seat's text while preserving buttons
            let studentInfo = document.createElement('div');
            studentInfo.innerHTML = `${seatNumber}<br> ${data.firstname} ${data.lastname} <br><span style="font-size: 0.8em;">${data.candidateno}</span><br>${additionalInfo}`;
            
            // Remove any existing student info (optional)
            const existingInfo = seat.querySelector('.student-info');
            if (existingInfo) {
                seat.removeChild(existingInfo);
            }

            studentInfo.className = 'student-info';
            seat.appendChild(studentInfo);

            studentIDs[`${seatNumber}`] = data.idstudents;
        } else {
            // Update with seat number only, preserving buttons
            const existingInfo = seat.querySelector('.student-info');
            if (existingInfo) {
                seat.removeChild(existingInfo);
            }

            const seatNumberElement = document.createElement('div');
            seatNumberElement.className = 'student-info';
            seatNumberElement.textContent = `${seatNumber}`;
            seat.appendChild(seatNumberElement);
        }
    } catch (error) {
        console.error('Error fetching student data:', error);

        // Preserve seat number as fallback
        const existingInfo = seat.querySelector('.student-info');
        if (existingInfo) {
            seat.removeChild(existingInfo);
        }

        const seatNumberElement = document.createElement('div');
        seatNumberElement.className = 'student-info';
        seatNumberElement.textContent = `${seatNumber}`;
        seat.appendChild(seatNumberElement);
    }
}

function handleDragStart(event) {
    event.target.classList.add('dragging');
    event.dataTransfer.setData('text/plain', event.target.id); 

    const seatElement = event.target;
    const plusButton = seatElement.querySelector('.plus-btn');
    const deleteButton = seatElement.querySelector('.delete-btn');

    if (plusButton) {
        plusButton.style.display = 'none';
    }
    if (deleteButton) {
        deleteButton.style.display = 'none';
    }
}

function handleDragEnd(event) {
    event.target.classList.remove('dragging');

    const seatElement = event.target;
    const plusButton = seatElement.querySelector('.plus-btn');
    const deleteButton = seatElement.querySelector('.delete-btn');

    if (plusButton) {
        plusButton.style.display = 'block';
    }
    if (deleteButton) {
        deleteButton.style.display = 'block';
    }
}

function handleDragOver(event) {
    event.preventDefault(); 
}

async function handleDrop(event) {
    event.preventDefault();

    const draggedSeatId = event.dataTransfer.getData('text/plain'); // ID of the dragged seat
    const draggedSeat = document.getElementById(draggedSeatId);
    const targetSeat = event.target.closest('.seat'); // Ensure we get the correct seat element

    if (!targetSeat || !draggedSeat) {
        console.error('Drag and drop failed: target or dragged seat not found.');
        return;
    }

    // Swap the innerHTML
    const draggedSeatContent = draggedSeat.innerHTML;
    const targetSeatContent = targetSeat.innerHTML;

    draggedSeat.innerHTML = targetSeatContent;
    targetSeat.innerHTML = draggedSeatContent;

    // Swap their IDs to maintain correct identification
    const draggedSeatOriginalId = draggedSeat.id;
    draggedSeat.id = targetSeat.id;
    targetSeat.id = draggedSeatOriginalId;

    // Reset opacity of the buttons after the drop
    const plusButtonDragged = draggedSeat.querySelector('.plus-btn');
    const deleteButtonDragged = draggedSeat.querySelector('.delete-btn');
    const plusButtonTarget = targetSeat.querySelector('.plus-btn');
    const deleteButtonTarget = targetSeat.querySelector('.delete-btn');

    if (plusButtonDragged) {
        plusButtonDragged.style.opacity = '1';
    }
    if (deleteButtonDragged) {
        deleteButtonDragged.style.opacity = '1';
    }
    if (plusButtonTarget) {
        plusButtonTarget.style.opacity = '1';
    }
    if (deleteButtonTarget) {
        deleteButtonTarget.style.opacity = '1';
    }

    // Save the updated seat positions to the backend
    await saveSeatPositions(draggedSeat.id, targetSeat.id);

    window.location.reload();
}

function addDragDropListeners(seat) {
    seat.addEventListener('dragstart', handleDragStart);
    seat.addEventListener('dragend', handleDragEnd);
}

async function saveSeatPositions(seat1Id, seat2Id) {
    try {
        const response = await fetch('save-seat-positions.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                seat1: seat1Id,  // Send the seat IDs to the backend
                seat2: seat2Id
            })
        });

        const resultText = await response.text(); // Get the raw text response
    } catch (error) {
        console.error('Error saving seat positions:', error);
    }
}

// Get elements for Add By Student button, modal content
const addStudentButton = document.querySelector('.add-student');
const addSubjectButton = document.querySelector('.add-subject');
const addstudentmodalcontent = document.querySelector('.addstudent-modal-content');

// Add click event listener for Add By Student button
addStudentButton.addEventListener('click', function () {
    // Hide the Add By Student and Add By Class buttons
    addStudentButton.style.display = 'none';
    addSubjectButton.style.display = 'none';

    // Create the dropdown
    const studentDropdown = document.createElement('select');
    studentDropdown.id = 'student-dropdown';
    studentDropdown.innerHTML = '<option value="">Select Student</option>'; 

    const submitstudent = document.createElement('button');
    submitstudent.id = 'submit-student';
    submitstudent.innerHTML = 'Add Student';

    // Append the dropdown to the modal content
    addstudentmodalcontent.appendChild(studentDropdown);
    addstudentmodalcontent.appendChild(submitstudent);

    // Fetch students from backend and populate the dropdown
    fetchStudents(studentDropdown);

    // Event listener for when a student is selected from the dropdown
    studentDropdown.addEventListener('change', function () {
        const selectedStudentId = studentDropdown.value;

        if (selectedStudentId) {
            // Do something with the selected student ID, e.g., send it to the server or update the UI
            console.log('Selected student ID:', selectedStudentId);
        }
    });

    submitstudent.addEventListener('click', function () {
        const selectedStudentId = studentDropdown.value;
        const examSessionId = document.getElementById('idexamsession').value;  // Get the exam session ID

        // Validate the required fields
        if (!selectedStudentId) {
            alert('Please select a student.');
            return;
        }
        if (!examSessionId) {
            alert('Please select an exam session.');
            return;
        }

        // Send the student assignment to the backend
        const seatNumber = selectedSeatNumber;
        const data = {
            idstudents: selectedStudentId,
            idexamsession: examSessionId,
            idvenue: idvenue,
            seatno: seatNumber  // This should be dynamically set based on the seat clicked
        };

        fetch('add-student-to-exam.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                window.location.reload()
            } else {
                alert('Error adding student to the exam.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error processing the request.');
        });
    });
});

async function fetchStudents(studentDropdown) {
    try {
        // Make the request to your PHP script
        const response = await fetch('get-students.php'); // Update the path as necessary
        const data = await response.json();

        if (data.success) {
            // Populate the dropdown with student options
            data.students.forEach(student => {
                const option = document.createElement('option');
                option.value = student.idstudents;
                option.textContent = `${student.firstname} ${student.lastname}`;
                studentDropdown.appendChild(option);
            });
        } else {
            console.error('No students found or error in fetching data');
        }
    } catch (error) {
        console.error('Error fetching students:', error);
    }
}

console.log(studentIDs);

// Event listener for the Add Subject button
addSubjectButton.addEventListener('click', function () {
    // Hide the Add By Student and Add By Class buttons
    addStudentButton.style.display = 'none';
    addSubjectButton.style.display = 'none';

    // Create the dropdown
    const subjectDropdown = document.createElement('select');
    subjectDropdown.id = 'subject-dropdown';
    subjectDropdown.innerHTML = '<option value="">Select Subject</option>';

    const submitsubject = document.createElement('button');
    submitsubject.id = 'submit-subject';
    submitsubject.innerHTML = 'Add Subject';

    // Append the dropdown to the modal content
    addstudentmodalcontent.appendChild(subjectDropdown);
    addstudentmodalcontent.appendChild(submitsubject);

    // Fetch subjects from backend and populate the dropdown
    fetchSubject(subjectDropdown);

    // Event listener for when a subject is selected from the dropdown
    subjectDropdown.addEventListener('change', function () {
        const selectedSubjectId = subjectDropdown.value;
        console.log('Selected subject ID:', selectedSubjectId);
    });

    // Event listener for the submit button
    submitsubject.addEventListener('click', async function () {
        const selectedSubjectId = subjectDropdown.value;
        const examSessionId = document.getElementById('idexamsession').value;
        let seatNumber = selectedSeatNumber;
    
        try {
            // Fetch students for the selected subject
            const response = await fetch('fetch-students-by-subject.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idsubjects: selectedSubjectId })
            });
    
            const result = await response.json();
    
            if (!result.success) {
                console.error('Error:', result.message); // Log the error message
                return;
            }
    
            const students = result.students;
    
            let studentIndex = 0;
    
            while (studentIndex < students.length) {
                const seat = document.getElementById(`${seatNumber}`); // Get the current seat by its ID    
    
                // Check if seat is valid (i.e., contains a number, not filled with other content)
                if (/^\+?\d+$/.test(seat.textContent)) {
                    // Assign student names to the seat
                    const student = students[studentIndex];
    
                    // Prepare data for backend update
                    const data = {
                        idstudents: student.idstudents,
                        idexamsession: examSessionId,
                        idvenue: idvenue, // Assume `idvenue` is globally available
                        seatno: seatNumber
                    };

                    console.log(data);
    
                    // Send the seat assignment data to the backend
                    try {
                        const backendResponse = await fetch('add-student-to-exam.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        });
    
                        const backendResult = await backendResponse.json();
                        if (!backendResult.success) {
                            console.error(`Error updating seat ${seatNumber}:`, backendResult.message);
                        }
                    } catch (error) {
                        console.error(`Error updating seat ${seatNumber}:`, error);
                    }
    
                    // Move to the next student
                    studentIndex++;
                }
    
                // Move to the next seat
                seatNumber++;
            }

            window.location.reload();
        } catch (error) {
            console.error('Fetch error:', error); // Log any errors from the fetch call
        }
    });    
});

async function fetchSubject(subjectDropdown) {
    try {
        const response = await fetch('get-subjects.php'); 
        const data = await response.json();

        if (data.success) {
            data.subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject.idsubjects; 
                option.textContent = `${subject.name}`; 
                subjectDropdown.appendChild(option);
            });
        } else {
            alert('Failed to fetch subjects. Please try again later.');
        }
    } catch (error) {
        console.error('Error fetching subjects:', error);
        alert('Error fetching subjects. Please check your network or try again later.');
    }
}

function highlightDuplicateSeats(studentIDs) {
    // Create a map to count occurrences of each idstudent
    const idCount = {};
    
    // Count occurrences of each student ID
    for (const seat in studentIDs) {
        const id = studentIDs[seat];
        idCount[id] = (idCount[id] || 0) + 1;
    }
    
    // Loop through the studentIDs to identify duplicates and apply a red overlay
    for (const seat in studentIDs) {
        const id = studentIDs[seat];
        if (idCount[id] > 1) {
            // Use the actual seat ID to select the element
            const seatElement = document.getElementById(seat); // Fixed selector
            if (seatElement) {
                seatElement.style.backgroundColor = "rgba(255, 0, 0, 0.2)"; 
                seatElement.style.border = "1px solid red";
            }
        }
    }
}

Promise.all(
    Array.from(document.querySelectorAll('.seat')).map(seat => fetchStudentData(seat, seat.id))
).then(() => {
    highlightDuplicateSeats(studentIDs);
});