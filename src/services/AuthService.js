import { StorageService } from './StorageService.js';
import { User } from '../models/User.js';

export class AuthService {
    static register(username, password) {
        const users = StorageService.getUsers();
        if (users.find(u => u.username === username.toLowerCase())) {
            throw new Error('Username already exists.');
        }
        // Simple validation
        if(username.length < 3 || password.length < 4) {
            throw new Error('Username must be 3+ chars, Password 4+ chars.');
        }
        const newUser = new User(username.toLowerCase(), password);
        StorageService.saveUser(newUser);
        return newUser;
    }

    static login(username, password) {
        const users = StorageService.getUsers();
        const user = users.find(u => u.username === username.toLowerCase() && u.password === password);
        if (user) {
            localStorage.setItem('ftp_current_user', user.username);
            return user;
        }
        throw new Error('Invalid username or password.');
    }

    static getCurrentUser() {
        return localStorage.getItem('ftp_current_user');
    }

    static logout() {
        localStorage.removeItem('ftp_current_user');
    }
}