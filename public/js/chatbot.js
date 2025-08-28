// Chatbot functionality
document.addEventListener("DOMContentLoaded", () => {
  const chatBtn = document.getElementById("chatbot-btn");
  const chatBox = document.getElementById("chatbot-box");
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");
  
  // Toggle chat
  chatBtn?.addEventListener("click", () => {
    chatBox.style.display = chatBox.style.display === "block" ? "none" : "block";
  });
  
  // Close button
  document.getElementById("chat-close")?.addEventListener("click", () => {
    chatBox.style.display = "none";
  });
  
  // Send message on Enter
  userInput?.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      const message = e.target.value.trim();
      if (!message) return;
      
      addMessage("user", message);
      e.target.value = "";
      
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message })
        });
        
        if (!response.ok) {
          throw new Error("Failed to get response");
        }
        
        const data = await response.json();
        addMessage("ai", data.reply);
      } catch (error) {
        console.error("Error:", error);
        addMessage("ai", "Sorry, I'm having trouble responding right now.");
      }
    }
  });
  
  function addMessage(sender, text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `msg ${sender}`;
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});