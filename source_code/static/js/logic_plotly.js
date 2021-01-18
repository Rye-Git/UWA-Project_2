// Function to plot line graph of country's population over time
function displayLineGraph(populationData, countryName) {


        // Filter populationData to return only data for matching country name
        // i.e. Only returns data for the desired country for line graph
        let countryPopulation = populationData.filter(country => country.Country == countryName);

        // Display population data to console for checking
        // Should be array of length 1
        console.log(countryPopulation);

        populationYears = Object.keys(countryPopulation[0]);
        populationAmounts = Object.values(countryPopulation[0]);
        let lineData = {
            x: populationYears.slice(0,12).map(i => Number(i)),
            y: populationAmounts.slice(0,12),
            type: "scatter",
            mode: "lines+markers"
        };
        console.log(populationYears.slice(0,12).map(i => Number(i)));
        console.log(populationAmounts.slice(0,12));

        // Set title for line graph
        let lineLayout = {
             title: "Population Actual and Predicted 1970 to 2050"
        };
        
        // Use plotly to display bar chart at div ID "line" with lineData and lineLayout
        Plotly.newPlot('line', lineData, lineLayout);
}

// Initialisation function
function init() {

    // Name and path to JSON file with dataset 
    let countriesURL = "/api/population/countries";

    // Read in JSON from URL
    d3.json(countriesURL).then(function(data) {
    
        // Assign the population data for all countries to variable countryPopulations
        countryPopulations = data[0]["data"];

        // Display first country's to console for checking
        // Countries are in ranked order of population
        console.log(countryPopulations[0]);

        displayLineGraph(countryPopulations, "United States");
        
        // Select the ID of the dropdown menu
        // let dropdownMenu = d3.select("#selDataset");

        // Populate the dropdown list with the names/IDs of the subjects
        // Set with HTML tag <option>, attribute of the name/ID and text display of the name/ID
        // data.names.forEach(nameID => {
        //     dropdownMenu.append("option").attr("value", nameID).text(nameID);
        // });
        
    // Initialise page with demographic information and plots for first subject in dataset    
    // displayDemoInfo(data.names[0]);
    // displayPlots(data.names[0])

  });
  
}

// Call initialisation function
init();