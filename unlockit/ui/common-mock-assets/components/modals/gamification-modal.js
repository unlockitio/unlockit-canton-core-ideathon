// Gamification Modal Component
const gamificationModalTemplate = `<div id="gamificationModal" class="gamification-modal" style="display: none;">
    <div class="gamification-modal-content">
        <div class="gamification-modal-header">
            <h2 class="gamification-modal-title">Profile Completion</h2>
            <button class="gamification-modal-close" onclick="closeGamificationModal()">&times;</button>
        </div>
        <div class="gamification-modal-body">
            <div class="completion-circle">
                <svg class="completion-circle-svg" width="120" height="120">
                    <circle class="completion-circle-bg" cx="60" cy="60" r="54"/>
                    <circle class="completion-circle-progress" cx="60" cy="60" r="54"
                            stroke-dasharray="339.292"
                            stroke-dashoffset="339.292"
                            id="completionCircle"/>
                </svg>
                <div class="completion-percentage" id="modalCompletionPercentage">0%</div>
            </div>

            <div class="completion-status">
                <h3 class="completion-status-title" id="completionStatusTitle">Get Started!</h3>
                <p class="completion-status-subtitle" id="completionStatusSubtitle">Complete your profile to unlock all features</p>
            </div>

            <div class="completion-checklist">
                <h4 class="completion-checklist-title">Complete these tasks:</h4>
                <ul class="completion-checklist-items">
                    <li class="completion-checklist-item" id="checklistBusinessCard">
                        <div class="completion-checklist-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                        <span>Create your Public Business Card</span>
                    </li>
                    <li class="completion-checklist-item" id="checklistEmails">
                        <div class="completion-checklist-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                        <span>Add at least 2 email addresses</span>
                    </li>
                    <li class="completion-checklist-item" id="checklistSocial">
                        <div class="completion-checklist-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                        <span>Add at least 1 web presence</span>
                    </li>
                    <li class="completion-checklist-item" id="checklistMedia">
                        <div class="completion-checklist-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                        <span>Upload at least 1 photo or video</span>
                    </li>
                    <li class="completion-checklist-item" id="checklistOrganization">
                        <div class="completion-checklist-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                        <span>Join an office with a valid Agency Manager</span>
                    </li>
                    <li class="completion-checklist-item" id="checklistVerifications">
                        <div class="completion-checklist-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                        <span>Get verified by 2 other users</span>
                    </li>
                    <li class="completion-checklist-item" id="checklistQualifiedSignature">
                        <div class="completion-checklist-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                        <span>Sign any contract with a qualified signature</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>`;

let gamificationConfig = {
    onUpdate: null
};

