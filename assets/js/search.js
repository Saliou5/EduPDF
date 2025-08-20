class SearchManager {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 1;
        this.filters = {
            categories: [],
            languages: [],
            year: null,
            sort: 'relevance'
        };
        
        this.init();
    }

    init() {
        this.setupSearch();
        this.setupFilters();
        this.loadSearchResults();
    }

    setupSearch() {
        const searchInput = document.querySelector('.search-header input');
        searchInput?.addEventListener('input', this.debounce(() => {
            this.currentPage = 1;
            this.loadSearchResults();
        }, 300));

        // Récupération des paramètres d'URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('q')) {
            searchInput.value = urlParams.get('q');
            this.loadSearchResults();
        }
    }

    setupFilters() {
        // Écouteurs pour les filtres
        document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.currentPage = 1;
                this.updateFilters();
                this.loadSearchResults();
            });
        });

        document.querySelectorAll('.filter-group input[type="range"]').forEach(range => {
            range.addEventListener('change', () => {
                this.currentPage = 1;
                this.updateFilters();
                this.loadSearchResults();
            });
        });

        document.querySelector('.sort-options select')?.addEventListener('change', (e) => {
            this.filters.sort = e.target.value;
            this.loadSearchResults();
        });
    }

    updateFilters() {
        this.filters.categories = Array.from(
            document.querySelectorAll('.filter-group input[type="checkbox"]:checked')
        ).map(cb => cb.value);
    }

    async loadSearchResults() {
        try {
            this.showLoading(true);

            const searchQuery = document.querySelector('.search-header input')?.value || '';
            const params = new URLSearchParams({
                q: searchQuery,
                page: this.currentPage,
                sort: this.filters.sort,
                ...this.filters
            });

            const response = await fetch(`/api/documents/search?${params}`);
            const data = await response.json();

            this.displayResults(data.documents);
            this.updatePagination(data.pagination);
            
        } catch (error) {
            console.error('Erreur de recherche:', error);
            this.showError('Impossible de charger les résultats');
        } finally {
            this.showLoading(false);
        }
    }

    displayResults(documents) {
        const resultsContainer = document.getElementById('search-results');
        
        if (documents.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search fa-3x"></i>
                    <h3>Aucun résultat trouvé</h3>
                    <p>Essayez de modifier vos critères de recherche</p>
                </div>
            `;
            return;
        }

        resultsContainer.innerHTML = documents.map(doc => `
            <div class="document-card">
                <div class="document-thumbnail">
                    <img src="${doc.thumbnail}" alt="${doc.title}">
                    <span class="document-badge">${doc.category}</span>
                </div>
                <div class="document-content">
                    <h3>${doc.title}</h3>
                    <p class="document-author">${doc.author}</p>
                    <p class="document-excerpt">${doc.excerpt}</p>
                    <div class="document-meta">
                        <span><i class="fas fa-download"></i> ${doc.downloads}</span>
                        <span><i class="fas fa-calendar"></i> ${doc.year}</span>
                        <a href="/document.html?id=${doc.id}" class="btn btn-sm">Voir</a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updatePagination(pagination) {
        const paginationContainer = document.querySelector('.pagination');
        this.totalPages = pagination.totalPages;

        paginationContainer.innerHTML = `
            <button class="btn btn-outline" ${this.currentPage === 1 ? 'disabled' : ''} 
                onclick="searchManager.previousPage()">
                <i class="fas fa-chevron-left"></i>
            </button>
            
            <span>Page ${this.currentPage} sur ${this.totalPages}</span>
            
            <button class="btn btn-outline" ${this.currentPage === this.totalPages ? 'disabled' : ''} 
                onclick="searchManager.nextPage()">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.loadSearchResults();
            window.scrollTo(0, 0);
        }
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadSearchResults();
            window.scrollTo(0, 0);
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    showLoading(show) {
        const resultsContainer = document.getElementById('search-results');
        if (show) {
            resultsContainer.innerHTML = `
                <div class="loading">
                    <i class="fas fa-spinner fa-spin fa-2x"></i>
                    <p>Recherche en cours...</p>
                </div>
            `;
        }
    }

    showError(message) {
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle fa-2x"></i>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="searchManager.loadSearchResults()">
                    Réessayer
                </button>
            </div>
        `;
    }
}

// Initialisation globale
let searchManager;
document.addEventListener('DOMContentLoaded', () => {
    searchManager = new SearchManager();
});