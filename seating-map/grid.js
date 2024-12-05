const map = document.querySelector('#map');

const isCoordinator = JSON.parse(map.dataset.isCoordinator);

const className = map.className;

let rows, columns; 

if (className === 'map-1') {
    rows = 13; 
    columns = 8;
} else if (className === 'map-2') {
    rows = 7; 
    columns = 3; 
} else if (className === 'map-3') {
    rows = 5; 
    columns = 1; 
}

// Dynamically create seats
for (let col = 0; col < columns; col++) {
    for (let row = 0; row < rows; row++) {
        const seatNumber = row * columns + col + 1; // Calculate the seat number
        const seat = document.createElement('div');
        seat.className = 'seat';

        seat.draggable = true;
        seat.id = `${seatNumber}`;
        seat.textContent = `${seatNumber}`;

        // Fetch student data for each seat number from the backend
        fetchStudentData(seat, seatNumber);
        map.appendChild(seat);

        // Add drag event listeners to each seat after they are added to the DOM
        seat.addEventListener('dragstart', handleDragStart);
        seat.addEventListener('dragend', handleDragEnd);
    }
}

// Assuming isCoordinator is passed from the PHP as described before
if (isCoordinator) {
    // Add event listeners for the map (drag over and drop)
    map.addEventListener('dragover', handleDragOver);
    map.addEventListener('drop', handleDrop);

    console.log('Drag and drop enabled for coordinators.');
} else {
    console.log('Drag and drop disabled for non-coordinators.');
}

// Other functions remain unchanged

async function fetchStudentData(seat, seatNumber) {
    try {
        // Fetch data from the PHP script
        const response = await fetch(`get-student-details.php?seatNumber=${seatNumber}`);
        const data = await response.json();

        // Update the seat text with student info
        if (data.firstname && data.lastname) {
            seat.textContent = `${data.firstname} ${data.lastname}`;
        } else {
            seat.textContent = `${seatNumber}`;
        }
    } catch (error) {
        console.error('Error fetching student data:', error);
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
        // Swap seat numbers
        const draggedSeatId = draggedSeat.id;  
        const targetSeatId = targetSeat.id;    
    
        // Swap their IDs
        [draggedSeat.id, targetSeat.id] = [targetSeat.id, draggedSeat.id];
    
        // Swap their textContent (if you want to show the updated seat number visually)
        const draggedSeatNumber = draggedSeat.textContent;
        const targetSeatNumber = targetSeat.textContent;
        [draggedSeat.textContent, targetSeat.textContent] = [targetSeatNumber, draggedSeatNumber];
    
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
