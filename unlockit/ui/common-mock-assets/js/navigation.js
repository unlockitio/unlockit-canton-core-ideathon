// Top Navigation JavaScript Functions
function openLanguageModal() {
    document.getElementById('languageModal').classList.add('show');
}

function closeLanguageModal() {
    document.getElementById('languageModal').classList.remove('show');
}

function selectLanguage(code, language) {
    console.log('Language selected:', code, language);
    closeLanguageModal();
}