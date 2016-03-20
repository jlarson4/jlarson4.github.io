require 'sinatra'
require 'sinatra/json'
require 'sequel'
require 'json'

#this is all data base stuff. 
DB = Sequel.connect('sqlite://Tennis.db')

#table for users
DB.create_table? :users do
	primary_key :id
	String :email
	String :password
	String :type #type is either coach or player
	foreign_key :school_id, :schools
end

#table for school
DB.create_table? :schools do
        primary_key :id #auto incrementing primary key
        String :name #name of the student
	end

# table for svs matches
 DB.create_table? :matches do
        primary_key :id #auto incrementing primary key
        Int :winnerScore
        Int :loserScore
       Int :winner #winners primary key
       String :date 
	end

DB.create_table? :seasons do
	primary_key :id
	Int :years
	foreign_key :school_id, :schools
	end

#table for players
DB.create_table? :players do
        primary_key :id #auto incrementing primary key
        String :name #name of the student
        foreign_key :school_id, :schools
	end

#table for pvp matches
DB.create_table? :singles do
        primary_key :id #auto incrementing primary key
        String :posNum #which position is it? 1st, 2nd, 3rd, etc
        String :score #string for the set scores
        Int :winner #winners primary key
        foreign_key :match_id, :matches
	end

DB.create_table? :doubles do
        primary_key :id #auto incrementing primary key
        String :posNum #which position is it? 1st, 2nd, 3rd, etc
        String :score #string for the set scores
        Int :winner1 #winners primary key
        Int :winner2 #winners primary key
        foreign_key :match_id, :matches
	end

#join table for players and matches
if not DB.table_exists?(:players_singles)
		#create a join table for the many to many relationship between
		#schools and matches. This will create schools_matches
		DB.create_join_table(:player_id=>:players, :single_id=>:singles)
	end

if not DB.table_exists?(:doubles_players)
		#create a join table for the many to many relationship between
		#schools and matches. This will create schools_matches
		DB.create_join_table(:player_id=>:players, :double_id=>:doubles)
	end

if not DB.table_exists?(:matches_seasons)
	#create a join table for the many to many relationship between
	#schools and matches. This will create schools_matches
	DB.create_join_table(:season_id=>:seasons, :match_id=>:matches)
end

if not DB.table_exists?(:players_seasons)
	#create a join table for the many to many relationship between
	#schools and matches. This will create schools_matches
	DB.create_join_table(:season_id=>:seasons, :player_id=>:players)
end

class User < Sequel::Model
	many_to_one :school
end


class School < Sequel::Model

	one_to_many :seasons
	one_to_many :players
	one_to_many :users
end



class Match < Sequel::Model

	many_to_many :seasons
	one_to_many :singles
	one_to_many :doubles


end

class Season < Sequel::Model
	many_to_one :school
	many_to_many :matches
	many_to_many :players
	
end

class Player < Sequel::Model

	many_to_many :singles
	many_to_many :doubles
	many_to_one :school
	many_to_many :season
	
end

class Single < Sequel::Model

	many_to_many :players
	many_to_one :match


end

class Double < Sequel::Model

	many_to_many :players
	many_to_one :match


end

get '/' do
 	File.read(File.join('public', 'index.html'))
end

post '/login' do
	
	 request_payload = request.body.read
	

	content_type :json
	request_payload.to_json
end

post '/signup' do

end



