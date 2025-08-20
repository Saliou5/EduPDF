class ProfileManager {
    constructor() {
        this.userData = null;
        this.init();
    }

    async init() {
        await this.loadUserData();
        this.setupEventListeners();
        this.setupAvatarUpload();
    }

    async loadUserData() {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                window.location.href = '/login.html';
                return;
            }

            const response = await fetch('/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                this.userData = await response.json();
                this.displayUserData();
            } else {
                throw new Error('Erreur de chargement du profil');
            }
        } catch (error) {
            this.showError('Impossible de charger le profil');
        }
    }

    displayUserData() {
        document.querySelector('.profile-info h1').textContent = this.userData.name;
        document.querySelector('.profile-info p:nth-child(2)').textContent = 
            `Membre depuis : ${new Date(this.userData.joinDate).toLocaleDateString()}`;
        
        document.querySelector('.profile-info p:nth-child(3)').innerHTML = 
            `Statut : <span class="badge-${this.userData.subscription}">${this.userData.subscription}</span>`;

        // Remplissage du formulaire
        const form = document.querySelector('.profile-section form');
        form.querySelector('input[type="text"]').value = this.userData.name;
        form.querySelector('input[type="email"]').value = this.userData.email;
    }

    setupEventListeners() {
        const form = document.querySelector('.profile-section form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.updateProfile(new FormData(form));
        });

        // Gestion d'abonnement
        document.querySelector('.subscription-card button')?.addEventListener('click', () => {
            this.manageSubscription();
        });
    }

    async updateProfile(formData) {
        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });

            if (response.ok) {
                this.showSuccess('Profil mis à jour avec succès');
            } else {
                throw new Error('Erreur de mise à jour');
            }
        } catch (error) {
            this.showError('Erreur lors de la mise à jour');
        }
    }

    setupAvatarUpload() {
        const avatarInput = document.createElement('input');
        avatarInput.type = 'file';
        avatarInput.accept = 'image/*';
        avatarInput.style.display = 'none';

        document.querySelector('.profile-avatar button')?.addEventListener('click', () => {
            avatarInput.click();
        });

        avatarInput.addEventListener('change', async (e) => {
            if (e.target.files.length > 0) {
                await this.uploadAvatar(e.target.files[0]);
            }
        });
    }

    async uploadAvatar(file) {
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await fetch('/api/user/avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                document.querySelector('.profile-avatar img').src = data.avatarUrl;
                this.showSuccess('Avatar mis à jour');
            }
        } catch (error) {
            this.showError('Erreur lors du changement d\'avatar');
        }
    }

    manageSubscription() {
        // Redirection vers la page d'abonnement
        window.location.href = '/subscription.html';
    }

    showSuccess(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success';
        alert.textContent = message;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
    }

    showError(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-error';
        alert.textContent = message;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new ProfileManager();
});