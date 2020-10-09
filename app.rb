require_relative "modules/dbhandler.rb"

class Main < Sinatra::Base

    register Sinatra::Reloader

    enable :sessions

    get '/' do

        slim :index

    end

    post '/test' do

        redirect '/'

    end

end