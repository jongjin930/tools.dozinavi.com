// script.js
document.addEventListener('DOMContentLoaded', () => {
  const dropZone     = document.getElementById('dropZone');
  const imageInput   = document.getElementById('imageInput');
  const fileInfo     = document.getElementById('fileInfo');
  const fileTypeSpan = document.getElementById('fileType');
  const formatSelect = document.getElementById('format');
  const qualityBox   = document.getElementById('qualityBox');
  const qualityInput = document.getElementById('quality');
  const qualityLabel = document.getElementById('qualityLabel');
  const expectedSize = document.getElementById('expectedSize');
  const previewArea  = document.getElementById('previewArea');
  const convertBtn   = document.getElementById('convertBtn');
  const resultSize   = document.getElementById('resultSize');

  let img = new Image();
  let currentFileName = '';

  // 드래그 앤 드롭
  ['dragenter','dragover'].forEach(evt =>
    dropZone.addEventListener(evt, e => {
      e.preventDefault(); e.stopPropagation();
      dropZone.classList.add('hover');
    })
  );
  ['dragleave','drop'].forEach(evt =>
    dropZone.addEventListener(evt, e => {
      e.preventDefault(); e.stopPropagation();
      dropZone.classList.remove('hover');
    })
  );
  dropZone.addEventListener('drop', e => handleFiles(e.dataTransfer.files));
  dropZone.addEventListener('click', () => imageInput.click());
  imageInput.addEventListener('change', () => handleFiles(imageInput.files));

  // 포맷 변경
  formatSelect.addEventListener('change', () => {
    qualityBox.style.display = formatSelect.value === 'image/png' ? 'none' : 'inline-flex';
    updateExpectedSize();
  });

  // 품질 슬라이더
  qualityInput.addEventListener('input', () => {
    qualityLabel.textContent = `${Math.round(qualityInput.value * 100)}%`;
    updateExpectedSize();
  });

  function handleFiles(files) {
    if (!files.length) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }
    currentFileName = file.name.replace(/\.[^.]+$/, '');
    // 파일 타입 표시
    const ext = file.type.split('/')[1].toUpperCase();
    fileTypeSpan.textContent = `${ext} 이미지`;
    fileInfo.style.display = 'flex';

    // 미리보기
    const reader = new FileReader();
    reader.onload = e => {
      img = new Image();
      img.onload = () => {
        previewArea.innerHTML = '';
        previewArea.appendChild(img);
        updateExpectedSize();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function updateExpectedSize() {
    if (!img.src) {
      expectedSize.textContent = '예상 용량: – KB';
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width  = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const type    = formatSelect.value;
    const quality = parseFloat(qualityInput.value);

    canvas.toBlob(blob => {
      expectedSize.textContent = `예상 용량: ${(blob.size / 1024).toFixed(1)} KB`;
    }, type, type === 'image/png' ? undefined : quality);
  }

  convertBtn.addEventListener('click', () => {
    if (!img.src) {
      alert('먼저 이미지를 업로드해주세요.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width  = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const type    = formatSelect.value;
    const quality = parseFloat(qualityInput.value);

    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a   = document.createElement('a');
      const ext = type.split('/')[1] === 'jpeg' ? 'jpg' : type.split('/')[1];
      a.href     = url;
      a.download = `${currentFileName || 'converted'}.${ext}`;
      resultSize.textContent = `변환 후 용량: ${(blob.size / 1024).toFixed(1)} KB`;
      a.click();
      URL.revokeObjectURL(url);
      resetUI();
    }, type, type === 'image/png' ? undefined : quality);
  });

  function resetUI() {
    img.src = '';
    previewArea.innerHTML = '';
    fileInfo.style.display = 'none';
    expectedSize.textContent = '예상 용량: – KB';
    resultSize.textContent = '';
    formatSelect.value = 'image/png';
    qualityInput.value = 0.8;
    qualityLabel.textContent = '80%';
    qualityBox.style.display = 'none';
  }
});
