import { AuthService } from './services/AuthService.js';
import { AuthUI } from './components/AuthUI.js';
import { DashboardUI } from './components/DashboardUI.js';
// ملاحظة: يمكنك وضع ProfileUI هنا مباشرة أو في ملف منفصل
const ProfileUI = {
    render: () => `
        <div class="card">
            <h2>⚙️ Profile Settings</h2>
            <div class="form-group" style="margin-top:20px">
                <label>Current User:</label>
                <input type="text" value="${AuthService.getCurrentUser()}" disabled class="input-flex">
            </div>
            <p>More settings coming soon...</p>
        </div>
    `,
    afterRender: () => {}
};

const appContainer = document.getElementById('app');
const mainNav = document.getElementById('main-nav');

function navigate(route) {
    const user = AuthService.getCurrentUser();
    let component;

    if (!user) {
        component = AuthUI;
        mainNav.style.display = 'none';
        document.body.style.display = 'block'; // لصفحة الدخول
    } else {
        mainNav.style.display = 'flex';
        document.body.style.display = 'flex'; // لشكل الـ Sidebar
        
        if (route === 'profile') component = ProfileUI;
        else component = DashboardUI;
    }

    appContainer.innerHTML = component.render();
    if (component.afterRender) component.afterRender(navigate);
}

function init() {
    const user = AuthService.getCurrentUser();
    navigate(user ? 'dashboard' : 'auth');

    document.getElementById('dashLink').addEventListener('click', () => navigate('dashboard'));
    document.getElementById('profileLink').addEventListener('click', () => navigate('profile'));
    document.getElementById('logoutBtn').addEventListener('click', () => {
        AuthService.logout();
        navigate('auth');
    });

    const themeBtn = document.getElementById('themeBtn');
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    });
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
}

document.addEventListener('DOMContentLoaded', init);