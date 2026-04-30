class MessagesController < ApplicationController
  def create
    message = Message.new(content: params[:content])

    if message.save
      # attach AFTER save
      if params[:images].present?
        message.images.attach(params[:images])
      end

      image_urls = message.images.attached? ? message.images.map { |img| url_for(img) } : []

      ActionCable.server.broadcast("chat_room", {
        message: message.content,
        image_urls: image_urls,
        time: message.created_at.in_time_zone.strftime("%H:%M")
      })

      render json: { success: true }
    else
      render json: { success: false }, status: :unprocessable_entity
    end
  end
end
