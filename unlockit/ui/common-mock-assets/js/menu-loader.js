// Menu Loader System - Unified menu structure with collapsible groups
// Avoids CORS issues with local file loading

const unifiedMenuTemplate = `
<div class="menu-bar">
    <div class="menu-bar__logo-wrap_desktop">
        <svg width="158" height="33" viewBox="0 0 158 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_7227_21409)">
                <path d="M32.0398 0.000344034C29.8158 -0.00779106 28.2082 -0.0118585 27.0879 1.07418C24.9763 3.13235 24.9763 8.81065 24.9763 25.6666C24.9763 25.996 24.9555 26.3174 24.918 26.6265C22.8439 27.0861 20.141 27.2895 16.5759 27.2895H16.5717C13.0067 27.2895 10.312 27.0861 8.24214 26.6265C8.20049 26.3174 8.17967 25.996 8.17967 25.6666C8.17967 8.81065 8.17967 3.13235 6.06811 1.07418C4.94778 -0.0118585 3.34017 -0.00779106 1.11617 0.000344034H0V11.3325C0 18.227 0.412315 22.201 2.68213 24.7554C3.76498 25.9798 5.24765 26.838 7.38419 27.3993C7.65907 28.6684 8.25463 29.7504 9.16672 30.6249C12.2487 33.7935 20.9073 33.7935 23.9892 30.6249C24.9013 29.7504 25.4969 28.6684 25.7759 27.3993C27.9083 26.838 29.391 25.9798 30.4738 24.7554C32.7437 22.201 33.156 18.227 33.156 11.3325V0.000344034H32.0398ZM3.4193 24.1331C1.36605 21.8146 0.974563 17.8447 0.974563 11.3325V0.95215H1.12033C3.18191 0.944015 4.54796 0.939947 5.37676 1.74939C7.12181 3.44556 7.2051 8.84726 7.2051 25.6666C7.2051 25.9065 7.21343 26.1384 7.23426 26.3702C5.51836 25.8659 4.3064 25.1337 3.4193 24.1331ZM23.3062 29.9456C19.7495 32.8417 13.4065 32.8458 9.84975 29.9456C9.18755 29.3111 8.72109 28.5382 8.45454 27.6434C10.5494 28.0583 13.1899 28.2413 16.5759 28.2413C19.9619 28.2413 22.6065 28.0583 24.7056 27.6434C24.4349 28.5382 23.9684 29.3111 23.3062 29.9456ZM32.1814 11.3325C32.1814 17.8447 31.7941 21.8146 29.7367 24.1331C28.8496 25.1337 27.6376 25.8659 25.9259 26.3702C25.9425 26.1384 25.9509 25.9065 25.9509 25.6666C25.9509 8.84726 26.0342 3.44556 27.7792 1.74939C28.533 1.01723 29.7242 0.95215 31.4817 0.95215H32.1814V11.3325Z" fill="white"/>
                <path d="M58.4404 16.1159C58.4404 19.6668 56.837 21.3671 53.88 21.3671C50.923 21.3671 49.3737 19.6424 49.3737 16.1159V4.77148H47.0122V16.1443C47.0122 20.9969 49.4819 23.4863 53.88 23.4863C58.278 23.4863 60.8019 20.9929 60.8019 16.1443V4.77148H58.4404V16.1199V16.1159Z" fill="white"/>
                <path d="M71.0764 9.64844C68.8774 9.64844 67.4947 10.6043 66.6784 11.6375L66.3785 9.80707H64.4502V23.3276H66.6742V16.3029C66.6742 13.415 68.2485 11.6375 70.6932 11.6375C72.9714 11.6375 74.275 13.0408 74.275 15.6684V23.3317H76.499V15.5382C76.499 11.2429 74.0542 9.65251 71.0681 9.65251L71.0764 9.64844Z" fill="white"/>
                <path d="M85.3367 4.77148H78.9313V6.76051H83.1127V21.3386H78.9313V23.3276H89.5432V21.3386H85.3367V4.77148Z" fill="white"/>
                <path d="M97.6187 9.64844C93.5747 9.64844 90.751 12.4591 90.751 16.5673C90.751 20.6756 93.5747 23.4862 97.6187 23.4862C101.663 23.4862 104.486 20.6756 104.486 16.5673C104.486 12.4591 101.663 9.64844 97.6187 9.64844ZM97.6187 21.5541C94.8783 21.5541 93.0291 19.4594 93.0291 16.5714C93.0291 13.6834 94.8741 11.5887 97.6187 11.5887C100.363 11.5887 102.208 13.6834 102.208 16.5714C102.208 19.4594 100.363 21.5541 97.6187 21.5541Z" fill="white"/>
                <path d="M113.557 11.5846C115.594 11.5846 116.952 12.6706 117.356 14.4725H119.688C119.118 11.5032 116.973 9.64844 113.578 9.64844C109.559 9.64844 106.819 12.4591 106.819 16.5958C106.819 20.7325 109.48 23.4903 113.524 23.4903C116.889 23.4903 119.142 21.6355 119.688 18.7191H117.327C116.893 20.4437 115.536 21.5541 113.553 21.5541C110.892 21.5541 109.101 19.5407 109.101 16.5958C109.101 13.6509 110.892 11.5846 113.553 11.5846H113.557Z" fill="white"/>
                <path d="M135.069 9.80711H132.245L124.865 16.9904V4.77148H122.637V23.3276H124.865V19.7238L127.684 16.966L132.599 23.3276H135.339L129.234 15.4813L135.069 9.80711Z" fill="white"/>
                <path d="M154.522 21.3382C153.327 21.3382 152.919 20.9152 152.919 19.7722V11.7917H157.779V9.80267H152.919V6.01172H150.695V9.80267H147.03V11.7917H150.695V19.7966C150.695 22.1843 151.644 23.3232 154.306 23.3232H157.996V21.3342H154.522V21.3382Z" fill="white"/>
                <path d="M143.486 9.80664H137.08V11.7957H141.262V21.3381H137.08V23.3272H147.696V21.3381H143.486V9.80664Z" fill="white"/>
                <path d="M142.407 7.43142C143.357 7.43142 144.094 6.73994 144.094 5.75966C144.094 4.83226 143.361 4.1123 142.407 4.1123C141.453 4.1123 140.695 4.82819 140.695 5.75966C140.695 6.73994 141.457 7.43142 142.407 7.43142Z" fill="white"/>
            </g>
            <defs>
                <clipPath id="clip0_7227_21409">
                    <rect width="158" height="33" fill="white"/>
                </clipPath>
            </defs>
        </svg>
    </div>
    <div class="menu-bar__store-switcher" data-store-switcher>
        <button class="store-switcher__button store-switcher__button--main" type="button" aria-expanded="false" aria-haspopup="listbox">
            <span class="store-switcher__avatar" aria-hidden="true">
                <img src="https://i.maxwork.pt/t-l/publicsite/images/remax_icon_alt.png" alt="">
            </span>
            <span class="store-switcher__name" title="C21">C21 Portugal</span>
            <span class="store-switcher__chevron" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </span>
        </button>
        <div class="store-switcher__dropdown" role="listbox" hidden>
            <div class="store-switcher__search">
                <input type="text" class="store-switcher__search-input" placeholder="Search offices / teams" aria-label="Search offices or teams">
            </div>
            <button class="store-switcher__option is-selected" type="button" data-store-id="main" data-store-type="main">
                <span class="store-switcher__option-avatar">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK3cFlslZcY4hmZIbkeKuwMX9_ZJnkKeZs1Q&s" alt="C21 Logo" />
                </span>
                <span class="store-switcher__option-details">
                    <span class="store-switcher__option-name">C21 Portugal</span>
                    <span class="store-switcher__option-role">Manager</span>
                </span>
                <span class="store-switcher__option-meta">Main</span>
            </button>
            <button class="store-switcher__option" type="button" data-store-id="lisboa" data-store-type="store">
                <span class="store-switcher__option-avatar">
                    <img src="https://www.century21.pt/logo.webp" alt="C21 Logo" />
                </span>
                <span class="store-switcher__option-details">
                    <span class="store-switcher__option-name">C21 Aliança</span>
                    <span class="store-switcher__option-role">Manager</span>
                </span>
            </button>
            <button class="store-switcher__option" type="button" data-store-id="porto" data-store-type="store">
                <span class="store-switcher__option-avatar">
                    <img src="https://www.century21.pt/logo.webp" alt="C21 Logo" />
                </span>
                <span class="store-switcher__option-details">
                    <span class="store-switcher__option-name">C21 Alpha</span>
                    <span class="store-switcher__option-role">Manager</span>
                </span>
            </button>
            <button class="store-switcher__option store-switcher__option--team" type="button" data-store-id="team-orion" data-store-type="team" data-avatar-name="Team Orion">
                <span class="store-switcher__option-avatar">
                    <img alt="Team Orion">
                </span>
                <span class="store-switcher__option-details">
                    <span class="store-switcher__option-name">Team Orion</span>
                    <span class="store-switcher__option-role">Team Lead</span>
                </span>
            </button>
            <button class="store-switcher__option store-switcher__option--team" type="button" data-store-id="team-atlas" data-store-type="team" data-avatar-name="Team Atlas">
                <span class="store-switcher__option-avatar">
                    <img alt="Team Atlas">
                </span>
                <span class="store-switcher__option-details">
                    <span class="store-switcher__option-name">Team Atlas</span>
                    <span class="store-switcher__option-role">Coordinator</span>
                </span>
            </button>
            <div class="store-switcher__divider"></div>
            <label class="store-switcher__toggle">
                <input class="store-switcher__toggle-input" type="checkbox">
                <span class="store-switcher__toggle-slider" aria-hidden="true"></span>
                <span class="store-switcher__toggle-label">Include teams</span>
            </label>
            <a class="store-switcher__option store-switcher__option--settings" href="manage-office-mockup.html">
                <span class="store-switcher__option-icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .66.26 1.3.73 1.77.47.47 1.11.73 1.77.73H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                </span>
                <span class="store-switcher__option-name">Business settings</span>
            </a>
        </div>
    </div>

    <div class="menu-bar__wrap-list">
        <div class="menu-bar__wrap-list--scrollable-list">
            <ul class="menu-bar__wrap-list__list">
                <li class="menu-bar__list__item">
                    <div class="menu-bar__list__item__row">
                        <a class="menu-bar__list__item__link" href="home-mockup.html" data-store-scope="store" data-store-home="true">
                            <div class="menu-bar__list__item__icon-wrap">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                            </div>
                            <div class="menu-bar__list__item__title">Home</div>
                        </a>
                    </div>
                </li>
                <li class="menu-bar__list__item">
                    <div class="menu-bar__list__item__row">
                        <a class="menu-bar__list__item__link" href="transaction-list-mockup.html" data-store-scope="store">
                            <div class="menu-bar__list__item__icon-wrap">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></svg>
                            </div>
                            <div class="menu-bar__list__item__title">Transactions</div>
                        </a>
                    </div>
                </li>
                <li class="menu-bar__list__item">
                    <div class="menu-bar__list__item__row">
                        <a class="menu-bar__list__item__link" href="#">
                            <div class="menu-bar__list__item__icon-wrap">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 9h6v6H9z"/></svg>
                            </div>
                            <div class="menu-bar__list__item__title">Billing</div>
                        </a>
                    </div>
                </li>
                <li class="menu-bar__list__item menu-bar__list__item--collapsible" data-menu-group="office">
                    <div class="menu-bar__list__item__row">
                        <a class="menu-bar__list__item__link" href="org-profile-mockup.html" data-store-scope="store">
                            <div class="menu-bar__list__item__icon-wrap">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                            </div>
                            <div class="menu-bar__list__item__title">Business</div>
                        </a>
                        <button class="menu-bar__list__item__toggle" type="button" aria-label="Toggle Office" aria-expanded="false" aria-controls="menu-office">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                        </button>
                    </div>
                    <ul class="menu-bar__sub-list" id="menu-office" hidden>
                        <li class="menu-bar__sub-item"><a class="menu-bar__sub-link" href="org-profile-mockup.html" data-store-scope="store">Profile</a></li>
                        <li class="menu-bar__sub-item"><a class="menu-bar__sub-link" href="structure-mockup.html" data-store-scope="store">Structure</a></li>
                        <li class="menu-bar__sub-item"><a class="menu-bar__sub-link" href="org-wallet-overview-mockup.html" data-store-scope="store">Wallet</a></li>
                    </ul>
                </li>

                <li class="menu-bar__list__item menu-bar__list__item--collapsible" data-menu-group="profile">
                    <div class="menu-bar__list__item__row">
                        <a class="menu-bar__list__item__link" href="profile-settings-mockup.html">
                            <div class="menu-bar__list__item__icon-wrap">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>
                            </div>
                            <div class="menu-bar__list__item__title">Personal Profile</div>
                        </a>
                        <button class="menu-bar__list__item__toggle" type="button" aria-label="Toggle Profile" aria-expanded="false" aria-controls="menu-profile">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                        </button>
                    </div>
                    <ul class="menu-bar__sub-list" id="menu-profile" hidden>
                        <li class="menu-bar__sub-item">
                            <a class="menu-bar__sub-link" href="profile-settings-mockup.html">Profile</a>
                        </li>
                        <li class="menu-bar__sub-item">
                            <a class="menu-bar__sub-link" href="personal-wallet-overview-mockup.html">Wallet</a>
                        </li>
                    </ul>
                </li>
                <li class="menu-bar__list__item menu-bar__list__item--collapsible" data-menu-group="assistants">
                    <div class="menu-bar__list__item__row">
                        <a class="menu-bar__list__item__link" href="ai-lawyer-chat-mockup.html">
                            <div class="menu-bar__list__item__icon-wrap">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path fill="none" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            </div>
                            <div class="menu-bar__list__item__title beta-badge">Assistants</div>
                        </a>
                        <button class="menu-bar__list__item__toggle" type="button" aria-label="Toggle Assistants" aria-expanded="false" aria-controls="menu-assistants">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                        </button>
                    </div>
                    <ul class="menu-bar__sub-list" id="menu-assistants" hidden>
                        <li class="menu-bar__sub-item"><a class="menu-bar__sub-link" href="ai-lawyer-chat-mockup.html">Veritas</a></li>
                        <li class="menu-bar__sub-item"><a class="menu-bar__sub-link" href="ai-trust-layer-chat-mockup.html">Eira</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>

    <div class="menu-bar__bottom"></div>
</div>
`;

