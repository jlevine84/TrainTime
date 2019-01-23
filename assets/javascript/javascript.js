function resetVals() {
    $("#train-name").val("");
    $("#train-dest").val("");
    $("#train-first").val("");
    $("#train-freq").val("");
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

        //TODO: Compute next departure time based on Train First Starts data

        
        //TODO: Compute how many minutes remaining till next departure

        //Append the new train to the database. //TODO: append next arrival and minutes away, Save to local storage
        newTR.append(newTDName, newTDDest, newTDFreq)
        $("#tablebody").append(newTR)
    })

});