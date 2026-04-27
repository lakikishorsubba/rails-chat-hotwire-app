import consumer from "channels/consumer"

const chatChannel = consumer.subscriptions.create("ChatChannel", {
  connected() {
    console.log("Connected to ChatChannel")
  },

  disconnected() {
    console.log("Disconnected")
  },

  received(data) {
    const messages = document.getElementById("messages")
    messages.insertAdjacentHTML(
      "beforeend",
      `<div class="message">${data.message}</div>`
    )
  },

  speak(message) {
    this.perform("speak", { message: message })
  }
})

document.addEventListener("turbo:load", () => {
  const button = document.getElementById("send_button")
  const input = document.getElementById("message_input")

  button?.addEventListener("click", () => {
    if (input.value.trim()) {
      chatChannel.speak(input.value)
      input.value = ""
    }
  })

  input?.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      chatChannel.speak(input.value)
      input.value = ""
    }
  })
})
