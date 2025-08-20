class DocumentRatings {
    constructor() {
        this.initRatingSystem();
        this.loadComments();
    }
    
    initRatingSystem() {
        const stars = document.querySelectorAll('.star-rating > span');
        stars.forEach((star, index) => {
            star.addEventListener('click', () => this.rateDocument(index + 1));
        });
    }
    
    rateDocument(rating) {
        // Envoyer la notation au backend
        console.log(`Noté ${rating} étoiles`);
        this.updateStarDisplay(rating);
    }
    
    updateStarDisplay(rating) {
        // Mettre à jour l'affichage des étoiles
    }
    
    loadComments() {
        // Charger les commentaires depuis l'API
    }
}

// Initialisation
new DocumentRatings();