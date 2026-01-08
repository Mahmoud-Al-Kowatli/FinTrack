import { AuthService } from './services/AuthService.js';
import { AuthUI } from './components/AuthUI.js';
import { DashboardUI } from './components/DashboardUI.js';

const appContainer = document.getElementById('app');
const logoutBtn = document.getElementById('logoutBtn');
const printBtn = document.getElementById('printBtn');

// Simple Router function
function navigate(route) {
    let component = null;
    const currentUser = AuthService.getCurrentUser();

    if (route === 'auth') {
        if (currentUser) { navigate('dashboard'); return; } // Redirect if already logged in
        component = AuthUI;
        logoutBtn.style.display = 'none';
        printBtn.style.display = 'none';
    } else if (route === 'dashboard') {
        if (!currentUser) { navigate('auth'); return; } // Protect route
        component = DashboardUI;
        logoutBtn.style.display = 'block';
        // Feature: Monthly Report Export (Print)
        printBtn.style.display = 'block';
    }

    // 1. Inject HTML
    appContainer.innerHTML = component.render();
    
    // 2. Attach Event Listeners & Initialize Scripts (like Charts)
    if (component.afterRender) {
        component.afterRender(navigate);
    }
}

// Initialize App
function init() {
    const user = AuthService.getCurrentUser();
    navigate(user ? 'dashboard' : 'auth');

    // Global Event Listeners
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        AuthService.logout();
        navigate('auth');
    });

    printBtn.addEventListener('click', () => {
        window.print();
    });
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);