// Load gamification modal component
function loadGamificationModal() {
    if (document.getElementById('gamificationModal')) {
        return;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = gamificationModalTemplate;
    const modalElement = tempDiv.querySelector('#gamificationModal');
    document.body.appendChild(modalElement);
}

function openGamificationModal() {
    const modal = document.getElementById('gamificationModal');
    if (modal) {
        updateGamificationModal();
        modal.style.display = 'flex';
        modal.classList.add('show');
    }
}

function closeGamificationModal() {
    const modal = document.getElementById('gamificationModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
    }
}

function updateGamificationModal() {
    const completion = calculateProfileCompletion();

    // Update percentage
    const percentageElement = document.getElementById('modalCompletionPercentage');
    if (percentageElement) {
        percentageElement.textContent = `${completion.score}%`;
    }

    // Update circle progress
    const circle = document.getElementById('completionCircle');
    if (circle) {
        const circumference = 339.292;
        const offset = circumference - (completion.score / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }

    // Update status title and subtitle
    const titleElement = document.getElementById('completionStatusTitle');
    const subtitleElement = document.getElementById('completionStatusSubtitle');

    if (completion.score === 100) {
        if (titleElement) titleElement.textContent = 'Profile Complete!';
        if (subtitleElement) subtitleElement.textContent = 'You\'ve unlocked all features';
    } else if (completion.score >= 75) {
        if (titleElement) titleElement.textContent = 'Almost There!';
        if (subtitleElement) subtitleElement.textContent = 'Just a few more steps to complete your profile';
    } else if (completion.score >= 50) {
        if (titleElement) titleElement.textContent = 'Good Progress!';
        if (subtitleElement) subtitleElement.textContent = 'Keep going to unlock all features';
    } else if (completion.score >= 25) {
        if (titleElement) titleElement.textContent = 'Getting Started!';
        if (subtitleElement) subtitleElement.textContent = 'Complete more tasks to unlock features';
    } else {
        if (titleElement) titleElement.textContent = 'Get Started!';
        if (subtitleElement) subtitleElement.textContent = 'Complete your profile to unlock all features';
    }

    // Update checklist items
    updateChecklistItem('checklistBusinessCard', completion.hasBusinessCard);
    updateChecklistItem('checklistEmails', completion.hasEmails);
    updateChecklistItem('checklistSocial', completion.hasSocial);
    updateChecklistItem('checklistMedia', completion.hasMedia);
    updateChecklistItem('checklistOrganization', completion.hasOrganization);
    updateChecklistItem('checklistVerifications', completion.hasVerifications);
    updateChecklistItem('checklistQualifiedSignature', completion.hasQualifiedSignature);

    // Call custom update callback if provided
    if (gamificationConfig.onUpdate) {
        gamificationConfig.onUpdate(completion);
    }
}

function updateChecklistItem(itemId, isCompleted) {
    const item = document.getElementById(itemId);
    if (item) {
        if (isCompleted) {
            item.classList.add('completed');
        } else {
            item.classList.remove('completed');
        }
    }
}

function calculateProfileCompletion() {
    const emailCount = document.querySelectorAll('.email-item').length;
    const socialCount = document.querySelectorAll('.social-item').length;
    const mediaCount = document.querySelectorAll('.media-item.photo, .media-item.video').length;
    const hasBusinessCard = document.getElementById('virtualCardName')?.textContent !== 'Nome Sobrenome';

    const hasEmails = emailCount >= 2;
    const hasSocial = socialCount >= 1;
    const hasMedia = mediaCount >= 1;

    // Check organization membership with valid broker
    const organizationData = window.userOrganization || { isMember: false, hasValidBroker: false };
    const hasOrganization = organizationData.isMember && organizationData.hasValidBroker;

    // Check user verifications
    const verificationCount = window.userVerifications?.length || 0;
    const hasVerifications = verificationCount >= 2;

    // Check qualified signature on contracts
    const signedContracts = window.userSignedContracts || [];
    const qualifiedSignatures = signedContracts.filter(contract => contract.hasQualifiedSignature);
    const hasQualifiedSignature = qualifiedSignatures.length >= 1;

    const totalSteps = 7;
    const scorePerStep = Math.round(100 / totalSteps);

    let completionScore = 0;
    if (hasEmails) completionScore += scorePerStep;
    if (hasSocial) completionScore += scorePerStep;
    if (hasMedia) completionScore += scorePerStep;
    if (hasBusinessCard) completionScore += scorePerStep;
    if (hasOrganization) completionScore += scorePerStep;
    if (hasVerifications) completionScore += scorePerStep;
    if (hasQualifiedSignature) completionScore += scorePerStep;

    // Ensure score doesn't exceed 100
    completionScore = Math.min(completionScore, 100);

    return {
        score: completionScore,
        hasBusinessCard,
        hasEmails,
        hasSocial,
        hasMedia,
        hasOrganization,
        hasVerifications,
        hasQualifiedSignature
    };
}

function updateGamificationBadge() {
    const completion = calculateProfileCompletion();
    const badgeText = document.querySelector('.completion-badge-text');

    if (badgeText) {
        badgeText.textContent = `${completion.score}% Complete`;
    }
}

function handleGamificationModalOutsideClick(event) {
    const modal = document.getElementById('gamificationModal');
    if (modal && event.target === modal) {
        closeGamificationModal();
    }
}

function handleGamificationModalEscape(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('gamificationModal');
        if (modal && modal.style.display === 'flex') {
            closeGamificationModal();
        }
    }
}

// Initialize gamification modal on page load
document.addEventListener('DOMContentLoaded', function() {
    loadGamificationModal();

    window.addEventListener('click', handleGamificationModalOutsideClick);
    document.addEventListener('keydown', handleGamificationModalEscape);

    // Listen for profile updates
    document.addEventListener('virtualCardUpdated', updateGamificationBadge);
    document.addEventListener('emailAdded', updateGamificationBadge);
    document.addEventListener('emailDeleted', updateGamificationBadge);
    document.addEventListener('socialMediaAdded', updateGamificationBadge);
    document.addEventListener('socialMediaDeleted', updateGamificationBadge);
    document.addEventListener('mediaUploaded', updateGamificationBadge);
    document.addEventListener('mediaDeleted', updateGamificationBadge);
    document.addEventListener('organizationUpdated', updateGamificationBadge);
    document.addEventListener('verificationReceived', updateGamificationBadge);
    document.addEventListener('contractSigned', updateGamificationBadge);
});

// Export functions for global access
window.openGamificationModal = openGamificationModal;
window.closeGamificationModal = closeGamificationModal;
window.updateGamificationModal = updateGamificationModal;
window.updateGamificationBadge = updateGamificationBadge;
window.calculateProfileCompletion = calculateProfileCompletion;
window.gamificationConfig = gamificationConfig;
