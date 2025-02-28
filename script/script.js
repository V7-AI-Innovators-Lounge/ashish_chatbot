let userName = null;

document.addEventListener("DOMContentLoaded", () => {
  appendMessage("Hello! What's your name?", 'bot');
});

document.getElementById('chat-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const inputField = document.getElementById('user-input');
  const message = inputField.value.trim();
  if (!message) return;

  appendMessage(message, 'user');
  inputField.value = '';

  if (!userName) {
    userName = message;
    appendMessage(`Hi ${userName}! How can I assist you today?`, 'bot');
    inputField.placeholder = "Type your message...";
    return;
  }

  const typingIndicator = appendTypingIndicator();

  try {
    const botResponse = await getBotResponse(message);
    removeTypingIndicator(typingIndicator);
    appendMessage(botResponse || "I'm not sure. Try rephrasing!", 'bot');
  } catch (error) {
    removeTypingIndicator(typingIndicator);
    appendMessage("Bot is busy... Please try again later!", 'bot');
  }
});

function appendMessage(message, sender) {
    const chatWindow = document.getElementById('chat-window');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', sender);
  
    const avatar = document.createElement('img');
    avatar.classList.add('chat-avatar');
    avatar.src = sender === 'user' 
      ? 'https://cdn-icons-png.flaticon.com/512/147/147142.png' 
      : 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png'; 
  
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.innerText = message;
  
    messageElement.appendChild(avatar);
    messageElement.appendChild(messageContent);
    chatWindow.appendChild(messageElement);
  
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function appendTypingIndicator() {
  const chatWindow = document.getElementById('chat-window');
  const typingElement = document.createElement('div');
  typingElement.classList.add('chat-message', 'bot');

  const avatar = document.createElement('img');
  avatar.classList.add('chat-avatar');
  avatar.src = 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png';

  const messageContent = document.createElement('div');
  messageContent.classList.add('message-content');

  // **Add the typing GIF instead of text**
  const typingGif = document.createElement('img');
  typingGif.src = 'https://media.tenor.com/kQ5Gj88WGuwAAAAj/taking-notes-kedet.gif';
  typingGif.alt = "Typing...";
  typingGif.style.width = "50px";  // Adjust size
  typingGif.style.height = "30px"; // Adjust size

  messageContent.appendChild(typingGif);
  typingElement.appendChild(avatar);
  typingElement.appendChild(messageContent);
  chatWindow.appendChild(typingElement);

  chatWindow.scrollTop = chatWindow.scrollHeight;

  return typingElement;
}


function removeTypingIndicator(typingElement) {
  typingElement.remove();
}

async function getBotResponse(userMessage) {
  const API_URL = "chat/chatbot.php"; 

  try {
      const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) {
          throw new Error("API request failed");
      }

      const data = await response.json();
      return data.response || "I'm not sure. Try rephrasing!";
  } catch (error) {
      console.error("Error fetching response:", error);
      return "Bot is busy... Please try again later!";
  }
}
