// Card Preview Modal Component
const cardPreviewModalTemplate = `<div id="cardPreviewModal" class="card-preview-modal" style="display: none;">
    <div class="card-preview-modal-content">
        <div class="card-preview-modal-header">
            <h2 class="card-preview-modal-title">Public Card Preview</h2>
            <div class="card-preview-modal-actions">
                <button class="card-preview-modal-close" onclick="closeCardPreviewModal()">&times;</button>
            </div>
        </div>
        <div class="card-preview-modal-body">
            <div class="card-preview-public" id="cardPreviewPublic">
                <div class="card-preview-card-actions">
                    <button class="btn-share-icon" onclick="shareCardFromPreview()" title="Share Card">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"/>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                    </button>
                </div>
                <div class="card-preview-photo" id="cardPreviewPhoto">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                </div>
                <div class="card-preview-content">
                    <h3 id="cardPreviewName">Nome Sobrenome</h3>
                    <p id="cardPreviewTitle">Broker Profissional</p>
                    <p id="cardPreviewPhrase" class="card-preview-phrase" style="display: none;"></p>
                    <div class="contact-info">
                        <p id="cardPreviewEmail">correioeletronico@empresa.com</p>
                        <p id="cardPreviewPhone">123 456 789</p>
                        <p id="cardPreviewLocation">📍 Lisboa</p>
                    </div>
                </div>
                <button class="card-preview-voice-btn" id="cardPreviewVoiceBtn" onclick="togglePreviewVoice()" title="Play voice introduction">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon id="previewPlayIcon" points="5 3 19 12 5 21 5 3"/>
                        <rect id="previewPauseIcon" style="display: none;" x="6" y="4" width="4" height="16"/>
                        <rect id="previewPauseIcon2" style="display: none;" x="14" y="4" width="4" height="16"/>
                    </svg>
                </button>
                <div class="card-preview-branding">
                    <svg viewBox="0 0 158 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_preview_unlockit)">
                            <path d="M32.0398 0.000344034C29.8158 -0.00779106 28.2082 -0.0118585 27.0879 1.07418C24.9763 3.13235 24.9763 8.81065 24.9763 25.6666C24.9763 25.996 24.9555 26.3174 24.918 26.6265C22.8439 27.0861 20.141 27.2895 16.5759 27.2895H16.5717C13.0067 27.2895 10.312 27.0861 8.24214 26.6265C8.20049 26.3174 8.17967 25.996 8.17967 25.6666C8.17967 8.81065 8.17967 3.13235 6.06811 1.07418C4.94778 -0.0118585 3.34017 -0.00779106 1.11617 0.000344034H0V11.3325C0 18.227 0.412315 22.201 2.68213 24.7554C3.76498 25.9798 5.24765 26.838 7.38419 27.3993C7.65907 28.6684 8.25463 29.7504 9.16672 30.6249C12.2487 33.7935 20.9073 33.7935 23.9892 30.6249C24.9013 29.7504 25.4969 28.6684 25.7759 27.3993C27.9083 26.838 29.391 25.9798 30.4738 24.7554C32.7437 22.201 33.156 18.227 33.156 11.3325V0.000344034H32.0398ZM3.4193 24.1331C1.36605 21.8146 0.974563 17.8447 0.974563 11.3325V0.95215H1.12033C3.18191 0.944015 4.54796 0.939947 5.37676 1.74939C7.12181 3.44556 7.2051 8.84726 7.2051 25.6666C7.2051 25.9065 7.21343 26.1384 7.23426 26.3702C5.51836 25.8659 4.3064 25.1337 3.4193 24.1331ZM23.3062 29.9456C19.7495 32.8417 13.4065 32.8458 9.84975 29.9456C9.18755 29.3111 8.72109 28.5382 8.45454 27.6434C10.5494 28.0583 13.1899 28.2413 16.5759 28.2413C19.9619 28.2413 22.6065 28.0583 24.7056 27.6434C24.4349 28.5382 23.9684 29.3111 23.3062 29.9456ZM32.1814 11.3325C32.1814 17.8447 31.7941 21.8146 29.7367 24.1331C28.8496 25.1337 27.6376 25.8659 25.9259 26.3702C25.9425 26.1384 25.9509 25.9065 25.9509 25.6666C25.9509 8.84726 26.0342 3.44556 27.7792 1.74939C28.533 1.01723 29.7242 0.95215 31.4817 0.95215H32.1814V11.3325Z" fill="currentColor"/>
                            <path d="M58.4404 16.1159C58.4404 19.6668 56.837 21.3671 53.88 21.3671C50.923 21.3671 49.3737 19.6424 49.3737 16.1159V4.77148H47.0122V16.1443C47.0122 20.9969 49.4819 23.4863 53.88 23.4863C58.278 23.4863 60.8019 20.9929 60.8019 16.1443V4.77148H58.4404V16.1199V16.1159Z" fill="currentColor"/>
                            <path d="M71.0764 9.64844C68.8774 9.64844 67.4947 10.6043 66.6784 11.6375L66.3785 9.80707H64.4502V23.3276H66.6742V16.3029C66.6742 13.415 68.2485 11.6375 70.6932 11.6375C72.9714 11.6375 74.275 13.0408 74.275 15.6684V23.3317H76.499V15.5382C76.499 11.2429 74.0542 9.65251 71.0681 9.65251L71.0764 9.64844Z" fill="currentColor"/>
                            <path d="M85.3367 4.77148H78.9313V6.76051H83.1127V21.3386H78.9313V23.3276H89.5432V21.3386H85.3367V4.77148Z" fill="currentColor"/>
                            <path d="M97.6187 9.64844C93.5747 9.64844 90.751 12.4591 90.751 16.5673C90.751 20.6756 93.5747 23.4862 97.6187 23.4862C101.663 23.4862 104.486 20.6756 104.486 16.5673C104.486 12.4591 101.663 9.64844 97.6187 9.64844ZM97.6187 21.5541C94.8783 21.5541 93.0291 19.4594 93.0291 16.5714C93.0291 13.6834 94.8741 11.5887 97.6187 11.5887C100.363 11.5887 102.208 13.6834 102.208 16.5714C102.208 19.4594 100.363 21.5541 97.6187 21.5541Z" fill="currentColor"/>
                            <path d="M113.557 11.5846C115.594 11.5846 116.952 12.6706 117.356 14.4725H119.688C119.118 11.5032 116.973 9.64844 113.578 9.64844C109.559 9.64844 106.819 12.4591 106.819 16.5958C106.819 20.7325 109.48 23.4903 113.524 23.4903C116.889 23.4903 119.142 21.6355 119.688 18.7191H117.327C116.893 20.4437 115.536 21.5541 113.553 21.5541C110.892 21.5541 109.101 19.5407 109.101 16.5958C109.101 13.6509 110.892 11.5846 113.553 11.5846H113.557Z" fill="currentColor"/>
                            <path d="M135.069 9.80711H132.245L124.865 16.9904V4.77148H122.637V23.3276H124.865V19.7238L127.684 16.966L132.599 23.3276H135.339L129.234 15.4813L135.069 9.80711Z" fill="currentColor"/>
                            <path d="M154.522 21.3382C153.327 21.3382 152.919 20.9152 152.919 19.7722V11.7917H157.779V9.80267H152.919V6.01172H150.695V9.80267H147.03V11.7917H150.695V19.7966C150.695 22.1843 151.644 23.3232 154.306 23.3232H157.996V21.3342H154.522V21.3382Z" fill="currentColor"/>
                            <path d="M143.486 9.80664H137.08V11.7957H141.262V21.3381H137.08V23.3272H147.696V21.3381H143.486V9.80664Z" fill="currentColor"/>
                            <path d="M142.407 7.43142C143.357 7.43142 144.094 6.73994 144.094 5.75966C144.094 4.83226 143.361 4.1123 142.407 4.1123C141.453 4.1123 140.695 4.82819 140.695 5.75966C140.695 6.73994 141.457 7.43142 142.407 7.43142Z" fill="currentColor"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_preview_unlockit">
                                <rect width="158" height="33" fill="currentColor"/>
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</div>`;

