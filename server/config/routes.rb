Rails.application.routes.draw do
  resources :timetrackers
  post 'timetrackers/details'
  get 'timetracke/userWebDetails', to: 'timetrackers#user_web_details'
  devise_for :users


  get "up" => "rails/health#show", as: :rails_health_check

end
