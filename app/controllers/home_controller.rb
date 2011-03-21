class HomeController < ApplicationController

  protect_from_forgery :except => [ :index, :session ]

  def index 
	@key_id = ActiveSupport::SecureRandom.hex(3)
	redirect_to :action => 'session', :key_id => @key_id
  end

  def session
	render :file => File.join(Rails.root, 'public', 'draw.html')
  end 

end
