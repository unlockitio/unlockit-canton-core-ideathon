/* Reusable Modal Component */

class Modal {
    constructor(id, options = {}) {
        this.id = id;
        this.options = {
            title: options.title || 'Modal',
            size: options.size || 'md', // sm, md, lg
            closeOnOverlay: options.closeOnOverlay !== false,
            closeOnEscape: options.closeOnEscape !== false,
            ...options
        };
        this.isOpen = false;
        this.callbacks = {
            onOpen: options.onOpen || (() => {}),
            onClose: options.onClose || (() => {}),
            onSubmit: options.onSubmit || (() => {})
        };

        this.create();
        this.bindEvents();
    }

    create() {
        // Remove existing modal if it exists
        const existing = document.getElementById(this.id);
        if (existing) {
            existing.remove();
        }

        // Create modal HTML
        const modal = document.createElement('div');
        modal.id = this.id;
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal modal-${this.options.size}">
                <div class="modal-header">
                    <h3 class="modal-title">${this.options.title}</h3>
                    <button class="modal-close" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- Content will be inserted here -->
                </div>
                <div class="modal-footer">
                    <!-- Footer buttons will be inserted here -->
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.element = modal;
        this.modalElement = modal.querySelector('.modal');
        this.headerElement = modal.querySelector('.modal-header');
        this.bodyElement = modal.querySelector('.modal-body');
        this.footerElement = modal.querySelector('.modal-footer');
        this.titleElement = modal.querySelector('.modal-title');
    }

    bindEvents() {
        // Close button
        this.element.querySelector('.modal-close').addEventListener('click', () => {
            this.close();
        });

        // Overlay click
        if (this.options.closeOnOverlay) {
            this.element.addEventListener('click', (e) => {
                if (e.target === this.element) {
                    this.close();
                }
            });
        }

        // Escape key
        if (this.options.closeOnEscape) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        }
    }

    setContent(content) {
        if (typeof content === 'string') {
            this.bodyElement.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            this.bodyElement.innerHTML = '';
            this.bodyElement.appendChild(content);
        }
        return this;
    }

    setFooter(buttons) {
        this.footerElement.innerHTML = '';

        if (Array.isArray(buttons)) {
            buttons.forEach(button => {
                const btn = document.createElement('button');
                btn.className = `btn ${button.class || 'btn-secondary'}`;
                btn.textContent = button.text;
                btn.type = button.type || 'button';

                if (button.onClick) {
                    btn.addEventListener('click', button.onClick);
                }

                this.footerElement.appendChild(btn);
            });
        }
        return this;
    }

    setTitle(title) {
        this.titleElement.textContent = title;
        return this;
    }

    open() {
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
        this.element.classList.add('visible');
        this.callbacks.onOpen(this);
        return this;
    }

    close() {
        this.isOpen = false;
        document.body.style.overflow = '';
        this.element.classList.remove('visible');
        this.callbacks.onClose(this);
        return this;
    }

    destroy() {
        this.element.remove();
    }

    // Static method to create and show a modal quickly
    static show(id, options) {
        const modal = new Modal(id, options);
        modal.open();
        return modal;
    }

    // Static method to create a form modal
    static createForm(id, options) {
        const modal = new Modal(id, {
            title: options.title || 'Form',
            ...options
        });

        // Create form content
        const form = document.createElement('form');
        form.className = 'modal-form';

        if (options.fields && Array.isArray(options.fields)) {
            options.fields.forEach(field => {
                const formGroup = document.createElement('div');
                formGroup.className = 'form-group';

                const label = document.createElement('label');
                label.textContent = field.label;
                label.setAttribute('for', field.id);
                formGroup.appendChild(label);

                let input;
                if (field.type === 'select') {
                    input = document.createElement('select');
                    if (field.options) {
                        field.options.forEach(option => {
                            const opt = document.createElement('option');
                            opt.value = option.value;
                            opt.textContent = option.text;
                            input.appendChild(opt);
                        });
                    }
                } else if (field.type === 'textarea') {
                    input = document.createElement('textarea');
                } else {
                    input = document.createElement('input');
                    input.type = field.type || 'text';
                }

                input.id = field.id;
                input.name = field.name || field.id;
                input.placeholder = field.placeholder || '';
                input.required = field.required || false;

                if (field.value) {
                    input.value = field.value;
                }

                formGroup.appendChild(input);
                form.appendChild(formGroup);
            });
        }

        modal.setContent(form);

        // Set footer buttons
        modal.setFooter([
            {
                text: 'Cancel',
                class: 'btn-secondary',
                onClick: () => modal.close()
            },
            {
                text: options.submitText || 'Submit',
                class: 'btn-primary',
                type: 'submit',
                onClick: (e) => {
                    e.preventDefault();
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData.entries());

                    if (options.onSubmit) {
                        const result = options.onSubmit(data, modal);
                        if (result !== false) {
                            modal.close();
                        }
                    } else {
                        modal.close();
                    }
                }
            }
        ]);

        return modal;
    }
}

// Export for use in other files
window.Modal = Modal;