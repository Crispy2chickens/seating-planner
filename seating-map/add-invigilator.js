let optionCount = 0;
let invigilators = []; 

fetch('get-invigilators.php')
    .then(response => response.json())
    .then(data => {
        invigilators = data; 
    })
    .catch(error => console.error('Error fetching invigilators:', error));

function addOption() {
    optionCount++;

    let optionRow = document.querySelector('.option-row:last-child');

    if (!optionRow) {
        optionRow = document.createElement('div');
        optionRow.className = 'option-row';
        document.body.appendChild(optionRow); 
    }

    const newOption = document.createElement('select');
    newOption.className = 'option';

    const defaultOption = document.createElement('option');
    defaultOption.value = ''; 
    defaultOption.textContent = `Select Invigilator ${optionCount}`; 
    newOption.appendChild(defaultOption);

    invigilators.forEach(invigilator => {
        const option = document.createElement('option');
        option.value = invigilator.idusers; 
        option.textContent = `${invigilator.firstname} ${invigilator.lastname}`; 
        newOption.appendChild(option);
    });

    optionRow.appendChild(newOption);

    const newRow = document.createElement('div');
    newRow.className = 'option-row';

    const addButton = document.createElement('button');
    const buttonImage = document.createElement('img');
    buttonImage.src = '../img/plus.png'; 
    buttonImage.alt = 'Add Option'; 
    buttonImage.style.width = '20px'; 
    buttonImage.style.height = '20px'; 

    addButton.appendChild(buttonImage);
    addButton.onclick = addOption;

    newRow.appendChild(addButton);

    const optionsContainer = document.getElementsByClassName('invigilators-container')[0];
    optionsContainer.appendChild(newRow);
}
