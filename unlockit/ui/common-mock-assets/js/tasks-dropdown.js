/* Tasks Dropdown JavaScript - Reusable Component */

const tasksDropdownTemplate = `
<div id="tasks-dropdown" class="tasks-dropdown">
    <div class="tasks-header">
        <h3>Tasks</h3>
    </div>

    <div class="tasks-list">
        <div class="task-item" onclick="handleTaskClick(this)">
            <div class="task-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 11l3 3L22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
            </div>
            <div class="task-content">
                <div class="task-title">Review contract for signature</div>
                <div class="task-description">Unlockit Contract Draft · Needs approval before sending.</div>
                <div class="task-meta">
                    <span>Due today</span>
                    <span class="task-status pending">Pending</span>
                </div>
            </div>
        </div>

        <div class="task-item" onclick="handleTaskClick(this)">
            <div class="task-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 20v-6"/>
                    <path d="M6 20V10"/>
                    <path d="M18 20V4"/>
                </svg>
            </div>
            <div class="task-content">
                <div class="task-title">Assign roles to new team members</div>
                <div class="task-description">3 pending requests waiting for role selection.</div>
                <div class="task-meta">
                    <span>Due in 2 days</span>
                    <span class="task-status in-progress">In progress</span>
                </div>
            </div>
        </div>

        <div class="task-item" onclick="handleTaskClick(this)">
            <div class="task-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
            </div>
            <div class="task-content">
                <div class="task-title">Upload missing documentation</div>
                <div class="task-description">Property listing #2450 requires two documents.</div>
                <div class="task-meta">
                    <span>Due next week</span>
                    <span class="task-status done">Done</span>
                </div>
            </div>
        </div>
    </div>

    <div class="tasks-footer">
        <a href="../../007-tasks/tasks-mockup.html" class="view-all-tasks-link">
            View All Tasks
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14m-7-7 7 7-7 7"/>
            </svg>
        </a>
    </div>
</div>
`;

function loadTasksDropdown() {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = tasksDropdownTemplate;

    const dropdownElement = tempDiv.querySelector('#tasks-dropdown');

    if (dropdownElement) {
        const navBarWrap = document.querySelector('.nav-bar-wrap');
        if (navBarWrap) {
            navBarWrap.insertAdjacentElement('afterend', dropdownElement);
        }
    }
}

function toggleTasksDropdown() {
    const dropdown = document.getElementById('tasks-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('visible');
    }
}

function handleTaskClick(taskElement) {
    if (!taskElement) return;
    taskElement.classList.toggle('selected');
}

document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('tasks-dropdown');
    const tasksButton = document.getElementById('tasks-button');

    if (dropdown && !dropdown.contains(event.target) && event.target !== tasksButton && !tasksButton?.contains(event.target)) {
        dropdown.classList.remove('visible');
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('tasks-dropdown');
        if (dropdown) {
            dropdown.classList.remove('visible');
        }
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTasksDropdown);
} else {
    loadTasksDropdown();
}
