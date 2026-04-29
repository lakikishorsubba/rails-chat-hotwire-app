class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from "chat_room"
  end

  def unsubscribed
  end

  def speak(data)
    # save to DB first
    message = Message.create!(content: data["message"])
    # then broadcast to all
    ActionCable.server.broadcast("chat_room", {
      message: message.content
    })
  end
end
