const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const filePath = path.join(__dirname, "public", "Clubs-Table 1.csv");

const sportsData = [];
const sportsMap = {};

// Read the CSV file
fs.createReadStream(filePath)
  .pipe(csv())
  .on("data", (row) => {
    const sport = row["Sport"];
    const club = row["Club"];

    if (!sport || !club) return; // Skip invalid rows

    const sportKey = sport.toLowerCase().replace(/ /g, "_");
    const clubKey = club.toLowerCase().replace(/ /g, "_");

    // If sport is not added, create category
    if (!sportsMap[sportKey]) {
      sportsMap[sportKey] = {
        label: sport,
        value: sportKey,
        isCategory: true,
        clubs: [],
      };
    }

    // Add club under the sport
    sportsMap[sportKey].clubs.push({
      label: club,
      value: clubKey,
      parent: sport,
    });
  })
  .on("end", () => {
    for (const sportKey in sportsMap) {
      sportsData.push({
        label: sportsMap[sportKey].label,
        value: sportKey,
        isCategory: true,
      });

      sportsData.push({
        label: `${sportsMap[sportKey].label} Clubs`,
        value: `${sportKey}_clubs`,
        options: sportsMap[sportKey].clubs,
      });
    }

    // Save the data to a JSON file
    const outputJsonPath = path.join(__dirname, "data", "sportsData.json");
    fs.writeFileSync(outputJsonPath, JSON.stringify(sportsData, null, 2));

    console.log("sportsData.json file has been generated successfully.");
  });