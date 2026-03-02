/* Profile Dropdown JavaScript - Reusable Component */

// Profile dropdown HTML template
const dropdownTemplate = `
<div id="profile-dropdown" class="profile-dropdown">
    <div class="user-info">
        <div class="icon-title-description">
            <div class="icon-title-description__icons">
                <div class="user-avatar">
                    <img src="https://www.decisoesesolucoes.com/wp-content/uploads/2023/04/21_consultor-imobiliario.jpg" alt="Profile avatar">
                </div>
                <div class="organization-avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m22 21-3-3 3-3"/></svg>
                </div>
            </div>
            <div class="icon-title-description__info">
                <h2>João Santos</h2>
                <p>joao.santos@unlockit.com</p>
            </div>
        </div>
        <div class="wallet-info">
            <div>
                <p>Personal Wallet</p>
                <span class="amount">250 Credits</span>
            </div>
            <div class="wallet-info__buttons">
                <a class="icon-btn secondary" id="personal-wallet-overview-link" href="../../005-personal/004-wallet/000-overview/personal-wallet-overview-mockup.html">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </a>
                <a class="icon-btn primary" id="personal-wallet-charge" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </a>
            </div>
        </div>
    </div>
    <div class="organization-info">
        <div class="wallet-info">
            <div>
                <p>Business Wallet</p>
                <span class="amount" id="selected-office-credits">1,250 Credits</span>
            </div>
            <div class="wallet-info__buttons">
                <a class="icon-btn secondary" id="office-wallet-overview-link" href="../../006-organization/003-wallet/000-overview/org-wallet-overview-mockup.html">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </a>
                <a class="icon-btn primary" id="office-wallet-charge" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </a>
            </div>
        </div>
    </div>
    <div class="useful-links">
        <a href="../../006-organization/001-settings/manage-office-mockup.html" id="business-settings-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
            Business Settings
        </a>
        <a href="#" id="account-settings-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
            Security & Privacy 
        </a>
        <a href="../../005-personal/003-preferences/preferences-mockup.html" id="org-dashboard-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Preferences
        </a>
        <a href="#">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20l-4-2-4 2-4-2-4 2v-3.5"/></svg>
            Terms and Conditions
        </a>
        <a href="#">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20l-4-2-4 2-4-2-4 2v-3.5"/></svg>
            Privacy Policy
        </a>
    </div>
    <footer class="profile-footer">
        <button class="logout-btn" onclick="logout()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
        </button>
    </footer>
</div>
`;

function getFeaturesBasePath() {
    const match = window.location.pathname.match(/^(.*?\/(?:docs\/)?features\/)/);
    if (match) return match[1];
    return window.location.pathname.replace(/\/[^/]*$/, '/');
}

