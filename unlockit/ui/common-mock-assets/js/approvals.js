const approvalsStore = {
    items: [
        {
            id: 'approval-1',
            kind: 'INVITE',
            title: 'Pedro Miguel Ferrão',
            subtitle: 'Invited you to join',
            meta: 'Agent',
            officeName: 'C21 Oriente',
            createdAt: new Date().toISOString(),
            status: 'PENDING',
        }, {
            id: 'approval-0',
            kind: 'REQUEST',
            title: 'Maria Carolina dos Santos',
            subtitle: 'Request to join',
            meta: 'Agent',
            officeName: 'C21 Oriente',
            createdAt: new Date().toISOString(),
            status: 'PENDING',
        },
        {
            id: 'approval-2',
            kind: 'VERIFICATION',
            title: 'Joao Afonso Pereira',
            subtitle: 'Request a Profile Verification',
            meta: 'Agency manager',
            officeName: 'C21 Oriente',
            createdAt: new Date().toISOString(),
            status: 'PENDING',
        },
    ],
    listeners: [],
};

function getFeaturesBasePath() {
    const match = window.location.pathname.match(/^(.*?\/(?:docs\/)?features\/)/);
    if (match) return match[1];
    return window.location.pathname.replace(/\/[^/]*$/, '/');
}

function getPendingApprovals() {
    return approvalsStore.items.filter((item) => item.status === 'PENDING');
}

function getInitials(value) {
    const parts = value.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function getApprovalLabelMarkup(kind) {
    const label = kind === 'VERIFICATION' ? 'Verification' : kind === 'INVITE' ? 'Invite' : 'Request';
    const icon = kind === 'VERIFICATION'
        ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 3v7c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6l8-3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`
        : `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><circle cx="9" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></circle><path d="M19 8v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M22 11h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;

    return `
        <div class="approvals-item__label approvals-item__label--${kind.toLowerCase()}">
            ${icon}
            <span>${label}</span>
        </div>
    `;
}

function updateApprovalsBadge() {
    const badge = document.querySelector('[data-approvals-badge]');
    if (!badge) return;
    const pendingCount = getPendingApprovals().length;
    badge.textContent = pendingCount;
    badge.classList.toggle('visible', pendingCount > 0);
}

function createToastContainer() {
    let container = document.getElementById('approvals-toast');
    if (!container) {
        container = document.createElement('div');
        container.id = 'approvals-toast';
        container.className = 'approvals-toast';
        document.body.appendChild(container);
    }
    return container;
}

function showApprovalsToast(message) {
    const container = createToastContainer();
    container.textContent = message;
    container.classList.add('visible');
    clearTimeout(container._timeoutId);
    container._timeoutId = setTimeout(() => {
        container.classList.remove('visible');
    }, 2400);
}

function getToastMessage(item, action) {
    if (item.kind === 'INVITE') {
        return action === 'approve' ? 'Invite approved' : 'Invite rejected';
    }
    if (item.kind === 'REQUEST') {
        return action === 'approve' ? 'Request approved' : 'Request rejected';
    }
    return action === 'approve' ? 'Verification approved' : 'Verification rejected';
}

function approveApproval(id) {
    const targetItem = approvalsStore.items.find((item) => item.id === id);
    approvalsStore.items = approvalsStore.items.map((item) => (
        item.id === id ? { ...item, status: 'APPROVED' } : item
    ));
    notifyApprovalsChange();
    if (targetItem) showApprovalsToast(getToastMessage(targetItem, 'approve'));
}

function rejectApproval(id) {
    const targetItem = approvalsStore.items.find((item) => item.id === id);
    approvalsStore.items = approvalsStore.items.map((item) => (
        item.id === id ? { ...item, status: 'REJECTED' } : item
    ));
    notifyApprovalsChange();
    if (targetItem) showApprovalsToast(getToastMessage(targetItem, 'reject'));
}

function renderApprovalItem(item, options = {}) {
    const { showView = true } = options;

    return `
        <div class="approvals-item">
            ${getApprovalLabelMarkup(item.kind)}
            <div class="approvals-item__avatar">${getInitials(item.title)}</div>
            <div class="approvals-item__office-image">
                <img src="https://www.century21.pt/logo.webp" alt="C21 Logo">            </div>
            <div class="approvals-item__content">
                <div>
                    <div class="approvals-item__title">${item.title}</div>
                    <div class="approvals-item__subtitle">${item.subtitle}</div>
                    <div class="approvals-item__subtitle">Office: <b>${item.officeName}</b></div>
                    <div class="approvals-item__subtitle">Role: <b>${item.meta}</b></div>
                </div>
                <div class="approvals-item__actions">
                    <button class="approvals-btn secondary" data-action="reject" data-id="${item.id}">Reject</button>
                    <button class="approvals-btn primary ${item.kind === 'VERIFICATION' ? 'verify' : item.kind === 'INVITE' ? 'invite' : 'request'}" data-action="approve" data-id="${item.id}">${item.kind === 'VERIFICATION' ? 'Verify Profile' : item.kind === 'INVITE' ? 'Accept Invite' : 'Accept Request'}</button>
                </div>
            </div>
        </div>
    `;
}

function renderApprovalsDropdown() {
    const dropdown = document.getElementById('approvals-dropdown');
    if (!dropdown) return;

    const pendingItems = getPendingApprovals().slice(0, 4);

    const listHtml = pendingItems.length
        ? pendingItems.map((item) => renderApprovalItem(item, { showView: false })).join('')
        : '<div class="approvals-dropdown__empty">No pending requests</div>';

    dropdown.querySelector('.approvals-dropdown__list').innerHTML = listHtml;

    dropdown.querySelectorAll('[data-action]').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const { action, id } = button.dataset;
            if (!id) return;
            if (action === 'approve') approveApproval(id);
            if (action === 'reject') rejectApproval(id);
        });
    });
}

