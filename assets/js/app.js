// Thème sombre/clair
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

document.documentElement.setAttribute('data-theme', currentTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Mettre à jour l'icône
        themeToggle.innerHTML = newTheme === 'dark' 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    });

    // Mettre à jour l'icône initiale
    themeToggle.innerHTML = currentTheme === 'dark' 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
}

// Chargement des documents (version simplifiée pour la démo)
function loadFeaturedDocuments() {
    try {
        const grid = document.getElementById('featured-documents');
        if (!grid) return;
        
        // Données factices pour la démo
        const demoDocuments = [
            {
                title: "Introduction à l'Histoire Africaine",
                author: "Dr. Kwame Nkrumah",
                downloads: 154,
                category: "Histoire"
            },
            {
                title: "Mathématiques Avancées",
                author: "Prof. Cheikh Anta Diop",
                downloads: 89,
                category: "Science"
            },
            {
                title: "Littérature Contemporaine",
                author: "Chinua Achebe",
                downloads: 203,
                category: "Littérature"
            }
        ];
        
        grid.innerHTML = '';
        
        demoDocuments.forEach(doc => {
            const card = document.createElement('div');
            card.className = 'document-card';
            card.innerHTML = `
                <div class="document-thumbnail">
                    <div style="background:#f0f0f0; height:120px; display:flex; align-items:center; justify-content:center;">
                        <i class="fas fa-file-pdf fa-3x" style="color:#E43B3B;"></i>
                    </div>
                    <div class="document-badge">${doc.category}</div>
                </div>
                <div class="document-content">
                    <h3>${doc.title}</h3>
                    <p class="document-author">${doc.author}</p>
                    <div class="document-meta">
                        <span><i class="fas fa-download"></i> ${doc.downloads}</span>
                        <a href="pages/auth/document.html" class="btn btn-sm">Voir</a>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Erreur de chargement des documents:', error);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedDocuments();
    
    // Menu mobile
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});