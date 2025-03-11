const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const filePath = path.join(__dirname, "public", "suburbs-australia.csv");

const locationData = [];
const statesMap = {};

// Read the CSV file
fs.createReadStream(filePath)
  .pipe(csv())
  .on("data", (row) => {
    const stateName = row["state_name"];
    const stateCode = row["state"].toLowerCase();
    const suburb = row["suburb"];
    const postcode = row["postcode"];

    if (!statesMap[stateCode]) {
      statesMap[stateCode] = {
        label: stateName,
        value: stateCode,
        isCategory: true,
        suburbs: [],
      };
    }

    statesMap[stateCode].suburbs.push({
      label: `${suburb}, ${postcode}`,
      value: `${suburb.toLowerCase().replace(/ /g, "_")}_${postcode}`,
      parent: stateName,
    });
  })
  .on("end", () => {
    for (const stateCode in statesMap) {
      locationData.push({
        label: statesMap[stateCode].label,
        value: stateCode,
        isCategory: true,
      });

      locationData.push({
        label: `${stateCode.toUpperCase()} Suburbs`,
        value: `${stateCode}_suburbs`,
        options: statesMap[stateCode].suburbs,
      });
    }

    // Convert to JavaScript file format
    const outputJs = `const locationData = ${JSON.stringify(locationData, null, 2)};\nexport default locationData;`;

    // fs.writeFileSync(path.join(__dirname, "public", "locations.js"), outputJs);
    fs.writeFileSync(path.join(__dirname, "data", "locations.json"), JSON.stringify(locationData, null, 2));
    console.log("locations.js file has been generated successfully.");
  });