class MenuLoader {
    constructor() {
        this.currentPage = this.getPageName();
        this.storeKey = 'selectedStore';
        this.stores = [
            { id: 'main', name: 'C21 Portugal', type: 'main', avatar: 'https://i.maxwork.pt/t-l/publicsite/images/remax_icon_alt.png' },
            { id: 'lisboa', name: 'C21 Lisboa', type: 'store', avatar: 'https://i.maxwork.pt/t-l/publicsite/images/remax_icon_alt.png' },
            { id: 'porto', name: 'C21 Porto', type: 'store', avatar: 'https://i.maxwork.pt/t-l/publicsite/images/remax_icon_alt.png' },
            { id: 'team-orion', name: 'Team Orion', type: 'team', avatar: '' },
            { id: 'team-atlas', name: 'Team Atlas', type: 'team', avatar: '' }
        ];
        this.includeTeamsKey = 'includeTeams';
        this.selectedStore = this.getSelectedStore();
        this.includeTeams = this.getIncludeTeams();
    }

    getPageName() {
        const path = window.location.pathname;
        const parts = path.split('/');
        return parts[parts.length - 1] || 'index.html';
    }

    getMenuTemplate() {
        return unifiedMenuTemplate;
    }

    getFeaturesBasePath() {
        const match = window.location.pathname.match(/^(.*?\/(?:unlockit\/)?ui\/)/);
        if (match) return match[1];
        return window.location.pathname.replace(/\/[^/]*$/, '/');
    }

