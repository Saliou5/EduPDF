class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        // Appliquer le thème sauvegardé
        this.applyTheme(this.currentTheme);
        
        // Configurer le bouton toggle
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
            this.updateToggleIcon();
        }
        
        // Ajouter la classe de transition après le chargement
        setTimeout(() => {
            document.documentElement.classList.add('transition-theme');
        }, 100);
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateToggleIcon();
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.currentTheme = newTheme;
        this.applyTheme(newTheme);
    }
    
    updateToggleIcon() {
        if (!this.themeToggle) return;
        
        this.themeToggle.innerHTML = this.currentTheme === 'dark' 
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});