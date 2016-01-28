var express = require("express");
var bodyParser = require('body-parser');
var Firebase = require('firebase');



var app= express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//firebase set up and pulling data

var i = 0;

var chatRef;
var cuddleRef = new Firebase('http://jl-individual.firebaseio.com');
var userRef = new Firebase('http://jl-cuddleusers.firebaseio.com');
var profRef;
cuddleRef.orderByKey().once("value", function(snapshot){
		snapshot.forEach(function(children){			
			profRef = children;
			//console.log(children.val());
			});
		
		});



//make sure this is above the static file server middleware
app.use(function(req, res, next){
console.log("Method: " + req.method + " URL: " + req.url);

//move to the next middleware function
next();
});

app.use(express.static("./public"));

app.get("/home.html", function(req, res){ 
// handle GET /my-route1
});

//takes a profile creation and adds it to the data base
app.post("/signup", function(request, response){ 
	
	var CID = "";
	var PID = "";

    //gender info added
    if(request.body.genderD == undefined){
    	CID = CID + '2';

    }
    else{
    	CID = CID + request.body.genderD;
   }

   //age info added
   var age = request.body.ageD;
   if(age < 25){
   	 CID = CID + '0';
   }
   else if (age >24 && age <= 30){
   	 CID = CID + '1';
   }
    else if (age >30 && age <= 36){
   	 CID = CID + '2';
   }
    else if (age >36 && age <= 42){
   	 CID = CID + '3';
   }
    else if (age >42 && age <= 50){
   	 CID = CID + '4';
   }
    else if (age >50 && age <= 60){
   	 CID = CID + '5';
   }
    else if (age >60){
   	 CID = CID + '6';
   }
   


	//add weight info
if(request.body.weightD !== undefined){
   var weight = request.body.weightD;
   	if(weight < 100){
		CID = CID + '0';
	}
	else if(weight > 250){
		CID = CID + '6';
	}
	else{
		var num = 0;
		for(var i = 100; i <= 250; i = i + 25){
			if(weight < i+25 && weight >= i){
				CID = CID + num;
				break;
			}
			else{
				num++;
			}
		}
	}
	}
else{
	CID = CID + '0';
}

   //height info added
   if(request.body.heightFTD !== undefined){
   var height = parseInt(request.body.heightFTD)*12 + parseInt(request.body.heightIND);

    if(height > 96){
		CID = CID + '8';
	}

	else if(height < 36){
		CID = CID + '0';
	}

	else if(height >= 36 && height < 48){
		CID = CID + "0";
	}
	
	else{
		
		var num = 1;
		for(var i = 54; i <= 96; i = i + 6){
			if(height <= i && height > i-6){
				CID = CID + num;
				break;
			}
			else{
				num++;
			}
	
		}
		
	}
}
else{
	CID = CID + '0';
}

if(request.body.hairColorD !== undefined){
	CID = CID + request.body.hairColorD;
}
else{
	CID = CID + 9;
}
   
if(request.body.musicD !== undefined){
   CID = CID + request.body.musicD;
   }
else{
	CID = CID + 9;
}


//sets your personal ID
if(request.body.genderP == undefined){
 	PID = PID + '2';
 	
 }
 else{
 	PID = PID + request.body.genderP;
}	

//age info added
   var age = request.body.ageP;
   if(age < 25){
   	 PID = PID + '0';
   }
   else if (age >24 && age <= 30){
   	 PID = PID + '1';
   }
    else if (age >30 && age <= 36){
   	 PID = PID + '2';
   }
    else if (age >36 && age <= 42){
   	 PID = PID + '3';
   }
    else if (age >42 && age <= 50){
   	 PID = PID + '4';
   }
    else if (age >50 && age <= 60){
   	 PID = PID + '5';
   }
    else if (age >60){
   	 PID = PID + '6';
   }
   


	//add weight info
if(request.body.weightP !== undefined){

  	 var weight = request.body.weightP;
   		if(weight < 100){
			PID = PID + '0';
		}
		else if(weight > 250){
			PID = PID + '6';
		}
		else{
			var num = 0;
			for(var i = 100; i <= 250; i = i + 25){
				if(weight < i+25 && weight >= i){
					PID = PID + num;
					break;
				}
				else{
					num++;
				}
			}
		}
	}
else{
		PID = PID + '0';
	}

   //height info added
  
   if(request.body.heightFTP !== undefined){
   var height2 = parseInt(request.body.heightFTP)*12 + parseInt(request.body.heightINP);
  
    if(height2 > 96){
		PID = PID + '8';
	}

	else if(height2 < 36){
		PID = PID + '0';
	}

	else if(height2 >= 36 && height2 < 48){
		PID = PID + "0";
	}
	
	else{
		
		var num = 1;
		for(var i = 54; i <= 96; i = i + 6){
			if(height2 <= i && height2 > i-6){
				PID = PID + num;
				break;
			}
			else{
				num++;
			}
	
		}
		
	}
}
else{
	PID = PID + '0';
}

if(request.body.hairColorP !== undefined){
	PID = PID + request.body.hairColorP;
}
else{
	PID = PID + "9";
}
   
if(request.body.musicP !== undefined){
   PID = PID + request.body.musicP;
   }
else{
	PID = PID +' 9';
}

PID = PID +'0';

var location = request.body.locale;
var email = request.body.email;
var pref;
var gen;

if(CID[0]==='0'){
	pref = 'Men';
}
else if (CID[0]==='1'){
	pref='Women';
}
else{
	pref='Either';
}

if(PID[0]==='0'){
gen = 'Male';
}
else if (PID[0]==='1'){
	gen='Female';
}
else{
	gen='Either';
}

userRef.push({
	email: email,
	location: location,		
	CID: CID,
	PID: PID,
	music: request.body.musicP,
	hair: request.body.hairColorP,
	sexualPreference: pref,
	gender: gen});
		
	var retval =  JSON.stringify({
		CID:CID,
		PID:PID
});
response.json(retval);

});




