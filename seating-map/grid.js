const map = document.querySelector('#map');

const isCoordinator = JSON.parse(map.dataset.isCoordinator);

const className = map.className;

let rows, columns;

let selectedSeatNumber = null;

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

    seat.textContent = `${seatNumber}`;

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
                
                // When the user clicks anywhere outside the modal content, close the modal
                window.addEventListener('click', function (event) {
                    if (event.target === addstudentmodal) {
                        plusButton.style.opacity = 1;

                        addstudentmodal.style.display = 'none';
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
        // Fetch data from the PHP script
        const response = await fetch(`get-student-details.php?seatNumber=${seatNumber}`);
        const data = await response.json();

        // Update the seat text with student info, after fetching
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

            seat.innerHTML = `<div>${data.firstname} ${data.lastname} <br><span style="font-size: 0.8em;">${data.candidateno}</span><br>${additionalInfo}</div>`;
        } else {
            // Correctly show row and column values
            seat.textContent = `${seatNumber}`;
        }
    } catch (error) {
        seat.textContent = `${seatNumber}`;  // Fallback if fetching data fails
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
const addClassButton = document.querySelector('.add-class');
const addstudentmodalcontent = document.querySelector('.addstudent-modal-content');

// Add click event listener for Add By Student button
addStudentButton.addEventListener('click', function () {
    // Hide the Add By Student and Add By Class buttons
    addStudentButton.style.display = 'none';
    addClassButton.style.display = 'none';

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
                alert('Student successfully added to exam.');
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
