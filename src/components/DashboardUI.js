import { AuthService } from '../services/AuthService.js';
import { StorageService } from '../services/StorageService.js';
import { AnalysisService } from '../services/AnalysisService.js';
import { Transaction } from '../models/Transaction.js';

export const DashboardUI = {
    render: () => {
        const user = AuthService.getCurrentUser();
        const transactions = StorageService.getTransactions(user);
        const stats = AnalysisService.calculateTotals(transactions);
        const advice = AnalysisService.getRecommendation(stats.income, stats.expense);
        
        // تغيير لون البطاقة بناء على الحالة المالية
        let balanceClass = 'balance-healthy';
        if (stats.income > 0) {
            if (stats.expense > stats.income * 0.9) balanceClass = 'balance-danger';
            else if (stats.expense > stats.income * 0.6) balanceClass = 'balance-warning';
        }

        // توليد قائمة العمليات
        const listHtml = transactions.length === 0 ? '<p style="text-align:center; padding:20px; color:#7f8c8d">No transactions yet.</p>' : 
        transactions.slice().reverse().map(t => `
            <div class="transaction-item">
                <div class="t-info">
                    <h4>${t.category === 'Uncategorized' ? '📁' : '🏷️'} ${t.category}</h4>
                    <small>${t.description} | ${t.date}</small>
                </div>
                <span class="t-amount ${t.type}">
                    ${t.type === 'income' ? '+' : '-'} ${AnalysisService.formatCurrency(t.amount)}
                </span>
            </div>
        `).join('');

        return `
            <h2 style="margin-bottom:1.5rem">Hello, <span style="color:var(--primary)">${user.charAt(0).toUpperCase() + user.slice(1)}</span> 👋</h2>
            
            <div class="dashboard-grid">
                <div class="stat-card ${balanceClass}">
                    <h3>Total Balance</h3>
                    <div class="amount">${AnalysisService.formatCurrency(stats.balance)}</div>
                </div>
                <div class="stat-card income">
                    <h3>Total Income</h3>
                    <div class="amount">+${AnalysisService.formatCurrency(stats.income)}</div>
                </div>
                <div class="stat-card expense">
                    <h3>Total Expense</h3>
                    <div class="amount">-${AnalysisService.formatCurrency(stats.expense)}</div>
                </div>
            </div>

            <div class="dashboard-grid" style="grid-template-columns: 2fr 1fr;">
                 <div class="card">
                    <h3>📊 Expenses by Category</h3>
                    <div class="chart-container">
                        <canvas id="expenseChart"></canvas>
                    </div>
                </div>

                <div class="card" style="background: #e0f7fa; border-left: 4px solid #00bcd4;">
                    <h3>🧠 Smart Insight</h3>
                    <p style="line-height:1.6; font-size:0.95rem;">${advice}</p>
                </div>
            </div>

            <div class="card add-transaction-card">
                <h3>➕ Add New Transaction</h3>
                <div class="form-group">
                    <select id="t-type" style="flex:1">
                        <option value="expense">Expense (Money Out)</option>
                        <option value="income">Income (Money In)</option>
                    </select>
                    <input type="text" id="t-cat" class="input-flex" placeholder="Category (e.g., Food, Rent)">
                </div>
                <div class="form-group">
                     <input type="number" id="t-amount" class="input-flex" placeholder="Amount (0.00)" step="0.01" min="0">
                </div>
                <div class="form-group">
                     <input type="text" id="t-desc" class="input-flex" placeholder="Description (optional)">
                </div>
                <button id="addBtn" style="width:100%">Add Transaction</button>
            </div>

            <div class="card">
                <h3>📜 Transaction History</h3>
                <div class="transaction-list">${listHtml}</div>
            </div>
        `;
    },

    afterRender: (navigate) => {
        // --- 1. Add Transaction Logic (تم نقله للأعلى لضمان عمله أولاً) ---
        const addBtn = document.getElementById('addBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const type = document.getElementById('t-type').value;
                let cat = document.getElementById('t-cat').value.trim();
                const amount = document.getElementById('t-amount').value;
                const desc = document.getElementById('t-desc').value.trim();

                // Auto-Categorization Logic
                if (type === 'expense' && cat === '' && desc !== '') {
                    const descLower = desc.toLowerCase();
                    if (descLower.includes('food') || descLower.includes('burger') || descLower.includes('coffee')) cat = 'Food';
                    else if (descLower.includes('uber') || descLower.includes('taxi') || descLower.includes('gas')) cat = 'Transport';
                    else if (descLower.includes('rent') || descLower.includes('bill')) cat = 'Bills';
                }

                if(amount && parseFloat(amount) > 0) {
                    const user = AuthService.getCurrentUser();
                    const newTrans = new Transaction(type, cat, amount, desc);
                    StorageService.addTransaction(user, newTrans);
                    navigate('dashboard'); // Refresh UI
                } else {
                    alert('Please enter a valid amount.');
                }
            });
        }

        // --- 2. Initialize Chart.js ---
        try {
            const user = AuthService.getCurrentUser();
            const transactions = StorageService.getTransactions(user);
            const chartData = AnalysisService.getExpensesByCategoryForChart(transactions);
            
            const canvasEl = document.getElementById('expenseChart');
            const ctx = canvasEl.getContext('2d');
            
            // تدمير الرسم القديم إذا وجد لتجنب التداخل
            if (window.myExpenseChart) {
                window.myExpenseChart.destroy();
            }

            if (chartData.data.length === 0) {
                // Fix: استخدام ctx.canvas.width بدلاً من canvas.width غير المعرفة
                ctx.font = "14px Segoe UI";
                ctx.fillStyle = "#95a5a6";
                ctx.textAlign = "center";
                ctx.fillText("Add expenses to see the chart", ctx.canvas.width/2, ctx.canvas.height/2);
            } else {
                window.myExpenseChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: chartData.labels,
                        datasets: [{
                            data: chartData.data,
                            backgroundColor: ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#e67e22'],
                            borderWidth: 2,
                            borderColor: '#ffffff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'right', labels: { boxWidth: 12 } }
                        }
                    }
                });
            }
        } catch (error) {
            console.error("Chart Error:", error);
        }
    }
};