//takes a cuddle application and returns a suggestion
app.post('/apply', function(request, response){
    
    var CID = ""

    //gender info added
    if(request.body.gender == undefined){
    	CID = CID + '2';
    }
    else{
    	CID = CID + request.body.gender;
   }
   //age info added
   var age = request.body.age;
   if(age < 25){
   	 CID = CID + '0';
   }
   else if (age >24 && age <= 30){
   	 CID = CID + '1';
   }
    else if (age >30 && age <= 36){
   	 CID = CID + '2';
   }
    else if (age >36 && age <= 42){
   	 CID = CID + '3';
   }
    else if (age >42 && age <= 50){
   	 CID = CID + '4';
   }
    else if (age >50 && age <= 60){
   	 CID = CID + '5';
   }
    else if (age >60){
   	 CID = CID + '6';
   }
   


	//add weight info
if(request.body.weight !== undefined){
   var weight = request.body.weight;
   	if(weight < 100){
		CID = CID + '0';
	}
	else if(weight > 250){
		CID = CID + '6';
	}
	else{
		var num = 0;
		for(var i = 100; i <= 250; i = i + 25){
			if(weight < i+25 && weight >= i){
				CID = CID + num;
				break;
			}
			else{
				num++;
			}
		}
	}
	}
else{
	CID = CID + '0';
}

   //height info added
   if(request.body.heightFT !== undefined){
   var height = parseInt(request.body.heightFT)*12 + parseInt(request.body.heightIN);

    if(height > 96){
		CID = CID + '8';
	}

	else if(height < 36){
		CID = CID + '0';
	}

	else if(height >= 36 && height < 48){
		CID = CID + "0";
	}
	
	else{
		
		var num = 1;
		for(var i = 54; i <= 96; i = i + 6){
			if(height <= i && height > i-6){
				CID = CID + num;
				break;
			}
			else{
				num++;
			}
	
		}
		
	}
}
else{
	CID = CID + '0';
}

if(request.body.hairColor !== undefined){
	CID = CID + request.body.hairColor;
}
else{
	CID = CID + 9;
}
   
if(request.body.music !== undefined){
   CID = CID + request.body.music;
   }
else{
	CID = CID + 9;
}

var bestProf = findProf(CID);

var retval =  JSON.stringify({
	name: bestProf.child('name').val(),
	bio: bestProf.child('bio').val(),
	imgurl: bestProf.child('imgurl').val()
});




response.json(retval);

});

