function createDashboard(sample) {
  d3.json("samples.json").then((data) => {
    var data = data.metadata;
    
    // Filter the data for the object with the desired sample number
    var resultArray = data.filter(sampleObj => sampleObj.id == sample);
    // Filter Output
    var result = resultArray[0];

    // Select panel with `#sample-metadata` ID
    var htmlPanel = d3.select("#sample-metadata");

    // Clear existing data
    htmlPanel.html("");

    // Add each key and value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      htmlPanel.append("h6").text(`${key.charAt(0).toUpperCase() + key.substring(1)}: ${value}`);
    });
  });
}

// Set variables for chart creation
function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // Build Bubble Chart
    var bubbleChart = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Portland"
        }
      }
    ];

    Plotly.newPlot("bubble", bubbleData, bubbleChart);
  
    // Build Gauge
    var gaugeChart = {
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };

    var gaugeData = [
      {
        type: "scatter",
        x: [0],
        y: [0],
        color: '66CDAA',
        value: 4,
        title: { text: "Weekly Wash Frequency" },
        type: "indicator",
        mode: "number+gauge+indicator",
      }
    ];
    var gauge = document.getElementById("gauge");
    Plotly.newPlot("gauge", gaugeData, gaugeChart);

    // Build Bar Chart
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    var barChart = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, barChart);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first selection from the list for default display
    var DefaultDisplay = sampleNames[0];
    buildCharts(DefaultDisplay);
    createDashboard(DefaultDisplay);
  });
}

function optionChanged(newData) {
  // Fetch new data each time a new sample is selected
  buildCharts(newData);
  createDashboard(newData);
}

// Initialize dashboard
init();
