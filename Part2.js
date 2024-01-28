import fetch from "node-fetch";
import promptSync from "prompt-sync";

const prompt = promptSync();
var postcode = prompt("Please enter a postcode: ");

// Step 1: Get the latitude and longitude of the given postcode
async function getPostcodeLatitudeLongitude() {
  let badResponse = true;
  while (badResponse) {
    try {
      var postcode = prompt("Please enter a postcode: ");
      const result = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
      if (result.status != 200) {
          postcode = prompt("Please enter a valid postcode ");
      }
      else {
        badResponse = false;
        const response = await result.json;
        for (let i = 0; i < data.lentgh && i < 5; i++) {
          const postcode = data[i];
          longitude = postcode.longitude;
          latitude = postcode.latitude;
          console.log("print latitude ", data[i].latitude);
        }
      }
    }
      catch (error){
      }
  }   return (latitude, longitude); 
}   
  
 async function busInRadius(latitude, longitude){
 const Buses =  await fetch(
  `https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&radius=500&lat=${latitude}&lon=${longitude}`)
  const result = await Buses
/*
  .then((data) => {
    for (let i = 0; i < data.lentgh && i < 5; i++) {
      const postcode = data[i];
      longitude = postcode.longitude;
      latitude = postcode.latitude;
      console.log("print latitude ", data[i].latitude);
    }
*/
    /*
    const latitude = data.result.latitude;
    const longitude = data.result.longitude;
    console.log("latitude and longitude :", data.result.latitude , " ",  longitude);
    */
    // Step 2: Get the list of all bus stops within a certain radius of the given latitude and longitude
    fetch(
      `https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&radius=500&lat=${latitude}&lon=${longitude}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Entries ", typeof (data));

        // Step 3: Sort the list of bus stops by distance from the given postcode
        data.stopPoints.sort((a, b) => a.distance - b.distance);

        // Step 4: Get the next five buses at the two nearest bus stops
        const stop1 = data.stopPoints[0].id;
        const stop2 = data.stopPoints[1].id;


        Promise.all([
          fetch(`https://api.tfl.gov.uk/StopPoint/${stop1}/Arrivals`),
          fetch(`https://api.tfl.gov.uk/StopPoint/${stop2}/Arrivals`),
        ])

          .then((responses) =>
            Promise.all(responses.map((response) => response.json()))
          )

          .then((arrivals) => {
            console.log(`Next five buses at stop ${stop1}:`);
            for (let i = 0; i < 5 && i < arrivals[0].length; i++) {
              const bus = arrivals[0][i];
              const route = bus.lineName;
              const destination = bus.destinationName;
              const timeToArrival = Math.round(bus.timeToStation / 60);
              console.log(
                `Bus ${route} to ${destination} arriving in ${timeToArrival} minutes`
              );
            }
            console.log(`Next five buses at stop ${stop2}:`);
            for (let i = 0; i < 5 && i < arrivals[1].length; i++) {
              const bus = arrivals[1][i];
              const route = bus.lineName;
              const destination = bus.destinationName;
              const timeToArrival = Math.round(bus.timeToStation / 60);
              console.log(
                `Bus ${route} to ${destination} arriving in ${timeToArrival} minutes`
              );
            }
          })

          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  })
    .catch((error) => console.error(error));














