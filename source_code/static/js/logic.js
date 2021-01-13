var url = "/api/population/live"
d3.json(url).then(function(response){
    console.log(response)
    console.log(response[0]['data'])
});