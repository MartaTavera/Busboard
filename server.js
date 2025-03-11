const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const fetch = require('node-fetch'); 


async function handleCommand(cmd) {
  if (cmd === 'help') {
    return 'Available commands: help, search [postcode]';
  } else if (cmd.startsWith('search ')) {
    const postcode = cmd.substring(7).trim(); 
    try {
      const { latitude, longitude } = await getPostcodeLatitudeLongitude(postcode);
      const busData = await busInRadius(latitude, longitude);
      return busData; // Return formatted results
    } catch (error) {
      return `Error: ${error.message}`;
    }
  } else {
    return `Command not found: ${cmd}. Type 'help' for available commands.`;
  }
}

async function getPostcodeLatitudeLongitude(postcode) {
  try {
    const result = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
    if (result.status != 200) {
      throw new Error("Invalid postcode");
    }
    const response = await result.json();
    const longitude = response.result.longitude;
    const latitude = response.result.latitude;
    return { latitude, longitude };
  } catch (error) {
    throw new Error("Failed to get location data for postcode");
  }
}

async function busInRadius(latitude, longitude) {
  try {
    const Buses = await fetch(
      `https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&radius=500&lat=${latitude}&lon=${longitude}`
    )
    const result = await Buses.json();
    if (!result.stopPoints || result.stopPoints.length < 2) {
      return "No bus stops found within radius";
    }
    result.stopPoints.sort((a, b) => a.distance - b.distance);
    const stop1 = result.stopPoints[0].id;
    const stop2 = result.stopPoints[1].id;
    
    const responses = await Promise.all([
      fetch(`https://api.tfl.gov.uk/StopPoint/${stop1}/Arrivals`),
      fetch(`https://api.tfl.gov.uk/StopPoint/${stop2}/Arrivals`),
    ]);

    const arrivals = await Promise.all(responses.map(response => response.json()));
    
    const sortedStop1Arrivals = arrivals[0].sort((a, b) => a.timeToStation - b.timeToStation);
    const sortedStop2Arrivals = arrivals[1].sort((a, b) => a.timeToStation - b.timeToStation);
    
    let output = `Next five buses at stop ${stop1} ${result.stopPoints[0].commonName}:\n`;
    for (let i = 0; i < 5 && i < sortedStop1Arrivals.length; i++) {
      const bus = sortedStop1Arrivals[i];
      const route = bus.lineName;
      const destination = bus.destinationName;
      const timeToArrival = Math.round(bus.timeToStation / 60);
      output += `Bus ${route} to ${destination} arriving in ${timeToArrival} minutes\n`;
    }
    
    output += `\nNext five buses at stop ${stop2} ${result.stopPoints[1].commonName}:\n`;
    for (let i = 0; i < 5 && i < sortedStop2Arrivals.length; i++) {
      const bus = sortedStop2Arrivals[i];
      const route = bus.lineName;
      const destination = bus.destinationName;
      const timeToArrival = Math.round(bus.timeToStation / 60);
      output += `Bus ${route} to ${destination} arriving in ${timeToArrival} minutes\n`;
    }
    
    return output;
  } catch (error) {
    return `Error fetching bus data: ${error.message}`;
  }
}

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
        const command = message.toString();
        const result = await handleCommand(command);
        ws.send(result);
    });
    
    ws.send('Welcome to BusBoard! Type "help" for available commands.');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});