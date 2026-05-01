class Message < ApplicationRecord
  belongs_to :user, optional: true
  has_many_attached :images
  has_rich_text :content
end