#actual server info
post '/newMatch' do

	puts "SUCCESS"

	request_payload = JSON.parse(request.body.read) 
	schools = Array.new()
	seasons = Array.new()
	found = Array.new(2, false)
	#search for team first
	#then search for season
	School.where(:name=> request_payload['team1']).each do |school|
		
			schools << school
			found[0] = true
			if check_season(school, request_payload['date'], seasons)
				seasons << Season.create( :years=>request_payload['date'][0...4])
				schools[-1].add_season(seasons[-1])
			end
	end

	if found[0] == false
		schools << School.create(:name=>request_payload['team1'])
		seasons << Season.create( :years=>request_payload['date'][0...4])
		
		schools[-1].add_season(seasons[-1])
	end

	School.where(:name=> request_payload['team2']).each do |school|
			schools << school
			found[1] = true
			if check_season(school, request_payload['date'], seasons)
				seasons << Season.create( :years=>request_payload['date'][0...4])
				schools[-1].add_season(seasons[-1])
			end
	end

	if found[1] == false
		schools  << School.create(:name=>request_payload['team2'])
		seasons << Season.create( :years=>request_payload['date'][0...4])
		
		schools[-1].add_season(seasons[-1])
	end

	curMatch = ''
	
	if request_payload['team1Score'] > request_payload['team2Score'] 

		curMatch = Match.create(:winnerScore => request_payload['team1Score'], :loserScore => request_payload['team2Score'], :winner => schools[0][:id], :date => request_payload['date'])
		seasons[0].add_match(curMatch)
		seasons[1].add_match(curMatch)

	else
		curMatch = Match.create(:winnerScore =>  request_payload['team2Score'], :loserScore => request_payload['team1Score'], :winner => schools[1][:id], :date => request_payload['date'])
		seasons[0].add_match(curMatch)
		seasons[1].add_match(curMatch)
	end

	#then start searching for players
	#this chunk does all the singles matches
	players = Array.new()
	
	6.times do |x|
		#if no player is in this position, move to the next set of players
		if request_payload['singlesPlayers'][x*2] == ''
			# do nothing no players in this group
		else
		#search for player one of this match
			findPlayer(request_payload['singlesPlayers'][x*2], players, schools[0], seasons[0])
			findPlayer(request_payload['singlesPlayers'][x*2+1], players, schools[1]. season[1])
		end

		#find the winner 
		p = x + 1
		if request_payload['sScores'][x] == ''
			#do nothing, this match doesn't exist
		elsif request_payload['sWinners'][x] == 0
			#player one won
			newPvPMatch = Single.create(:posNum => p, :score => request_payload['sScores'][x], :winner => players[-2][:id])
			curMatch.add_single(newPvPMatch)
			newPvPMatch.add_player(players[-1])
			newPvPMatch.add_player(players[-2])
		else
			#player two won
			newPvPMatch = Single.create(:posNum => p, :score => request_payload['sScores'][x], :winner => players[-1][:id])
			curMatch.add_single(newPvPMatch)
			newPvPMatch.add_player(players[-1])
			newPvPMatch.add_player(players[-2])
		end
	
	end

	#do doubles matches now
	dplayers = Array.new()
	
	3.times do |x|
		if request_payload['doublesPlayers'][x*4] == ''
			#do nothing, no players in this group
		else
			findPlayer(request_payload['doublesPlayers'][x*4], dplayers, schools[0], seasons[0])
			findPlayer(request_payload['doublesPlayers'][x*4+1], dplayers, schools[0], seasons[0])
			findPlayer(request_payload['doublesPlayers'][x*4+2], dplayers, schools[1], seasons[1])
			findPlayer(request_payload['doublesPlayers'][x*4+3], dplayers, schools[1], seasons[1])
			#find the winner 
		end

		p = x + 1
		
		if request_payload['dScores'][x] == ''
			
		elsif request_payload['dWinners'][x] == 0

			newPvPMatch = Double.create(:posNum => p, :score => request_payload['dScores'][x], :winner1 => dplayers[-3][:id], :winner2 => dplayers[-4][:id])
			curMatch.add_double(newPvPMatch)
			newPvPMatch.add_player(dplayers[-1])
			newPvPMatch.add_player(dplayers[-2])
			newPvPMatch.add_player(dplayers[-3])
			newPvPMatch.add_player(dplayers[-4])

		else

			newPvPMatch = Double.create(:posNum => p, :score => request_payload['dScores'][x], :winner1 => dplayers[-2][:id], :winner2 => dplayers[-1][:id])
			curMatch.add_double(newPvPMatch)
			newPvPMatch.add_player(dplayers[-1])
			newPvPMatch.add_player(dplayers[-2])
			newPvPMatch.add_player(dplayers[-3])
			newPvPMatch.add_player(dplayers[-4])
		end
	
	end
	

	content_type :json
	{ :key1 => 'value1', :key2 => 'value2' }.to_json


end


def check_season(s, d, seasons)
	newSeason = d[0...4].to_i
	retval = true
	s.seasons.each do |season|
		if season.years == newSeason
			seasons << season
			retval = false
		end
	end
	return retval
end

def findPlayer(playerName, players, school, season)

	found = false
	Player.where(:name=>playerName).each do |player|
			
			players << player
			found = true
			seasonFind = false
			season.players.each do |p|
				if p.id = player.id
					seasonFind = true
				end
			end
			if seasonFind == false
				season.add_player(players[-1])
			end
	end

	if found == false
		players << Player.create(:name => playerName)
		school.add_player(players[-1])
		season.add_player(players[-1])
		
	end
end


