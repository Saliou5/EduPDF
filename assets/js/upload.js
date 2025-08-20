class UploadManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupDropzone();
        this.setupFormValidation();
        this.setupTagsInput();
    }

    setupDropzone() {
        const dropzone = document.getElementById('dropzone');
        const fileInput = document.getElementById('file-input');
        const browseBtn = dropzone?.querySelector('button');

        if (!dropzone) return;

        // Glisser-déposer
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => {
                dropzone.classList.add('drag-over');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => {
                dropzone.classList.remove('drag-over');
            }, false);
        });

        dropzone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type === 'application/pdf') {
                this.handleFileSelect(files[0]);
            }
        });

        // Bouton parcourir
        browseBtn?.addEventListener('click', () => {
            fileInput?.click();
        });

        fileInput?.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelect(e.target.files[0]);
            }
        });
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleFileSelect(file) {
        if (file.type !== 'application/pdf') {
            this.showError('Veuillez sélectionner un fichier PDF');
            return;
        }

        if (file.size > 16 * 1024 * 1024) {
            this.showError('Le fichier ne doit pas dépasser 16MB');
            return;
        }

        this.updateDropzonePreview(file);
    }

    updateDropzonePreview(file) {
        const dropzone = document.getElementById('dropzone');
        dropzone.innerHTML = `
            <div class="file-preview">
                <i class="fas fa-file-pdf text-4xl text-red-500"></i>
                <div class="file-info">
                    <h4>${file.name}</h4>
                    <p>${this.formatFileSize(file.size)}</p>
                </div>
                <button class="btn btn-sm btn-outline" onclick="this.removeFile()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }

    setupFormValidation() {
        const form = document.getElementById('upload-form');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!this.validateForm()) return;

            const formData = new FormData(form);
            await this.submitForm(formData);
        });
    }

    validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        return isValid;
    }

    async submitForm(formData) {
        try {
            this.showLoading(true);

            const response = await fetch('/api/documents/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            if (response.ok) {
                this.showSuccess('Document uploadé avec succès !');
                form.reset();
                setTimeout(() => window.location.href = '/dashboard.html', 2000);
            } else {
                throw new Error('Erreur lors de l\'upload');
            }
        } catch (error) {
            this.showError('Erreur: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    setupTagsInput() {
        const tagsInput = document.querySelector('.tags-input input');
        const tagsList = document.querySelector('.tags-list');

        tagsInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && tagsInput.value.trim()) {
                e.preventDefault();
                this.addTag(tagsInput.value.trim());
                tagsInput.value = '';
            }
        });
    }

    addTag(tagText) {
        const tagsList = document.querySelector('.tags-list');
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.innerHTML = `
            ${tagText}
            <button type="button" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        tagsList.appendChild(tag);
    }

    formatFileSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    showLoading(show) {
        const submitBtn = document.querySelector('#upload-form button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = show;
            submitBtn.innerHTML = show 
                ? '<i class="fas fa-spinner fa-spin"></i> Upload en cours...' 
                : 'Publier le document';
        }
    }

    showSuccess(message) {
        alert('SUCCÈS: ' + message);
    }

    showError(message) {
        alert('ERREUR: ' + message);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new UploadManager();
});