function renderApprovalsWidget() {
    const container = document.getElementById('approvals-widget');
    if (!container) return;

    const pendingItems = getPendingApprovals();
    if (pendingItems.length === 0) {
        container.innerHTML = '';
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';

    const itemsHtml = pendingItems.slice(0, 3).map((item) => `
        ${renderApprovalItem(item, { showView: true })}
    `).join('');

    container.innerHTML = `
        <div class="approvals-widget">
            <div class="approvals-widget__header">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z"></path><path d="m9 12 2 2 4-4"></path></svg> 
                <h3>
                    <b>Action Required</b> · ${pendingItems.length} pending actions need your approval
                </h3>
                <button class="approvals-item__view" data-action="view" data-id="${pendingItems}">View All requests→</button>
            </div>
            <div class="approvals-widget__list">${itemsHtml}</div>
        </div>
    `;

    container.querySelectorAll('[data-action]').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const { action, id } = button.dataset;
            if (!id) return;
            if (action === 'approve') approveApproval(id);
            if (action === 'reject') rejectApproval(id);
            if (action === 'view') {
                window.location.href = `${getFeaturesBasePath()}008-approvals/approvals-mockup.html`;
            }
        });
    });
}

function renderApprovalsPage() {
    const page = document.getElementById('approvals-page');
    if (!page) return;

    const activeFilter = page.dataset.filter || 'ALL';
    const listContainer = page.querySelector('[data-approvals-list]');
    const filteredItems = approvalsStore.items.filter((item) => (
        activeFilter === 'ALL' ? true : item.kind === activeFilter
    ));

    if (!listContainer) return;

    if (filteredItems.length === 0) {
        listContainer.innerHTML = '<div class="approvals-page__empty">No approvals to show.</div>';
        return;
    }

    listContainer.innerHTML = filteredItems.map((item) => `
        ${renderApprovalItem(item, { showView: false })}
    `).join('');

    listContainer.querySelectorAll('[data-action]').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const { action, id } = button.dataset;
            if (!id) return;
            if (action === 'approve') approveApproval(id);
            if (action === 'reject') rejectApproval(id);
        });
    });
}

function notifyApprovalsChange() {
    updateApprovalsBadge();
    renderApprovalsDropdown();
    renderApprovalsWidget();
    renderApprovalsPage();
}

function loadApprovalsDropdown() {
    const existing = document.getElementById('approvals-dropdown');
    if (existing) return;

    const basePath = getFeaturesBasePath();

    const dropdown = document.createElement('div');
    dropdown.id = 'approvals-dropdown';
    dropdown.className = 'approvals-dropdown';
    dropdown.innerHTML = `
        <div class="approvals-dropdown__header">
            <h3>Invites & Verifications</h3>
        </div>
        <div class="approvals-dropdown__list"></div>
        <div class="approvals-dropdown__footer">
            <a href="${basePath}008-approvals/approvals-mockup.html">View all requests →</a>
        </div>
    `;

    const navBarWrap = document.querySelector('.nav-bar-wrap');
    if (navBarWrap) {
        navBarWrap.insertAdjacentElement('afterend', dropdown);
    }

    renderApprovalsDropdown();
}

function toggleApprovalsDropdown() {
    const dropdown = document.getElementById('approvals-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('visible');
    }
}

function setupApprovalsPageTabs() {
    const page = document.getElementById('approvals-page');
    if (!page) return;

    page.querySelectorAll('[data-approvals-filter-btn]').forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.dataset.approvalsFilterBtn;
            page.dataset.filter = filter;
            page.querySelectorAll('[data-approvals-filter-btn]').forEach((btn) => {
                btn.classList.toggle('active', btn === button);
            });
            renderApprovalsPage();
        });
    });
}

function handleApprovalsOutsideClick(event) {
    const dropdown = document.getElementById('approvals-dropdown');
    const approvalsButton = document.getElementById('approvals-button');

    if (dropdown && approvalsButton) {
        if (!dropdown.contains(event.target) && !approvalsButton.contains(event.target)) {
            dropdown.classList.remove('visible');
        }
    }
}

function initializeApprovals() {
    loadApprovalsDropdown();
    updateApprovalsBadge();
    renderApprovalsWidget();
    renderApprovalsPage();
    setupApprovalsPageTabs();

    document.addEventListener('click', handleApprovalsOutsideClick);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const dropdown = document.getElementById('approvals-dropdown');
            if (dropdown) dropdown.classList.remove('visible');
        }
    });
}

window.toggleApprovalsDropdown = toggleApprovalsDropdown;
window.approvalsStore = approvalsStore;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApprovals);
} else {
    initializeApprovals();
}
