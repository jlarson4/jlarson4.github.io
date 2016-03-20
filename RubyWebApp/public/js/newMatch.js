//holds team names and the date
var teamOne;
var teamTwo;
var dateval;

//keeps track of who is winning over all
var team1Score =0;
var team2Score =0;

//arrays to hold all the player names
var dPlayers = [];
var sPlayers = [];

//arrays to hold all the scores
var dScores = [];
var sScores = [];

//arrays to hold all the winner values
var dWinners = [];
var sWinners = [];
var winString = [];


var scoreSubmitted=[];

for(var i = 0; i < 12; i++){
	if(i < 9)
	{
		scoreSubmitted[i]=false;
	}
	if( i < 3)
	{
		dWinners[i] = '';
		dScores[i] = '';
	}
	if( i < 6)
	{
		sWinners[i] = '';
		sScores[i] = '';
	}
	
	dPlayers[i] = '';
	sPlayers[i] = '';
}







$( "#teamsDate").on( "click", function() {
	  $('#opener').hide();
	 $('#dors').show();

	 teamOne = $('#homeTeam').val();
	teamTwo = $('#awayTeam').val();
	dateval = $('#date').val();

	winString[0] = teamOne.substr(0,3);
	winString[1] = teamTwo.substr(0,3);
	winString[0] = winString[0].toUpperCase();
	winString[1] = winString[1].toUpperCase();

	$("#homeT").text(teamOne);
	$("#awayT").text(teamTwo);
	$("#day").text(dateval);
	$(".atm").text(teamTwo);
	$(".htm").text(teamOne);
});

$( "#singles").on( "click", function() {
	 $('#dors').hide();
	 $('#sSubmit').show();
});

$( "#doubles").on( "click", function() {
	 $('#dors').hide();
	 $('#dSubmit').show();
});

$( "#cancel").on( "click", function() {
	 $('#opener').show();
	 $('#dors').hide();
});

$( ".cancelIM").on( "click", function() {
	 //$('#opener').show();
	 $('#dors').show();
	 $('#dSubmit').hide();
	 $('#sSubmit').hide();
});


$( "#dubSub").on( "click", function() {
	var pos = parseInt($("#doublesPosition").val());
	
	
	
	if(isNaN(pos))
	{
		$("#errors").html("<span style='color:red; text-align:center'> Please input a position number</span>")
	}
	else
	{
		//gets their names
		dPlayers[(pos-1)*4] = $('#dt1a').val();
		dPlayers[(pos-1)*4+1]=  $('#dt1b').val();
		dPlayers[(pos-1)*4+2]=  $('#dt2a').val();
		dPlayers[(pos-1)*4+3]=  $('#dt2b').val();
	
		//gets the score and concatonates them into one string
		dScores[pos-1] = $("#ds1").val() + " " + $("#ds2").val() + " " + $('#ds3').val();
	
	
		//gets the winner
		if(scoreSubmitted[(pos+5)] === false)
		{
		
			if($('#dw').val() === 'Team 1')
			{
				dWinners[pos-1] = 0;
				team1Score++;
				
			}
			else
			{
				dWinners[pos -1 ] = 1;
				team2Score++;
				
	
			}
			scoreSubmitted[(pos+5)] = true;
		}
		else
		{
			
			if($('#dw').val() === 'Team 1')
			{
				if(dWinners[pos-1] === 1)
				{
					dWinners[pos-1] = 0;
					team1Score++;
					team2Score--;
					
				}
				
			}
			else
			{
				if(dWinners[pos-1] === 0)
				{
					dWinners[pos-1] = 1;
					team2Score++;
					team1Score--;
					
				}
				
			}
		}
	
		

		$("#d" + pos + "hp1").text(dPlayers[(pos-1)*4]);
		$("#d" +  pos + "hp2").text(dPlayers[(pos-1)*4+1]);
		$("#d" + pos + "ap1").text(dPlayers[(pos-1)*4+2]);
		$("#d" +  pos + "ap2").text(dPlayers[(pos-1)*4+3]);
		$("#d" + pos + "set1").text(dScores[pos-1]);
		$("#d" + pos + "set2").text("");
		$("#d" + pos + "set3").text("");
		$("#d" + pos + "won").text(winString[dWinners[pos-1]]);
		$("#hsc").text(team1Score);
		$("#asc").text(team2Score);
	
	
		$("#dSubmit").hide();
		$("#dors").show();
		$("#errors").empty();
		document.getElementById("doub1").reset();
		document.getElementById("doub2").reset();
		document.getElementById("doub3").reset();
		document.getElementById("doub4").reset();
	}
});

