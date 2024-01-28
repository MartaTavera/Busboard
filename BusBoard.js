import fetch from 'node-fetch';
import promptSync from 'prompt-sync';

const prompt = promptSync();
//var result = prompt("Please enter a bus code  ");
//console.log(result);
let content = [];
let selectedData = 0;
async function getResult() {
    const result = await fetch("https://api.tfl.gov.uk/StopPoint/490008660N/Arrivals");
    const response = await result.json();
    return response;
}
   
    //fetch(`https://api.tfl.gov.uk/StopPoint/${result}/Arrivals`)
    let data = await  getResult();

    //.then(data => {
        //console.log(data);
        //let content = [];
       // console.log(`data received length: ${data.length}`);
        for (let i = 0; i < data.length; i++) 
        {
            let d = data[i];
            content[i] = {BusRoute: data[i].lineName, // BusRoute: data[i].lineName
                        stationName: d.stationName, 
                        Estimated_Arrival_Time: Math.floor(d.timeToStation/60) , 
                        destinationName:d.destinationName};
                        //console.log(content[i]);
            console.log("next Bus ", data[i].lineName, " to: ", d.stationName, "  arrives in  ", content[i]["Estimated_Arrival_Time"]);
        }
      //
    //}
    
    
    //async function getThing() {
    //    const result = await fetch("https://api.tfl.gov.uk/StopPoint/490008660N");
    //    const response = await result.json();
    //}
    /*
    //.then(stuff => {console.log("stuff:", stuff.length); 
//console.log(stuff);})

    //.then(data => console.log(data))
    //data=> data.forEach(function())
    .catch(error => console.error(error)); // Would need to be wrapped in try if using await.
console.log(" THIS IS SELECTED DATA ", selectedData);
/*
In your case, you can replace key with the name of the key you want to access. 
For example, if you want to access the id of the first dictionary in the array, you can use data[0].id.
console.log(content);
/*
the next five buses at that stop code, with their routes, destinations, and the time until they arrive in minutes.




//const result = prompt("Please enter a bus code");
//console.log(result);

//fetch(`https://api.tfl.gov.uk/StopPoint/${result}/Arrivals`)

fetch(`https://api.tfl.gov.uk/StopPoint/490008660N/Arrivals`)


array.forEach(function() {
  
});
*/

