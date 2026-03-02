// Task Modal Component
const taskModalTemplate = `<!-- Create Task Modal -->
<div id="createTaskModal" class="task-modal" style="display: none;">
    <div class="task-modal-content">
        <div class="task-modal-header">
            <h2 class="task-modal-title">Create New Task</h2>
            <button class="task-modal-close" onclick="closeCreateTaskModal()">&times;</button>
        </div>
        <div class="task-modal-body">
            <form id="taskForm" onsubmit="submitTaskForm(event)">
                <div class="task-form-group">
                    <label class="task-form-label">Task Title *</label>
                    <input type="text" name="task-title" class="task-form-input" placeholder="Enter task description" required>
                </div>
                <div class="task-form-group" style="display: flex; gap: 1rem; justify-content: space-between;align-items: center;">
                    <div class="task-form-row" style="width: 100%">
                        <label class="task-form-label">Category</label>
                        <select name="task-category" class="task-form-select">
                            <option value="Documents">Documents</option>
                            <option value="Communications">Communications</option>
                            <option value="Appointments">Appointments</option>
                            <option value="General">General</option>
                        </select>
                    </div>
                    <div class="task-form-row" style="width: 100%">
                        <label class="task-form-label">Priority</label>
                        <select name="task-priority" class="task-form-select">
                            <option value="none">No Priority</option>
                            <option value="low">Low Priority</option>
                            <option value="medium" selected>Medium Priority</option>
                            <option value="high">High Priority</option>
                        </select>
                    </div>      
                </div>
                <div class="task-form-group" id="taskAssigneeGroup">
                    <label class="task-form-label">Participantes</label>
                    <input type="text" name="task-assignee" class="task-form-input" placeholder="Enter assignee name or email">
                </div>

                <div class="task-form-group" style="display: flex; gap: 1rem; justify-content: space-between;align-items: center;">
                    <div class="task-form-row" style="width: 100%">
                        <label class="task-form-label">Due Date</label>
                    <input type="date" name="task-due-date" class="task-form-input">
                    </div>
                    <div class="task-form-row" style="width: 100%">
                        <label class="task-form-label">Status</label>
                        <select name="task-status" class="task-form-select">
                            <option value="todo" selected>To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>      
                </div>
                <div class="task-form-group" id="taskLinkGroup" style="display: none;">
                    <label class="task-form-label">Related Link (optional)</label>
                    <input type="url" name="task-link" class="task-form-input" placeholder="https://... (optional)">
                </div>
                <div class="task-form-group">
                    <label class="task-form-label">Notes</label>
                    <textarea name="task-notes" class="task-form-textarea" placeholder="Add details, requirements, or context..."></textarea>
                </div>
                <div class="task-modal-footer">
                    <button type="button" class="btn-secondary" onclick="closeCreateTaskModal()">Cancel</button>
                    <button type="submit" class="btn-primary">Add Task</button>
                </div>
            </form>
        </div>
    </div>
</div>`;

// Load task modal component
function loadTaskModal() {
    // Check if modal already exists
    if (document.getElementById('createTaskModal')) {
        return;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = taskModalTemplate;
    const modalElement = tempDiv.querySelector('#createTaskModal');
    document.body.appendChild(modalElement);
}

// Task modal functions
function openCreateTaskModal() {
    const modal = document.getElementById('createTaskModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
    }
}

function closeCreateTaskModal() {
    const modal = document.getElementById('createTaskModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        const taskForm = document.getElementById('taskForm');
        if (taskForm) {
            taskForm.reset();
        }
    }
}

function submitTaskForm(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const taskData = {
        title: formData.get('task-title'),
        category: formData.get('task-category'),
        priority: formData.get('task-priority'),
        assignee: formData.get('task-assignee'),
        dueDate: formData.get('task-due-date'),
        status: formData.get('task-status'),
        link: formData.get('task-link') || '',
        notes: formData.get('task-notes') || ''
    };

    // Trigger custom event with task data
    document.dispatchEvent(new CustomEvent('taskCreated', {
        detail: taskData
    }));

    closeCreateTaskModal();
}

function getPriorityIcon(priority) {
    const icons = {
        'high': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>`,
        'medium': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>`,
        'low': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 20V10"/>
            <path d="M12 20V4"/>
            <path d="M6 20v-6"/>
        </svg>`,
        'none': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="1"/>
        </svg>`
    };
    return icons[priority] || icons['none'];
}

function getPriorityTitle(priority) {
    const titles = {
        'high': 'High Priority',
        'medium': 'Medium Priority',
        'low': 'Low Priority',
        'none': 'No Priority'
    };
    return titles[priority] || 'No Priority';
}

// Configure task modal for specific context (home vs transaction)
function configureTaskModal(options = {}) {
    const { showAssignee = true, showLink = false, assigneeOptions = [] } = options;

    // Show/hide assignee field
    const assigneeGroup = document.getElementById('taskAssigneeGroup');
    if (assigneeGroup) {
        assigneeGroup.style.display = showAssignee ? 'block' : 'none';
    }

    // Show/hide link field
    const linkGroup = document.getElementById('taskLinkGroup');
    if (linkGroup) {
        linkGroup.style.display = showLink ? 'block' : 'none';
    }

    // Update assignee options if provided
    if (assigneeOptions.length > 0) {
        const assigneeSelect = document.querySelector('select[name="task-assignee"]');
        if (assigneeSelect) {
            assigneeSelect.innerHTML = assigneeOptions.map(option =>
                `<option value="${option.value}">${option.label}</option>`
            ).join('');
        }
    }
}

// Close modal when clicking outside
function handleTaskModalOutsideClick(event) {
    const modal = document.getElementById('createTaskModal');
    if (modal && event.target === modal) {
        closeCreateTaskModal();
    }
}

// Handle escape key
function handleTaskModalEscape(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('createTaskModal');
        if (modal && modal.style.display === 'flex') {
            closeCreateTaskModal();
        }
    }
}

// Initialize task modal on page load
document.addEventListener('DOMContentLoaded', function() {
    loadTaskModal();

    // Add event listeners
    window.addEventListener('click', handleTaskModalOutsideClick);
    document.addEventListener('keydown', handleTaskModalEscape);
});

// Export functions for global access
window.openCreateTaskModal = openCreateTaskModal;
window.closeCreateTaskModal = closeCreateTaskModal;
window.submitTaskForm = submitTaskForm;
window.getPriorityIcon = getPriorityIcon;
window.getPriorityTitle = getPriorityTitle;
window.configureTaskModal = configureTaskModal;
