// Language Modal Component
const languageModalTemplate = `<!-- Language Selection Modal -->
<div id="languageModal" class="language-modal" style="display: none;">
    <div class="language-modal-content">
        <div class="language-modal-header">
            <h3>Select Language</h3>
            <button class="close-modal" onclick="closeLanguageModal()">&times;</button>
        </div>
        <div class="language-modal-body">
            <p>Choose your preferred language</p>
            <div class="language-options">
                <label class="language-option" data-language="en">
                    <input type="radio" name="language" value="en" checked>
                    <div class="language-flag">
                        <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                            <rect width="24" height="18" rx="2" fill="#012169"/>
                            <path d="M0 0l24 18M24 0L0 18" stroke="#fff" stroke-width="2"/>
                            <path d="M0 0l24 18M24 0L0 18" stroke="#C8102E" stroke-width="1"/>
                            <path d="M12 0v18M0 9h24" stroke="#fff" stroke-width="3"/>
                            <path d="M12 0v18M0 9h24" stroke="#C8102E" stroke-width="2"/>
                        </svg>
                    </div>
                    <div class="language-name">English</div>
                    <div class="language-check">✓</div>
                </label>
                <label class="language-option" data-language="pt">
                    <input type="radio" name="language" value="pt">
                    <div class="language-flag">
                        <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                            <rect width="24" height="18" rx="2" fill="#FF0000"/>
                            <rect x="0" y="0" width="9.6" height="18" fill="#006600"/>
                            <circle cx="9.6" cy="9" r="3" fill="#FFFF00" stroke="#0000FF" stroke-width="0.5"/>
                            <circle cx="9.6" cy="9" r="2.2" fill="none" stroke="#0000FF" stroke-width="0.3"/>
                            <rect x="8.8" y="8.2" width="1.6" height="1.6" fill="#FF0000"/>
                        </svg>
                    </div>
                    <div class="language-name">Português</div>
                    <div class="language-check">✓</div>
                </label>
                <label class="language-option" data-language="es">
                    <input type="radio" name="language" value="es">
                    <div class="language-flag">
                        <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                            <rect width="24" height="18" rx="2" fill="#AA151B"/>
                            <rect x="0" y="4.5" width="24" height="9" fill="#F1BF00"/>
                            <rect x="0" y="13.5" width="24" height="4.5" fill="#AA151B"/>
                        </svg>
                    </div>
                    <div class="language-name">Español</div>
                    <div class="language-check">✓</div>
                </label>
                <label class="language-option" data-language="fr">
                    <input type="radio" name="language" value="fr">
                    <div class="language-flag">
                        <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                            <rect width="24" height="18" rx="2" fill="#ED2939"/>
                            <rect x="0" y="0" width="8" height="18" fill="#002395"/>
                            <rect x="8" y="0" width="8" height="18" fill="#FFFFFF"/>
                        </svg>
                    </div>
                    <div class="language-name">Français</div>
                    <div class="language-check">✓</div>
                </label>
                <label class="language-option" data-language="de">
                    <input type="radio" name="language" value="de">
                    <div class="language-flag">
                        <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                            <rect width="24" height="18" rx="2" fill="#FFCE00"/>
                            <rect x="0" y="0" width="24" height="6" fill="#000000"/>
                            <rect x="0" y="6" width="24" height="6" fill="#DD0000"/>
                        </svg>
                    </div>
                    <div class="language-name">Deutsch</div>
                    <div class="language-check">✓</div>
                </label>
                <label class="language-option" data-language="it">
                    <input type="radio" name="language" value="it">
                    <div class="language-flag">
                        <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                            <rect width="24" height="18" rx="2" fill="#CE2B37"/>
                            <rect x="0" y="0" width="8" height="18" fill="#009246"/>
                            <rect x="8" y="0" width="8" height="18" fill="#FFFFFF"/>
                        </svg>
                    </div>
                    <div class="language-name">Italiano</div>
                    <div class="language-check">✓</div>
                </label>
            </div>
            <div class="language-modal-footer">
                <button class="btn btn-primary" onclick="applyLanguageSelection()">Apply</button>
                <button class="btn btn-secondary" onclick="closeLanguageModal()">Cancel</button>
            </div>
        </div>
    </div>
</div>`;

