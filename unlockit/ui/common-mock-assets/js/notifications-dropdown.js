/* Notifications Dropdown JavaScript - Reusable Component */

const notificationsDropdownTemplate = `
<div id="notifications-dropdown" class="notifications-dropdown">
    <div class="notifications-header">
        <h3>Notifications</h3>
        <button class="mark-all-read-btn" onclick="markAllAsRead()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
            Mark all as read
        </button>
    </div>

    <div class="notifications-list">
        <div class="notification-item unread" onclick="handleNotificationClick(this)">
            <div class="notification-icon warning">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
            </div>
            <div class="notification-content">
                <div class="notification-title">Document Review Required</div>
                <div class="notification-description">Transaction #2024-001 needs your signature on the purchase agreement</div>
                <div class="notification-time">2 hours ago</div>
            </div>
            <div class="notification-unread-indicator"></div>
        </div>

        <div class="notification-item unread" onclick="handleNotificationClick(this)">
            <div class="notification-icon info">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                </svg>
            </div>
            <div class="notification-content">
                <div class="notification-title">New Message</div>
                <div class="notification-description">Client Maria Santos sent you a message regarding property viewing</div>
                <div class="notification-time">5 hours ago</div>
            </div>
            <div class="notification-unread-indicator"></div>
        </div>

        <div class="notification-item" onclick="handleNotificationClick(this)">
            <div class="notification-icon success">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
            </div>
            <div class="notification-content">
                <div class="notification-title">Transaction Completed</div>
                <div class="notification-description">Property sale at Rua das Flores completed successfully</div>
                <div class="notification-time">1 day ago</div>
            </div>
        </div>

        <div class="notification-item" onclick="handleNotificationClick(this)">
            <div class="notification-icon info">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                </svg>
            </div>
            <div class="notification-content">
                <div class="notification-title">Payment Received</div>
                <div class="notification-description">Commission payment of €2,450 has been processed</div>
                <div class="notification-time">2 days ago</div>
            </div>
        </div>

        <div class="notification-item" onclick="handleNotificationClick(this)">
            <div class="notification-icon warning">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
            </div>
            <div class="notification-content">
                <div class="notification-title">Appointment Reminder</div>
                <div class="notification-description">Property viewing scheduled for tomorrow at 2:00 PM</div>
                <div class="notification-time">3 days ago</div>
            </div>
        </div>
    </div>

    <div class="notifications-footer">
        <a href="#" class="view-all-notifications-link">
            View All Notifications
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14m-7-7 7 7-7 7"/>
            </svg>
        </a>
    </div>
</div>
`;

function loadNotificationsDropdown() {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = notificationsDropdownTemplate;

    const dropdownElement = tempDiv.querySelector('#notifications-dropdown');

    if (dropdownElement) {
        const navBarWrap = document.querySelector('.nav-bar-wrap');
        if (navBarWrap) {
            navBarWrap.insertAdjacentElement('afterend', dropdownElement);
        }
    }
}

function toggleNotificationsDropdown() {
    const dropdown = document.getElementById('notifications-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('visible');
    }
}

function handleNotificationClick(notificationElement) {
    notificationElement.classList.remove('unread');

    const indicator = notificationElement.querySelector('.notification-unread-indicator');
    if (indicator) {
        indicator.remove();
    }
}

function markAllAsRead() {
    const unreadNotifications = document.querySelectorAll('.notification-item.unread');
    unreadNotifications.forEach(notification => {
        notification.classList.remove('unread');
        const indicator = notification.querySelector('.notification-unread-indicator');
        if (indicator) {
            indicator.remove();
        }
    });
}

document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('notifications-dropdown');
    const notificationsButton = document.getElementById('notifications-button');

    if (dropdown && !dropdown.contains(event.target) && event.target !== notificationsButton && !notificationsButton?.contains(event.target)) {
        dropdown.classList.remove('visible');
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('notifications-dropdown');
        if (dropdown) {
            dropdown.classList.remove('visible');
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    loadNotificationsDropdown();
});
