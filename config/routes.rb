Rails.application.routes.draw do
  resources :users
  get "chat", to: "chat#index"   # keep this one only
  root to: redirect("/users")

  get "up" => "rails/health#show", as: :rails_health_check
end
