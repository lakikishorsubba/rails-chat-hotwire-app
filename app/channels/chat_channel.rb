class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from "chat_room"  # joins this stream
  end

  def unsubscribed
    # called when browser disconnects
  end

  def speak(data)
    ActionCable.server.broadcast("chat_room", {
      message: data["message"]
    })
  end
end
