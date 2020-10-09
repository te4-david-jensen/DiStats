require_relative "modules/dbhandler.rb"

class Main < Sinatra::Base

    enable :sessions

    get '/' do

        # @students = @db.execute("SELECT * FROM students")

        @students = Student.get do {:columns => "*"} end

        slim :index

    end

    post '/test' do

        redirect '/'

    end

    post '/add_student' do

        id = Student.add do {:student => params['name']} end

        # puts "======="
        # p id
        # puts "======="
        # p params
        # puts "======="

        if params[:image] && params[:image][:filename]

            filename = params[:image][:filename]

            file = params[:image][:tempfile]
            
            path = "public/img/#{id}/#{filename}"

            File.open(path, 'wb') do |f|

                f.write(file.read)
                
            end

        end

        path = "img/#{id}/#{filename}"

        Student.update_path do {:id => id, :path => path} end

        redirect '/'

    end

    post '/remove_student' do 

        Student.remove do {:id => params['id']} end

        redirect '/'

    end

end