require('isomorphic-fetch');
const fs = require('fs');

console.time();
fetch('https://covid.ourworldindata.org/data/owid-covid-data.json')
  .then((res) => res.json())
  .then((timeseries) => {
    const countryCodes = Object.keys(timeseries);
    console.log(`Number of keys = ${countryCodes.length}`);

    countryCodes.forEach((countryCode) => {
      fs.writeFile(
        `./timeseries/${countryCode}.json`,
        JSON.stringify(timeseries[countryCode]),
        (err) => {
          if (err) {
            console.error('Error while writing data for ' + countryCode, err);
          } else {
            console.info('Successfully wrote data file for ' + countryCode);
          }
        }
      );
    });
  })
  .catch((err) => console.error('Error while downloading original data', err))
  .finally(() => {
    console.timeEnd();
  });
