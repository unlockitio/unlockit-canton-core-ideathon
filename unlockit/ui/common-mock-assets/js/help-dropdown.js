/* Help Dropdown JavaScript - Reusable Component */

const helpDropdownTemplate = `
<div id="help-dropdown" class="help-dropdown">
    <div class="help-dropdown-header">
        <h3>Help & Resources</h3>
    </div>

    <div class="help-dropdown-list">
         <button class="help-dropdown-item" onclick="handleHelpItemClick('academy')">
            <div class="help-item-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5"/></svg>
            </div>
            <div class="help-item-content">
                <div class="help-item-title">Academy</div>
                <div class="help-item-description">Learn with Unlockit</div>
            </div>
        </button>
        <button class="help-dropdown-item" onclick="handleHelpItemClick('tutorials')">
            <div class="help-item-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
            </div>
            <div class="help-item-content">
                <div class="help-item-title">Tutorials</div>
                <div class="help-item-description">Learn how to use Unlockit</div>
            </div>
        </button>

        <button class="help-dropdown-item" onclick="handleHelpItemClick('support')">
            <div class="help-item-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
            </div>
            <div class="help-item-content">
                <div class="help-item-title">Support</div>
                <div class="help-item-description">Get help from our team</div>
            </div>
        </button>

        <button class="help-dropdown-item" onclick="handleHelpItemClick('latest-features')">
            <div class="help-item-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                </svg>
            </div>
            <div class="help-item-content">
                <div class="help-item-title">Latest Features</div>
                <div class="help-item-description">What's new in Unlockit</div>
            </div>
        </button>
    </div>
</div>
`;

function loadHelpDropdown() {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = helpDropdownTemplate;

    const dropdownElement = tempDiv.querySelector('#help-dropdown');

    if (dropdownElement) {
        const navBarWrap = document.querySelector('.nav-bar-wrap');
        if (navBarWrap) {
            navBarWrap.insertAdjacentElement('afterend', dropdownElement);
        }
    }
}

function toggleHelpDropdown() {
    const dropdown = document.getElementById('help-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('visible');
    }
}

function handleHelpItemClick(item) {
    const dropdown = document.getElementById('help-dropdown');
    if (dropdown) {
        dropdown.classList.remove('visible');
    }

    switch(item) {
         case 'academy':
            window.open('https://www.unlockit.io/academia','_blank');
            break;
        case 'tutorials':
            window.open('https://www.unlockit.io/academia-tutoriais','_blank');
            break;
        case 'support':
            alert('This would navigate to the Support page');
            break;
        case 'latest-features':
            alert('This would navigate to the Latest Features page');
            break;
    }
}

document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('help-dropdown');
    const helpButton = document.getElementById('help-button');

    if (dropdown && !dropdown.contains(event.target) && event.target !== helpButton && !helpButton?.contains(event.target)) {
        dropdown.classList.remove('visible');
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('help-dropdown');
        if (dropdown) {
            dropdown.classList.remove('visible');
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    loadHelpDropdown();
});
