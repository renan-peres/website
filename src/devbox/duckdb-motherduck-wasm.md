<!-- ---
title: MotherDuck Dashboard (Mosaic)
index: true 
toc: true
---

# MotherDuck Dashboard (Mosaic)

```js
import { MDConnection } from '@motherduck/wasm-client/with-arrow';
import * as XLSX from "npm:xlsx";
import * as vg from "@uwdata/vgplot";
import { token } from "../assets/secrets/motherduck_token.js";
import { html } from "@observablehq/stdlib";
import { Inputs } from "@observablehq/inputs";

const loadWasmModule = async () => {
  try {
    const connection = await MDConnection.create({
      mdToken: token,
      wasmUrl: "https://cdn.motherduck.com/motherduck-duckdb-wasm/1.1.3/motherduck.duckdb_extension.wasm",
      duckdbConfig: {
        mainModuleURL: "https://cdn.motherduck.com/motherduck-duckdb-wasm/1.1.3/duckdb-browser.worker.js"
      }
    });
    await connection.isInitialized();
    return connection;
  } catch (error) {
    console.error("WASM initialization error:", error);
    throw error;
  }
};

async function mdConnector(token) {
  const connection = await loadWasmModule();
  return {
    query: async (query) => {
      try {
        const { sql, type } = query;
        const result = await connection.evaluateQuery(sql);
        
        switch (type) {
          case "arrow":
            return result.data;
          case "json":
            return result.data.toRows();
          case "exec":
            return undefined;
        }
      } catch (error) {
        console.error("Query error:", error);
        throw error;
      }
    },
  };
}

const connector = await mdConnector(token);
const app = document.querySelector("#app");

vg.coordinator().databaseConnector(connector);

const table = "s.main.gaia_sample_1_percent_projected";
const size = await connector.query({ 
  sql: `SELECT * FROM information_schema.tables WHERE table_schema = 'main'`, 
  type: "arrow" 
});

const data = size.toRows();
const datasetname = "motherduck_tables";

display(html`
  <div style="display: flex; margin-bottom: 10px;">
    ${Inputs.button(`Download ${datasetname}.xlsx`, {
      reduce() {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet);
        XLSX.writeFile(workbook, `${datasetname}.xlsx`);
      }
    })}
    ${Inputs.button(`Download ${datasetname}.csv`, {
      reduce() {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const csvContent = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${datasetname}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    })}
  </div>
  ${Inputs.table(size, { rows: 30 })}
`);
``` -->