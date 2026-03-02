(() => {
    const root = document.documentElement;
    const fallbackPrimary = '#664EE0';
    const fallbackSecondary = '#4722AD';

    try {
        const computed = getComputedStyle(root);
        const defaultPrimary = computed.getPropertyValue('--color-primary').trim() || fallbackPrimary;
        const defaultSecondary = computed.getPropertyValue('--color-secondary').trim() || fallbackSecondary;

        const storedPrimary = localStorage.getItem('primaryColor') || defaultPrimary;
        const storedSecondary = localStorage.getItem('secondaryColor') || defaultSecondary;

        root.style.setProperty('--color-primary', storedPrimary);
        root.style.setProperty('--color-secondary', storedSecondary);
    } catch (error) {
        root.style.setProperty('--color-primary', fallbackPrimary);
        root.style.setProperty('--color-secondary', fallbackSecondary);
    }
})();
