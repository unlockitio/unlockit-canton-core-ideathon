// Email Modal Component
const emailModalTemplate = `<div id="emailModal" class="modal" style="display: none;">
    <div class="modal-content modal-wide">
        <div class="modal-header">
            <h2 class="modal-title">Add Email Address</h2>
            <button class="modal-close" onclick="closeEmailModal()">&times;</button>
        </div>
        <div class="modal-body">
            <div class="email-security-notice">
                <h4>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    Approval Required
                </h4>
                <p><strong>Important:</strong> Only add email addresses you own and control. The recipient must approve this connection before you can use it to sign in.</p>
                <p>Adding an email you don't own may result in account restrictions if reported as abuse.</p>
            </div>

            <div class="email-info-box">
                <h4>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    How It Works
                </h4>
                <p><strong>If the email is registered:</strong> The user will receive an in-app notification to approve connecting this email to your account.</p>
                <p><strong>If the email is not registered:</strong> An invitation will be sent to register. After registration, they'll receive a notification to approve the connection.</p>
                <p><strong>Once approved:</strong> This email will be linked to your account and you can use it to sign in. All activity will be associated with your primary profile.</p>
            </div>

            <div class="email-protection-list">
                <h4>Security Protections:</h4>
                <ul>
                    <li><strong>Rate limiting:</strong> Maximum 3 pending requests at once, 5 requests per day</li>
                    <li><strong>Auto-expiry:</strong> Pending requests expire after 48 hours without approval</li>
                    <li><strong>Abuse reporting:</strong> Recipients can report and block unauthorized connection attempts</li>
                    <li><strong>Account monitoring:</strong> Repeated abuse reports may result in restrictions or suspension</li>
                </ul>
            </div>

            <form id="emailForm" onsubmit="submitEmailForm(event)">
                <div class="form-group">
                    <label class="form-label">Email Address *</label>
                    <input
                        type="email"
                        id="emailAddress"
                        name="emailAddress"
                        class="form-input"
                        placeholder="your.email@example.com"
                        required
                    >
                </div>

                <div class="form-group">
                    <label class="form-label">Category *</label>
                    <select id="emailCategory" name="emailCategory" class="form-select" required>
                        <option value="">Select a category</option>
                        <option value="Personal">Personal</option>
                        <option value="Work">Work</option>
                        <option value="Agency">Agency</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div class="form-group" id="customCategoryGroup" style="display: none;">
                    <label class="form-label">Custom Category Name</label>
                    <input
                        type="text"
                        id="customCategory"
                        name="customCategory"
                        class="form-input"
                        placeholder="Enter category name"
                    >
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn-secondary" onclick="closeEmailModal()">Cancel</button>
                    <button type="submit" class="btn-primary">Add Email</button>
                </div>
            </form>
        </div>
    </div>
</div>`;

// Load email modal component
function loadEmailModal() {
    if (document.getElementById('emailModal')) {
        return;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = emailModalTemplate;
    const modalElement = tempDiv.querySelector('#emailModal');
    document.body.appendChild(modalElement);
}

// Email modal functions
function openEmailModal() {
    const modal = document.getElementById('emailModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');

        const categorySelect = document.getElementById('emailCategory');
        const customCategoryGroup = document.getElementById('customCategoryGroup');
        const customCategoryInput = document.getElementById('customCategory');

        categorySelect.addEventListener('change', function() {
            if (this.value === 'Other') {
                customCategoryGroup.style.display = 'block';
                customCategoryInput.required = true;
            } else {
                customCategoryGroup.style.display = 'none';
                customCategoryInput.required = false;
            }
        });
    }
}

function closeEmailModal() {
    const modal = document.getElementById('emailModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        const form = document.getElementById('emailForm');
        if (form) {
            form.reset();
        }
        document.getElementById('customCategoryGroup').style.display = 'none';
    }
}

function submitEmailForm(event) {
    event.preventDefault();

    const emailAddress = document.getElementById('emailAddress').value;
    const emailCategory = document.getElementById('emailCategory').value;
    const customCategory = document.getElementById('customCategory').value;

    const category = emailCategory === 'Other' ? customCategory : emailCategory;

    const emailData = {
        email: emailAddress,
        category: category,
        status: 'pending'
    };

    document.dispatchEvent(new CustomEvent('emailAdded', { detail: emailData }));

    alert(`Connection request sent to ${emailAddress}. If the email is registered, they'll receive an in-app notification. Otherwise, an invite to register will be sent. The connection will remain pending until approved.`);

    closeEmailModal();
}

function handleEmailModalOutsideClick(event) {
    const modal = document.getElementById('emailModal');
    if (modal && event.target === modal) {
        closeEmailModal();
    }
}

function handleEmailModalEscape(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('emailModal');
        if (modal && modal.style.display === 'flex') {
            closeEmailModal();
        }
    }
}

// Initialize email modal on page load
document.addEventListener('DOMContentLoaded', function() {
    loadEmailModal();

    window.addEventListener('click', handleEmailModalOutsideClick);
    document.addEventListener('keydown', handleEmailModalEscape);
});

// Export functions for global access
window.openEmailModal = openEmailModal;
window.closeEmailModal = closeEmailModal;
window.submitEmailForm = submitEmailForm;
