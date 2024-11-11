let invigilators = []; 
let selectedInvigilators = new Set();

fetch('get-invigilators.php')
    .then(response => response.json())
    .then(data => {
        invigilators = data; 
    })
    .catch(error => console.error('Error fetching invigilators:', error));

function addOption() {
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
    defaultOption.textContent = `Select Invigilator`; 
    newOption.appendChild(defaultOption);

    updateOptions(newOption);

    newOption.addEventListener('change', () => {
        selectedInvigilators.clear(); 

        document.querySelectorAll('.option').forEach(optionElement => {
            if (optionElement.value) {
                selectedInvigilators.add(optionElement.value); 
            }
        });

        updateAllDropdowns(); 

        if (newOption.value !== '') {
            const addButton = optionRow.querySelector('button'); 

            addButton.innerHTML = '';

            const minusButtonImage = document.createElement('img');
            minusButtonImage.src = '../img/minus.png'; 
            minusButtonImage.alt = 'Minus Option'; 
            minusButtonImage.style.width = '20px'; 
            minusButtonImage.style.height = '20px'; 

            addButton.appendChild(minusButtonImage);
            
            addButton.onclick = () => deleteOptionRow(optionRow);
        }
    });

    optionRow.appendChild(newOption);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'invigilator-checkbox';
    
    optionRow.appendChild(checkbox);

    const newRow = document.createElement('div');
    newRow.className = 'option-row';

    const addButton = document.createElement('button');
    addButton.id = "add-option-btn";
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

function updateOptions(selectElement) {
    const previousValue = selectElement.value; 

    selectElement.innerHTML = ''; 

    const defaultOption = document.createElement('option');
    defaultOption.value = ''; 
    defaultOption.textContent = `Select Invigilator`; 
    selectElement.appendChild(defaultOption);

    invigilators.forEach(invigilator => {
        const option = document.createElement('option');
        option.value = invigilator.idusers; 
        option.textContent = `${invigilator.firstname} ${invigilator.lastname}`; 

        if (!selectedInvigilators.has(invigilator.idusers) || invigilator.idusers === previousValue) {
            selectElement.appendChild(option);
        }
    });

    if (previousValue) {
        selectElement.value = previousValue; 
    }
}

function updateAllDropdowns() {
    document.querySelectorAll('.option').forEach(selectElement => {
        updateOptions(selectElement);
    });
}

function deleteOptionRow(optionRow) {
    const selectElement = optionRow.querySelector('select');
    const selectedValue = selectElement.value;

    if (selectedValue) {
        selectedInvigilators.delete(selectedValue);
    }

    optionRow.remove();

    updateAllDropdowns();
}