app.post('/view', function(request, response){
	userRef = new Firebase('http://jl-cuddleusers.firebaseio.com');
	var matches = {};
	var searchPref;
	var fireUsers;
	var fireIndex;
	var userPID;
	var searchEmail = request.body.email;

 	matches['a'] = [];
 	


	userRef.orderByKey().once('value', function(snapshot){
		//gets all the children and finds the CID for the current user
		snapshot.forEach(function(children){	
			
			var testEmail = children.child('email').val();
			//console.log(testEmail);
			//console.log(searchEmail);
			//console.log(" ")
			if(testEmail === searchEmail){
				searchPref = children.child('CID').val();
				snapshot.forEach(function(kid){
					if(testEmail === kid.child('email').val()){
						console.log("yay");
					}
					else{
				fireUsers=kid;
				fireIndex=0;
				userPID=kid.child('PID').val();
				//console.log(userPID);
	
				
			//finds all the users who have the similar interests *fireIndex>3
			for(var i = 0; i <searchPref.length; i++){
				
  				//console.log(searchPref[i] + " S");
  				//console.log(userPID[i] + " U");
  				//console.log(" ");
  				if(searchPref[i] === userPID[i] || searchPref[i] === '9'){
  					if(i === 0){
  						fireIndex = fireIndex+5;
  					}
  					else if(i === 1){
  						fireIndex = fireIndex+3;
  					}
  					else if(i === 2){
  						fireIndex = fireIndex+2;
  					}
  					else if(i === 3){
  						fireIndex = fireIndex+2;
  					}
  					else if(i === 4){
  						fireIndex++;
  					}
  					else{
  						fireIndex++;
  					}
  					//console.log(fireIndex+ "!");
  					//console.log('');
  				}
			
  			}
  			//console.log(fireIndex);
  			if(fireIndex >=7){
  				var musicchoice = checkMusic(kid.child('music').val());
  				var hairStyle = checkHair(kid.child('hair').val());
  				var person = {
  					location: kid.child('location').val(),
  					music:musicchoice,
  					hair:hairStyle,
  					sexPref: kid.child('sexualPreference').val(),
  					gender: kid.child('gender').val()

  				};
  				
  				matches['a'].push(person);
  			};
	

			}

				});
			}
			
		});
		
  			

  	//returns important stuff
			var retval =  JSON.stringify({
		matches:matches
	});
	response.json(retval);
	});
		
	
});


function findProf(searchPref){
	var CIDs = [];
	var profs = [];
	var fireIndexes = [];
		profRef.forEach(function(children){
			CIDs.push(children.key());
			profs.push(children);
			var fireIndex =0;
			//console.log(children.key());
			var userPID = children.key();

			//finds all the users who have the similar interests
			for(var i = 0; i <searchPref.length; i++){
				
  				//console.log(searchPref[i] + " S");
  				//console.log(userPID[i] + " U");
  				//console.log(" ");
				if(searchPref[0]==='2'){
					fireIndex= fireIndex+8;
				}

  				if(searchPref[i] === userPID[i] || searchPref[i] === '9'){
  					if(i === 0){
  						fireIndex = fireIndex+8;
  					}
  					else if(i === 1){
  						fireIndex = fireIndex+3;
  					}
  					else if(i === 2){
  						fireIndex = fireIndex+2;
  					}
  					else if(i === 3){
  						fireIndex = fireIndex+2;
  					}
  					else if(i === 4){
  						fireIndex++;
  					}
  					else{
  						fireIndex++;
  					}
  					//console.log(fireIndex+ "!");
  					//console.log('');
  				}
			
  			}
  			fireIndexes.push(fireIndex);
			});
	var bestIndex = ['0', '0']; 	
  	for(var i = 0; i < CIDs.length; i++){
  		//console.log(i + ")");
  		if(fireIndexes[i] > bestIndex['0']){
  			bestIndex[0]=fireIndexes[i];
  			bestIndex[1]=i;
  			//console.log(fireIndexes[i]);
  			//console.log('');
  		}

  	};
  	//console.log( profs[bestIndex[1]])
  	return profs[bestIndex[1]];

  			
		
  	
};

function checkMusic(i){
	var mo = ['Pop', 'Rock', 'Country', 'Metal', 'Alternative/Indie', 'Electronic', 'Smooth Jazz', 'Rap/Hip Hop', 'No Preference'];
	return mo[i-1];
};
function checkHair(i){
	var ho = ['Light Brown', 'Dark Brown', 'Platinum Blonde', 'Dirty Blonde', 'Strawberry Blonde', 'Black', 'Ginger', 'Dyed Something Ridiculous', 'No Preference'];
	return ho[i-1];
};

app.post('/cuddlers', function(request, response){
	var profs = {}
	profs['a']=[];
	var done = false;
	var i = 0;
	profRef.forEach(function(children){
		var person = {
			bio: children.child('bio').val(),
			imgurl: children.child('imgurl').val(),
			name: children.child('name').val()
		}
		profs['a'].push(person);
		i++;
		//console.log(i);
		//console.log(person);
		if(i===20){
					var retval =  JSON.stringify({
				profs:profs
			});
					//console.log("what");
			response.json(retval);
		}
	});

	

});


app.listen(3000);

