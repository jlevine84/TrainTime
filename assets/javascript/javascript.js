$(document).ready(function(){

    $("form").submit(function(event){
        event.preventDefault();
        trainName = $("#train-name").val();
        console.log(trainName)

    })

});