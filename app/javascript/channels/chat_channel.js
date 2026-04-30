import consumer from "channels/consumer";

const chatChannel = consumer.subscriptions.create("ChatChannel", {
  connected() {
    console.log("Connected to ChatChannel");
  },

  disconnected() {
    console.log("Disconnected");
  },

  received(data) {
    const messages = document.getElementById("messages");
    let html = `<div class="message" style="margin-bottom: 8px;">
      <span style="color: #888; font-size: 12px;">${data.time}</span>`;

    if (data.message) {
      html += `<span style="margin-left: 6px;">${data.message}</span>`;
    }

    if (data.image_urls && data.image_urls.length > 0) {
      data.image_urls.forEach((url) => {
        html += `<div>
        <img src="${url}"
             style="max-width: 200px; display: block; margin-top: 4px; border-radius: 4px;" />
      </div>`;
      });
    }

    html += `</div>`;
    messages.insertAdjacentHTML("beforeend", html);
    messages.scrollTop = messages.scrollHeight;
  },

  speak(message) {
    this.perform("speak", { message: message });
  },
});

document.addEventListener("turbo:load", () => {
  const button = document.getElementById("send_button");
  const input = document.getElementById("message_input");
  const imageInput = document.getElementById("image_input");
  const sendImageButton = document.getElementById("send_image_button");
  const messages = document.getElementById("messages");

  if (messages) messages.scrollTop = messages.scrollHeight;

  // send text message via WebSocket
  button?.addEventListener("click", () => {
    if (input.value.trim()) {
      chatChannel.speak(input.value);
      input.value = "";
    }
  });

  input?.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      chatChannel.speak(input.value);
      input.value = "";
    }
  });

  // send image via HTTP POST
  sendImageButton?.addEventListener("click", async () => {
    const files = imageInput.files;
    if (!files) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("images[]", file);
    });

    formData.append("content", "");

    const token = document.querySelector('meta[name="csrf-token"]').content;

    await fetch("/messages", {
      method: "POST",
      headers: { "X-CSRF-Token": token },
      body: formData,
    });

    imageInput.value = "";
  });
});
