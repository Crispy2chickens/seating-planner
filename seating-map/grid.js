const map = document.querySelector('#map');
const isCoordinator = JSON.parse(map.dataset.isCoordinator); // Get the value from data-is-coordinator attribute

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

    // Create Plus Button
    const plusButton = document.createElement('button');
    plusButton.className = 'plus-btn';
    plusButton.textContent = '+';

    // Fetch student data after seat is created and then update the seat text
    fetchStudentData(seat, seatNumber).then(() => {
        seat.appendChild(plusButton);  // Add the button after data is fetched
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