import fetch from 'node-fetch';
  import promptSync from 'prompt-sync';
  
  const prompt = promptSync();
  const postcode = prompt('Please enter a postcode: ');
  //validate postcode
  


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
   






    import fetch from 'node-fetch';
    import promptSync from 'prompt-sync';
    
    const prompt = promptSync();
    
    async function getPostcodeAndFetchData() {
      let badResponse = true;
    
      while (badResponse) {
        const postcode = prompt('Please enter a postcode: ');
        const result = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
        if (!result.ok) {
          console.log('Incorrect Postcode. Please fill in correct postcode.');
        } else {
          const data = await result.json();
          const latitude = data.result.latitude;
          const longitude = data.result.longitude;
          badResponse = false; // If we reach this point, it means the postcode was valid and we can exit the loop
    
          // Step 2: Get the list of all bus stops within a certain radius of the given latitude and longitude
          const response = await fetch(`https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&radius=500&lat=${latitude}&lon=${longitude}`);
          const stopPointData = await response.json();
    
          // Step 3: Sort the list of bus stops by distance from the given postcode
          stopPointData.stopPoints.sort((a, b) => a.distance - b.distance);
    
          // Step 4: Get the next five buses at the two nearest bus stops
          const stop1 = stopPointData.stopPoints[0].id;
          const stop2 = stopPointData.stopPoints[1].id;
    
          const arrivals = await Promise.all([
            fetch(`https://api.tfl.gov.uk/StopPoint/${stop1}/Arrivals`).then(res => res.json()),
            fetch(`https://api.tfl.gov.uk/StopPoint/${stop2}/Arrivals`).then(res => res.json())
          ]);
    
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
        }
      }
    }
    
    // Call the function to start the process
    getPostcodeAndFetchData();
    


    import fetch from 'node-fetch';
    import promptSync from 'prompt-sync';
    
    const prompt = promptSync();
    
    async function getPostcodeAndFetchData() {
      let badResponse = true;
      let data, latitude, longitude;
    
      while (badResponse) {
        try {
          const postcode = prompt('Please enter a postcode: ');
          const result = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
          if (!result.ok) {
            console.log('Incorrect Postcode. Please fill in correct postcode.');
          } else {
            data = await result.json();
            latitude = data.result.latitude;
            longitude = data.result.longitude;
            badResponse = false; // If we reach this point, it means the postcode was valid and we can exit the loop
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    
      return { data, latitude, longitude };
    }
    
    // Call the function to start the process
    getPostcodeAndFetchData().then(({ data, latitude, longitude }) => {
      // Continue with your code here...
    });
