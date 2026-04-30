class MessagesController < ApplicationController
  def create
    message = Message.new(content: params[:content])

    if params[:image].present?
      message.image.attach(params[:image])
    end

    if message.save
      image_url = message.image.attached? ? url_for(message.image) : nil

      ActionCable.server.broadcast("chat_room", {
        message: message.content,
        image_url: image_url,
        time: message.created_at.in_time_zone.strftime("%H:%M")
      })

      render json: { success: true }
    else
      render json: { success: false }, status: :unprocessable_entity
    end
  end
end
