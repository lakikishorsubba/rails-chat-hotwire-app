class ApplicationMailbox < ActionMailbox::Base
  routing all: :chat
end
