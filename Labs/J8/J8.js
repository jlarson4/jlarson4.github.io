//primefinder - square root the number, then run the number
//throguh all the numbers up to the square root to see if it is divisible


function prime(){
 
 console.log("HI");

document.querySelector("#work");
var num = parseInt(document.querySelector("#work"));
  return primeFinder(num);
}
function primeFinder(num){
 
  var numcounter = Math.sqrt(num);
  numcounter = Math.trunc(numcounter);
  console.log(numcounter);
  for(var i = 2; i < numcounter+3; i++){
    if((num%i) === 0){
      console.log(i + " is the current counter");

        break;
    }
    if(i >= numcounter)
    {
      console.log(num + " is prime.");
      return num + " is prime";
    }
  }
  console.log(num + " is not prime.");
  return num + " is not prime";
}
document.querySelector("#primeInfo").innerHTML = prime();
//string analysis
// gives the total number of words
// the number of occurences of each word
// the total number of distinct words
// array of strings with fewest letters
// array of strings with most letters

function stringAnalysis(string){

var substrings = string.split(" ");


var numStrings = substrings.length;
console.log(numStrings + " is how many strings we have");


//removing periods punctuation
var punct = [".", "!", "?", ","];
for(var i = 0; i < substrings.length; i++){

}

var bigNum = 0;
var littleNum = 10000000000000;

//finds the lowest and largest word lengths
for(var i = 0; i < substrings.length; i++){

  if(substrings[i].length > bigNum){
    bigNum = substrings[i].length;
  }

   if(substrings[i].length < littleNum){
    littleNum = substrings[i].length;
  }

}

var leastLetters = new Array();
var mostLetters = new Array();
var x = 0;
var o = 0;

//creates the array of the words
for(var i = 0; i < substrings.length; i++){

  if(substrings[i].length === littleNum){
    leastLetters[x] = substrings[i];
    x++;
  }

  if(substrings[i].length === bigNum){
    mostLetters[o] = substrings[i];
    o++;

  }
}

console.log(leastLetters.length + " word(s) have the least letters" );
console.log(mostLetters.length + " word(s) have the most letters" );
//var stringObject = {numstrings, occurences, distinct, leastLetters, mostLetters}
}

//document.getElementById("stringInfo").innerHTML = stringAnalysis("I have four word");

