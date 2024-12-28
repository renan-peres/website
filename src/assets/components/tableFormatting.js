import * as XLSX from "npm:xlsx";
import * as d3 from "d3";

// Basic table format with downloads
export function getTableFormat(data, options = {}) {
  const {
    rows = 30,
    datasetName = "data"
  } = options;

  // Ensure data is converted to a plain array of objects
  let dataArray = data.toArray ? data.toArray().map(row => Object.fromEntries(row)) : 
                  Array.isArray(data) ? data : 
                  Array.from(data);

  // Apply date parsing to the data
  dataArray = dataArray.map(item => {
    Object.entries(item).forEach(([key, value]) => {
      if (value && (key === 'Date' || key === 'date')) {
        item[key] = d3.timeFormat("%Y-%m-%d")(d3.isoParse(value) || new Date(value));
      }
    });
    return item;
  });

  // Create the download buttons
  const xlsxButton = document.createElement("button");
  xlsxButton.textContent = `Download ${datasetName}.xlsx`;
  xlsxButton.onclick = () => {
    try {
      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(dataArray);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, datasetName);
      
      // Write file
      XLSX.writeFile(workbook, `${datasetName}.xlsx`);
    } catch (error) {
      console.error('Error creating Excel file:', error);
    }
  };

  const csvButton = document.createElement("button");
  csvButton.textContent = `Download ${datasetName}.csv`;
  csvButton.onclick = () => {
    try {
      // Create worksheet and convert to CSV
      const worksheet = XLSX.utils.json_to_sheet(dataArray);
      const csvContent = XLSX.utils.sheet_to_csv(worksheet);
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${datasetName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating CSV file:', error);
    }
  };

  // Style the buttons
  [xlsxButton, csvButton].forEach(button => {
    button.className = "button"; // Use Observable's default button class
    button.style.marginRight = "10px";
  });

//   // Style the buttons
//   [xlsxButton, csvButton].forEach(button => {
//     button.style.marginRight = "10px";
//     button.style.marginBottom = "10px";
//     button.style.padding = "8px 16px";
//     button.style.background = "#4CAF50";
//     button.style.color = "white";
//     button.style.border = "none";
//     button.style.borderRadius = "4px";
//     button.style.cursor = "pointer";
//   });

  // Create the container
  const container = document.createElement("div");
  const buttonContainer = document.createElement("div");
  buttonContainer.style.marginBottom = "10px";
  buttonContainer.appendChild(xlsxButton);
  buttonContainer.appendChild(csvButton);
  container.appendChild(buttonContainer);

  // Return the formatting configuration and buttons
  return {
    container,
    format: {
      Date: value => {
        if (!value) return '';
        const date = d3.isoParse(value) || new Date(value);
        return d3.timeFormat("%Y-%m-%d")(date);
      },
      date: value => {
        if (!value) return '';
        const date = d3.isoParse(value) || new Date(value);
        return d3.timeFormat("%Y-%m-%d")(date);
      }
    },
    rows
  };
}

// Custom table format with more options
export function getCustomTableFormat(data, options = {}) {
  const {
    rows = 30,
    datasetName = "data",
    dateColumns = ['Date', 'date', 'created_date', 'updated_date', 'date_of_birth'],
    dateFormat = d3.timeFormat("%Y-%m-%d"),
    additionalFormatting = {}
  } = options;

  // Create basic config
  const baseConfig = getTableFormat(data, { rows, datasetName });
  
  // Create custom format configuration
  const formatConfig = { ...additionalFormatting };
  dateColumns.forEach(colName => {
    formatConfig[colName] = value => {
      if (!value) return '';
      const date = d3.isoParse(value) || new Date(value);
      return dateFormat(date);
    };
  });

  // Return combined configuration
  return {
    ...baseConfig,
    format: formatConfig
  };
}