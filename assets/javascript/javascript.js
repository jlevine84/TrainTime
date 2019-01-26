//Firebase configuration and initialize database
var config = {
    apiKey: "AIzaSyBujKqc5E8jtTGMdi_tijdFU6D0zc5_Pp8",
    authDomain: "train-time-51c47.firebaseapp.com",
    databaseURL: "https://train-time-51c47.firebaseio.com",
    projectId: "train-time-51c47",
    storageBucket: "train-time-51c47.appspot.com",
    messagingSenderId: "1082402305985"
};
firebase.initializeApp(config);
database = firebase.database();

//Local storage object for new trains
var trains = {
    name: [],
    destination: [],
    first: [],
    frequency: []
}

//Resets the field values
function resetVals() {
    $("#train-name").val("");
    $("#train-dest").val("");
    $("#train-first").val("");
    $("#train-freq").val("");
}

//Convert total minutes to Military Time
function timeConvert(time) {
    var minutes = time % 60;
    var hours = (time - minutes) / 60;
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    return hours + ":" + minutes;
}

//Convert Military Time to Standard Time
function toStandardTime(militaryTime) {
    var militaryTime = militaryTime.split(":");
    if (militaryTime[0].charAt(0) == 1 && militaryTime[0].charAt(1) > 2) {
      return (militaryTime[0] - 12) + ":" + militaryTime[1] + " P.M.";
    } else if (militaryTime[0].charAt(0) > 1 && militaryTime[0].charAt(1) < 5) {
        return (militaryTime[0] - 12) + ":" + militaryTime[1] + " P.M.";
    }else {
      return militaryTime.join(":") + " A.M.";
    }
}

//Function to calculate the total minutes remaining from the next valid departure time and the current time
function minutesLeft(nextArrival) {
    var time = new Date();
    var currentHour = time.getHours();
    var currentMinutes = time.getMinutes();
    var timeSplit = nextArrival.toString().split(":");
    var currentTime = (currentHour * 60) + currentMinutes;
    var departHours = parseInt(timeSplit[0]);
    var departMinutes = parseInt(timeSplit[1]);
    var nextDepart = (departHours * 60) + departMinutes;
    var minutesRemaining = nextDepart - currentTime;

    return minutesRemaining;
}

//Function to calculate the next valid departure time
function nextDeparture(nextTrain, frequency) {
    var time = new Date();
    var currentHour = time.getHours();
    var currentMinutes = time.getMinutes();
    var timeSplit = nextTrain.toString().split(":");
    var currentTime = (currentHour * 60) + currentMinutes;
    
    //Check to see if the train has yet to leave.
    if (parseInt(timeSplit[0]) > currentHour) {
        return nextArrival = nextTrain;  
    }

    //If the train already left, the next departure time is the previous departure time + the frequency
    if (parseInt(timeSplit[0]) < currentHour) {
        var departHours = parseInt(timeSplit[0]);
        var departMinutes = parseInt(timeSplit[1]);
        var nextDepart = (departHours * 60) + departMinutes + parseInt(frequency);

        //if next departure < current time - get the next departure time until next departure time is valid
        while (nextDepart <= currentTime) {
            nextDepart = nextDepart + parseInt(frequency);
        }
        
        //return the next Arrival Time
        return nextArrival = timeConvert(nextDepart);
    }
}

$(document).ready(function(){

    $("form").submit(function(event){
        //Capture Train Data from the submitted Form and reset the values
        event.preventDefault();
        var newTrainName = $("#train-name").val();
        var newTrainDest = $("#train-dest").val();
        var newTrainFirst = $("#train-first").val();
        var newTrainFreq = $("#train-freq").val();
        resetVals();
        
        //Push the Train Object to the database
        trains.name = newTrainName;
        trains.destination = newTrainDest;
        trains.first = newTrainFirst;
        trains.frequency = newTrainFreq;

        database.ref("/trains").push({
            trains: trains
        })
    })

    //Listener for trains the database and adds them to the table.
    database.ref("trains").on("child_added", function(snapshot) {
        
            //Grab data from each object in the database
            var trainsData = snapshot.val();

            //Create new Table elements for Name, Destination, and Frequency
            var newTR = $("<tr>");
            var newTDName = $("<td>").text(trainsData.trains.name);
            var newTDDest = $("<td>").text(trainsData.trains.destination);
            var newTDFreq = $("<td>").text(trainsData.trains.frequency);

            //Get Frequency and First Start time for functions
            var trainsFreq = trainsData.trains.frequency;
            var trainsFirst = trainsData.trains.first;

            //Compute next departure time based on Train First Starts data and Frequency. Create table elements
            var nextArrival = nextDeparture(trainsFirst, trainsFreq)
            newTDNextArrival = $("<td>").text(toStandardTime(nextArrival))

            //Compute how many minutes remaining till next departure time. Create table elements
            var minutesRemaining = minutesLeft(nextArrival)
            newTDMinutes = $("<td>").text(minutesRemaining)

            //Append the new train to the database 
            newTR.append(newTDName, newTDDest, newTDFreq, newTDNextArrival, newTDMinutes)
            $("#tablebody").append(newTR)
    });
});