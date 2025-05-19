const chatbotToggler = document.querySelector(".chatbot-toggler"); // Button to open/close chatbot
const closeBtn = document.querySelector(".close-btn"); // Chatbot close button
const chatbox = document.querySelector(".chatbox"); // Chat messages container
const chatInput = document.querySelector(".chat-input textarea"); // User input textarea
const sendChatBtn = document.querySelector(".chat-input span"); // Send message button

let userMessage = null;
const API_KEY = "AIzaSyA561NhrjRJJVDCEet3TCfKGtC429r-lOs"; // API key for requests
const inputInitHeight = chatInput.scrollHeight; // Initial textarea height

// Create chat message element
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`); // Add incoming/outgoing class
    // Bot message has icon, user message does not
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message; // Set message text
    return chatLi; 
};

// Call API to get chatbot response
const generateResponse = (chatElement) => {
    const API_URL = "https://aistudio.google.com/app/apikey"; // Fake API URL (replace with actual)
    const messageElement = chatElement.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}` // Auth header
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }], // Send user message
        })
    };

    fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            messageElement.textContent = data.choices[0].message.content.trim(); // Show response
        })
        .catch(() => {
            messageElement.classList.add("error"); // Show error if fetch fails
            messageElement.textContent = "Oops! Something went wrong. Please try again.";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight)); // Scroll to bottom
};

// Handle sending user message and bot reply
const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get trimmed input
    if (!userMessage) return; // Ignore empty messages

    chatInput.value = ""; // Clear input
    chatInput.style.height = `${inputInitHeight}px`; // Reset textarea height

    chatbox.appendChild(createChatLi(userMessage, "outgoing")); // Show user message
    chatbox.scrollTo(0, chatbox.scrollHeight); // Scroll to bottom

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming"); // Placeholder bot reply
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi); // Fetch bot response
    }, 600); // Delay for realism
};

// Adjust textarea height dynamically on input
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`; // Reset height
    chatInput.style.height = `${chatInput.scrollHeight}px`; // Set to scrollHeight
});

// Send message on Enter key (except Shift+Enter) if screen is wide
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault(); // Prevent newline
        handleChat(); // Send chat
    }
});

sendChatBtn.addEventListener("click", handleChat); // Send button click triggers chat
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot")); // Close chatbot
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot")); // Toggle chatbot open/close
