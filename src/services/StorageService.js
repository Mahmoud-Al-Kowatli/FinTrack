export class StorageService {
    static getUsers() {
        return JSON.parse(localStorage.getItem('ftp_users')) || [];
    }

    static saveUser(user) {
        const users = this.getUsers();
        users.push(user);
        localStorage.setItem('ftp_users', JSON.stringify(users));
    }

    static getTransactions(username) {
        return JSON.parse(localStorage.getItem(`ftp_transactions_${username}`)) || [];
    }

    static addTransaction(username, transaction) {
        const transactions = this.getTransactions(username);
        transactions.push(transaction);
        localStorage.setItem(`ftp_transactions_${username}`, JSON.stringify(transactions));
    }
}