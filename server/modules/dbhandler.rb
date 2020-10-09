require_relative "inputhandler.rb"

class DBhandler

    def self.connect

        @db ||= SQLite3::Database.new('db/db.db')
        @db.results_as_hash = true
        @db

    end

    # Public: gets values from database
    # 
    # Examples
    # 
    # DBhandler.get do {:columns => "*", :nondefault_table => "Example"}
    #   #=> all items in table "Example"
    def self.get(&blk)

        connect

        input = yield

        # puts '------'
        # puts ''
        # puts input
        # puts ''
        # puts '------'

        if input[:fragment] == nil

            input[:fragment] = ""

        end

        if input[:nondefault_table]

            @db.execute("SELECT #{input[:columns]} FROM #{input[:nondefault_table]} #{input[:fragment]}", input[:condition]) 
            
        else

            @db.execute("SELECT #{input[:columns]} FROM #{@table_name} #{input[:fragment]}", input[:condition]) 
        
        end
    end

    # Public: inserts a series of values into a database
    # 
    # Examples
    # 
    # Class_inheriting_DBhandler.insert do {:insertion => {"bananpaj" => "god"}} end
    #   #=> "god" has been inserted into column "bananpaj" on table @table_name
    def self.insert(&blk)

        connect

        input = yield

        columns = Input.list_to_string(input[:insertion].keys)

        values = Input.list_to_string(input[:insertion])
        
        # puts '------'
        # puts ''
        # p columns
        # puts ''
        # puts '------'
        # puts ''
        # p values
        # puts ''
        # puts '------'

        if input[:nondefault_table] != nil

            @db.execute("INSERT INTO #{input[:nondefault_table]} (#{columns}) VALUES (#{values})")

        else

            @db.execute("INSERT INTO #{@table_name} (#{columns}) VALUES (#{values})")

        end
    
    end

    # Public: removes rows from database where a condition is met
    # 
    # Examples
    # 
    # Class_inheriting_DBhandler.remove_row do {:nondefault_table => "bakelser", :where => "bananpaj", :condition => "god"} end
    #   #=> all entries in table "bakelser" where "bananpaj" = "god" have been removed
    def self.remove_row(&blk)
    
        connect

        input = yield

        if input[:nondefault_table] != nil
            
            @db.execute("DELETE FROM #{input[:nondefault_table]} WHERE #{input[:where]} = ?", input[:condition])
            
        else
            
            @db.execute("DELETE FROM #{@table_name} WHERE #{input[:where]} = ?", input[:condition])
    
        end

    end

    # Public: updates values in a database
    # 
    # Examples
    # 
    # Class_inheriting_DBhandler.update do {:columns => ["bananpaj", kanelbulle], :values => ["inte god", "god"], :where => "id", :condition => 1} end
    #   #=> values in table @table_name where "id" = 1 in columns "bananpaj" and "kanelbulle" have been updated to "inte god" and "god" respectively
    def self.update(&blk)

        input = yield

        connect

        # puts '------'
        # puts ''
        # p table
        # puts ''
        # puts '------'

        if input[:columns].length == input[:values].length

            input[:columns].each_with_index do |column, i|

                # puts '#----------#'
                # puts ''
                # p "UPDATE #{@table_name} SET #{column} = '#{input[:values][i]}' WHERE #{input[:where]} = ?"
                # puts ''
                # puts '#----------#'
            
                @db.execute("UPDATE #{@table_name} SET #{column} = '#{input[:values][i]}' WHERE #{input[:where]} = ? ", input[:condition])

            end
        
        end

    end

    def self.testmethod

        # FileUtils.mkdir_p "public/img/test"
        
    end

end

class Student < DBhandler

    @table_name = "students"
    @column_names = ["id", "name", "img_path"]

    def self.add(&blk)

        input = yield
        
        array = [input[:student], "wait"]

        insert do {:insertion => Input.array_to_hash(array, @column_names)} end
        
        id = get do {:columns => "id", :fragment => "ORDER BY id DESC LIMIT 1"} end.first["id"]
        
        FileUtils.mkdir_p "public/img/#{id}"

        # if input[:image] && input[:image][:filename]

        #     filename = input[:image][:filename]

        #     file = input[:image][:tempfile]

        #     path = "./public/img/#{id}/#{filename}"
        
        #     File.open(path, 'wb') do |f|

        #         f.write(file.read)
                
        #     end

        # end

        return id

    end

    def self.update_path(&blk)

        input = yield

        update do {:columns => ["img_path"], :values => [input[:path]], :where => "id", :condition => input[:id]} end

    end

    def self.remove(&blk)

        input = yield

        remove_row do {:where => "id", :condition => input[:id]} end

        FileUtils.remove_dir("public/img/#{input[:id]}")
        
    end

end