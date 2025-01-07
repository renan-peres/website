# Hello Huggingface.js Inference


* [@huggingface/hub](https://huggingface.co/docs/huggingface.js/hub/README): Interact with huggingface.co to create or delete repos and commit / download files
* [@huggingface/inference](https://huggingface.co/docs/huggingface.js/inference/README): Use the Inference API to make calls to Machine Learning models

This notebook will focus on the Inference.


### Loading

The library runs on Node.js and browser environments and is available on npm [@huggingface/inference](https://www.npmjs.com/package/@huggingface/inference). To load it in a browser, you can use ES modules via [skypack.dev](https://skypack.dev)

```js echo
import { HfInference } from '@huggingface/inference';
const hf = new HfInference('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');
```

#### ❗Access token❗
Using an API key is optional to get started, however you will be rate limited eventually. To get a a new token go to [setting/tokens](https://huggingface.co/settings/tokens). Please note that this access token is intended to be kept private and only used here for experimental purposes.

---

### Text to Image 

```js
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