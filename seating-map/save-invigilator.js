function saveInvigilators() {
    const selectedInvigilatorsData = [];

    document.querySelectorAll('.option').forEach((selectElement, index) => {
        if (selectElement.value) {
            const attendance = document.querySelectorAll('.invigilator-checkbox')[index].checked;
            selectedInvigilatorsData.push({
                userid: selectElement.value,
                examsessionid: 1,  // Replace with dynamic session ID if needed
                venueid: 1,
                attendance: attendance
            });
        }
    });

    fetch('save-invigilators.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedInvigilatorsData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Invigilators saved successfully!');
        } else {
            alert('Error saving invigilators.');
        }
    })
    .catch(error => console.error('Error saving invigilators:', error));
}
