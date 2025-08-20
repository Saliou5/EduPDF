class DashboardManager {
    constructor() {
        this.userStats = null;
        this.recentDocuments = [];
        this.init();
    }

    async init() {
        await this.verifyAuthentication();
        await this.loadDashboardData();
        this.setupQuickActions();
    }

    async verifyAuthentication() {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            window.location.href = '/login.html';
            return false;
        }
        return true;
    }

    async loadDashboardData() {
        try {
            const [statsResponse, docsResponse] = await Promise.all([
                fetch('/api/user/stats', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    }
                }),
                fetch('/api/user/documents/recent', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    }
                })
            ]);

            if (statsResponse.ok && docsResponse.ok) {
                this.userStats = await statsResponse.json();
                this.recentDocuments = await docsResponse.json();
                this.updateDashboard();
            } else {
                throw new Error('Erreur de chargement des données');
            }
        } catch (error) {
            this.showError('Impossible de charger le tableau de bord');
        }
    }

    updateDashboard() {
        this.updateStats();
        this.updateRecentDocuments();
        this.updateQuickActions();
    }

    updateStats() {
        const statsGrid = document.querySelector('.stats-grid');
        if (!statsGrid || !this.userStats) return;

        statsGrid.innerHTML = `
            <div class="stat-card">
                <h3>Documents consultés</h3>
                <p>${this.userStats.viewedDocuments}</p>
            </div>
            <div class="stat-card">
                <h3>Téléchargements</h3>
                <p>${this.userStats.downloads}</p>
            </div>
            <div class="stat-card">
                <h3>Documents sauvegardés</h3>
                <p>${this.userStats.savedDocuments}</p>
            </div>
            <div class="stat-card">
                <h3>Activité cette semaine</h3>
                <p>${this.userStats.weeklyActivity}</p>
            </div>
        `;
    }

    updateRecentDocuments() {
        const docsContainer = document.getElementById('user-documents');
        if (!docsContainer) return;

        if (this.recentDocuments.length === 0) {
            docsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book-open fa-3x"></i>
                    <p>Aucun document récent</p>
                    <a href="/search.html" class="btn btn-primary">Explorer</a>
                </div>
            `;
            return;
        }

        docsContainer.innerHTML = this.recentDocuments.map(doc => `
            <div class="document-card">
                <div class="document-thumbnail">
                    <img src="${doc.thumbnail}" alt="${doc.title}">
                </div>
                <div class="document-content">
                    <h4>${doc.title}</h4>
                    <p>Consulté le ${new Date(doc.lastViewed).toLocaleDateString()}</p>
                    <a href="/document.html?id=${doc.id}" class="btn btn-sm">Ouvrir</a>
                </div>
            </div>
        `).join('');
    }

    setupQuickActions() {
        document.querySelectorAll('.quick-action').forEach(action => {
            action.addEventListener('click', (e) => {
                const actionType = e.currentTarget.dataset.action;
                this.handleQuickAction(actionType);
            });
        });
    }

    handleQuickAction(action) {
        switch (action) {
            case 'upload':
                window.location.href = '/upload.html';
                break;
            case 'search':
                window.location.href = '/search.html';
                break;
            case 'premium':
                window.location.href = '/subscription.html';
                break;
            case 'help':
                window.open('/help.html', '_blank');
                break;
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'dashboard-error';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
            <button onclick="location.reload()">Réessayer</button>
        `;
        document.querySelector('.dashboard-content').appendChild(errorDiv);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new DashboardManager();
});