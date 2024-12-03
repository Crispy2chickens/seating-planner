const map = document.querySelector('.map');
const rows = 13; // 13 rows
const columns = 8; // 8 columns

// Dynamically create seats
for (let col = 0; col < columns; col++) {
    for (let row = 0; row < rows; row++) {
        const seatNumber = row * columns + col + 1; // Calculate the seat number
        const seat = document.createElement('div');
        seat.className = 'seat';
        seat.draggable = true;
        seat.id = `seat${seatNumber}`;
        seat.textContent = `${seatNumber}`;
        map.appendChild(seat);

        // Add drag event listeners to each seat after they are added to the DOM
        seat.addEventListener('dragstart', handleDragStart);
        seat.addEventListener('dragend', handleDragEnd);
    }
}

// Add event listeners for the map (drag over and drop)
map.addEventListener('dragover', handleDragOver);
map.addEventListener('drop', handleDrop);

function handleDragStart(event) {
    event.target.classList.add('dragging');
    event.dataTransfer.setData('text/plain', event.target.id); // Pass the seat's ID
}

function handleDragEnd(event) {
    event.target.classList.remove('dragging');
}

function handleDragOver(event) {
    event.preventDefault(); // Allow dropping
}

function handleDrop(event) {
    event.preventDefault();
    const draggedSeatId = event.dataTransfer.getData('text/plain');
    const draggedSeat = document.getElementById(draggedSeatId);
    const targetSeat = event.target;

    // Swap positions only if the target is a seat
    if (targetSeat.classList.contains('seat')) {
        // Clone the seats to swap their content and position
        const draggedClone = draggedSeat.cloneNode(true);
        const targetClone = targetSeat.cloneNode(true);

        // Remove the 'dragging' class from the clones
        draggedClone.classList.remove('dragging');
        targetClone.classList.remove('dragging');

        // Replace the original seats
        map.replaceChild(draggedClone, targetSeat);
        map.replaceChild(targetClone, draggedSeat);

        // Re-add drag-and-drop listeners to the clones
        addDragDropListeners(draggedClone);
        addDragDropListeners(targetClone);
    }
}

// Function to add drag-and-drop listeners to dynamically created nodes
function addDragDropListeners(seat) {
    seat.addEventListener('dragstart', handleDragStart);
    seat.addEventListener('dragend', handleDragEnd);
}
