import ParticleRenderer from './ParticleRenderer';
import { getImageByEmbedCode } from '../lib/imageUpload';

const urlParams = new URLSearchParams(window.location.search);
const embedCode = urlParams.get('code');

const container = document.getElementById('particle-container');

async function init() {
  if (!embedCode) {
    container.innerHTML = '<div class="error"><p>No embed code provided</p></div>';
    return;
  }

  try {
    console.log('Loading image with embed code:', embedCode);
    const imageData = await getImageByEmbedCode(embedCode);

    if (!imageData) {
      console.error('Image not found for embed code:', embedCode);
      container.innerHTML = '<div class="error"><p>Image not found</p></div>';
      return;
    }

    console.log('Image data loaded:', imageData);
    console.log('Image URL:', imageData.original_url);
    new ParticleRenderer(container, imageData.original_url);
  } catch (error) {
    console.error('Failed to load particle effect:', error);
    container.innerHTML = '<div class="error"><p>Failed to load particle effect</p></div>';
  }
}

init();
