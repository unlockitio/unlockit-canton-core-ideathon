// Enhanced Component Loader System
// Handles dynamic loading of modular UI components

class ComponentLoader {
    constructor() {
        this.loadedComponents = new Set();
        this.cssCache = new Map();
    }

    /**
     * Dynamically loads a CSS file if not already loaded
     * @param {string} cssPath - Path to the CSS file
     * @param {string} componentId - Unique identifier for the component
     */
    loadCSS(cssPath, componentId) {
        if (this.cssCache.has(componentId)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = cssPath;
            link.onload = () => {
                this.cssCache.set(componentId, true);
                resolve();
            };
            link.onerror = () => reject(new Error(`Failed to load CSS: ${cssPath}`));
            document.head.appendChild(link);
        });
    }

    /**
     * Dynamically loads a JavaScript file if not already loaded
     * @param {string} jsPath - Path to the JavaScript file
     * @param {string} componentId - Unique identifier for the component
     */
    loadJS(jsPath, componentId) {
        if (this.loadedComponents.has(componentId)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = jsPath;
            script.onload = () => {
                this.loadedComponents.add(componentId);
                resolve();
            };
            script.onerror = () => reject(new Error(`Failed to load JS: ${jsPath}`));
            document.body.appendChild(script);
        });
    }

    /**
     * Loads a complete component (CSS + JS)
     * @param {Object} config - Component configuration
     * @param {string} config.id - Component identifier
     * @param {string} config.cssPath - Path to CSS file
     * @param {string} config.jsPath - Path to JavaScript file
     * @param {string} [config.basePath] - Base path for relative paths
     */
    async loadComponent(config) {
        const { id, cssPath, jsPath, basePath = '' } = config;

        try {
            const cssFullPath = basePath ? `${basePath}/${cssPath}` : cssPath;
            const jsFullPath = basePath ? `${basePath}/${jsPath}` : jsPath;

            // Load CSS and JS in parallel
            await Promise.all([
                this.loadCSS(cssFullPath, `${id}-css`),
                this.loadJS(jsFullPath, `${id}-js`)
            ]);

            console.log(`Component ${id} loaded successfully`);
        } catch (error) {
            console.error(`Failed to load component ${id}:`, error);
            throw error;
        }
    }

    /**
     * Loads multiple components in parallel
     * @param {Array} components - Array of component configurations
     */
    async loadComponents(components) {
        try {
            await Promise.all(
                components.map(component => this.loadComponent(component))
            );
            console.log('All components loaded successfully');
        } catch (error) {
            console.error('Failed to load some components:', error);
            throw error;
        }
    }

    /**
     * Auto-detects and loads common components based on page structure
     * @param {string} basePath - Base path for component files
     */
    async autoLoadComponents(basePath = '../common-mock-assets') {
        const componentsToLoad = [];

        // Menu loader is now included directly in HTML files, skip dynamic loading

        // Navbar loader is now included directly in HTML files, skip dynamic loading

        // Check for language selector and load language modal
        const languageButton = document.querySelector('[onclick="openLanguageModal()"], .language-toggle, [data-toggle="language"]');
        if (languageButton) {
            componentsToLoad.push({
                id: 'language-modal',
                cssPath: 'components/modals/language-modal.css',
                jsPath: 'components/modals/language-modal.js',
                basePath: basePath
            });
        }

        // Check for profile button and load profile dropdown
        const profileButton = document.querySelector('#profile-button, [onclick*="Profile"], .profile-toggle');
        if (profileButton) {
            componentsToLoad.push({
                id: 'profile-dropdown',
                cssPath: 'css/profile-dropdown.css',
                jsPath: 'js/profile-dropdown.js',
                basePath: basePath
            });
        }

        // Check for tasks button and load tasks dropdown
        const tasksButton = document.querySelector('#tasks-button, [onclick*="Tasks"], .tasks-toggle');
        if (tasksButton) {
            componentsToLoad.push({
                id: 'tasks-dropdown',
                cssPath: 'css/tasks-dropdown.css',
                jsPath: 'js/tasks-dropdown.js',
                basePath: basePath
            });
        }

        if (componentsToLoad.length > 0) {
            await this.loadComponents(componentsToLoad);
        }
    }
}

function getFeaturesBasePath() {
    const match = window.location.pathname.match(/^(.*?\/unlockit\/ui\/)/);
    if (match) return match[1];
    return window.location.pathname.replace(/\/[^/]*$/, '/');
}

// Create global instance
window.componentLoader = new ComponentLoader();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const basePath = `${getFeaturesBasePath()}common-mock-assets`;

    // Auto-load components
    window.componentLoader.autoLoadComponents(basePath);
});
