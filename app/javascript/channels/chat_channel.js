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
      // render rich text HTML directly
      html += `<div style="margin-top: 4px;">${data.message}</div>`;
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
  const sendRichButton = document.getElementById("send_rich_button");
  const imageInput = document.getElementById("image_input");
  const sendImageButton = document.getElementById("send_image_button");
  const messages = document.getElementById("messages");

  if (messages) messages.scrollTop = messages.scrollHeight;

  // send rich text message via HTTP POST
  sendRichButton?.addEventListener("click", async () => {
    const editor = document.querySelector("trix-editor");
    const content = editor.value; // ← gets HTML content from Trix

    if (!content.trim()) return;

    const formData = new FormData();
    formData.append("content", content);

    const token = document.querySelector('meta[name="csrf-token"]').content;

    await fetch("/messages", {
      method: "POST",
      headers: { "X-CSRF-Token": token },
      body: formData,
    });

    editor.editor.loadHTML(""); // ← clear Trix editor after send
  });

  // send images via HTTP POST
  sendImageButton?.addEventListener("click", async () => {
    const files = imageInput.files;
    if (!files.length) return;

    const formData = new FormData();
    formData.append("content", "");

    Array.from(files).forEach((file) => {
      formData.append("images[]", file);
    });

    const token = document.querySelector('meta[name="csrf-token"]').content;

    await fetch("/messages", {
      method: "POST",
      headers: { "X-CSRF-Token": token },
      body: formData,
    });

    imageInput.value = "";
  });
});
