// Virtual Card Editor Modal Component
const virtualCardModalTemplate = `<div id="virtualCardModal" class="modal" style="display: none;">
    <div class="modal-content modal-wide">
        <div class="modal-header">
            <h2 class="modal-title">Edit Virtual Business Card</h2>
            <button class="modal-close" onclick="closeVirtualCardModal()">&times;</button>
        </div>
        <div class="modal-body">
            <form id="virtualCardForm" onsubmit="submitVirtualCardForm(event)">
                <!-- Card Preview -->
                <div class="virtual-card-preview" id="cardPreview">
                    <h3 id="previewName">Nome Sobrenome</h3>
                    <p id="previewTitle">Broker Profissional</p>
                    <p id="previewPhrase" class="preview-phrase" style="display: none;"></p>
                    <div class="contact-info">
                        <p id="previewEmail">correioeletronico@empresa.com</p>
                        <p id="previewPhone">123 456 789</p>
                        <p id="previewLocation">📍 Lisboa</p>
                    </div>
                </div>

                <!-- Basic Information -->
                <div class="form-section-title">Basic Information</div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Full Name *</label>
                        <input type="text" name="card-name" class="form-input" placeholder="Enter full name" required oninput="updateCardPreview()">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Job Title *</label>
                        <input type="text" name="card-job-title" class="form-input" placeholder="Enter job title" required oninput="updateCardPreview()">
                    </div>
                </div>

                <!-- Contact Information -->
                <hr class="form-section-divider">
                <div class="form-section-title">Contact Information</div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Email *</label>
                        <select name="card-email" class="form-input" id="cardEmailSelect" required onchange="updateCardPreview()">
                            <option value="">Select an email</option>
                        </select>
                        <p class="form-help-text">Choose from your verified email addresses</p>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Phone *</label>
                        <input type="tel" name="card-phone" class="form-input" placeholder="+351 123 456 789" required oninput="updateCardPreview()">
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Location</label>
                    <input type="text" name="card-location" class="form-input" placeholder="City, Country" oninput="updateCardPreview()">
                </div>

                <div class="form-group">
                    <label class="form-label">Personal Phrase (optional)</label>
                    <input type="text" name="card-phrase" class="form-input" placeholder="Your personal motto or tagline" maxlength="100" oninput="updateCardPreview()">
                    <p class="form-help-text">A custom phrase or quote to personalize your business card (max 100 characters)</p>
                </div>

                <div class="form-group">
                    <label class="form-label">Website (optional)</label>
                    <input type="url" name="card-website" class="form-input" placeholder="https://yourwebsite.com">
                </div>

                <!-- Voice Introduction -->
                <hr class="form-section-divider">
                <div class="form-section-title">Voice Introduction</div>
                <div class="form-group">
                    <label class="form-label">Voice Audio (optional)</label>
                    <select name="card-voice" class="form-input" id="voiceAudioSelect">
                        <option value="">No voice audio</option>
                    </select>
                    <p class="form-help-text">Select a voice recording from your media library to add a personal introduction to your business card</p>
                </div>

                <!-- Company Information -->
                <hr class="form-section-divider">
                <div class="form-section-title">Company Information</div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Company Name</label>
                        <input type="text" name="card-company" class="form-input" placeholder="Company name">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Company Website</label>
                        <input type="url" name="card-company-website" class="form-input" placeholder="https://company.com">
                    </div>
                </div>

                <!-- Card Design -->
                <hr class="form-section-divider">
                <div class="form-section-title">Card Design</div>
                <div class="form-group">
                    <label class="form-label">Background Gradient</label>
                    <div class="gradient-presets">
                        <div class="gradient-preset purple selected" data-gradient="purple" onclick="selectGradient('purple')" title="Purple"></div>
                        <div class="gradient-preset blue" data-gradient="blue" onclick="selectGradient('blue')" title="Blue"></div>
                        <div class="gradient-preset green" data-gradient="green" onclick="selectGradient('green')" title="Green"></div>
                        <div class="gradient-preset orange" data-gradient="orange" onclick="selectGradient('orange')" title="Orange"></div>
                        <div class="gradient-preset pink" data-gradient="pink" onclick="selectGradient('pink')" title="Pink"></div>
                        <div class="gradient-preset dark" data-gradient="dark" onclick="selectGradient('dark')" title="Dark"></div>
                        <div class="gradient-preset sunset" data-gradient="sunset" onclick="selectGradient('sunset')" title="Sunset"></div>
                        <div class="gradient-preset ocean" data-gradient="ocean" onclick="selectGradient('ocean')" title="Ocean"></div>
                    </div>
                    <input type="hidden" name="card-gradient" id="selectedGradient" value="purple">
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn-secondary" onclick="closeVirtualCardModal()">Cancel</button>
                    <button type="submit" class="btn-primary">Save Card</button>
                </div>
            </form>
        </div>
    </div>
</div>`;

