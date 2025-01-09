---
title: HuggingFace Model Inference
theme: dashboard
index: true
toc: false
source: https://observablehq.com/@huggingface/hello-huggingface-js-inference | https://huggingface.co/learn/cookbook/enterprise_hub_serverless_inference_api | https://huggingface.co/docs/huggingface.js/hub/README | https://huggingface.co/docs/huggingface.js/inference/README
keywords: 
sql:
  stock_quotes: https://aws-test-duckdb.s3.us-east-2.amazonaws.com/finance/stock_quotes.parquet
  company_profiles: https://raw.githubusercontent.com/renan-peres/datasets/refs/heads/master/data/finance/company_profile.parquet
---

```js
import { datetime } from "../../assets/components/datetime.js";
import {getDefaultClient} from "observablehq:stdlib/duckdb";
import * as XLSX from "npm:xlsx";
import { DEFAULT_CONFIG, getCustomTableFormat, formatUrl, createCollapsibleSection } from "../../assets/components/tableFormatting.js";
import * as htl from "htl";
import * as arrow from "apache-arrow";
import { HfInference } from '@huggingface/inference';
const db = await getDefaultClient();

const secrets = await FileAttachment("../../assets/loaders/secrets.json").json();
const HF_TOKEN = secrets.HF_TOKEN;
const hf = new HfInference(HF_TOKEN);
```

```html
<style>
  
h1, h2, h3, h4, h5, h6, p, li, ul, ol {
  width: 100% !important;
  max-width: none !important;
  margin-right: 0 !important;
  padding-right: 0 !important;
}

</style>
```


# HuggingFace Serverless Model Inference

<div class="datetime-container"> <div id="datetime"></div> </div>

---

### References

* [@huggingface/hello-huggingface-js-inference](https://observablehq.com/@huggingface/hello-huggingface-js-inference): Original Inspiration
* [@huggingface/hub](https://huggingface.co/docs/huggingface.js/hub/README): Interact with huggingface.co to create or delete repos and commit / download files
* [@huggingface/inference](https://huggingface.co/docs/huggingface.js/inference/README): Use the Inference API to make calls to Machine Learning models

### Loading

The library runs on Node.js and browser environments and is available on npm [@huggingface/inference](https://www.npmjs.com/package/@huggingface/inference). To load it in a browser, you can use ES modules via [skypack.dev](https://skypack.dev)


### Access Token
Using an API key is optional to get started, however you will be rate limited eventually. To get a a new token go to [setting/tokens](https://huggingface.co/settings/tokens). Please note that this access token is intended to be kept private and only used here for experimental purposes.

---

## Table Question Answering

```sql id = tableData display=true
FROM stock_quotes;
```

```js
function formatTableData(data) {
  const formattedTable = {};
  const columns = data.schema.fields.map(f => f.name);
  
  columns.forEach(col => {
    // Convert Arrow table column to array
    const columnArray = Array.from(data.getChild(col));
    formattedTable[col] = columnArray.map(val => String(val));
  });
  
  return formattedTable;
};
```

```js
// Create the textarea that updates based on the selected query
const tableQuestion = view(Inputs.textarea({
  label: "Table Question",
  width: "100%", 
  value: "Which symbol was the best performer today based on the highest percent_change?",
  submit: true,
  style: { fontSize: "16px" },
  rows: 1,
  resize: "both",
  onKeyDown: e => {
    if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
  }
}));
```

```js echo
// Replace the tableQResps code block with:
const tableQResps = await hf.tableQuestionAnswering({
  model: "google/tapas-base-finetuned-wtq",
  inputs: {
    query: tableQuestion,
    table: formatTableData(tableData)
  }
});

view(htl.html`<div class="answer">
  The best performing stock today was: "${tableQResps.answer}"
</div>`);
```

---

## Text to Image 

```js echo
const image = await hf.textToImage({
  inputs: 'award winning high resolution photo of a giant tortoise/((ladybird)) hybrid, [trending on artstation]',
  model: 'stabilityai/stable-diffusion-2',
  parameters: {
    negative_prompt: 'blurry',
  }
});

// Convert blob to URL and display
const imageUrl = URL.createObjectURL(image);
const imgElement = document.createElement('img');
imgElement.src = imageUrl;
imgElement.style.maxWidth = '100%';
display(imgElement);

// Clean up the object URL when done
imgElement.onload = () => URL.revokeObjectURL(imageUrl);
```