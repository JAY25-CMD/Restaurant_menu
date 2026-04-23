document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('pageTitle');
    const darkModeToggle = document.getElementById('darkModeToggle');

    // --- Responsive Sidebar Toggle ---
    const toggleSidebar = () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    };

    mobileToggle.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);

    // --- Navigation ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-section');

            // Close sidebar on mobile
            if (window.innerWidth <= 992) toggleSidebar();

            // Update UI
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(target).classList.add('active');
            pageTitle.innerText = target.charAt(0).toUpperCase() + target.slice(1);
        });
    });

    // --- Dark Mode ---
    darkModeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
        darkModeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // --- Data Rendering ---
    const renderData = () => {
        document.getElementById('recentOrders').innerHTML = [
            { id: '#8821', name: 'John Doe', status: 'delivered', total: '$42.00' },
            { id: '#8822', name: 'Jane Smith', status: 'pending', total: '$18.50' }
        ].map(o => `<tr><td>${o.id}</td><td>${o.name}</td><td><span class="status-badge ${o.status}">${o.status}</span></td><td>${o.total}</td></tr>`).join('');
    };

    renderData();
});