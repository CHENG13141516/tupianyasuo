document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const settingsPanel = document.getElementById('settingsPanel');
    const previewContainer = document.getElementById('previewContainer');
    const downloadArea = document.getElementById('downloadArea');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalFile = null;
    let compressedFile = null;

    // 点击上传区域触发文件选择
    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });

    // 处理文件拖放
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#007AFF';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#E5E5E5';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#E5E5E5';
        const file = e.dataTransfer.files[0];
        if (file && file.type.match('image.*')) {
            handleImageUpload(file);
        }
    });

    // 处理文件选择
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });

    // 处理图片上传
    async function handleImageUpload(file) {
        originalFile = file;
        
        // 显示原图预览
        originalPreview.src = URL.createObjectURL(file);
        originalSize.textContent = `文件大小：${formatFileSize(file.size)}`;

        // 显示设置面板和预览区域
        settingsPanel.style.display = 'block';
        previewContainer.style.display = 'grid';
        downloadArea.style.display = 'block';

        // 压缩图片
        await compressImage();
    }

    // 质量滑块变化时重新压缩
    qualitySlider.addEventListener('input', async (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        await compressImage();
    });

    // 压缩图片
    async function compressImage() {
        if (!originalFile) return;

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            quality: qualitySlider.value / 100
        };

        try {
            compressedFile = await imageCompression(originalFile, options);
            compressedPreview.src = URL.createObjectURL(compressedFile);
            compressedSize.textContent = `文件大小：${formatFileSize(compressedFile.size)}`;
        } catch (error) {
            console.error('压缩失败:', error);
        }
    }

    // 下载压缩后的图片
    downloadBtn.addEventListener('click', () => {
        if (!compressedFile) return;
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(compressedFile);
        link.download = `compressed_${originalFile.name}`;
        link.click();
    });

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 