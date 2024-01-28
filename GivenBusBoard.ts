import fetch from 'node-fetch';
import promptSync from 'prompt-sync';

const prompt = promptSync();
const result = prompt("Please enter a bus code: ");

fetch(`https://api.tfl.gov.uk/StopPoint/${result}/Arrivals`)
  .then(response => response.json())
  .then(data => {
    console.log(`Next five buses at stop ${result}:`);
    for (let i = 0; i < 5 && i < data.length; i++) {
      const bus = data[i];
      const route = bus.lineName;
      const destination = bus.destinationName;
      const timeToArrival = Math.round(bus.timeToStation / 60);
      console.log(`Bus ${route} to ${destination} arriving in ${timeToArrival} minutes`);
    }
  })
  .catch(error => console.error(error));
