// Media Upload Modal Component
const mediaUploadModalTemplate = `<div id="mediaUploadModal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2 class="modal-title">Add Media</h2>
            <button class="modal-close" onclick="closeMediaUploadModal()">&times;</button>
        </div>
        <div class="modal-body">
            <form id="mediaUploadForm" onsubmit="submitMediaUploadForm(event)">
                <div class="form-group">
                    <label class="form-label">Select Media Type *</label>
                    <div class="media-type-grid">
                        <div class="media-type-option" data-media-type="photo" onclick="selectMediaType('photo')">
                            <div class="media-type-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                    <circle cx="8.5" cy="8.5" r="1.5"/>
                                    <polyline points="21,15 16,10 5,21"/>
                                </svg>
                            </div>
                            <div class="media-type-name">Photo</div>
                        </div>
                        <div class="media-type-option" data-media-type="video" onclick="selectMediaType('video')">
                            <div class="media-type-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polygon points="23,12 5,2 5,22"/>
                                </svg>
                            </div>
                            <div class="media-type-name">Video</div>
                        </div>
                        <div class="media-type-option" data-media-type="voice" onclick="selectMediaType('voice')">
                            <div class="media-type-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                                    <line x1="12" y1="19" x2="12" y2="23"/>
                                    <line x1="8" y1="23" x2="16" y2="23"/>
                                </svg>
                            </div>
                            <div class="media-type-name">Voice</div>
                        </div>
                    </div>
                    <input type="hidden" name="media-type" id="selectedMediaType" required>
                </div>

                <div class="form-group" id="fileUploadGroup" style="display: none;">
                    <label class="form-label">Upload File *</label>
                    <div class="file-upload-area" id="fileUploadArea" onclick="document.getElementById('fileInput').click()">
                        <div class="file-upload-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="17,8 12,3 7,8"/>
                                <line x1="12" y1="3" x2="12" y2="15"/>
                            </svg>
                        </div>
                        <div class="file-upload-text">Click to upload or drag and drop</div>
                        <div class="file-upload-hint" id="fileUploadHint">Select a file to upload</div>
                    </div>
                    <input type="file" id="fileInput" name="file" class="file-upload-input" accept="" onchange="handleFileSelect(event)">

                    <div class="file-preview" id="filePreview">
                        <div class="file-preview-item">
                            <div class="file-preview-icon" id="filePreviewIcon"></div>
                            <div class="file-preview-info">
                                <div class="file-preview-name" id="filePreviewName"></div>
                                <div class="file-preview-size" id="filePreviewSize"></div>
                            </div>
                            <button type="button" class="file-preview-remove" onclick="clearFileSelection()">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="form-group" id="titleGroup" style="display: none;">
                    <label class="form-label">Title (optional)</label>
                    <input type="text" name="media-title" class="form-input" placeholder="Enter a title for this media">
                </div>

                <div class="form-group" id="descriptionGroup" style="display: none;">
                    <label class="form-label">Description (optional)</label>
                    <textarea name="media-description" class="form-textarea" placeholder="Add a description..." rows="3"></textarea>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn-secondary" onclick="closeMediaUploadModal()">Cancel</button>
                    <button type="submit" class="btn-primary" id="submitMediaBtn" disabled>Add Media</button>
                </div>
            </form>
        </div>
    </div>
</div>`;

// Media type configurations
const mediaTypeConfigs = {
    'photo': {
        accept: 'image/*',
        maxSize: 10 * 1024 * 1024,
        hint: 'PNG, JPG, GIF up to 10MB',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>'
    },
    'video': {
        accept: 'video/*',
        maxSize: 100 * 1024 * 1024,
        hint: 'MP4, MOV, AVI up to 100MB',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23,12 5,2 5,22"/></svg>'
    },
    'voice': {
        accept: 'audio/*',
        maxSize: 20 * 1024 * 1024,
        hint: 'MP3, WAV, OGG up to 20MB',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>'
    }
};

let selectedFile = null;

// Load media upload modal component
function loadMediaUploadModal() {
    if (document.getElementById('mediaUploadModal')) {
        return;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = mediaUploadModalTemplate;
    const modalElement = tempDiv.querySelector('#mediaUploadModal');
    document.body.appendChild(modalElement);

    setupDragAndDrop();
}

// Setup drag and drop
function setupDragAndDrop() {
    const uploadArea = document.getElementById('fileUploadArea');
    if (!uploadArea) return;

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

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const fileInput = document.getElementById('fileInput');
            fileInput.files = files;
            handleFileSelect({ target: fileInput });
        }
    });
}

