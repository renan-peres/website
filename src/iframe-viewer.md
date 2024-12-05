---
index: true
---

# Webpage Viewer

This will load external webpages in various device viewports.

```js
import { html } from "htl";
```

```js
viewof urlInput = Inputs.text({
  label: "Enter URL",
  value: "https://example.com",
  placeholder: "Enter a URL (e.g., https://example.com)"
})
```

```js
viewof deviceType = Inputs.select(
  ["Desktop", "Tablet", "Mobile"], 
  {
    label: "Device Type",
    value: "Desktop"
  }
)
```

```js
// Device dimensions configuration
const deviceDimensions = {
  Desktop: { width: "100%", height: 600 },
  Tablet: { width: 768, height: 1024 },
  Mobile: { width: 375, height: 667 }
};
```

```js echo
display(
  html`<div style="
    width: ${deviceDimensions[deviceType].width === "100%" ? "100%" : deviceDimensions[deviceType].width + "px"};
    margin: 0 auto;
  ">
    <div style="
      position: relative;
      width: 100%;
      height: ${deviceDimensions[deviceType].height}px;
      border: 1px solid #ccc;
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.3s ease;
      background: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    ">
      <iframe
        src="${validateUrl(urlInput)}"
        style="
          width: 100%;
          height: 100%;
          border: none;
        "
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      ></iframe>
    </div>
  </div>`
)
```

```js
// URL validation helper function
function validateUrl(url) {
  try {
    new URL(url);
    return url;
  } catch {
    return 'about:blank';
  }
}
```

To use this viewer:

1. Enter a URL in the text input field
2. Select a device type from the dropdown menu
3. The webpage will be displayed in the iframe with the selected device dimensions

Note:
- Some websites may block iframe embedding due to security policies
- The viewer supports three device types: Desktop, Tablet, and Mobile
- The viewport will automatically adjust when switching between device types

For a more styled version with additional features:

```js
viewof urlInput = Inputs.text({
  label: "Enter URL",
  value: "https://example.com",
  placeholder: "Enter a URL (e.g., https://example.com)",
  width: 400
})
```

```js
viewof deviceType = Inputs.select(
  ["Desktop", "Tablet", "Mobile", "Custom"], 
  {
    label: "Device Type",
    value: "Desktop"
  }
)
```

```js
viewof customDimensions = Inputs.form({
  width: Inputs.range([320, 1920], {
    label: "Width",
    step: 10,
    value: 1024,
    disabled: deviceType !== "Custom"
  }),
  height: Inputs.range([480, 1080], {
    label: "Height",
    step: 10,
    value: 768,
    disabled: deviceType !== "Custom"
  })
})
```

```js echo
const deviceDimensions = {
  Desktop: { width: "100%", height: 600 },
  Tablet: { width: 768, height: 1024 },
  Mobile: { width: 375, height: 667 },
  Custom: customDimensions
};

display(
  html`<style>
    .viewer-container {
      font-family: system-ui, -apple-system, sans-serif;
    }
    .device-frame {
      position: relative;
      transition: all 0.3s ease;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    .device-frame.Mobile {
      padding: 20px 10px;
      background: #111;
    }
    .device-frame.Mobile::before {
      content: '';
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 4px;
      background: #333;
      border-radius: 2px;
    }
    .device-frame.Tablet {
      padding: 20px;
      background: #111;
    }
  </style>
  <div class="viewer-container">
    <div style="
      width: ${deviceType === "Custom" ? customDimensions.width + "px" : 
             deviceDimensions[deviceType].width === "100%" ? "100%" : 
             deviceDimensions[deviceType].width + "px"};
      margin: 0 auto;
    ">
      <div class="device-frame ${deviceType}" style="
        width: 100%;
        height: ${deviceType === "Custom" ? customDimensions.height : deviceDimensions[deviceType].height}px;
      ">
        <iframe
          src="${validateUrl(urlInput)}"
          style="
            width: 100%;
            height: 100%;
            border: none;
            border-radius: ${deviceType === "Desktop" ? "8px" : "4px"};
          "
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        ></iframe>
      </div>
    </div>
  </div>`
)
```

```js
function validateUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:' ? 
      url : 'about:blank';
  } catch {
    return 'about:blank';
  }
}
```