    getCommonAssetsBasePath() {
        return `${this.getFeaturesBasePath()}common-mock-assets`;
    }

    getSelectedStore() {
        const stored = localStorage.getItem(this.storeKey);
        return this.stores.find(store => store.id === stored) || this.stores[0];
    }

    getIncludeTeams() {
        if (this.selectedStore.type === 'team') {
            return true;
        }
        const stored = localStorage.getItem(this.includeTeamsKey);
        return stored === 'true';
    }

    setSelectedStore(storeId) {
        const store = this.stores.find(option => option.id === storeId);
        if (!store) return;
        localStorage.setItem(this.storeKey, store.id);
        this.selectedStore = store;
        if (store.type === 'team') {
            this.setIncludeTeams(true);
        }
        this.updateStoreSwitcherUI();
        this.applyStoreContextToDom();
    }

    setIncludeTeams(value) {
        this.includeTeams = value;
        localStorage.setItem(this.includeTeamsKey, String(value));
    }

    updateNavigationLinks(menuHTML) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = menuHTML;

        const featuresBasePath = this.getFeaturesBasePath();

        const targetPaths = {
            'home-mockup.html': '002-home/001-organization/home-mockup.html',
            'transaction-list-mockup.html': '003-transactions/000-list/transaction-list-mockup.html',
            'profile-settings-mockup.html': '005-personal/002-profile/profile-settings-mockup.html',
            'personal-wallet-overview-mockup.html': '005-personal/004-wallet/000-overview/personal-wallet-overview-mockup.html',
            'org-dashboard-mockup.html': '006-organization/000-dashboard/org-dashboard-mockup.html',
            'org-profile-mockup.html': '006-organization/001-settings/001-profile/org-profile-mockup.html',
            'roles-permissions-mockup.html': '006-organization/001-settings/002-roles-permissions/roles-permissions-mockup.html',
            'structure-mockup.html': '006-organization/004-structure/structure-mockup.html',
            'transaction-type-mockup.html': '006-organization/002-transaction-management/001-transaction-types/transaction-type-mockup.html',
            'document-type-mockup.html': '006-organization/002-transaction-management/002-document-types/document-type-mockup.html',
            'workflow-templates-mockup.html': '006-organization/002-transaction-management/003-workflow-templates/workflow-templates-mockup.html',
            'org-wallet-overview-mockup.html': '006-organization/003-wallet/000-overview/org-wallet-overview-mockup.html',
            'ai-lawyer-chat-mockup.html': '004-assistants/001-veritas/ai-lawyer-chat-mockup.html',
            'ai-trust-layer-chat-mockup.html': '004-assistants/003-trust-layer/ai-trust-layer-chat-mockup.html',
            'tasks-mockup.html': '007-tasks/tasks-mockup.html',
            'preferences-mockup.html': '005-personal/003-preferences/preferences-mockup.html',
            'manage-office-mockup.html': '006-organization/001-settings/manage-office-mockup.html'
        };

