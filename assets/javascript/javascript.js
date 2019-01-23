function resetVals() {
    $("#train-name").val("");
    $("#train-dest").val("");
    $("#train-first").val("");
    $("#train-freq").val("");
}

//convert military time to standard time
function toStandardTime(militaryTime) {
    var militaryTime = militaryTime.split(':');
    if (militaryTime[0].charAt(0) == 1 && militaryTime[0].charAt(1) > 2) {
      return (militaryTime[0] - 12) + ':' + militaryTime[1] + ' P.M.';
    } else {
      return militaryTime.join(':') + ' A.M.';
    }
  }

function nextDepature(time) {

}



$(document).ready(function(){

    $("form").submit(function(event){
        //Capture Train Data from the submitted Form
        event.preventDefault();
        var newTrainName = $("#train-name").val();
        var newTrainDest = $("#train-dest").val();
        var newTrainFirst = $("#train-first").val();
        var newTrainFreq = $("#train-freq").val();
        resetVals();
        
        //Create new Table elements for Name, Destination, and Frequency
        var newTR = $("<tr>");
        var newTDName = $("<td>").text(newTrainName)
        var newTDDest = $("<td>").text(newTrainDest)
        var newTDFreq = $("<td>").text(newTrainFreq)

        //TODO: Compute next departure time based on Train First Starts data and Frequency
        var time = new Date();
        var currentHour = time.getHours();
        var currentMinutes = time.getMinutes();

        var timeSplit = newTrainFirst.toString().split(":")
        
        var departHours = currentHour - timeSplit[0];
        var departMinutes = currentMinutes - timeSplit[1];

        //Compute how many minutes remaining till next departure
        if (departHours < 0){
            departHours = departHours + -departHours + -departHours;
        }
        if (departMinutes < 0){
            departMinutes = departMinutes + -departMinutes + -departMinutes;
        }
        var minutesRemaining = (departHours*60) + departMinutes;
        newTDMinutes = $("<td>").text(minutesRemaining)

        if (timeSplit[0] > currentHour) {
            var newTDNextArrival = $("<td>").text(toStandardTime(newTrainFirst))
        } else {
           //calculate next valid departure time

        }
        


        //Append the new train to the database. //TODO: append next arrival and minutes away, Save to local storage
        newTR.append(newTDName, newTDDest, newTDFreq, newTDNextArrival, newTDMinutes)
        $("#tablebody").append(newTR)
    })

});