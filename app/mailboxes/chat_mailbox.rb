class ChatMailbox < ActionMailbox::Base
  def process
    # find the user by their email address
    user = User.find_by(email: mail.from.first)
    sender = user ? user.name : mail.from.first

    message = Message.create!(
      content: "#{sender}: #{mail.decoded.strip.truncate(500)}"
    )

    ActionCable.server.broadcast("chat_room", {
      message: message.content,
      image_urls: [],
      time: message.created_at.in_time_zone.strftime("%H:%M")
    })
  end
end
