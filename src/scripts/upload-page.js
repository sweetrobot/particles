import { uploadImage } from '../lib/imageUpload';

const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const previewSection = document.getElementById('previewSection');
const previewImage = document.getElementById('previewImage');
const uploadBtn = document.getElementById('uploadBtn');
const successSection = document.getElementById('successSection');
const embedCode = document.getElementById('embedCode');
const copyBtn = document.getElementById('copyBtn');
const viewLink = document.getElementById('viewLink');
const uploadAnother = document.getElementById('uploadAnother');
const loading = document.getElementById('loading');

let selectedFile = null;

uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    handleFileSelect(file);
  }
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    handleFileSelect(file);
  }
});

function handleFileSelect(file) {
  selectedFile = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.src = e.target.result;
    uploadArea.style.display = 'none';
    previewSection.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

uploadBtn.addEventListener('click', async () => {
  if (!selectedFile) return;

  loading.style.display = 'block';
  previewSection.style.display = 'none';

  try {
    const result = await uploadImage(selectedFile);

    const embedUrl = `${window.location.origin}/embed.html?code=${result.embed_code}`;
    const embedCodeText = `<iframe src="${embedUrl}" width="800" height="600" frameborder="0" allowfullscreen></iframe>`;

    embedCode.value = embedCodeText;
    viewLink.href = embedUrl;

    loading.style.display = 'none';
    successSection.style.display = 'block';
  } catch (error) {
    console.error('Upload failed:', error);
    alert('Upload failed. Please try again.');
    loading.style.display = 'none';
    previewSection.style.display = 'block';
  }
});

copyBtn.addEventListener('click', () => {
  embedCode.select();
  document.execCommand('copy');
  copyBtn.textContent = 'Copied!';
  setTimeout(() => {
    copyBtn.textContent = 'Copy Code';
  }, 2000);
});

uploadAnother.addEventListener('click', () => {
  selectedFile = null;
  fileInput.value = '';
  previewImage.src = '';
  successSection.style.display = 'none';
  uploadArea.style.display = 'flex';
});
