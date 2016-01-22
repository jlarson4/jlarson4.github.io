 //this is for the fire base
 $('#displayZone').hide();
 $('#newMatch').hide();
 $('#finalize').hide();
$(document).ready(function() {
 

	var myFireBase = new Firebase("https://jl-scorebook.firebaseio.com/");
	var dates = [];
	var sKeys = ['homeName', 'awayName', 'set1', 'set2', 'set3', 'winner'];
	var dKeys = ['homeName1', 'homeName2', 'awayName1', 'awayName2', 'set1', 'set2', 'set3', 'winner'];
	var mydiv = [];
	$('#teams').find("div[id]").each(function(){ mydiv.push(this); });
	matchdd();

	function matchdd(){

	myFireBase.orderByKey().once("value", function(snapshot){
		snapshot.forEach(function(children){
			var newSnap = children.child("date");
			dates.push(newSnap.val());

			
			});
		for(var i = dates.length-1; i >= 0 ; i--){			

				$("#matchDropdown").append("<option class='match' id=o"+ i +' )>' + dates[i] + "</option>");
				$( "#o"+ i ).on( "click", function() {
			    	
			    	
				findInFB(this);

				$('#newMatch').hide();
				});
			};
		});
		};

		function findInFB(id){

			myFireBase.orderByKey().once("value", function(snapshot){
				console.log("Clicked: " + id.text);
				snapshot.forEach(function(children){
					
					if(children.child("date").val() === id.text){
						console.log(children);
						displayShit(children);
					};
					
				});
			});
		};

		function displayShit(match){
			console.log(match);
			var newSnap = match.child("date");
			$("#homeT").text(" " + match.child('home').val() + " ");
			$("#awayT").text(" " + match.child('away').val() + " ");
			$("#day").text(" " + match.child('date').val() + " ");
			$("#at").text(match.child("away").val() + ": " + match.child('awayWins').val());
			$("#ht").text(match.child("home").val() + ": " + match.child('homeWins').val());

			for(var i = 1; i < 7; i++){
				display(match.child('singles' + i), 6, mydiv[i-1]);
				if(i < 4){
					display(match.child('double' + i), 8, mydiv[i+5]);
				}
			}
			$('#displayZone').show();
			setBodyScale();


		};

		function display(snapshot, sod, mydiv){
			//retrieves all the id's in that div
			var ids = [];
			$(mydiv).find("span span[id]").each(function(){ ids.push(this.id); });

			//fills them with info from the ref
		
			for(var i = 0; i < 8; i++){
				if(sod === i){
					break;
				}
				if(sod === 6){
					var newSnap = snapshot.child(sKeys[i]);
				}
				else{
					var newSnap = snapshot.child(dKeys[i]);
				}
	
				$("#"+ids[i]).text( newSnap.val() );
			}
		};

	//for the input fields
		$('#addMatch').on("click", function() {
			newDisplay();
			$('#displayZone').show();
			$('#newMatch').show();
			$("#finalize").show();
			$('#menu1').hide();
			$('#menu2').hide();
			$('#addMatch').hide();
			
			myFireBase = new Firebase("https://jl-scorebook.firebaseio.com/");
			var teamsSub = false;
			var sKeys = ['homeName', 'awayName', 'set1', 'set2', 'set3', 'winner'];
			var dKeys = ['homeName1', 'homeName2', 'awayName1', 'awayName2', 'set1', 'set2', 'set3', 'winner'];

			var match = myFireBase.push(
					{home: 0, 
					away: 0, 
					date: 0, 
					homeWins: 0,
					awayWins: 0,
					singles1: {homeName:0, awayName:0, set1:0, set2: 0, set3:0, winner:{hi:0}}, 
					singles2: {homeName:0, awayName:0, set1:0, set2: 0, set3:0, winner: 0}, 
					singles3: {homeName:0, awayName:0, set1:0, set2: 0, set3:0, winner: 0}, 
					singles4: {homeName:0, awayName:0, set1:0, set2: 0, set3:0, winner: 0}, 
					singles5: {homeName:0, awayName:0, set1:0, set2: 0, set3:0, winner: 0}, 
					singles6: {homeName:0, awayName:0, set1:0, set2: 0, set3:0, winner: 0}, 
					double1: {homeName1:0, homeName2:0, awayName1:0, awayName2:0, set1:0, set2:0, set3:0, winner: 0},
					double2:{homeName1:0, homeName2:0, awayName1:0, awayName2:0, set1:0, set2:0, set3:0, winner: 0},
					double3:{homeName1:0, homeName2:0, awayName1:0, awayName2:0, set1:0, set2:0, set3:0, winner: 0},
					});
			var id = match.key();
			var matchRef = myFireBase.child(id);
			var individualRefs = [matchRef.child("singles1"), matchRef.child("singles2"), matchRef.child("singles3"), matchRef.child("singles4"), matchRef.child("singles5"), matchRef.child("singles6"), matchRef.child("double1"), matchRef.child("double2"), matchRef.child("double3")];
			
			var sub = false;
			var hWins =0;
			var aWins = 0;
			var scoreSubmitted=[];
			var won = [];
			for(var i = 0; i < 9; i++){
				scoreSubmitted[i]=false;
			}

			//button handlers
			for(var j = 1; j < 7; j++){
				$( "#bs"+ j ).on( "click", function() {
							storeInfo(this.id);
				});

				if(j <4){
						$( "#bd"+ j ).on( "click", function() {
							storeInfo(this.id);
				});
				}

			}

			$('#teamsDate').on("click", function(){
				teamInfo(); return false;
			});

			function teamInfo(){
				var homeval = $('#homeTeam').val();
				var awayval = $('#awayTeam').val();
				var dateval = $('#date').val();
				
				matchRef.update({"date": dateval});
				matchRef.update({"home": homeval});
				matchRef.update({"away": awayval});
		
				//update the drop down
				dates.push(dateval);
				var num = dates.length-1;
				if(!sub){
					$("#matchDropdown").prepend("<option class='match' id=o"+num+' )>' + dateval + "</option>");
					sub = true;
				};
					$( "#o"+ num ).on( "click", function() {
						findInFB(this);
		
						$('#newMatch').hide();
						});
		
				//update display
				matchRef.once( "value", function(snapshot){
					
					$("#homeT").text(" " + snapshot.child('home').val() + " ");
					$("#awayT").text(" " + snapshot.child('away').val() + " ");
					$("#day").text(" " + snapshot.child('date').val() + " ");
					$("#at").text(snapshot.child("away").val() + ": " + snapshot.child('awayWins').val());
					$("#ht").text(snapshot.child("home").val() + ": " + snapshot.child('homeWins').val());
					teamsSub = true;
				});
			}

			function storeInfo(buttonID){
				console.log(buttonID);
				var sod = buttonID[1];
				var num = parseInt(buttonID[2]);
				var index = num;
				var disIndex;
				if(sod === 'd'){
					index = index + 5;
					individualRefs[index].update({homeName1: $('#h' + num + "da").val()});
					individualRefs[index].update({homeName2: $('#h' + num + "db").val()});
					individualRefs[index].update({awayName1: $('#a' + num + "da").val()});
					individualRefs[index].update({awayName2: $('#a' + num + "db").val()});
					disIndex = 8;
				}
				else{
					index--;
					individualRefs[index].update({homeName: $('#h' + num + "s").val()});
					individualRefs[index].update({awayName: $('#a' + num + "s").val()});
					disIndex=6;
				}

				individualRefs[index].update({set1: $('#' + sod + num + "s1").val()});
				individualRefs[index].update({set2: $('#' + sod + num + "s2").val()});
				individualRefs[index].update({set3: $('#' + sod + num + "s3").val()});

				whoWon(index, "#" + sod + num +"w", individualRefs[index]);
				
				individualRefs[index].once("value", function(snapshot){
					display(snapshot, disIndex, mydiv[index]);
				})
				
				
				matchRef.once("value", function(snapshot){
	
					$("#at").text(snapshot.child("away").val() + ": " + snapshot.child('awayWins').val());
					$("#ht").text(snapshot.child("home").val() + ": " + snapshot.child('homeWins').val());
				});			
			}

			function whoWon(i, tag, ref){
			//update match score
				console.log(tag);
				if(scoreSubmitted[i]===false){
					won[i] = $(tag).val();
					ref.update({"winner": won[i]});
		
					calculate(won[i]);
					scoreSubmitted[i] = true;
				}
				else{
					var newWinner = $(tag).val();
					recalculate(newWinner, won[i]);
					won[i]=newWinner;
					ref.update({"winner": won[i]});
				}
			}

			function calculate(won){
				if(won === "Away"){
					aWins++;
					matchRef.update({"awayWins": aWins});
				}
				else{
					hWins++;
					matchRef.update({"homeWins": hWins});
				}
			}
			
			function recalculate(newWinner, won){
				if(newWinner === won){
					return 0;
				}
				else if(newWinner === "Away"){
					hWins--;
					aWins++;
					matchRef.update({"awayWins": aWins});
					matchRef.update({"homeWins": hWins});
				}
				else if(newWinner==="Home"){
					hWins++;
					aWins--;
				}
				matchRef.update({"awayWins": aWins});
				matchRef.update({"homeWins": hWins});
			}

			$('#fullMatch').on("click", function(){
				allMatch(); return false;
			});

			$('#finalize').on("click", function(){
				allMatch();
				 $('#newMatch').hide();
				$('#displayZone').hide(); 
				$('#menu1').show();
				$('#menu2').show();
				$('#addMatch').show();
				newDisplay();
				//$("#matchDropdown").prepend("<option class='match' id=o"+(dates.length-1)+' )>' + matchRef.child("date").val() + "</option>");
				return false;
			});
			
			function allMatch(){
				teamInfo();
				var buttonIDs = ['bs1', 'bs2', 'bs3', 'bs4', 'bs5', 'bs6', 'bd1', 'bd2',  'bd3'];
				for(var o = 0; o < buttonIDs.length; o++){
					storeInfo(buttonIDs[o]);
				}
				
			};

			function newDisplay(){
				var divIDs = ['#s1', '#s2', '#s3', '#s4', '#s5', '#s6', '#d1', '#d2', '#d3'];
				
						//retrieves all the id's in that div
					var ids = [];
					$(mydiv).find("span span[id]").each(function(){ ids.push(this.id); });
		
					//fills them with info from the ref
				
					for(var i = 0; i < 60; i++){

						$("#"+ids[i]).text( '_____' );
					}
				$("#homeT").text( '____________' );
				$("#awayT").text( '____________' );
				$("#day").text( '_________' );
				$("#at").text ('______') ;
				$("#ht").text( '______' );

			};
		});
});

