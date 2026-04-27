// app/javascript/channels/chat_channel.js
import consumer from "./consumer";

const chatChannel = consumer.subscriptions.create("ChatChannel", {
  connected() {
    console.log("Connected to ChatChannel");
  },

  disconnected() {
    console.log("Disconnected");
  },

  received(data) {
    // called when server broadcasts a message
    const messages = document.getElementById("messages");
    messages.insertAdjacentHTML(
      "beforeend",
      `<div class="message">${data.message}</div>`,
    );
  },

  speak(message) {
    this.perform("speak", { message: message });
  },
});

// send message when button clicked
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("send_button");
  const input = document.getElementById("message_input");

  button?.addEventListener("click", () => {
    if (input.value.trim()) {
      chatChannel.speak(input.value);
      input.value = "";
    }
  });

  // send on Enter key
  input?.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      chatChannel.speak(input.value);
      input.value = "";
    }
  });
});
