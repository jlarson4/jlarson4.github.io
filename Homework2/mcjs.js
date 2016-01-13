$("#calculate").on("click",function(){
	mortgageInfo(); return false;
});

$(document).on("click", "#recalc #recalculate", function(){
	mortgageInfo(); return false;
});

for(var i = 0; i <=360; i++){
	$("#start").append('<option id="s'+i+'"> '+i+' </option>');
	$("#end").append('<option id="e'+i+'"> '+i+' </option>');

}



function mortgageInfo(){

$('#summary').empty();
$('#output').empty();
$('#recalc').empty();


var monthNumber= [0];
var monthlyPayment=[0];
var paymentToInterest=[0];
var paymentToPrinciple=[0];
var principle = [document.querySelector("#loanAmnt").value];

//ensures the principle is filled out
if(principle == null || principle == ""){
	$('#summary').append('<br><p class="p-warning"><em>Your Loan Amount is invalid, please try again</em></p><br>');
return 0;
}
principle[0] = parseInt(principle);

//ensures the principle is greater than 0
if(principle[0]<0 || principle[0]==null){
	$('#summary').append('<br><p class="p-warning"><em>Your Loan Amount is invalid, please try again</em></p><br>');
return 0;
}

var annualInterest = document.querySelector("#interest").value;

//ensures the interest rate is filled out
if(annualInterest==null || annualInterest==""){
	$('#summary').append('<br><p class="p-warning"><em> Your Annual Interest Rate is invalid, please try again</em></p><br>');
return 0;
}
annualInterest=parseInt(annualInterest);
//ensures the interest rate is between 0 and 100
if(annualInterest<0 || annualInterest>100){
	$('#summary').append('<br><p class="p-warning"><em> Your Annual Interest Rate is invalid, please try again</em></p><br>');
return 0;
}



var years = 30;

//sets the year properly
if(y15.checked===true){
	years = 15;
}
else if(y20.checked===true){
	years = 20;
}
else if(y30.checked===true){
	years = 30;
}
else{
	$('#summary').append('<br><p class="p-warning"><em>Please select a duration</em></p><br>');
return 0;
}


//sets start and end months, then fixes them if they are bad values
var startMonth = parseInt(document.querySelector('#start').value);
var endMonth = parseInt(document.querySelector('#end').value);

if(endMonth < startMonth){
	var temp = endMonth;
	endMonth=startMonth;
	startMonth=temp;
}

//too large end value
if(endMonth > (years*12)){
	endMonth= (years*12);
}

//too large start value
if(startMonth > (years*12)){
	startMonth= 0;
}


//calculate the monthly payment
var monthlyInterest = annualInterest/1200;
var powInt = Math.pow((monthlyInterest + 1), (years*(-12)));
monthlyPayment[0] = (monthlyInterest / (1 - powInt))*principle;

//sets up all the data in memory
console.log("MN | MP | PtI | PtP | P");
for(var i = 1; i <= (years*12); i++){

	//set the monthly payment and month number for every month.
	monthlyPayment[i] = monthlyPayment[0];
	monthNumber[i] = i;
	

	//determine the amount of money that goes to interest and principle each month
	paymentToInterest[i]= (principle[i-1]*monthlyInterest);
	paymentToPrinciple[i]= monthlyPayment[0] - paymentToInterest[i];

	//recalculate the principle
	principle[i]=principle[i-1]-paymentToPrinciple[i];
	
	if(i === (years*12)){
		principle[i] = 0;
	}

	console.log(monthNumber[i] + "|" + (monthlyPayment[i]).toFixed(2) + "|" + paymentToInterest[i] + "|" + paymentToPrinciple[i] + "|" + principle[i]);
}

var totalAmntPaid = years*12*monthlyPayment[1] ;
var interestPaid = totalAmntPaid-principle[0];
var ratio = totalAmntPaid/principle[0];

	//creates a second button to recalculate at the top. 
	$('#recalc').append('<button id="recalculate" class="btn btn-info"> Recalculate </button>');
	$('#calculate').html('Recalculate');
	//show summary in div
	$('#summary').append('<h4><strong> Summary</strong></h4>')
	$('#summary').append(  '<table class="table table-hover" />' );
	$('#summary table').append('<tr class="info" id="la"><td><strong> Loan Amount:</strong> $' + principle[0] + '</td></tr>');
	$('#summary table').append('<tr class="info" id="tap"><td><strong> Total Amount Paid:</strong> $' + (totalAmntPaid).toFixed(2) + '</td></tr>');
	$('#summary table').append('<tr class="info" id="mp"><td><strong> Monthly Payment:</strong> $' + (monthlyPayment[1]).toFixed(2) + '</td></tr>');
	$('#summary table').append('<tr class="info"  id="ip"><td><strong> Interest Paid:</strong> $' + (interestPaid).toFixed(2) + '</td></tr>');
	$('#summary table').append('<tr class="info" id="rot"><td><strong> Ratio of Total:</strong> ' + (ratio).toFixed(2) + '</td></tr>');
	$('#summary table').append('<br>');

	//show output in div
	$('#output').append('<h3><strong>Monthly Schedule</strong></h3>')
	$('#output').append(  '<table class="table-hover table-bordered table-condensed" id="infoTable"/>' );
	$('#output table').append(  '<tr id="year"><th> Month Number </th><th> Monthly Payment </th><th>  Paid to Interest </th><th> Paid to Principle </th><th> Remaining Principle</th></tr>' );

	for(var i=startMonth;i<=endMonth;i++){
		if((i%12) === 1 ){
    	$('#output table').append( '<tr id="year"><td></td><td></td><td class="text-center"><strong>Year '+((1+i/12)).toFixed(0) +'</strong></td><td></td><td></td></tr>' );

		}

    $('#output table').append( '<tr id="r' + i + '"><td>' + monthNumber[i] + '</td><td> $'+ (monthlyPayment[i]).toFixed(2) + '</td><td> $'+ (paymentToInterest[i]).toFixed(2) + '</td><td> $'+ (paymentToPrinciple[i]).toFixed(2) + '</td><td> $'+ (principle[i]).toFixed(2) + '</td></tr>' );

	}

}

