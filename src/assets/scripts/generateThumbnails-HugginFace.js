import { HfInference } from '@huggingface/inference';
import { writeFile, mkdir } from 'fs/promises';

const HF_TOKEN = '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';

const projectPrompts = [
  {
    name: 'economic-calendar',
    prompt: 'business calendar with economic indicators and charts'
  },
  {
    name: 'stock-crypto',
    prompt: 'modern stock market dashboard with crypto prices and charts'
  },
  {
    name: 'dcf',
    prompt: 'financial analysis spreadsheet showing cash flow calculations'
  },
  {
    name: 'portfolio',
    prompt: 'investment portfolio dashboard showing asset allocation and performance charts'
  }
];

async function generateImages() {
  const hf = new HfInference(HF_TOKEN);

  for (const project of projectPrompts) {
    try {
      console.log(`Generating image for ${project.name}...`);
      
      const image = await hf.textToImage({
        inputs: project.prompt,
        model: 'ZB-Tech/Text-to-Image'
      });

      const imagePath = `${project.name}.png`;
      await writeFile(imagePath, Buffer.from(await image.arrayBuffer()));
      
      console.log(`Saved ${imagePath}`);
    } catch (error) {
      console.error(`Error generating image for ${project.name}:`, error);
    }
  }
}

generateImages().catch(console.error);