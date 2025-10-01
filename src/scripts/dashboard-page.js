import { getAllImages, deleteImage } from '../lib/imageUpload';

const loading = document.getElementById('loading');
const imagesGrid = document.getElementById('imagesGrid');
const emptyState = document.getElementById('emptyState');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

async function loadImages() {
  try {
    const images = await getAllImages();

    loading.style.display = 'none';

    if (images.length === 0) {
      emptyState.style.display = 'block';
      return;
    }

    imagesGrid.innerHTML = images.map(img => `
      <div class="image-card" data-id="${img.id}">
        <div class="image-preview" style="background-image: url('${img.original_url}')"></div>
        <div class="image-info">
          <h3 class="image-title">${img.title}</h3>
          <p class="image-meta">${img.width}x${img.height} • ${(img.file_size / 1024).toFixed(1)}KB</p>
          <p class="image-stats">${img.view_count} views • ${new Date(img.created_at).toLocaleDateString()}</p>
          <div class="image-actions">
            <button class="btn btn-small btn-secondary" onclick="showEmbedCode('${img.embed_code}')">Get Embed Code</button>
            <button class="btn btn-small btn-outline" onclick="viewParticle('${img.embed_code}')">View</button>
            <button class="btn btn-small btn-danger" onclick="deleteImageConfirm('${img.id}', '${img.original_url}')">Delete</button>
          </div>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('Failed to load images:', error);
    loading.innerHTML = '<p class="error">Failed to load images</p>';
  }
}

window.showEmbedCode = (embedCode) => {
  const embedUrl = `${window.location.origin}/embed.html?code=${embedCode}`;
  const embedCodeText = `<iframe src="${embedUrl}" width="800" height="600" frameborder="0" allowfullscreen></iframe>`;

  modalTitle.textContent = 'Embed Code';
  modalBody.innerHTML = `
    <textarea class="embed-code" readonly>${embedCodeText}</textarea>
    <button class="btn btn-primary" onclick="copyEmbedCode(this)">Copy Code</button>
  `;
  modal.style.display = 'flex';
};

window.viewParticle = (embedCode) => {
  const embedUrl = `${window.location.origin}/embed.html?code=${embedCode}`;
  window.open(embedUrl, '_blank');
};

window.deleteImageConfirm = async (id, originalUrl) => {
  if (!confirm('Are you sure you want to delete this image?')) return;

  try {
    await deleteImage(id, originalUrl);
    loadImages();
  } catch (error) {
    console.error('Failed to delete image:', error);
    alert('Failed to delete image');
  }
};

window.copyEmbedCode = (btn) => {
  const textarea = btn.previousElementSibling;
  textarea.select();
  document.execCommand('copy');
  btn.textContent = 'Copied!';
  setTimeout(() => {
    btn.textContent = 'Copy Code';
  }, 2000);
};

modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

loadImages();
