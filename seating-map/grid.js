const map = document.querySelector('#map');

const isCoordinator = JSON.parse(map.dataset.isCoordinator);

const className = map.className;

let rows, columns;

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
    if (col%2==0) {
        seatNumber = col * rows + row + 1
    } else {
        seatNumber = (col + 1) * rows - (row)
    }

    const seat = document.createElement('div');
    seat.className = 'seat';

    seat.draggable = true;
    seat.id = `${seatNumber}`;

    seat.textContent = `${seatNumber}`;

    if (isCoordinator) {
        // Create Plus Button
        const plusButton = document.createElement('button');
        plusButton.className = 'plus-btn';
        plusButton.textContent = '+';

        const deletebutton = document.createElement('button');
        deletebutton.className = 'delete-btn';
        deletebutton.textContent = '-';

        const addstudentmodal = document.querySelector('.addstudent-modal');
        const addstudentmodalcontent = document.querySelector('.addstudent-modal-content');

        plusButton.addEventListener('click', function () {
            plusButton.style.opacity = 0;
            deletebutton.style.opacity = 0;
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
                deletebutton.style.opacity = 1;

                addstudentmodal.style.display = 'none';
            }
        });

        deletebutton.addEventListener('click', () => {
            // Clear the seat's content
            seat.innerHTML = `${seatNumber}`;

            var examSessionValue = document.getElementById('idexamsession').value;
            // console.log(examSessionValue); 

            // Data to send to the PHP backend
            const data = {
                idexamsession: examSessionValue, 
                idvenue: idvenue, 
                seatno: `${seatNumber}`        
            };
        
            // Send DELETE request to PHP script
            fetch('delete-seat.php', {
                method: 'POST', // Use POST for simplicity; can be changed to DELETE if desired
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

        // Fetch student data after seat is created and then update the seat text
        fetchStudentData(seat, seatNumber).then(() => {
            seat.appendChild(plusButton);
            seat.appendChild(deletebutton);
        });
    }

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
        seat.textContent = `${seatNumber}`;
    }
}

function handleDragStart(event) {
    event.target.classList.add('dragging');
    event.dataTransfer.setData('text/plain', event.target.id); 
}

function handleDragEnd(event) {
    event.target.classList.remove('dragging');
}

function handleDragOver(event) {
    event.preventDefault(); // Allow dropping
}

async function handleDrop(event) {
    event.preventDefault();
    const draggedSeatId = event.dataTransfer.getData('text/plain');
    const draggedSeat = document.getElementById(draggedSeatId);
    const targetSeat = event.target;

    // Swap positions only if the target is a seat
    if (targetSeat.classList.contains('seat')) {
        // Swap seat IDs
        const draggedSeatId = draggedSeat.id;  
        const targetSeatId = targetSeat.id;    
    
        // Swap their IDs
        [draggedSeat.id, targetSeat.id] = [targetSeat.id, draggedSeat.id];
    
        // Swap their innerHTML (preserving the HTML structure including spans and other elements)
        const draggedSeatHTML = draggedSeat.innerHTML;
        const targetSeatHTML = targetSeat.innerHTML;

        [draggedSeat.innerHTML, targetSeat.innerHTML] = [targetSeatHTML, draggedSeatHTML];
    
        // Send the updated seat positions (using their IDs) to the backend
        await saveSeatPositions(draggedSeatId, targetSeatId);
    }
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
    studentDropdown.innerHTML = '<option value="">Select Student</option>'; // Placeholder option

    // Append the dropdown to the modal content
    addstudentmodalcontent.appendChild(studentDropdown);

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