// Gradient configurations
const gradientConfigs = {
    'purple': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'blue': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'green': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'orange': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'pink': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'dark': 'linear-gradient(135deg, #434343 0%, #000000 100%)',
    'sunset': 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
    'ocean': 'linear-gradient(135deg, #2e3192 0%, #1bffff 100%)'
};

let currentCardData = null;

// Load virtual card modal component
function loadVirtualCardModal() {
    if (document.getElementById('virtualCardModal')) {
        return;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = virtualCardModalTemplate;
    const modalElement = tempDiv.querySelector('#virtualCardModal');
    document.body.appendChild(modalElement);
}

// Virtual card modal functions
function openVirtualCardModal(cardData = null) {
    const modal = document.getElementById('virtualCardModal');
    if (modal) {
        if (cardData) {
            currentCardData = cardData;
            populateCardForm(cardData);
        }
        modal.style.display = 'flex';
        modal.classList.add('show');
    }
}

function closeVirtualCardModal() {
    const modal = document.getElementById('virtualCardModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        const form = document.getElementById('virtualCardForm');
        if (form) {
            form.reset();
        }
        currentCardData = null;
        selectGradient('purple');
    }
}

function populateCardForm(cardData) {
    const form = document.getElementById('virtualCardForm');
    if (!form) return;

    if (cardData.name) form.querySelector('[name="card-name"]').value = cardData.name;
    if (cardData.jobTitle) form.querySelector('[name="card-job-title"]').value = cardData.jobTitle;
    if (cardData.email) form.querySelector('[name="card-email"]').value = cardData.email;
    if (cardData.phone) form.querySelector('[name="card-phone"]').value = cardData.phone;
    if (cardData.location) form.querySelector('[name="card-location"]').value = cardData.location;
    if (cardData.phrase) form.querySelector('[name="card-phrase"]').value = cardData.phrase;
    if (cardData.website) form.querySelector('[name="card-website"]').value = cardData.website;
    if (cardData.company) form.querySelector('[name="card-company"]').value = cardData.company;
    if (cardData.companyWebsite) form.querySelector('[name="card-company-website"]').value = cardData.companyWebsite;
    if (cardData.voice) form.querySelector('[name="card-voice"]').value = cardData.voice;
    if (cardData.gradient) selectGradient(cardData.gradient);

    updateCardPreview();
}

function selectGradient(gradient) {
    document.querySelectorAll('.gradient-preset').forEach(preset => {
        preset.classList.remove('selected');
    });

    const selectedPreset = document.querySelector(`.gradient-preset[data-gradient="${gradient}"]`);
    if (selectedPreset) {
        selectedPreset.classList.add('selected');
    }

    document.getElementById('selectedGradient').value = gradient;

    const cardPreview = document.getElementById('cardPreview');
    if (cardPreview) {
        cardPreview.style.background = gradientConfigs[gradient] || gradientConfigs['purple'];
    }
}

function updateCardPreview() {
    const form = document.getElementById('virtualCardForm');
    if (!form) return;

    const name = form.querySelector('[name="card-name"]').value || 'Nome Sobrenome';
    const jobTitle = form.querySelector('[name="card-job-title"]').value || 'Broker Profissional';
    const emailSelect = form.querySelector('[name="card-email"]');
    const email = emailSelect.value || emailSelect.options[0]?.text || 'correioeletronico@empresa.com';
    const phone = form.querySelector('[name="card-phone"]').value || '123 456 789';
    const location = form.querySelector('[name="card-location"]').value || 'Lisboa';
    const phrase = form.querySelector('[name="card-phrase"]').value || '';

    document.getElementById('previewName').textContent = name;
    document.getElementById('previewTitle').textContent = jobTitle;
    document.getElementById('previewEmail').textContent = email;
    document.getElementById('previewPhone').textContent = phone;
    document.getElementById('previewLocation').textContent = location ? `📍 ${location}` : '';

    const phraseElement = document.getElementById('previewPhrase');
    if (phrase) {
        phraseElement.textContent = `"${phrase}"`;
        phraseElement.style.display = 'block';
    } else {
        phraseElement.style.display = 'none';
    }
}

function submitVirtualCardForm(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const cardData = {
        name: formData.get('card-name'),
        jobTitle: formData.get('card-job-title'),
        email: formData.get('card-email'),
        phone: formData.get('card-phone'),
        location: formData.get('card-location') || '',
        phrase: formData.get('card-phrase') || '',
        website: formData.get('card-website') || '',
        company: formData.get('card-company') || '',
        companyWebsite: formData.get('card-company-website') || '',
        voice: formData.get('card-voice') || '',
        gradient: formData.get('card-gradient')
    };

    document.dispatchEvent(new CustomEvent('virtualCardUpdated', {
        detail: cardData
    }));

    closeVirtualCardModal();
}

function handleVirtualCardModalOutsideClick(event) {
    const modal = document.getElementById('virtualCardModal');
    if (modal && event.target === modal) {
        closeVirtualCardModal();
    }
}

function handleVirtualCardModalEscape(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('virtualCardModal');
        if (modal && modal.style.display === 'flex') {
            closeVirtualCardModal();
        }
    }
}