// Current language state
let currentLanguage = 'en';

// Load language modal component
function loadLanguageModal() {
    // Check if modal already exists
    if (document.getElementById('languageModal')) {
        return;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = languageModalTemplate;
    const modalElement = tempDiv.querySelector('#languageModal');
    document.body.appendChild(modalElement);

    // Initialize language options click handlers
    initializeLanguageOptions();
}

// Initialize language option handlers
function initializeLanguageOptions() {
    const languageOptions = document.querySelectorAll('.language-option');

    languageOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            // Don't trigger if clicking on radio button directly
            if (e.target.type === 'radio') return;

            // Check the radio button in this option
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;

                // Update visual state
                updateLanguageSelection();
            }
        });
    });

    // Handle radio button changes
    const radioButtons = document.querySelectorAll('input[name="language"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', updateLanguageSelection);
    });
}

// Update visual selection state
function updateLanguageSelection() {
    const selectedRadio = document.querySelector('input[name="language"]:checked');
    const allOptions = document.querySelectorAll('.language-option');

    allOptions.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        if (radio && radio.checked) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

// Language modal functions
function openLanguageModal() {
    const modal = document.getElementById('languageModal');
    if (modal) {
        modal.style.display = 'flex';

        // Set current language as selected
        const currentRadio = document.querySelector(`input[name="language"][value="${currentLanguage}"]`);
        if (currentRadio) {
            currentRadio.checked = true;
            updateLanguageSelection();
        }
    }
}

function closeLanguageModal() {
    const modal = document.getElementById('languageModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function applyLanguageSelection() {
    const selectedRadio = document.querySelector('input[name="language"]:checked');
    if (selectedRadio) {
        const newLanguage = selectedRadio.value;
        const languageName = selectedRadio.closest('.language-option').querySelector('.language-name').textContent;

        // Update current language
        currentLanguage = newLanguage;

        // Store in localStorage for persistence
        localStorage.setItem('selectedLanguage', newLanguage);
        localStorage.setItem('selectedLanguageName', languageName);

        // Update language selector button if it exists
        updateLanguageButton(newLanguage, languageName);

        // Close modal
        closeLanguageModal();

        // Trigger language change event
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: newLanguage, name: languageName }
        }));

        console.log(`Language changed to: ${languageName} (${newLanguage})`);
    }
}

// Update the language selector button
function updateLanguageButton(languageCode, languageName) {
    const languageButton = document.querySelector('.language-selector');
    if (languageButton) {
        // Update button title
        languageButton.title = languageName;

        // You could also update the flag icon here if needed
        // For now, we'll keep the current globe icon
    }
}

// Close modal when clicking outside
function handleLanguageModalOutsideClick(event) {
    const modal = document.getElementById('languageModal');
    if (modal && event.target === modal) {
        closeLanguageModal();
    }
}

// Handle escape key
function handleLanguageModalEscape(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('languageModal');
        if (modal && modal.style.display === 'flex') {
            closeLanguageModal();
        }
    }
}

// Initialize language modal on page load
document.addEventListener('DOMContentLoaded', function() {
    loadLanguageModal();

    // Load saved language preference
    const savedLanguage = localStorage.getItem('selectedLanguage');
    const savedLanguageName = localStorage.getItem('selectedLanguageName');

    if (savedLanguage) {
        currentLanguage = savedLanguage;
        if (savedLanguageName) {
            updateLanguageButton(savedLanguage, savedLanguageName);
        }
    }

    // Add event listeners
    window.addEventListener('click', handleLanguageModalOutsideClick);
    document.addEventListener('keydown', handleLanguageModalEscape);
});

// Export functions for global access
window.openLanguageModal = openLanguageModal;
window.closeLanguageModal = closeLanguageModal;
window.applyLanguageSelection = applyLanguageSelection;