//this is for the main app




$('#addMatch').mouseover( function() {
   $('#addMatch').css("color", "red");
});

$('#addMatch').mouseout( function() {
   $('#addMatch').css("color", "black");
});

$('#menu1').mouseover( function() {
   $('#menu1').css("color", "red");
});

$('#menu1').mouseout( function() {
   $('#menu1').css("color", "black");
});

//scales text to screen
/*var $displayZone = $('#displayZone'); //Cache this for performance

            var setBodyScale = function() {
                var scaleSource = $displayZone.width(),
                    scaleFactor = 0.35,                     
                    maxScale = 200,
                    minScale = 100; //Tweak these values to taste

                var fontSize = scaleSource * scaleFactor; //Multiply the width of the body by the scaling factor:

                if (fontSize > maxScale) fontSize = maxScale;
                if (fontSize < minScale) fontSize = minScale; //Enforce the minimum and maximums

                $('#displayZone').css('font-size', fontSize + '%');
                $('.disHeading').css('font-size', (fontSize + 25 ) + '%');
                $('.SM').css('font-size', fontSize + '%');
                $('.matchscore').css('font-size', fontSize + '%');
                $('#matchscore').css('font-size', fontSize + '%');

      }

            $(window).resize(function(){
                setBodyScale();
            });*/


