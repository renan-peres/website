import * as XLSX from "npm:xlsx";

// Basic table format with downloads
export function getTableFormat(data, options = {}) {
  const {
    rows = 30,
    datasetName = "data"
  } = options;

  // Create the download buttons
  const xlsxButton = document.createElement("button");
  xlsxButton.textContent = `Download ${datasetName}.xlsx`;
  xlsxButton.onclick = () => {
    try {
      // Convert data to array if it's not already
      const dataArray = Array.isArray(data) ? data : Array.from(data);
      
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
      // Convert data to array if it's not already
      const dataArray = Array.isArray(data) ? data : Array.from(data);
      
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
        if (typeof value === 'string' && value.includes('T')) return value;
        const date = new Date(Number(value));
        return date.toISOString().split('T')[0];
      },
      date: value => {
        if (!value) return '';
        if (typeof value === 'string' && value.includes('T')) return value;
        const date = new Date(Number(value));
        return date.toISOString().split('T')[0];
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
    dateColumns = ['Date', 'date'],
    dateFormat = date => date.toISOString().split('T')[0],
    additionalFormatting = {}
  } = options;

  // Create basic config
  const baseConfig = getTableFormat(data, { rows, datasetName });
  
  // Create custom format configuration
  const formatConfig = { ...additionalFormatting };
  dateColumns.forEach(colName => {
    formatConfig[colName] = value => {
      if (!value) return '';
      if (typeof value === 'string' && value.includes('T')) return value;
      const date = new Date(Number(value));
      return dateFormat(date);
    };
  });

  // Return combined configuration
  return {
    ...baseConfig,
    format: formatConfig
  };
}