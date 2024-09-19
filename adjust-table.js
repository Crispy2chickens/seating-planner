document.addEventListener('tableUpdated', () => {
    let tableBody = document.querySelector("#data-table tbody");
    let currentRowCount = tableBody.rows.length; 

    if (currentRowCount < 10) {
        for (let i = currentRowCount; i < 10; i++) {
            let tr = document.createElement('tr');
            tr.innerHTML = `<td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>`;
            tableBody.appendChild(tr);
        }
    }
});