// Media upload modal functions
function openMediaUploadModal() {
    const modal = document.getElementById('mediaUploadModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
    }
}

function closeMediaUploadModal() {
    const modal = document.getElementById('mediaUploadModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        const form = document.getElementById('mediaUploadForm');
        if (form) {
            form.reset();
        }
        document.querySelectorAll('.media-type-option').forEach(option => {
            option.classList.remove('selected');
        });
        clearFileSelection();
        document.getElementById('fileUploadGroup').style.display = 'none';
        document.getElementById('titleGroup').style.display = 'none';
        document.getElementById('descriptionGroup').style.display = 'none';
        selectedFile = null;
    }
}

function selectMediaType(mediaType) {
    document.querySelectorAll('.media-type-option').forEach(option => {
        option.classList.remove('selected');
    });

    const selectedOption = document.querySelector(`.media-type-option[data-media-type="${mediaType}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }

    document.getElementById('selectedMediaType').value = mediaType;

    const config = mediaTypeConfigs[mediaType];
    const fileInput = document.getElementById('fileInput');
    const fileUploadHint = document.getElementById('fileUploadHint');

    fileInput.accept = config.accept;
    fileUploadHint.textContent = config.hint;

    document.getElementById('fileUploadGroup').style.display = 'block';
    document.getElementById('titleGroup').style.display = 'block';
    document.getElementById('descriptionGroup').style.display = 'block';

    clearFileSelection();
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const mediaType = document.getElementById('selectedMediaType').value;
    const config = mediaTypeConfigs[mediaType];

    if (file.size > config.maxSize) {
        alert(`File size exceeds maximum allowed size of ${formatFileSize(config.maxSize)}`);
        clearFileSelection();
        return;
    }

    selectedFile = file;

    const filePreview = document.getElementById('filePreview');
    const filePreviewIcon = document.getElementById('filePreviewIcon');
    const filePreviewName = document.getElementById('filePreviewName');
    const filePreviewSize = document.getElementById('filePreviewSize');
    const submitBtn = document.getElementById('submitMediaBtn');

    filePreviewIcon.innerHTML = config.icon;
    filePreviewName.textContent = file.name;
    filePreviewSize.textContent = formatFileSize(file.size);

    filePreview.classList.add('active');
    submitBtn.disabled = false;
}

function clearFileSelection() {
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const submitBtn = document.getElementById('submitMediaBtn');

    fileInput.value = '';
    filePreview.classList.remove('active');
    submitBtn.disabled = true;
    selectedFile = null;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function submitMediaUploadForm(event) {
    event.preventDefault();

    if (!selectedFile) {
        alert('Please select a file to upload');
        return;
    }

    const formData = new FormData(event.target);
    const mediaType = formData.get('media-type');
    const title = formData.get('media-title') || selectedFile.name;
    const description = formData.get('media-description') || '';

    const mediaData = {
        type: mediaType,
        file: selectedFile,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        title: title,
        description: description,
        url: URL.createObjectURL(selectedFile)
    };

    document.dispatchEvent(new CustomEvent('mediaUploaded', {
        detail: mediaData
    }));

    closeMediaUploadModal();
}

function handleMediaUploadModalOutsideClick(event) {
    const modal = document.getElementById('mediaUploadModal');
    if (modal && event.target === modal) {
        closeMediaUploadModal();
    }
}

function handleMediaUploadModalEscape(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('mediaUploadModal');
        if (modal && modal.style.display === 'flex') {
            closeMediaUploadModal();
        }
    }
}

function getMediaIcon(mediaType) {
    return mediaTypeConfigs[mediaType]?.icon || mediaTypeConfigs['photo'].icon;
}

// Initialize media upload modal on page load
document.addEventListener('DOMContentLoaded', function() {
    loadMediaUploadModal();

    window.addEventListener('click', handleMediaUploadModalOutsideClick);
    document.addEventListener('keydown', handleMediaUploadModalEscape);
});

// Export functions for global access
window.openMediaUploadModal = openMediaUploadModal;
window.closeMediaUploadModal = closeMediaUploadModal;
window.selectMediaType = selectMediaType;
window.handleFileSelect = handleFileSelect;
window.clearFileSelection = clearFileSelection;
window.submitMediaUploadForm = submitMediaUploadForm;
window.getMediaIcon = getMediaIcon;