// Load profile dropdown HTML dynamically
function loadProfileDropdown() {
    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = dropdownTemplate;

    // Extract the profile dropdown element
    const dropdownElement = tempDiv.querySelector('#profile-dropdown');

    if (dropdownElement) {
        // Insert after nav-bar-wrap
        const navBarWrap = document.querySelector('.nav-bar-wrap');
        if (navBarWrap) {
            navBarWrap.insertAdjacentElement('afterend', dropdownElement);

            // Update organization dashboard link to be relative to current file
            const basePath = getFeaturesBasePath();

            const orgLink = dropdownElement.querySelector('#org-dashboard-link');
            if (orgLink) {
                orgLink.href = `${basePath}005-personal/003-preferences/preferences-mockup.html`;
            }

            const personalWalletOverview = dropdownElement.querySelector('#personal-wallet-overview-link');
            if (personalWalletOverview) {
                personalWalletOverview.href = `${basePath}005-personal/004-wallet/000-overview/personal-wallet-overview-mockup.html`;
            }

            const officeWalletOverview = dropdownElement.querySelector('#office-wallet-overview-link');
            if (officeWalletOverview) {
                officeWalletOverview.href = `${basePath}006-organization/003-wallet/000-overview/org-wallet-overview-mockup.html`;
            }

            const personalWalletCharge = dropdownElement.querySelector('#personal-wallet-charge');
            if (personalWalletCharge) {
                personalWalletCharge.href = `${basePath}007-wallet/wallet-charge-mockup.html?wallet=personal`;
            }

            const officeWalletCharge = dropdownElement.querySelector('#office-wallet-charge');
            if (officeWalletCharge) {
                officeWalletCharge.href = `${basePath}007-wallet/wallet-charge-mockup.html?wallet=office`;
            }

            const manageOfficesLink = dropdownElement.querySelector('#select-office-toggle');
            if (manageOfficesLink) {
                manageOfficesLink.href = `${basePath}006-organization/001-settings/manage-office-mockup.html`;
            }

            const officeCardToggle = dropdownElement.querySelector('#office-card-toggle');
            const officeSelectList = dropdownElement.querySelector('#office-select-list');
            if (officeCardToggle && officeSelectList) {
                officeCardToggle.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const isOpen = officeSelectList.classList.toggle('open');
                    officeSelectList.setAttribute('aria-hidden', String(!isOpen));
                    officeCardToggle.setAttribute('aria-expanded', String(isOpen));
                });
            }

            const officeOptions = dropdownElement.querySelectorAll('.office-option');
            if (officeOptions.length) {
                officeOptions.forEach((option) => {
                    option.addEventListener('click', (event) => {
                        const deleteButton = event.target.closest('.office-option__delete');
                        if (deleteButton) {
                            event.preventDefault();
                            event.stopPropagation();
                            const selectedName = dropdownElement.querySelector('#selected-office-name')?.textContent;
                            const isSelected = selectedName && option.dataset.name === selectedName;
                            option.remove();
                            if (isSelected) {
                                const nextOption = dropdownElement.querySelector('.office-option');
                                if (nextOption) {
                                    const name = nextOption.dataset.name;
                                    const role = nextOption.dataset.role;
                                    const credits = nextOption.dataset.credits;
                                    const nameEl = dropdownElement.querySelector('#selected-office-name');
                                    const roleEl = dropdownElement.querySelector('#selected-office-role');
                                    const creditsEl = dropdownElement.querySelector('#selected-office-credits');
                                    if (nameEl && name) nameEl.textContent = name;
                                    if (roleEl && role) roleEl.textContent = role;
                                    if (creditsEl && credits) creditsEl.textContent = credits;
                                    localStorage.setItem('selectedOffice', JSON.stringify({ name, role, credits }));
                                }
                            }
                            return;
                        }
                        event.preventDefault();
                        const name = option.dataset.name;
                        const role = option.dataset.role;
                        const credits = option.dataset.credits;
                        const nameEl = dropdownElement.querySelector('#selected-office-name');
                        const roleEl = dropdownElement.querySelector('#selected-office-role');
                        const creditsEl = dropdownElement.querySelector('#selected-office-credits');
                        if (nameEl && name) nameEl.textContent = name;
                        if (roleEl && role) roleEl.textContent = role;
                        if (creditsEl && credits) creditsEl.textContent = credits;
                        localStorage.setItem('selectedOffice', JSON.stringify({ name, role, credits }));
                        if (officeSelectList && officeCardToggle) {
                            officeSelectList.classList.remove('open');
                            officeSelectList.setAttribute('aria-hidden', 'true');
                            officeCardToggle.setAttribute('aria-expanded', 'false');
                        }
                    });
                });
            }

            const officeCreateButton = dropdownElement.querySelector('.office-create');
            if (officeCreateButton && officeSelectList) {
                officeCreateButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const newOffice = document.createElement('button');
                    newOffice.type = 'button';
                    newOffice.className = 'office-option';
                    newOffice.dataset.name = 'New Office';
                    newOffice.dataset.role = 'Owner';
                    newOffice.dataset.credits = '0 Credits';
                    newOffice.innerHTML = `
                        <span class="office-option__avatar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m22 21-3-3 3-3"/></svg>
                        </span>
                        <span class="office-option__info">
                            <span class="office-option__name">New Office</span>
                            <span class="office-option__meta">Owner · Add details</span>
                        </span>
                            `;
                    officeSelectList.insertBefore(newOffice, officeCreateButton);
                    newOffice.addEventListener('click', (clickEvent) => {
                        const deleteButton = clickEvent.target.closest('.office-option__delete');
                        if (deleteButton) {
                            clickEvent.preventDefault();
                            clickEvent.stopPropagation();
                            newOffice.remove();
                            return;
                        }
                        clickEvent.preventDefault();
                        const nameEl = dropdownElement.querySelector('#selected-office-name');
                        const roleEl = dropdownElement.querySelector('#selected-office-role');
                        const creditsEl = dropdownElement.querySelector('#selected-office-credits');
                        if (nameEl) nameEl.textContent = 'New Office';
                        if (roleEl) roleEl.textContent = 'Owner';
                        if (creditsEl) creditsEl.textContent = '0 Credits';
                        localStorage.setItem('selectedOffice', JSON.stringify({ name: 'New Office', role: 'Owner', credits: '0 Credits' }));
                        officeSelectList.classList.remove('open');
                        officeSelectList.setAttribute('aria-hidden', 'true');
                        officeCardToggle.setAttribute('aria-expanded', 'false');
                    });
                });
            }

            const storedOffice = localStorage.getItem('selectedOffice');
            if (storedOffice) {
                const parsed = JSON.parse(storedOffice);
                const nameEl = dropdownElement.querySelector('#selected-office-name');
                const roleEl = dropdownElement.querySelector('#selected-office-role');
                const creditsEl = dropdownElement.querySelector('#selected-office-credits');
                if (nameEl && parsed.name) nameEl.textContent = parsed.name;
                if (roleEl && parsed.role) roleEl.textContent = parsed.role;
                if (creditsEl && parsed.credits) creditsEl.textContent = parsed.credits;
            }
        }
    }
}

function toggleProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('visible');
    }
}

function logout() {
    const basePath = getFeaturesBasePath();

    window.location.href = `${basePath}000-base/login-mockup.html`;
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('profile-dropdown');
    const profileButton = document.getElementById('profile-button');
    const officeCardToggle = document.getElementById('office-card-toggle');
    const officeSelectList = document.getElementById('office-select-list');

    if (officeCardToggle && officeCardToggle.contains(event.target)) {
        return;
    }

    if (officeSelectList && officeSelectList.contains(event.target)) {
        return;
    }

    if (officeSelectList && officeSelectList.classList.contains('open')) {
        officeSelectList.classList.remove('open');
        officeSelectList.setAttribute('aria-hidden', 'true');
        if (officeCardToggle) {
            officeCardToggle.setAttribute('aria-expanded', 'false');
        }
    }

    if (dropdown && !dropdown.contains(event.target) && event.target !== profileButton && !profileButton.contains(event.target)) {
        dropdown.classList.remove('visible');
    }
});

// Close dropdown when pressing Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('profile-dropdown');
        if (dropdown) {
            dropdown.classList.remove('visible');
        }
    }
});

// Initialize dropdown when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadProfileDropdown();

    const openProfile = localStorage.getItem('openProfileDropdown');
    if (openProfile === 'true') {
        localStorage.removeItem('openProfileDropdown');
        setTimeout(() => {
            toggleProfileDropdown();
        }, 100);
    }
});
