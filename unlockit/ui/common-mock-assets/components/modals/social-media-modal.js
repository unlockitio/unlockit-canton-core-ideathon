// Social Media Modal Component
const socialMediaModalTemplate = `<div id="socialMediaModal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2 class="modal-title">Add Web Presence</h2>
            <button class="modal-close" onclick="closeSocialMediaModal()">&times;</button>
        </div>
        <div class="modal-body">
            <form id="socialMediaForm" onsubmit="submitSocialMediaForm(event)">
                <div class="form-group">
                    <label class="form-label">Select Platform *</label>
                    <div class="social-platform-grid">
                        <div class="social-platform-option" data-platform="linkedin" onclick="selectSocialPlatform('linkedin')">
                            <div class="social-platform-icon linkedin">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                                    <rect x="2" y="9" width="4" height="12"/>
                                    <circle cx="4" cy="4" r="2"/>
                                </svg>
                            </div>
                            <div class="social-platform-name">LinkedIn</div>
                        </div>
                        <div class="social-platform-option" data-platform="facebook" onclick="selectSocialPlatform('facebook')">
                            <div class="social-platform-icon facebook">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                                </svg>
                            </div>
                            <div class="social-platform-name">Facebook</div>
                        </div>
                        <div class="social-platform-option" data-platform="twitter" onclick="selectSocialPlatform('twitter')">
                            <div class="social-platform-icon twitter">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                                </svg>
                            </div>
                            <div class="social-platform-name">Twitter/X</div>
                        </div>
                        <div class="social-platform-option" data-platform="instagram" onclick="selectSocialPlatform('instagram')">
                            <div class="social-platform-icon instagram">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                                </svg>
                            </div>
                            <div class="social-platform-name">Instagram</div>
                        </div>
                        <div class="social-platform-option" data-platform="youtube" onclick="selectSocialPlatform('youtube')">
                            <div class="social-platform-icon youtube">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                                    <polygon points="9.75,15.02 15.5,11.75 9.75,8.48"/>
                                </svg>
                            </div>
                            <div class="social-platform-name">YouTube</div>
                        </div>
                        <div class="social-platform-option" data-platform="tiktok" onclick="selectSocialPlatform('tiktok')">
                            <div class="social-platform-icon tiktok">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
                                </svg>
                            </div>
                            <div class="social-platform-name">TikTok</div>
                        </div>
                        <div class="social-platform-option" data-platform="whatsapp" onclick="selectSocialPlatform('whatsapp')">
                            <div class="social-platform-icon whatsapp">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                                </svg>
                            </div>
                            <div class="social-platform-name">WhatsApp</div>
                        </div>
                        <div class="social-platform-option" data-platform="other" onclick="selectSocialPlatform('other')">
                            <div class="social-platform-icon other">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="2" y1="12" x2="22" y2="12"/>
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                                </svg>
                            </div>
                            <div class="social-platform-name">Other</div>
                        </div>
                    </div>
                    <input type="hidden" name="platform" id="selectedPlatform" required>
                </div>
                <div class="form-group" id="customPlatformGroup" style="display: none;">
                    <label class="form-label">Platform Name *</label>
                    <input type="text" name="custom-platform-name" class="form-input" placeholder="Enter platform name">
                </div>
                <div class="form-group">
                    <label class="form-label">Profile URL *</label>
                    <input type="url" name="profile-url" class="form-input" placeholder="https://..." required>
                    <div class="form-help-text">Enter the full URL to your profile</div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" onclick="closeSocialMediaModal()">Cancel</button>
                    <button type="submit" class="btn-primary">Add Web Presence</button>
                </div>
            </form>
        </div>
    </div>
</div>`;

// Platform configurations
const platformConfigs = {
    'linkedin': { name: 'LinkedIn', icon: 'linkedin' },
    'facebook': { name: 'Facebook', icon: 'facebook' },
    'twitter': { name: 'Twitter/X', icon: 'twitter' },
    'instagram': { name: 'Instagram', icon: 'instagram' },
    'youtube': { name: 'YouTube', icon: 'youtube' },
    'tiktok': { name: 'TikTok', icon: 'tiktok' },
    'whatsapp': { name: 'WhatsApp', icon: 'whatsapp' }
};

