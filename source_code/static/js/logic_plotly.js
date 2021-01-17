// Function to plot line graph of country's population over time
function displayLineGraph (populationData, countryName) {


        // Filter metadata set to return only sample data for matching ID and subjectID function parameter
        // i.e. Only returns metadata for the desired subject
        let countryPopulation = PopulationData.filter(Country == countryName);

        // Display metadata to console for checking
        // Using an index of 0 as subject_samples is an array of length 1
        console.log("From filter");
        console.log(countryPopulation);

        // // BAR CHART
        // // Retrieve Top 10 sample values 
        // // Already sorted in JSON data so can use .slice for values
        // let sampleValuesTop10 = subject_samples[0].sample_values.slice(0,10);

        // // Display sample values to console for checking
        // console.log(sampleValuesTop10);

        // // Retrieve otu IDs for Top 10 sample values
        // let otuIDsTop10 = subject_samples[0].otu_ids.slice(0,10);

        // // Display otu IDs to console for checking
        // console.log(otuIDsTop10);

        // // Convert otu IDs to array of strings with value "OTU {otuID}"
        // // To provide clearer display in bar chart
        // let otuIDsList = otuIDsTop10.map(otuID => `OTU ${otuID}`)

        // // Display strings to console for checking
        // console.log(otuIDsList);

        // // Retrieve otu labels for use in hovertext of bar chart
        // let otuLabelsTop10 = subject_samples[0].otu_labels.slice(0,10);

        // // Display labels to console for checking
        // console.log(otuLabelsTop10);

        // // Set up data for horizontal bar plot
        // // Must use reverse on arrays to display in descending order of sample values
        // let barData = [{
        //     type: "bar",
        //     x: sampleValuesTop10.reverse(),
        //     y: otuIDsList.reverse(),
        //     type: "bar",
        //     orientation: "h",
        //     text: otuLabelsTop10.reverse()
        //   }];
          
        // // Set title for bar chart
        // let barLayout = {
        //     title: "Top 10 OTU IDs by Sample Values"
        // };

        // // Use plotly to display bar chart at div ID "bar" with barData and barLayout
        // Plotly.newPlot('bar', barData, barLayout);
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

        displayLineGraph(countryPopulations, "China");
        
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