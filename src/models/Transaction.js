export class Transaction {
    constructor(type, category, amount, description) {
        this.id = Date.now();
        this.type = type; // 'income' or 'expense'
        this.category = category || 'Uncategorized';
        this.amount = parseFloat(amount);
        this.description = description;
        // Use US format for date
        this.date = new Date().toLocaleDateString('en-US');
    }
}