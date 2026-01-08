import { AuthService } from '../services/AuthService.js';

export const AuthUI = {
    render: () => {
        return `
        <div class="auth-page">
            <div class="glass-card">
                <h1>FinTrack Pro</h1>
                <input type="text" id="username" placeholder="Username">
                <input type="password" id="password" placeholder="Password">
                <button id="loginBtn">Login</button>
                <button id="regBtn" style="background:transparent; border:1px solid white; margin-top:10px">Register New User</button>
                <p id="error" style="color: #ff7782; margin-top: 10px;"></p>
            </div>
        </div>
        `;
    },
    afterRender: (navigate) => {
        // Login Logic
        document.getElementById('loginBtn').addEventListener('click', () => {
            const u = document.getElementById('username').value;
            const p = document.getElementById('password').value;
            try {
                AuthService.login(u, p);
                navigate('dashboard');
            } catch (e) { document.getElementById('error').innerText = e.message; }
        });

        // Register Logic (To add another person)
        document.getElementById('regBtn').addEventListener('click', () => {
            const u = document.getElementById('username').value;
            const p = document.getElementById('password').value;
            try {
                AuthService.register(u, p);
                alert("User Registered! You can now login.");
            } catch (e) { document.getElementById('error').innerText = e.message; }
        });
    }
};