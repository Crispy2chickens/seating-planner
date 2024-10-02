function setSessionAndRedirect(title, date, starttime, idexamsession, redirectUrl) {
    fetch('set-session.php', { // Update this path as necessary
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: title, date: date, starttime: starttime, idexamsession: idexamsession })
    }).then(response => {
        if (response.ok) {
            // Redirect to the specified URL after setting the session
            window.location.href = redirectUrl;
        }
    }).catch(error => {
        console.error('Error:', error);
    });
}
