import fetch from "node-fetch";
import promptSync from "prompt-sync";

const prompt = promptSync();

async function nextBuses(){
  const { latitude, longitude } = await getPostcodeLatitudeLongitude()

  const buses = await busInRadius(latitude, longitude)
}

// Step 1: Get the latitude and longitude of the given postcode
async function getPostcodeLatitudeLongitude() {
  let badResponse = true;
  let latitude, longitude;
  while (badResponse) {
    try {
      var postcode = prompt("Please enter a postcode: ");
      const result = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
      if (result.status != 200) {
          postcode = prompt("Please enter a valid postcode ");
      }
      else {
        badResponse = false;
        const response = await result.json();
        longitude = response.result.longitude;
        latitude = response.result.latitude;
        console.log("let and lon ", latitude, longitude);
      }
    }
      catch (error){
      }
  }   return {latitude, longitude}; 
  
}   
  
 async function busInRadius(latitude, longitude){
  try {
 const Buses =  await fetch(
  `https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&radius=500&lat=${latitude}&lon=${longitude}`)
  const result = await Buses.json();

        console.log("Entries ", typeof (result));
        if (!result.stopPoints) {
          console.log("No stopPoints found in the response");
          return;
        }
        // Step 3: Sort the list of bus stops by distance from the given postcode
        result.stopPoints.sort((a, b) => a.distance - b.distance);

        // Step 4: Get the next five buses at the two nearest bus stops
        const stop1 = result.stopPoints[0].id;
        const stop2 = result.stopPoints[1].id;
        
        return Promise.all([
          fetch(`https://api.tfl.gov.uk/StopPoint/${stop1}/Arrivals`),
          fetch(`https://api.tfl.gov.uk/StopPoint/${stop2}/Arrivals`),
        ])

          .then((responses) =>
            Promise.all(responses.map((response) => response.json()))
          )

          .then((arrivals) => {
            console.log(`Next five buses at stop ${stop1} ${result.stopPoints[0].commonName} :`);
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
              console.log(`Bus ${route} to ${destination} arriving in ${timeToArrival} minutes`
              );
            }
          });
        } catch (error) {
          console.error("Error fetching bus data:", error);
        }
      }

nextBuses();











