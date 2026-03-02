// Delete Confirmation Modal Component
const deleteConfirmationModalTemplate = `<div id="deleteConfirmationModal" class="delete-confirmation-modal" style="display: none;">
    <div class="delete-confirmation-modal-content">
        <div class="delete-confirmation-modal-header">
            <h2 class="delete-confirmation-modal-title" id="deleteModalTitle">Confirm Deletion</h2>
            <button class="delete-confirmation-modal-close" onclick="closeDeleteConfirmationModal()">&times;</button>
        </div>
        <div class="delete-confirmation-modal-body">
            <p class="delete-confirmation-question" id="deleteModalQuestion">Are you sure you want to delete this item?</p>

            <div class="delete-confirmation-notes" id="deleteModalNotesSection" style="display: none;">
                <label class="delete-confirmation-notes-label">Notes (optional)</label>
                <textarea class="delete-confirmation-notes-textarea" id="deleteModalNotes" placeholder="Add any notes..."></textarea>
            </div>

            <p class="delete-confirmation-warning">This action is irrevocable</p>

            <div class="delete-confirmation-actions">
                <button class="delete-confirmation-btn delete-confirmation-btn-cancel" onclick="closeDeleteConfirmationModal()">Cancel</button>
                <button class="delete-confirmation-btn delete-confirmation-btn-confirm" id="deleteModalConfirmBtn" onclick="confirmDelete()">Yes, delete it</button>
            </div>
        </div>
    </div>
</div>`;

let deleteModalCallback = null;
let deleteModalConfig = {
    showNotes: false
};

// Load delete confirmation modal component
function loadDeleteConfirmationModal() {
    if (document.getElementById('deleteConfirmationModal')) {
        return;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = deleteConfirmationModalTemplate;
    const modalElement = tempDiv.querySelector('#deleteConfirmationModal');
    document.body.appendChild(modalElement);
}

function openDeleteConfirmationModal(options = {}) {
    const {
        title = 'Confirm Deletion',
        question = 'Are you sure you want to delete this item?',
        confirmText = 'Yes, delete it',
        showNotes = false,
        onConfirm = null
    } = options;

    deleteModalCallback = onConfirm;
    deleteModalConfig.showNotes = showNotes;

    const modal = document.getElementById('deleteConfirmationModal');
    if (modal) {
        const titleElement = document.getElementById('deleteModalTitle');
        const questionElement = document.getElementById('deleteModalQuestion');
        const confirmBtnElement = document.getElementById('deleteModalConfirmBtn');
        const notesSection = document.getElementById('deleteModalNotesSection');
        const notesTextarea = document.getElementById('deleteModalNotes');

        if (titleElement) titleElement.textContent = title;
        if (questionElement) questionElement.textContent = question;
        if (confirmBtnElement) confirmBtnElement.textContent = confirmText;

        if (notesSection) {
            notesSection.style.display = showNotes ? 'block' : 'none';
        }

        if (notesTextarea) {
            notesTextarea.value = '';
        }

        modal.style.display = 'flex';
        modal.classList.add('show');
    }
}

function closeDeleteConfirmationModal() {
    const modal = document.getElementById('deleteConfirmationModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        deleteModalCallback = null;
        deleteModalConfig.showNotes = false;
    }
}

function confirmDelete() {
    const notes = deleteModalConfig.showNotes ? document.getElementById('deleteModalNotes')?.value : null;

    if (deleteModalCallback) {
        deleteModalCallback(notes);
    }

    closeDeleteConfirmationModal();
}

function handleDeleteModalOutsideClick(event) {
    const modal = document.getElementById('deleteConfirmationModal');
    if (modal && event.target === modal) {
        closeDeleteConfirmationModal();
    }
}

function handleDeleteModalEscape(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('deleteConfirmationModal');
        if (modal && modal.style.display === 'flex') {
            closeDeleteConfirmationModal();
        }
    }
}

// Initialize delete confirmation modal on page load
document.addEventListener('DOMContentLoaded', function() {
    loadDeleteConfirmationModal();

    window.addEventListener('click', handleDeleteModalOutsideClick);
    document.addEventListener('keydown', handleDeleteModalEscape);
});

// Export functions for global access
window.openDeleteConfirmationModal = openDeleteConfirmationModal;
window.closeDeleteConfirmationModal = closeDeleteConfirmationModal;
window.confirmDelete = confirmDelete;
