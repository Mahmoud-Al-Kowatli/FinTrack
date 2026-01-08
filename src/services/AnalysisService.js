export class AnalysisService {
    // Formats numbers as currency (e.g., $1,200.50)
    static formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    static calculateTotals(transactions) {
        let income = 0;
        let expense = 0;
        
        transactions.forEach(t => {
            if (t.type === 'income') income += t.amount;
            else expense += t.amount;
        });

        return {
            income,
            expense,
            balance: income - expense
        };
    }

    // Feature: Smart Recommendations Engine
    static getRecommendation(income, expense) {
        if (income === 0) return "Start by adding your income sources to see recommendations.";
        
        const expenseRatio = (expense / income) * 100;
        
        if (expenseRatio > 90) {
            return "🚨 **Critical Warning:** You are spending over 90% of your income! Immediate action is needed to cut costs.";
        } else if (expenseRatio > 75) {
            return "⚠️ **Caution:** Your expenses are very high (over 75% of income). Try to create a stricter budget.";
        } else if (expenseRatio > 50) {
            return "💡 **Tip:** You are spending more than half your income. Consider checking your 'Wants' vs 'Needs'.";
        } else {
            return "✅ **Great Job!** Your financial health is looking good. Keep saving!";
        }
    }

    // Feature: Get data prepared for Chart.js
    static getExpensesByCategoryForChart(transactions) {
        const categoryMap = {};
        
        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                if (categoryMap[t.category]) {
                    categoryMap[t.category] += t.amount;
                } else {
                    categoryMap[t.category] = t.amount;
                }
            });

        return {
            labels: Object.keys(categoryMap),
            data: Object.values(categoryMap)
        };
    }
}