post '/findPlayer' do
	
	 wins = 0
	 losses = 0
	 matches = Array.new()
	
	 request_payload = JSON.parse(request.body.read) 
	
	 pname =  request_payload['name']
	
	info = {1 => "1st", 2 => "2nd", 3 => "3rd", 4 => "4th", 5 => "5th", 6 => "6th"}
	 #find player with this name
	Player.where(:name=>pname).each do |player|
		#for each singles match this player is associated 
		#grab info and add it to the future JSON object
		
		player.singles.each do |single|
			pos = single[:posNum].to_i
			type = " Singles"


			match = { date: "asdfasd", position: '1st Singles', opponent: "opName", opponentSchool: "Augustana", score: "6-0 6-0", wOrL: "W", partner: 'onlyIfDoubles', year: 0}
			match[:position] = "#{info[pos]}" + "#{type}"

			Match.where(:id => single.match_id).each do |m|
				date = m.date
				match[:year] = date[0...4].to_i
				date = "#{date[5...7]}" + "/" + "#{date[9...11]}" + "/" + "#{date[0...4]}"
				match[:date] = date

			end

			#for each player in the current match
			single.players.each do |p|
				
				#if their id is not the current player's ID
				if p.id != player.id
					#find the player with that ID
					Player.where(:id => p.id).each do |p2|
						#and get their name
						match[:opponent] = p2.name
						School.where(:id => p2.school_id).each do |school|
							#and their school name
							match[:opponentSchool] = school.name
						end
					end
				end
			end
			
			match[:score] = single.score
			if single.winner == player.id
				match[:wOrL] = "W"
				wins = wins + 1
			else
				match[:wOrL] = "L"
				losses = losses + 1
			end
			match[:partner] = "-"
	 		matches << match
		end

		#for each doubles match this plauer is associated with 
		#grab info and add it to the future JSON object
		player.doubles.each do |double|
			pos = double[:posNum].to_i
			type = " Doubles"

			match = { date: "asdfasd", position: '1st Singles', opponent: "opName", opponentSchool: "Augustana", score: "6-0 6-0", wOrL: "W", partner: 'onlyIfDoubles', year: 0}
			match[:position] = "#{info[pos]}" + "#{type}"

			Match.where(:id => double.match_id).each do |m|
				date = m.date
				
				date = "#{date[5...7]}" + "/" + "#{date[8...10]}" + "/" + "#{date[0...4]}"
				match[:date] = date

				

			end

			opponentNames = ''
			count = 0
			#for each player in the current match
			double.players.each do |p|
				if p.school_id == player.school_id and p.id != player.id
					match[:partner] = p.name
				end
				
				
				#if their id is not the current player's ID
				if p.id != player.id and p.school_id != player.school_id
					#find the player with that ID
					Player.where(:id => p.id).each do |p2|
						#and get their name
						if count ==0
							opponentNames = "#{p2.name}"
							count += 1
						else
						opponentNames = "#{opponentNames}" + " &  " + "#{p2.name}"
						end
						
						School.where(:id => p2.school_id).each do |school|
							#and their school name
							match[:opponentSchool] = school.name
						end
					end
				end
				match[:opponent] = opponentNames
			end
			
			match[:score] = double.score
			
			if double.winner1 == player.id or double.winner2 == player.id
				match[:wOrL] = "W"
				wins = wins + 1
			else
				match[:wOrL] = "L"
				losses = losses + 1
			end
			
	 		matches << match
		end

	end
	 #do stuff to determine record
	 record = wins.to_s + "-" + losses.to_s

	 #sort not working
	 #matches.sort {|x| x[:year]}
	 #matches.each do |match|
	 #	puts match[:year]
	 #end


	content_type :json 
	{:player => pname, :record => record, :matches => matches}.to_json
end


post '/findMatch' do
 	request_payload = JSON.parse(request.body.read) 

	#not sure how to do this one
	ms = Array.new()
	team1Wins = 0
	team2Wins = 0

	School.where(:name => request_payload['team1']).each do |school1|

		School.where(:name => request_payload['team2']).each do |school2|
			school1.seasons.each do |season1|

				school2.seasons.each do |season2|
					if season1.years == season2.years
						season1.matches.each do |match|
							match.seasons.each do |sea|
								wn = ""
								if sea.id == season2.id
									sc = "#{match.winnerScore}-#{match.loserScore}"
									if match.winner == school1.id
										wn = request_payload['team1']
										team1Wins += 1
									else
										wn = request_payload['team2']
										team2Wins += 1
									end
									date = "#{match.date[5...7]}" + "/" + "#{match.date[8...10]}" + "/" + "#{match.date[0...4]}"
									m = {score: sc, winner: wn, date: date}
								
									ms << m
								end
							end
						end
					end

				end
			end

		end

	end
	rc = "#{team1Wins}- #{team2Wins}"
	#ms.sort_by {|x| x[:date]}


	content_type :json
	{:team1 => request_payload['team1'], :team2 => request_payload['team2'], :record => rc, :matches => ms}.to_json
end

post '/findSchool' do
 	request_payload = JSON.parse(request.body.read) 

	 

	seasons = Array.new()

	School.where(:name => request_payload['team1']).each do |school|
		school.seasons.each do |season|
			wins = 0
			losses = 0
			season.matches.each do |match|
				if  match.winner == school.id
					wins += 1
				else
					losses += 1
				end
			end
			rec = "#{wins}-#{losses}"

			s = {years: season.years, record: rec}
			seasons << s
		end


	end
	#seasons.sort_by {|x| x[:years]}

	content_type :json
	{:school => request_payload['team1'], :seasons => seasons}.to_json
end