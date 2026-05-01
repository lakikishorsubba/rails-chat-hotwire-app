class Greeter < Thor
  desc "hello NAME", "Greet someone"
  option :shout, type: :boolean, default: false, aliases: "-s"

  def hello(name)
    msg = "Hello, #{name}! 👋"
    say(options[:shout] ? msg.upcase : msg, :green)
  end
end
