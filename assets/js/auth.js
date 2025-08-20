class Auth {
    static async login(email, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('auth_token', data.token);
                window.location.href = '/dashboard.html';
            } else {
                throw new Error(data.message || 'Erreur de connexion');
            }
        } catch (error) {
            console.error('Login error:', error);
            showToast(error.message, 'error');
        }
    }
    
    static isAuthenticated() {
        return !!localStorage.getItem('auth_token');
    }
    
    static logout() {
        localStorage.removeItem('auth_token');
        window.location.href = '/login.html';
    }
}