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
function validateUrl(url) {
  try {
    new URL(url);
    return url;
  } catch {
    return 'about:blank';
  }
}
```

The example above demonstrates a simple webpage viewer with device viewport simulation. You can:
1. Enter any URL to view the webpage
2. Select different device types to see how the page looks on various screens
3. The viewer automatically adjusts dimensions based on the selected device type

Note that some websites may block iframe embedding due to security policies. Try it with these example URLs:
- https://example.com
- https://wikipedia.org
- https://html5demos.com

For a reference implementation and more details, see:
[Observable Iframe Viewer Example](https://observablehq.com/@tmcw/iframe-viewer)​​​​​​​​​​​​​​​​
