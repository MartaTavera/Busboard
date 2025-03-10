import fetch from 'node-fetch';
import promptSync from 'prompt-sync';

//const prompt = promptSync();
//const result = prompt("Please enter a bus code: ");

let lon = 0;
let lat = 0;
fetch('https://api.postcodes.io/postcodes/')
    .then(response => response.json())
console.log("I got this far ");
.then(data => {
    for (let i = 0; i < data.lentgh && i < 5; i++) {
        const postcode = data[i];
        lon = postcode.longitude;
        lat = postcode.latitude;
        console.log("print latitude ", data[i].latitude);
    }
    //const postcode = data[i]

})
    .catch(error => console.error(error));

console.log("Second Part ");
fetch(`https://api.tfl.gov.uk/StopPoint/490008660N/Arrivals`)
    //fetch(`https://api.tfl.gov.uk/StopPoint/${result}/Arrivals`)
    .then(response => response.json())
    .then(data => {
        console.log(`Next five buses at stop :`);
        //console.log(`Next five buses at stop ${result}:`);
        for (let i = 0; i < 5 && i < data.length; i++) {
            const bus = data[i];
            const route = bus.lineName;
            const destination = bus.destinationName;
            const timeToArrival = Math.round(bus.timeToStation / 60);
            console.log(`Bus ${route} to ${destination} arriving in ${timeToArrival} minutes`);
        }
    })
    .catch(error => console.error(error));

/*
// Step 2: Get the list of all bus stops within a certain radius of the given latitude and longitude
    fetch(`https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&radius=500&lat=${latitude}&lon=${longitude}`)
      .then(response => response.json())
      .then(data => {
        
        
*/


import fetch from 'node-fetch';
import promptSync from 'prompt-sync';

const prompt = promptSync();
const postcode = prompt('Please enter a postcode: ');

// Step 1: Get the latitude and longitude of the given postcode
fetch(`https://api.postcodes.io/postcodes/${postcode}`)
    .then(response => response.json())
    .then(data => {
        const latitude = data.result.latitude;
        const longitude = data.result.longitude;

        // Step 2: Get the list of all bus stops within a certain radius of the given latitude and longitude
        fetch(`https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&radius=500&lat=${latitude}&lon=${longitude}`)
            .then(response => response.json())
            .then(data => {

                // Step 3: Sort the list of bus stops by distance from the given postcode
                data.stopPoints.sort((a, b) => a.distance - b.distance);

                // Step 4: Get the next five buses at the two nearest bus stops
                const stop1 = data.stopPoints[0].id;
                const stop2 = data.stopPoints[1].id;


                Promise.all([
                    fetch(`https://api.tfl.gov.uk/StopPoint/${stop1}/Arrivals`),
                    fetch(`https://api.tfl.gov.uk/StopPoint/${stop2}/Arrivals`)
                ])

                    .then(responses => Promise.all(responses.map(response => response.json())))


                    .then(arrivals => {
                        console.log(`Next five buses at stop ${stop1}:`);
                        for (let i = 0; i < 5 && i < arrivals[0].length; i++) {
                            const bus = arrivals[0][i];
                            const route = bus.lineName;
                            const destination = bus.destinationName;
                            const timeToArrival = Math.round(bus.timeToStation / 60);
                            console.log(`Bus ${route} to ${destination} arriving in ${timeToArrival} minutes`);
                        }
                        console.log(`Next five buses at stop ${stop2}:`);
                        for (let i = 0; i < 5 && i < arrivals[1].length; i++) {
                            const bus = arrivals[1][i];
                            const route = bus.lineName;
                            const destination = bus.destinationName;
                            const timeToArrival = Math.round(bus.timeToStation / 60);
                            console.log(`Bus ${route} to ${destination} arriving in ${timeToArrival} minutes`);
                        }
                    })


                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
    })
    .catch(error => console.error(error));