$( "#singlesSubmit").on( "click", function() {
	var pos = parseInt($("#singlesPosition").val());
	

	console.log(pos)

	if(isNaN(pos))
	{
		$("#errors").html("<span style='color:red; text-align:center'> Please input a position number</span>")
	}
	else
	{
		var pos = parseInt($("#singlesPosition").val());
		
		//gets their names
		sPlayers[(pos-1)*2] = $('#sp1').val();
		sPlayers[(pos-1)*2+1]=  $('#sp2').val();
	
		//gets the score and concatonates them into one string
		sScores[pos-1] = $("#ss1").val() + " " + $("#ss2").val() + " " + $('#ss3').val();
	
	
		//gets the winner
		if(scoreSubmitted[pos-1] === false)
		{
			
			if($('#sw').val() === 'Player 1')
			{
				sWinners[pos-1] = 0;
				team1Score = team1Score + 1;
				
			}
			else
			{
				sWinners[pos-1] = 1;
				team2Score = team2Score + 1;
				
			}
			scoreSubmitted[pos-1] = true;
		}
		else
		{
			if($('#sw').val() === 'Player 1')
			{
				if(sWinners[pos-1] === 1)
				{
					sWinners[pos-1] = 0;
					team1Score++;
					team2Score--;
					
				}
				
			}
			else
			{
				if(sWinners[pos-1] === 0)
				{
					sWinners[pos-1] = 1;
					team2Score++;
					team1Score--;
					
				}
				
			}
		}
	
		//update preview
		
		$("#s" + pos + "p1").text(sPlayers[(pos-1)*2]);
		$("#s" +  pos + "p2").text(sPlayers[(pos-1)*2+1]);
		$("#s" + pos + "set1").text(sScores[pos-1]);
		$("#s" + pos + "set2").text("");
		$("#s" + pos + "set3").text("");
		$("#s" + pos + "won").text(winString[sWinners[pos-1]]);
		$("#hsc").text(team1Score);
		$("#asc").text(team2Score);
	
	
		$("#sSubmit").hide();
		$("#dors").show();
		$("#errors").empty();
		document.getElementById("sing3").reset();
		document.getElementById("sing2").reset();
		document.getElementById("sing1").reset();
	}
});

$( "#finalize").on( "click", function() {

	$('#modalNote').hide();
	$('#finalizeInfo').text("Your match is being processed. You will be redirected  to the home page once this process is completed");
	
	var formData = {
		'team1' : teamOne,
 		'team2' : teamTwo,
 		'date' : dateval,
 		'team1Score' : team1Score,
 		'team2Score' : team2Score,
		'singlesPlayers' : sPlayers,
		'doublesPlayers' : dPlayers,
		'sScores' : sScores,
		'dScores' : dScores,
		'sWinners' : sWinners,
		'dWinners' : dWinners
	}

	 $.ajax({
                           type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
                           url         : 'newMatch', // the url where we want to POST
                           data        : JSON.stringify(formData), // our data object
                           dataType    : 'json', // what type of data do we expect back from the server
                                     
          })

	 .success(function(data) {
                                console.log("INFO SENT AND RECIEVED");
                           // log data to the console so we can see
                          		location.href = 'index.html';
                           // here we will handle errors and validation messages
                       });
        
        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
        

    });

$("#return").on('click', function(){
	location.href = 'index.html';

});
