fetch('get-invigilators.php')
    .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.text(); // Use text() to check raw output first
    })
    .then(text => {
        console.log("Raw response text:", text); // Check raw output in console
        const data = text ? JSON.parse(text) : {}; // Parse if not empty
        if (data.status === 'success') {
            console.log("Data received:", data.data);
        } else {
            console.error("Error:", data.message);
        }
    })
    .catch(error => console.error("Fetch error:", error));