// Populate voice audio options from media library
function populateVoiceOptions() {
    const voiceSelect = document.getElementById('voiceAudioSelect');
    if (!voiceSelect) return;

    // Clear existing options except the first one
    while (voiceSelect.options.length > 1) {
        voiceSelect.remove(1);
    }

    // Get voice media from a global voice media array (populated by the page)
    if (window.voiceMediaLibrary && window.voiceMediaLibrary.length > 0) {
        window.voiceMediaLibrary.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = voice.id || `voice-${index}`;
            option.textContent = voice.name || `Voice Recording ${index + 1}`;
            voiceSelect.appendChild(option);
        });
    }
}

// Populate email options from user's email addresses
function populateEmailOptions() {
    const emailSelect = document.getElementById('cardEmailSelect');
    if (!emailSelect) return;

    // Clear existing options except the first one
    while (emailSelect.options.length > 1) {
        emailSelect.remove(1);
    }

    // Get emails from a global email array (populated by the page)
    if (window.userEmailAddresses && window.userEmailAddresses.length > 0) {
        window.userEmailAddresses.forEach(email => {
            const option = document.createElement('option');
            option.value = email.address;
            option.textContent = email.address + (email.category ? ` (${email.category})` : '');
            // Only show verified emails
            if (email.verified) {
                emailSelect.appendChild(option);
            }
        });
    }
}

// Initialize virtual card modal on page load
document.addEventListener('DOMContentLoaded', function() {
    loadVirtualCardModal();

    // Populate options when modal is opened
    setTimeout(() => {
        populateVoiceOptions();
        populateEmailOptions();
    }, 100);

    window.addEventListener('click', handleVirtualCardModalOutsideClick);
    document.addEventListener('keydown', handleVirtualCardModalEscape);
});

// Export functions for global access
window.openVirtualCardModal = openVirtualCardModal;
window.closeVirtualCardModal = closeVirtualCardModal;
window.selectGradient = selectGradient;
window.updateCardPreview = updateCardPreview;
window.submitVirtualCardForm = submitVirtualCardForm;
window.populateVoiceOptions = populateVoiceOptions;
window.populateEmailOptions = populateEmailOptions;