let previewVoiceAudio = null;

// Load card preview modal component
function loadCardPreviewModal() {
    if (document.getElementById('cardPreviewModal')) {
        return;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cardPreviewModalTemplate;
    const modalElement = tempDiv.querySelector('#cardPreviewModal');
    document.body.appendChild(modalElement);
}

function openCardPreviewModal() {
    const modal = document.getElementById('cardPreviewModal');
    if (modal) {
        // Get current card data
        const name = document.getElementById('virtualCardName').textContent;
        const title = document.getElementById('virtualCardTitle').textContent;
        const email = document.getElementById('virtualCardEmail').textContent;
        const phone = document.getElementById('virtualCardPhone').textContent;
        const location = document.getElementById('virtualCardLocation').textContent;
        const phraseElement = document.getElementById('virtualCardPhrase');
        const phrase = phraseElement.style.display !== 'none' ? phraseElement.textContent : '';

        // Get current gradient
        const virtualCard = document.getElementById('virtualCard');
        const currentGradient = virtualCard.style.background;

        // Update preview
        document.getElementById('cardPreviewName').textContent = name;
        document.getElementById('cardPreviewTitle').textContent = title;
        document.getElementById('cardPreviewEmail').textContent = email;
        document.getElementById('cardPreviewPhone').textContent = phone;
        document.getElementById('cardPreviewLocation').textContent = location;

        const previewPhraseElement = document.getElementById('cardPreviewPhrase');
        if (phrase) {
            previewPhraseElement.textContent = phrase;
            previewPhraseElement.style.display = 'block';
        } else {
            previewPhraseElement.style.display = 'none';
        }

        // Apply gradient
        const previewCard = document.getElementById('cardPreviewPublic');
        previewCard.style.background = currentGradient;

        modal.style.display = 'flex';
        modal.classList.add('show');
    }
}

function closeCardPreviewModal() {
    const modal = document.getElementById('cardPreviewModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');

        // Stop audio if playing
        if (previewVoiceAudio) {
            previewVoiceAudio.pause();
            previewVoiceAudio = null;
        }

        // Reset play button
        const playIcon = document.getElementById('previewPlayIcon');
        const pauseIcon = document.getElementById('previewPauseIcon');
        const pauseIcon2 = document.getElementById('previewPauseIcon2');
        const voiceBtn = document.getElementById('cardPreviewVoiceBtn');
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
        if (pauseIcon2) pauseIcon2.style.display = 'none';
        if (voiceBtn) voiceBtn.classList.remove('playing');
    }
}