        const links = tempDiv.querySelectorAll('a[href]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('#')) {
                return;
            }

            const filename = href.split('/').pop();
            if (targetPaths[filename]) {
                link.setAttribute('href', featuresBasePath + targetPaths[filename]);
            }
        });

        this.applyStoreContext(tempDiv);
        return tempDiv.innerHTML;
    }

    applyStoreContext(rootElement) {
        if (!rootElement) return;
        const storeLinks = rootElement.querySelectorAll('[data-store-scope="store"]');
        storeLinks.forEach(link => {
            if (!(link instanceof HTMLAnchorElement)) return;
            const url = new URL(link.href, window.location.href);
            url.searchParams.set('store', this.selectedStore.id);
            link.href = url.toString();
        });
    }

    applyStoreContextToDom() {
        const menuContainer = document.querySelector('#menu-container');
        if (!menuContainer) return;
        this.applyStoreContext(menuContainer);
    }

    setActiveMenuItem() {
        const menuContainer = document.querySelector('#menu-container');
        if (!menuContainer) return;

        let currentPage = this.currentPage;
        if (currentPage === 'wallet-charge-mockup.html') {
            const params = new URLSearchParams(window.location.search);
            const wallet = params.get('wallet');
            currentPage = wallet === 'office'
                ? 'org-wallet-overview-mockup.html'
                : 'personal-wallet-overview-mockup.html';
        }

       
        if (currentPage === 'shared-structure-profile-mockup.html') {
            currentPage = 'structure-mockup.html'
        }

        if (currentPage === 'business-manage-mockup.html') {
            currentPage = 'structure-mockup.html'
        }

        if (currentPage === 'members-manage-mockup.html') {
            currentPage = 'structure-mockup.html'
        }

        const links = menuContainer.querySelectorAll('a[href]');

        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes(currentPage)) {
                link.classList.add('active');
                const row = link.closest('.menu-bar__list__item__row');
                if (row) {
                    row.classList.add('active');
                }
                const subList = link.closest('.menu-bar__sub-list');
                if (subList) {
                    subList.hidden = false;
                    const parentItem = link.closest('.menu-bar__list__item--collapsible');
                    if (parentItem) {
                        parentItem.classList.add('menu-bar__list__item--open');
                        const parentRow = parentItem.querySelector('.menu-bar__list__item__row');
                        if (parentRow) {
                            parentRow.classList.add('active');
                        }
                        const toggle = parentItem.querySelector('.menu-bar__list__item__toggle');
                        if (toggle) {
                            toggle.setAttribute('aria-expanded', 'true');
                        }
                    }
                }
            }
        });
    }

    bindSubmenuToggles() {
        const toggles = document.querySelectorAll('.menu-bar__list__item__toggle');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', event => {
                event.preventDefault();
                const parentItem = toggle.closest('.menu-bar__list__item--collapsible');
                if (!parentItem) return;

                const subList = parentItem.querySelector('.menu-bar__sub-list');
                if (!subList) return;

                const isOpen = !subList.hidden;
                subList.hidden = isOpen;
                toggle.setAttribute('aria-expanded', String(!isOpen));
                parentItem.classList.toggle('menu-bar__list__item--open', !isOpen);
            });
        });
    }

    updateStoreSwitcherUI() {
        const switcher = document.querySelector('[data-store-switcher]');
        if (!switcher) return;

        const button = switcher.querySelector('.store-switcher__button');
        const nameEl = switcher.querySelector('.store-switcher__name');
        const avatarImg = switcher.querySelector('.store-switcher__avatar img');
        const includeTeamsToggle = switcher.querySelector('.store-switcher__toggle-input');

        if (nameEl) {
            nameEl.textContent = this.selectedStore.name;
            nameEl.setAttribute('title', this.selectedStore.name);
        }

        if (button) {
            button.classList.toggle('store-switcher__button--main', this.selectedStore.type === 'main');
        }

        this.updateStoreOptionAvatars(switcher);

        if (avatarImg) {
            const selectedOption = switcher.querySelector(`[data-store-id="${this.selectedStore.id}"]`);
            const optionImg = selectedOption?.querySelector('img')?.getAttribute('src');
            const fallback = this.makeInitialAvatar(this.selectedStore.name);
            avatarImg.src = optionImg || this.selectedStore.avatar || fallback;
            avatarImg.onerror = () => {
                avatarImg.src = fallback;
            };
        }

        this.filterStoreOptions(switcher);

        if (includeTeamsToggle) {
            includeTeamsToggle.checked = this.includeTeams;
        }
    }

    filterStoreOptions(switcher) {
        const options = switcher.querySelectorAll('[data-store-id]');
        const searchInput = switcher.querySelector('.store-switcher__search-input');
        const query = (searchInput?.value || '').trim().toLowerCase();

        options.forEach(option => {
            const isSelected = option.getAttribute('data-store-id') === this.selectedStore.id;
            option.classList.toggle('is-selected', isSelected);

            const type = option.getAttribute('data-store-type');
            if (type === 'team' && !this.includeTeams) {
                option.hidden = false;
                option.style.display = 'none';
                return;
            }

            const name = option.querySelector('.store-switcher__option-name')?.textContent || '';
            const role = option.querySelector('.store-switcher__option-role')?.textContent || '';
            const matches = !query || `${name} ${role}`.toLowerCase().includes(query);
            option.hidden = false;
            option.style.display = matches ? '' : 'none';
        });
    }

    makeInitialAvatar(name) {
        const parts = (name || '?').trim().split(/\s+/).filter(Boolean);
        const initials = parts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('') || '?';
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
                <rect width="100%" height="100%" rx="40" fill="var(--color-primary)"/>
                <text x="50%" y="65%" font-size="36" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" dy=".1em">${initials}</text>
            </svg>
        `;
        return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }

    updateStoreOptionAvatars(switcher) {
        const options = switcher.querySelectorAll('[data-store-id]');
        options.forEach(option => {
            const img = option.querySelector('.store-switcher__option-avatar img');
            if (!img) return;
            const name = option.getAttribute('data-avatar-name')
                || option.querySelector('.store-switcher__option-name')?.textContent?.trim()
                || 'Office';
            const currentSrc = img.getAttribute('src');
            if (!currentSrc) {
                img.src = this.makeInitialAvatar(name);
            }
            img.onerror = () => {
                img.src = this.makeInitialAvatar(name);
            };
        });
    }

    bindStoreSwitcher() {
        const switcher = document.querySelector('[data-store-switcher]');
        if (!switcher) return;

        const button = switcher.querySelector('.store-switcher__button');
        const dropdown = switcher.querySelector('.store-switcher__dropdown');
        const options = switcher.querySelectorAll('[data-store-id]');
        const searchInput = switcher.querySelector('.store-switcher__search-input');
        const includeTeamsToggle = switcher.querySelector('.store-switcher__toggle-input');

        if (!button || !dropdown) return;

        const closeDropdown = () => {
            switcher.classList.remove('is-open');
            dropdown.hidden = true;
            button.setAttribute('aria-expanded', 'false');
        };

        button.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            const isOpen = switcher.classList.contains('is-open');
            switcher.classList.toggle('is-open', !isOpen);
            dropdown.hidden = isOpen;
            button.setAttribute('aria-expanded', String(!isOpen));
            if (!isOpen) {
                this.filterStoreOptions(switcher);
            }
        });

        options.forEach(option => {
            option.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                const storeId = option.getAttribute('data-store-id');
                if (!storeId || storeId === this.selectedStore.id) {
                    closeDropdown();
                    return;
                }

                this.setSelectedStore(storeId);
                closeDropdown();

                const homeLink = document.querySelector('[data-store-home="true"]');
                if (homeLink && homeLink instanceof HTMLAnchorElement) {
                    window.location.href = homeLink.href;
                } else {
                    window.location.reload();
                }
            });
        });

        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterStoreOptions(switcher));
        }

        if (includeTeamsToggle) {
            includeTeamsToggle.checked = this.includeTeams;
            includeTeamsToggle.addEventListener('change', () => {
                const nextValue = includeTeamsToggle.checked;
                if (!nextValue && this.selectedStore.type === 'team') {
                    this.setSelectedStore('main');
                }
                this.setIncludeTeams(nextValue);
                this.filterStoreOptions(switcher);
            });
        }

        document.addEventListener('click', event => {
            if (switcher.contains(event.target)) return;
            closeDropdown();
        });
    }

    async injectMenu(targetSelector = '#menu-container') {
        const menuContainer = document.querySelector(targetSelector);
        if (!menuContainer) {
            console.error(`Menu container not found: ${targetSelector}`);
            return;
        }

        try {
            let menuHTML = this.getMenuTemplate();
            menuHTML = this.updateNavigationLinks(menuHTML);
            menuContainer.innerHTML = menuHTML;

            this.updateStoreSwitcherUI();
            this.bindStoreSwitcher();
            this.bindSubmenuToggles();
            setTimeout(() => this.setActiveMenuItem(), 100);
        } catch (error) {
            console.error('Failed to inject menu:', error);
            menuContainer.innerHTML = '<div class="menu-error">Menu loading failed</div>';
        }
    }

    async loadMenuWithCSS(targetSelector = '#menu-container') {
        await this.injectMenu(targetSelector);

        if (window.componentLoader) {
            try {
                const basePath = this.getCommonAssetsBasePath();

                await window.componentLoader.loadCSS(`${basePath}/css/beta-badge.css`, 'menu-beta-css');
            } catch (error) {
                console.warn('Beta badge CSS could not be loaded:', error);
            }
        }
    }
}

async function loadMenu(targetSelector = '#menu-container') {
    const loader = new MenuLoader();
    window.menuLoader = loader;
    await loader.loadMenuWithCSS(targetSelector);
}

document.addEventListener('DOMContentLoaded', function() {
    const menuContainer = document.querySelector('#menu-container');
    if (menuContainer) {
        loadMenu('#menu-container');
    }
});

window.MenuLoader = MenuLoader;
window.loadMenu = loadMenu;
