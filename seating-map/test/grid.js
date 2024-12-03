// script.js
const seats = document.querySelectorAll('.seat');
const planner = document.querySelector('.planner');

// Add drag event listeners to each seat
seats.forEach(seat => {
    seat.addEventListener('dragstart', handleDragStart);
    seat.addEventListener('dragend', handleDragEnd);
});

// Add event listeners for the planner container
planner.addEventListener('dragover', handleDragOver);
planner.addEventListener('drop', handleDrop);

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
        planner.replaceChild(draggedClone, targetSeat);
        planner.replaceChild(targetClone, draggedSeat);

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


const addSeatButton = document.getElementById('add-seat-button');
let seatCount = 4; // Keep track of the number of seats

addSeatButton.addEventListener('click', addNewSeat);

function addNewSeat() {
    seatCount += 1;
    const newSeat = document.createElement('div');
    newSeat.classList.add('seat');
    newSeat.setAttribute('draggable', 'true');
    newSeat.setAttribute('id', `seat${seatCount}`);
    newSeat.textContent = `Seat ${seatCount}`;

    // Add drag-and-drop listeners to the new seat
    addDragDropListeners(newSeat);

    // Append the new seat to the planner grid
    planner.appendChild(newSeat);
}
