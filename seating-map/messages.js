const chatboxMessages = document.getElementById('chatboxMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');

const idexamsession = document.querySelector("#idexamsession").value;

async function loadMessages() {
    try {
        // Send a GET request with idexamsession and idvenue
        const response = await fetch(`chat-api.php?idexamsession=${idexamsession}&idvenue=${idvenue}`);
        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }
        const messages = await response.json(); 
        
        // Clear existing messages
        chatboxMessages.innerHTML = '';
        
        // Add each message to the chatbox
        messages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.textContent = `${msg.firstname} ${msg.lastname}: ${msg.message}`;
            chatboxMessages.appendChild(messageElement);
        });
        
        // Scroll to the bottom of the chatbox to show the latest message
        chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Function to send a new message to the server
async function sendMessage() {
    const messageText = chatInput.value.trim();
    if (messageText === '') return; // Don't send empty messages

    try {
        // Send the message to the server using POST request
        const response = await fetch('chat-api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                idusers: idusers,  // Send the user ID
                message: messageText,
                idexamsession: idexamsession,  // Send the exam session ID
                idvenue: idvenue  // Send the venue ID
            }).toString()
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        // Clear the input field after sending
        chatInput.value = '';

        // Reload messages to include the newly sent one
        loadMessages();
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// Event listener for sending the message when the send button is clicked
sendButton.addEventListener('click', sendMessage);

// Event listener for sending the message when Enter is pressed
chatInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Load messages initially and periodically
loadMessages();
setInterval(loadMessages, 5000); // Refresh every 5 seconds