function togglePreviewVoice() {
    const playIcon = document.getElementById('previewPlayIcon');
    const pauseIcon = document.getElementById('previewPauseIcon');
    const pauseIcon2 = document.getElementById('previewPauseIcon2');
    const voiceBtn = document.getElementById('cardPreviewVoiceBtn');

    // Use configured voice URL or demo audio (short beep)
    const audioUrl = window.currentVoiceUrl || 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGmN7uw2ghBSuBzvLZiTYIGGS56+ahUBELTaLj772iSQ0RNZHZ79SQQQYOJ3TN7dSaTxALR5bb7b2fRAYQMoXM7NubVBEMQJPX7KxgHgQpecXw2I5DCBVhtOrssGMcBDaP0/LHdyoFKnrG796UTxIMVJ/f67BeHQcugM/v2JFBBxgxvub0tGUcBTWI0u7PgjMGHWWr4+esbhsGLXvF79KMPwcdZ7Tr66tVEg1OoN/ssmolCCt5xu7WiywLJnO76OWkTgwNUZfc7bJcGAU1idHvzIQyBh1kq+PlrWwZBy18w+/Qiz0HHmy57O+rXBYGNInR7s6GNAkcYqzh6apmIAU0gsvy2Ig2CSN0wfDglUcIDllp1+qqWxQINITL8diIOwgZbbjq6JpNDwxPouHswGQpBCl1wu3YizcJGGu46+mfUA8LTaHh7MFjJwcpc8TuxXgsCS5+w+zHcycFM3+16V+VHwpah8btwXMoBC16wu3VhCgGMnrD68GKXhkGP4vM6MBvJAUrbsHwzoo7Bxtiu+bupFIQC0yo3+y0YR4EL3rC7teKOQgYaLfp6aVQDwtOot/rxGMnByx5wu7WiTkIGGa45+qjUBELTaHg7L9hJAQrdMHu14k4Chlmuen0qmMgBSx6w+7UhTAHH2u16d+YSwwNT6Hd67RgHgQseMHt14k4CRhmuejto1IRDEyh4O3AYSQELHbC7tiKNwkZZ7no8qltGwQpd8Tv0os7CB5qtennoFAPDEuf3+u1YR4ELHfC7teJOAkZZbnn76ZRDgtMnt/stF8eBS14wu7YiTcJGWa56O+lURAKTaDf7L1hJAUtecPu1Yo3CRhkvOjxrGQYBDSIzO3AcSQELn3E7sp+LwcjdrfopmkiBS16w+3WiDYKGWK36fGqYxsFJnvE7sp/MAcjd7TorGsoBSh3xO7LfS0HIXOt4+2gTgwNT6Hf7L1iJQYnecPu1og3ChlmuejvpmEcBTCEzO/BcSUELnvC7tmINwkZZbrm8aZhHAUtecPu1og2ChlluejwpmEcBTKFzO/BcSQELnzB7tiJNgkYZrro8KllHgUxgMjwxm8jBS1+xO3IfSwGI3Wz6a1pHQUue8Lt1oo4CBhluuftpmEeBDCBy/HEcCMFLX3F78t+LgcidLToq2kgBSt6w+3XhzgJGGS66O+lUSAJPHzB7tiKNwkYZrro8KllHgUxgcjwxm8jBS1+xO3IfSwGI3Wz6a1pHQUue8Ht1oo4CBhluuftpmEeBDCBy/HEcCMFLX3F78t+LgcidLToq2kgBSt6w+3Xh';

    if (!previewVoiceAudio) {
        previewVoiceAudio = new Audio(audioUrl);
        previewVoiceAudio.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        pauseIcon2.style.display = 'block';
        voiceBtn.classList.add('playing');

        previewVoiceAudio.onended = function() {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            pauseIcon2.style.display = 'none';
            voiceBtn.classList.remove('playing');
            previewVoiceAudio = null;
        };
    } else {
        if (previewVoiceAudio.paused) {
            previewVoiceAudio.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            pauseIcon2.style.display = 'block';
            voiceBtn.classList.add('playing');
        } else {
            previewVoiceAudio.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            pauseIcon2.style.display = 'none';
            voiceBtn.classList.remove('playing');
        }
    }
}


function handleCardPreviewModalOutsideClick(event) {
    const modal = document.getElementById('cardPreviewModal');
    if (modal && event.target === modal) {
        closeCardPreviewModal();
    }
}

function handleCardPreviewModalEscape(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('cardPreviewModal');
        if (modal && modal.style.display === 'flex') {
            closeCardPreviewModal();
        }
    }
}

// Initialize card preview modal on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCardPreviewModal();

    window.addEventListener('click', handleCardPreviewModalOutsideClick);
    document.addEventListener('keydown', handleCardPreviewModalEscape);
});

function shareCardFromPreview() {
    const name = document.getElementById('cardPreviewName').textContent;
    const cardUrl = 'https://iris.unlockit.io/card/' + name.toLowerCase().replace(/\s+/g, '-');

    if (window.openShareModal) {
        window.openShareModal({
            url: cardUrl,
            text: `${name} - Professional Business Card`,
            title: 'Share Business Card'
        });
    }
}

// Export functions for global access
window.openCardPreviewModal = openCardPreviewModal;
window.closeCardPreviewModal = closeCardPreviewModal;
window.togglePreviewVoice = togglePreviewVoice;
window.shareCardFromPreview = shareCardFromPreview;