// Load social media modal component
function loadSocialMediaModal() {
    if (document.getElementById('socialMediaModal')) {
        return;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = socialMediaModalTemplate;
    const modalElement = tempDiv.querySelector('#socialMediaModal');
    document.body.appendChild(modalElement);
}

// Social media modal functions
let editingSocialItem = null;

function openSocialMediaModal(editData = null) {
    const modal = document.getElementById('socialMediaModal');
    const modalTitle = modal.querySelector('.modal-title');
    const submitButton = modal.querySelector('button[type="submit"]');

    if (modal) {
        if (editData) {
            // Edit mode
            editingSocialItem = editData.element;
            modalTitle.textContent = 'Edit Web Presence';
            submitButton.textContent = 'Save Changes';

            // Pre-fill form with existing data
            selectSocialPlatform(editData.platform);
            modal.querySelector('input[name="profile-url"]').value = editData.url;

            if (editData.platform === 'other') {
                modal.querySelector('input[name="custom-platform-name"]').value = editData.platformName;
            }
        } else {
            // Add mode
            editingSocialItem = null;
            modalTitle.textContent = 'Add Web Presence';
            submitButton.textContent = 'Add Web Presence';
        }

        modal.style.display = 'flex';
        modal.classList.add('show');
    }
}

function closeSocialMediaModal() {
    const modal = document.getElementById('socialMediaModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        const form = document.getElementById('socialMediaForm');
        if (form) {
            form.reset();
        }
        document.querySelectorAll('.social-platform-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.getElementById('customPlatformGroup').style.display = 'none';
        editingSocialItem = null;
    }
}

function selectSocialPlatform(platform) {
    document.querySelectorAll('.social-platform-option').forEach(option => {
        option.classList.remove('selected');
    });

    const selectedOption = document.querySelector(`.social-platform-option[data-platform="${platform}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }

    document.getElementById('selectedPlatform').value = platform;

    const customPlatformGroup = document.getElementById('customPlatformGroup');
    if (platform === 'other') {
        customPlatformGroup.style.display = 'block';
        customPlatformGroup.querySelector('input').required = true;
    } else {
        customPlatformGroup.style.display = 'none';
        customPlatformGroup.querySelector('input').required = false;
    }
}

function submitSocialMediaForm(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const platform = formData.get('platform');
    const customPlatformName = formData.get('custom-platform-name');
    const profileUrl = formData.get('profile-url');

    const platformName = platform === 'other' ? customPlatformName : platformConfigs[platform]?.name || platform;

    const socialData = {
        platform: platform,
        platformName: platformName,
        profileUrl: profileUrl,
        icon: platform,
        element: editingSocialItem
    };

    if (editingSocialItem) {
        // Editing existing social network
        document.dispatchEvent(new CustomEvent('socialMediaUpdated', {
            detail: socialData
        }));
    } else {
        // Adding new social network
        document.dispatchEvent(new CustomEvent('socialMediaAdded', {
            detail: socialData
        }));
    }

    closeSocialMediaModal();
}

function handleSocialMediaModalOutsideClick(event) {
    const modal = document.getElementById('socialMediaModal');
    if (modal && event.target === modal) {
        closeSocialMediaModal();
    }
}

function handleSocialMediaModalEscape(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('socialMediaModal');
        if (modal && modal.style.display === 'flex') {
            closeSocialMediaModal();
        }
    }
}

// Get social icon HTML
function getSocialIcon(platform) {
    const icons = {
        'linkedin': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
        'facebook': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
        'twitter': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>`,
        'instagram': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
        'youtube': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75,15.02 15.5,11.75 9.75,8.48"/></svg>`,
        'tiktok': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>`,
        'whatsapp': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
        'other': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
    };
    return icons[platform] || icons['other'];
}

// Initialize social media modal on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSocialMediaModal();

    window.addEventListener('click', handleSocialMediaModalOutsideClick);
    document.addEventListener('keydown', handleSocialMediaModalEscape);
});

// Export functions for global access
window.openSocialMediaModal = openSocialMediaModal;
window.closeSocialMediaModal = closeSocialMediaModal;
window.selectSocialPlatform = selectSocialPlatform;
window.submitSocialMediaForm = submitSocialMediaForm;
window.getSocialIcon = getSocialIcon;
