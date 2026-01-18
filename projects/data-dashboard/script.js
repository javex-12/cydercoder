// Analytics Pro - Data Dashboard JavaScript

class DataDashboard {
    constructor() {
        this.charts = {};
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.transactions = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showLoading();
        this.generateMockData();
        this.initializeCharts();
        this.animateKPIs();
        this.populateTransactionsTable();
        this.hideLoading();
    }

    setupEventListeners() {
        // Menu toggle
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('active');
        });

        // Date range change
        document.getElementById('dateRange').addEventListener('change', (e) => {
            this.updateDashboard(e.target.value);
        });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshDashboard();
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });

        // Chart period buttons
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = e.target.getAttribute('data-period');
                this.updateChartPeriod(period, e.target);
            });
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchTransactions(e.target.value);
        });

        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.populateTransactionsTable();
            }
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            const totalPages = Math.ceil(this.transactions.length / this.itemsPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.populateTransactionsTable();
            }
        });
    }

    generateMockData() {
        // Generate mock transactions
        const customers = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson'];
        const products = ['Laptop Pro', 'Wireless Mouse', 'Keyboard', 'Monitor', 'Headphones'];
        const statuses = ['Completed', 'Pending', 'Failed'];

        this.transactions = [];
        for (let i = 0; i < 100; i++) {
            this.transactions.push({
                id: `TXN${String(i + 1).padStart(4, '0')}`,
                customer: customers[Math.floor(Math.random() * customers.length)],
                product: products[Math.floor(Math.random() * products.length)],
                amount: (Math.random() * 500 + 50).toFixed(2),
                status: statuses[Math.floor(Math.random() * statuses.length)],
                date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
            });
        }
    }

    initializeCharts() {
        this.createRevenueChart();
        this.createUserChart();
        this.createProductChart();
        this.createGeoChart();
    }

    createRevenueChart() {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        
        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Revenue',
                    data: [12000, 15000, 18000, 22000, 25000, 28000, 32000, 35000, 38000, 42000, 45000, 48000],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    createUserChart() {
        const ctx = document.getElementById('userChart').getContext('2d');
        
        this.charts.user = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Desktop', 'Mobile', 'Tablet'],
                datasets: [{
                    data: [45, 35, 20],
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createProductChart() {
        const ctx = document.getElementById('productChart').getContext('2d');
        
        this.charts.product = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Laptop Pro', 'Wireless Mouse', 'Keyboard', 'Monitor', 'Headphones'],
                datasets: [{
                    label: 'Sales',
                    data: [120, 85, 95, 75, 110],
                    backgroundColor: '#3b82f6',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    createGeoChart() {
        const ctx = document.getElementById('geoChart').getContext('2d');
        
        this.charts.geo = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['USA', 'Canada', 'UK', 'Germany', 'France'],
                datasets: [{
                    data: [35, 20, 15, 15, 15],
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    animateKPIs() {
        const kpiValues = document.querySelectorAll('.kpi-value');
        
        kpiValues.forEach(element => {
            const target = parseInt(element.getAttribute('data-target'));
            const isDecimal = element.getAttribute('data-target').includes('.');
            let current = 0;
            const increment = target / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (element.textContent.includes('$')) {
                    element.textContent = '$' + Math.floor(current).toLocaleString();
                } else if (isDecimal) {
                    element.textContent = current.toFixed(1);
                } else {
                    element.textContent = Math.floor(current).toLocaleString();
                }
            }, 50);
        });
    }

    populateTransactionsTable() {
        const tbody = document.querySelector('#transactionsTable tbody');
        tbody.innerHTML = '';
        
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageTransactions = this.transactions.slice(start, end);
        
        pageTransactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.id}</td>
                <td>${transaction.customer}</td>
                <td>${transaction.product}</td>
                <td>$${transaction.amount}</td>
                <td><span class="status-badge status-${transaction.status.toLowerCase()}">${transaction.status}</span></td>
                <td>${transaction.date}</td>
            `;
            tbody.appendChild(row);
        });
        
        // Update pagination info
        const totalPages = Math.ceil(this.transactions.length / this.itemsPerPage);
        document.querySelector('.page-info').textContent = `Page ${this.currentPage} of ${totalPages}`;
        document.querySelector('.table-info').textContent = 
            `Showing ${start + 1}-${Math.min(end, this.transactions.length)} of ${this.transactions.length} transactions`;
    }

    searchTransactions(query) {
        if (!query) {
            this.generateMockData();
        } else {
            this.transactions = this.transactions.filter(transaction =>
                transaction.customer.toLowerCase().includes(query.toLowerCase()) ||
                transaction.product.toLowerCase().includes(query.toLowerCase()) ||
                transaction.id.toLowerCase().includes(query.toLowerCase())
            );
        }
        
        this.currentPage = 1;
        this.populateTransactionsTable();
    }

    updateChartPeriod(period, button) {
        // Update active button
        document.querySelectorAll('.chart-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update chart data based on period
        let newData, newLabels;
        
        switch (period) {
            case 'daily':
                newLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                newData = [3200, 4100, 3800, 4500, 5200, 4800, 4200];
                break;
            case 'weekly':
                newLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                newData = [28000, 32000, 35000, 38000];
                break;
            case 'monthly':
                newLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                newData = [12000, 15000, 18000, 22000, 25000, 28000, 32000, 35000, 38000, 42000, 45000, 48000];
                break;
        }
        
        this.charts.revenue.data.labels = newLabels;
        this.charts.revenue.data.datasets[0].data = newData;
        this.charts.revenue.update();
    }

    updateDashboard(days) {
        this.showLoading();
        
        // Simulate API call delay
        setTimeout(() => {
            // Update KPI values based on date range
            const multiplier = days / 30;
            document.querySelectorAll('.kpi-value').forEach(element => {
                const baseTarget = parseInt(element.getAttribute('data-target'));
                const newTarget = Math.floor(baseTarget * multiplier);
                element.setAttribute('data-target', newTarget);
            });
            
            this.animateKPIs();
            this.hideLoading();
        }, 1000);
    }

    refreshDashboard() {
        this.showLoading();
        
        // Simulate refresh delay
        setTimeout(() => {
            this.generateMockData();
            this.populateTransactionsTable();
            this.animateKPIs();
            
            // Update charts with new data
            Object.values(this.charts).forEach(chart => {
                chart.data.datasets[0].data = chart.data.datasets[0].data.map(() => 
                    Math.floor(Math.random() * 50000) + 10000
                );
                chart.update();
            });
            
            this.hideLoading();
        }, 1500);
    }

    exportData() {
        const data = {
            kpis: {
                revenue: document.querySelector('[data-target="125000"]').textContent,
                users: document.querySelector('[data-target="15420"]').textContent,
                orders: document.querySelector('[data-target="2847"]').textContent,
                conversion: document.querySelector('[data-target="3.2"]').textContent
            },
            transactions: this.transactions
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    showLoading() {
        document.getElementById('loadingOverlay').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.add('hidden');
    }
}

// Add status badge styles
const style = document.createElement('style');
style.textContent = `
    .status-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .status-completed {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
    }
    
    .status-pending {
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
    }
    
    .status-failed {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
    }
`;
document.head.appendChild(style);

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    new DataDashboard();
    console.log('Analytics Pro dashboard initialized!');
});