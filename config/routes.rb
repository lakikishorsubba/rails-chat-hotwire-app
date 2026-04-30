Rails.application.routes.draw do
  get "message/create"
  resources :users
  resources :messages, only: [ :create ]
  get "chat", to: "chat#index"
  root to: redirect("/users")

  get "up" => "rails/health#show", as: :rails_health_check
end
