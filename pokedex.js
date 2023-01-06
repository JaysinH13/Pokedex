const fs = require('fs');
const axios = require('axios');

axios.get('https://pokeapi.co/api/v2/pokemon')
  .then((response) => {
    const pokemon = response.data.results.map((result) => {
      return {
        name: result.name,
        stats: {
          // Make another API call to get the stats for this Pokemon
        },
        description: '', // Get the description for this Pokemon
      };
    });

    fs.writeFile('pokemon.json', JSON.stringify(pokemon), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('File written successfully');
    });
  })
  .catch((err) => {
    console.error(err);
  });
