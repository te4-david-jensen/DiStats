require_relative "modules/dbhandler.rb"

class Main < Sinatra::Base

    register Sinatra::Reloader

    enable :sessions

    get '/' do

        slim :index

    end

    get '/test' do

        DBhandler.testmethod()

        redirect '/'

    end

end