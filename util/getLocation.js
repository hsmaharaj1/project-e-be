const fetch = require('node-fetch');

async function getCoordinates(address) {
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.length > 0) {
            const location = data[0];
            const coordinates = {
                address: address,
                latitude: parseFloat(location.lat),
                longitude: parseFloat(location.lon)
            };
            return coordinates;
        } else {
            throw new Error('Unable to geocode address');
        }
    } catch (error) {
        throw new Error('Error fetching geocoding data: ' + error.message);
    }
}

// Example usage
const address = 'IIT Hyderabad, India';
getCoordinates(address)
    .then(coordinates => {
        console.log('Coordinates:', coordinates);
    })
    .catch(error => {
        console.error('Error:', error);
    });
