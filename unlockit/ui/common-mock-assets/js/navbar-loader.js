// Navbar Loader System - Dynamically loads navbar components using embedded templates
// Provides consistent top navigation across all mockup files

// Standard Navbar Template
const navbarTemplate = `<div class="nav-bar-wrap">
    <div class="nav-bar">
        <div class="nav-bar__inner">
           
        </div>
        <div class="navigation-wrap">
            <ul>
                <li>
                    <button type="button" class="language-selector" onclick="openLanguageModal()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    </button>
                </li>
                <li>
                    <button id="help-button" onclick="toggleHelpDropdown()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                    </button>
                </li>
                <li>
                    <button id="tasks-button" onclick="toggleTasksDropdown()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                    </button>
                </li>
                <li>
                    <button id="approvals-button" class="approvals-button" onclick="toggleApprovalsDropdown()">
                        <span class="approvals-badge" data-approvals-badge>0</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z"/><path d="m9 12 2 2 4-4"/></svg>
                    </button>
                </li>
                <li>
                    <button id="notifications-button" onclick="toggleNotificationsDropdown()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    </button>
                </li>
                <li>
                    <button id="profile-button" onclick="toggleProfileDropdown()">
                        <div class="profile-avatar">
                            <img src="https://www.decisoesesolucoes.com/wp-content/uploads/2023/04/21_consultor-imobiliario.jpg" alt="Profile avatar">
                        </div>
                    </button>
                </li>
            </ul>
        </div>
    </div>
</div>`;

class NavbarLoader {
    constructor() {
        this.loadedNavbars = new Set();
        this.currentPage = this.getCurrentPage();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const segments = path.split('/');
        return segments[segments.length - 1] || 'index.html';
    }

    getFeaturesBasePath() {
        const match = window.location.pathname.match(/^(.*?\/(?:docs\/)?features\/)/);
        if (match) return match[1];
        return window.location.pathname.replace(/\/[^/]*$/, '/');
    }

    getCommonAssetsBasePath() {
        return `${this.getFeaturesBasePath()}common-mock-assets`;
    }

    updateLogoPath(navbarHTML) {
        // Create a temporary container to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = navbarHTML;

        const basePath = this.getFeaturesBasePath();

        // Update logo src path
        const logoImg = tempDiv.querySelector('.nav-bar__logo img');
        if (logoImg) {
            logoImg.setAttribute('src', `${basePath}common-mock-assets/images/org-logo.jpeg`);
        }

        return tempDiv.innerHTML;
    }

    async injectNavbar(targetSelector = '#navbar-container') {
        const navbarContainer = document.querySelector(targetSelector);
        if (!navbarContainer) {
            console.error(`Navbar container not found: ${targetSelector}`);
            return;
        }

        try {
            console.log(`Loading navbar for page: ${this.currentPage}`);

            let navbarHTML = navbarTemplate;
            navbarHTML = this.updateLogoPath(navbarHTML);

            navbarContainer.innerHTML = navbarHTML;

            this.loadedNavbars.add('standard');
            console.log('Navbar loaded successfully');

            if (window.componentLoader?.autoLoadComponents) {
                const basePath = this.getCommonAssetsBasePath();
                await window.componentLoader.autoLoadComponents(basePath);
            }

            const tasksButton = navbarContainer.querySelector('#tasks-button');
            if (tasksButton) {
                tasksButton.removeAttribute('onclick');
                tasksButton.addEventListener('click', async () => {
                    if (typeof window.toggleTasksDropdown !== 'function') {
                        const basePath = this.getCommonAssetsBasePath();

                        if (window.componentLoader) {
                            await window.componentLoader.loadCSS(`${basePath}/css/tasks-dropdown.css`, 'tasks-dropdown-css');
                            await window.componentLoader.loadJS(`${basePath}/js/tasks-dropdown.js`, 'tasks-dropdown-js');
                        } else {
                            const link = document.createElement('link');
                            link.rel = 'stylesheet';
                            link.href = `${basePath}/css/tasks-dropdown.css`;
                            document.head.appendChild(link);
                            const script = document.createElement('script');
                            script.src = `${basePath}/js/tasks-dropdown.js`;
                            document.body.appendChild(script);
                        }
                    }

                    if (typeof window.toggleTasksDropdown === 'function') {
                        window.toggleTasksDropdown();
                    }
                });
            }

            const approvalsButton = navbarContainer.querySelector('#approvals-button');
            const loadApprovalsAssets = async () => {
                if (typeof window.toggleApprovalsDropdown === 'function') return;
                const basePath = this.getCommonAssetsBasePath();

                if (window.componentLoader) {
                    await window.componentLoader.loadCSS(`${basePath}/css/approvals.css`, 'approvals-css');
                    await window.componentLoader.loadJS(`${basePath}/js/approvals.js`, 'approvals-js');
                } else {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = `${basePath}/css/approvals.css`;
                    document.head.appendChild(link);
                    const script = document.createElement('script');
                    script.src = `${basePath}/js/approvals.js`;
                    document.body.appendChild(script);
                }
            };

            if (approvalsButton) {
                approvalsButton.removeAttribute('onclick');
                approvalsButton.addEventListener('click', async () => {
                    await loadApprovalsAssets();
                    if (typeof window.toggleApprovalsDropdown === 'function') {
                        window.toggleApprovalsDropdown();
                    }
                });
            }

            // Load required CSS if component loader is available
            if (window.componentLoader) {
                try {
                    const basePath = this.getCommonAssetsBasePath();
                    await window.componentLoader.loadCSS(`${basePath}/css/nav-logo.css`, 'navbar-logo-css');
                    await window.componentLoader.loadCSS(`${basePath}/css/approvals.css`, 'approvals-css');
                    await window.componentLoader.loadJS(`${basePath}/js/approvals.js`, 'approvals-js');
                } catch (error) {
                    console.warn('Navbar logo CSS could not be loaded:', error);
                }
            }

            if (!window.componentLoader) {
                await loadApprovalsAssets();
            }

        } catch (error) {
            console.error('Failed to load navbar:', error);
            // Fallback: create a basic error message
            navbarContainer.innerHTML = '<div class="navbar-error">Navbar loading failed</div>';
        }
    }
}

// Create global instance
window.navbarLoader = new NavbarLoader();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Auto-load navbar if container exists
    const navbarContainer = document.querySelector('#navbar-container');
    if (navbarContainer) {
        window.navbarLoader.injectNavbar();
    }
});
