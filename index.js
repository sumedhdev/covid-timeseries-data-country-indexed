require('isomorphic-fetch');
const fs = require('fs');

console.time('downloading');
console.time('complete');
fetch('https://covid.ourworldindata.org/data/owid-covid-data.json')
  .then((res) => res.json())
  .then((timeseries) => {
    console.log('Downloaded data');
    console.timeEnd('downloading');
    const countryCodes = Object.keys(timeseries);
    console.log(`Number of keys = ${countryCodes.length}`);

    const meta = {};
    countryCodes.forEach((country) => {
      if (timeseries[country]?.continent) {
        const { data, ...rest } = timeseries[country];
        meta[country] = rest;
      }
    });

    console.time('writing-meta-data');
    fs.writeFileSync(`./timeseries/meta.json`, JSON.stringify(meta));
    console.timeEnd('writing-meta-data');

    console.time('writing-country-data');
    countryCodes.forEach((country, i) => {
      if (timeseries[country]?.continent) {
        fs.writeFile(
          `./timeseries/${country}.json`,
          JSON.stringify(timeseries[country]),
          (err) => {
            if (err) {
              console.error('Error while writing data for ' + country, err);
            }
          }
        );
      }
      if (i === countryCodes.length - 1) {
        console.timeEnd('writing-country-data');
        console.timeEnd('complete');
      }
    });
  })
  .catch((err) => console.error(err));
