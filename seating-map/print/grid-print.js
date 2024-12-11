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
    }).catch(error => {
        console.error("Error fetching student data:", error);
        seat.textContent = `${seatNumber}`;  // Fallback if fetching fails
    });

    // Append the seat to the map
    map.appendChild(seat);
}

// Function to fetch student data and update seat content
async function fetchStudentData(seat, seatNumber) {
    try {
        const response = await fetch(`../get-student-details.php?seatNumber=${seatNumber}`);
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