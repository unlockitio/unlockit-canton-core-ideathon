// Share Modal Component
const shareModalTemplate = `<!-- Share Modal -->
<div id="shareModal" class="share-modal" style="display: none;">
    <div class="share-modal-content">
        <div class="share-modal-header">
            <h2 class="share-modal-title">Share Invitation</h2>
            <button class="share-modal-close" onclick="closeShareModal()">&times;</button>
        </div>
        <div class="share-modal-body">
            <div class="share-preview">
                <div class="share-preview-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="white">
                        <path d="M20 15 L20 85 L40 85 L40 65 L60 65 L60 85 L80 85 L80 15 Z M30 25 L50 25 L50 35 L30 35 Z M30 45 L50 45 L50 55 L30 55 Z M60 25 L70 25 L70 35 L60 35 Z M60 45 L70 45 L70 55 L60 55 Z"/>
                    </svg>
                </div>
                <div class="share-preview-content">
                    <p class="share-preview-text" id="sharePreviewText">I'm sharing an invitation</p>
                    <div class="share-preview-url" id="sharePreviewUrl">https://iris.unlockit.io/invitation/...</div>
                </div>
            </div>

            <h3 class="share-section-title">Share via app</h3>
            <div class="share-options">
                <div class="share-option" onclick="shareViaWhatsApp()">
                    <div class="share-option-icon whatsapp">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                    </div>
                    <div class="share-option-label">WhatsApp</div>
                </div>
                <div class="share-option" onclick="shareViaTelegram()">
                    <div class="share-option-icon telegram">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.122.098.155.231.171.363.016.133.036.434.02.668z"/>
                        </svg>
                    </div>
                    <div class="share-option-label">Telegram</div>
                </div>
                <div class="share-option" onclick="shareViaEmail()">
                    <div class="share-option-icon email">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                        </svg>
                    </div>
                    <div class="share-option-label">Email</div>
                </div>
                <div class="share-option" onclick="shareViaQRCode()">
                    <div class="share-option-icon qrcode">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="7" height="7"/>
                            <rect x="14" y="3" width="7" height="7"/>
                            <rect x="14" y="14" width="7" height="7"/>
                            <rect x="3" y="14" width="7" height="7"/>
                        </svg>
                    </div>
                    <div class="share-option-label">QR Code</div>
                </div>
            </div>

            <button class="share-action-button" onclick="copyShareLink()">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                <span id="copyButtonText">Copy link</span>
            </button>

            <button class="share-action-button" onclick="showOtherSharingOptions()">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="18" cy="5" r="3"/>
                    <circle cx="6" cy="12" r="3"/>
                    <circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                <span>Other sharing options</span>
            </button>
        </div>
    </div>
</div>`;

let currentShareUrl = '';
let currentShareText = '';

function loadShareModal() {
    if (document.getElementById('shareModal')) {
        return;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = shareModalTemplate;
    const modalElement = tempDiv.querySelector('#shareModal');
    document.body.appendChild(modalElement);
}

function openShareModal(options = {}) {
    const {
        url = window.location.href,
        text = "I'm sharing an invitation",
        title = "Share Invitation"
    } = options;

    currentShareUrl = url;
    currentShareText = text;

    const modal = document.getElementById('shareModal');
    if (modal) {
        const titleElement = modal.querySelector('.share-modal-title');
        const previewTextElement = modal.querySelector('#sharePreviewText');
        const previewUrlElement = modal.querySelector('#sharePreviewUrl');

        if (titleElement) titleElement.textContent = title;
        if (previewTextElement) previewTextElement.textContent = text;
        if (previewUrlElement) previewUrlElement.textContent = url;

        modal.style.display = 'flex';
        modal.classList.add('show');
    }
}

function closeShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');

        const copyButton = modal.querySelector('#copyButtonText');
        const copyButtonParent = copyButton?.parentElement;
        if (copyButton) copyButton.textContent = 'Copy link';
        if (copyButtonParent) copyButtonParent.classList.remove('copied');
    }
}

function shareViaWhatsApp() {
    const message = encodeURIComponent(`${currentShareText}\n${currentShareUrl}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
}

function shareViaTelegram() {
    const message = encodeURIComponent(`${currentShareText}\n${currentShareUrl}`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(currentShareUrl)}&text=${encodeURIComponent(currentShareText)}`, '_blank');
}

function shareViaEmail() {
    const subject = encodeURIComponent('Unlockit Invitation');
    const body = encodeURIComponent(`${currentShareText}\n\n${currentShareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function shareViaQRCode() {
    alert('QR Code generation would be implemented here. The QR code would encode: ' + currentShareUrl);
}

function copyShareLink() {
    navigator.clipboard.writeText(currentShareUrl).then(() => {
        const copyButton = document.querySelector('#copyButtonText');
        const copyButtonParent = copyButton?.parentElement;
        if (copyButton) {
            copyButton.textContent = 'Copied!';
            if (copyButtonParent) {
                copyButtonParent.classList.add('copied');
            }
        }

        setTimeout(() => {
            if (copyButton) {
                copyButton.textContent = 'Copy link';
                if (copyButtonParent) {
                    copyButtonParent.classList.remove('copied');
                }
            }
        }, 2000);
    }).catch(err => {
        alert('Failed to copy link to clipboard');
        console.error('Copy failed:', err);
    });
}

function showOtherSharingOptions() {
    if (navigator.share) {
        navigator.share({
            title: 'Unlockit Invitation',
            text: currentShareText,
            url: currentShareUrl
        }).catch(err => {
            if (err.name !== 'AbortError') {
                console.error('Share failed:', err);
            }
        });
    } else {
        alert('Other sharing options would be shown here (native share dialog not available in this browser)');
    }
}

function handleShareModalOutsideClick(event) {
    const modal = document.getElementById('shareModal');
    if (modal && event.target === modal) {
        closeShareModal();
    }
}

function handleShareModalEscape(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('shareModal');
        if (modal && modal.style.display === 'flex') {
            closeShareModal();
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadShareModal();

    window.addEventListener('click', handleShareModalOutsideClick);
    document.addEventListener('keydown', handleShareModalEscape);
});

window.openShareModal = openShareModal;
window.closeShareModal = closeShareModal;
window.shareViaWhatsApp = shareViaWhatsApp;
window.shareViaTelegram = shareViaTelegram;
window.shareViaEmail = shareViaEmail;
window.shareViaQRCode = shareViaQRCode;
window.copyShareLink = copyShareLink;
window.showOtherSharingOptions = showOtherSharingOptions;
