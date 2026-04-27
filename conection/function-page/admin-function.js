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

    if (mobileToggle) mobileToggle.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);

    // --- Navigation ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const target = link.getAttribute('data-section');

            if (href && href.endsWith('.html')) {
                if (window.innerWidth <= 992) {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                }
                return;
            }

            e.preventDefault();
            if (window.innerWidth <= 992) toggleSidebar();

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            sections.forEach(s => s.classList.remove('active'));
            const targetSection = document.getElementById(target);
            if (targetSection) targetSection.classList.add('active');
            if (pageTitle) pageTitle.innerText = target.charAt(0).toUpperCase() + target.slice(1);
        });
    });

    // --- Set Active Nav Based on Current Page ---
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage && currentPage !== 'Admin_page.html' && currentPage !== '') {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    }

    // --- Dark Mode ---
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (darkModeToggle) {
            darkModeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            darkModeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        });
    }

    // --- Data Rendering ---
    const renderData = () => {
        const recentOrdersEl = document.getElementById('recentOrders');
        if (recentOrdersEl) {
            recentOrdersEl.innerHTML = [
                { id: '#8821', name: 'John Doe', status: 'delivered', total: '$42.00' },
                { id: '#8822', name: 'Jane Smith', status: 'pending', total: '$18.50' }
            ].map(o => `<tr><td>${o.id}</td><td>${o.name}</td><td><span class="status-badge ${o.status}">${o.status}</span></td><td>${o.total}</td></tr>`).join('');
        }
    };

    renderData();

    // ================================
    // MENU FORM & RENDERING
    // ================================
    const menuForm = document.getElementById('menuForm');
    const menuList = document.getElementById('menuList');
    const menuName = document.getElementById('menuName');
    const menuPrice = document.getElementById('menuPrice');
    const menuCategory = document.getElementById('menuCategory');
    const menuDescription = document.getElementById('menuDescription');
    const menuAvailable = document.getElementById('menuAvailable');
    const menuImage = document.getElementById('menuImage');
    const previewImg = document.getElementById('previewImg');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const uploadBtn = document.getElementById('uploadBtn');
    const removeImageBtn = document.getElementById('removeImageBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const menuSearch = document.getElementById('menuSearch');
    const imagePreview = document.getElementById('imagePreview');

    let menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    let currentImage = null;

    // --- Image Upload Handling ---
    const handleImageSelect = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            currentImage = e.target.result;
            if (previewImg) { previewImg.src = currentImage; previewImg.hidden = false; }
            if (uploadPlaceholder) uploadPlaceholder.hidden = true;
            if (imagePreview) imagePreview.classList.add('has-image');
            if (uploadBtn) uploadBtn.hidden = true;
            if (removeImageBtn) removeImageBtn.hidden = false;
        };
        reader.readAsDataURL(file);
    };

    if (uploadBtn) {
        uploadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (menuImage) menuImage.click();
        });
    }

    if (imagePreview) {
        imagePreview.addEventListener('click', () => {
            if (!currentImage && menuImage) menuImage.click();
        });

        imagePreview.addEventListener('dragover', (e) => {
            e.preventDefault();
            imagePreview.style.borderColor = 'var(--primary-color)';
        });

        imagePreview.addEventListener('dragleave', () => {
            if (!currentImage) imagePreview.style.borderColor = '';
        });

        imagePreview.addEventListener('drop', (e) => {
            e.preventDefault();
            imagePreview.style.borderColor = '';
            handleImageSelect(e.dataTransfer.files[0]);
        });
    }

    if (menuImage) {
        menuImage.addEventListener('change', (e) => handleImageSelect(e.target.files[0]));
    }

    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImage = null;
            if (previewImg) { previewImg.src = ''; previewImg.hidden = true; }
            if (uploadPlaceholder) uploadPlaceholder.hidden = false;
            if (imagePreview) imagePreview.classList.remove('has-image');
            if (uploadBtn) uploadBtn.hidden = false;
            removeImageBtn.hidden = true;
            if (menuImage) menuImage.value = '';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (menuForm) menuForm.reset();
            if (removeImageBtn && !removeImageBtn.hidden) removeImageBtn.click();
        });
    }

    // --- Category Badge Helper ---
    const getCategoryClass = (cat) => {
        const map = { 'burger': 'burger', 'pizza': 'pizza', 'drink': 'drink', 'dessert': 'dessert', 'salad': 'salad', 'main course': 'main' };
        return map[(cat || '').toLowerCase()] || '';
    };

    // --- Render Menu Table ---
    const renderMenu = (items = menuItems) => {
        if (!menuList) return;
        if (items.length === 0) {
            menuList.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 3rem; color: var(--text-muted);">
                        <i class="fas fa-utensils" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
                        No menu items yet. Add your first item above!
                    </td>
                </tr>`;
            return;
        }

        menuList.innerHTML = items.map((item, index) => {
            const imgHtml = item.image
                ? `<img src="${item.image}" alt="${item.name}" class="menu-item-img">`
                : `<div class="menu-item-img placeholder"><i class="fas fa-image"></i></div>`;
            const statusClass = item.available !== false ? 'available' : 'unavailable';
            const statusText = item.available !== false ? 'Available' : 'Unavailable';

            return `
                <tr>
                    <td>${imgHtml}</td>
                    <td>
                        <div class="menu-item-name">${item.name}</div>
                        ${item.description ? `<div class="menu-item-desc">${item.description}</div>` : ''}
                    </td>
                    <td><span class="category-badge ${getCategoryClass(item.category)}">${item.category}</span></td>
                    <td class="price-tag">Tsh ${parseFloat(item.price).toLocaleString()}</td>
                    <td><span class="status-dot ${statusClass}"></span>${statusText}</td>
                    <td class="actions-cell">
                        <button class="btn btn-sm btn-outline" onclick="editMenuItem(${index})" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteMenuItem(${index})" title="Delete"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
        }).join('');
    };

    // --- Search Filter ---
    if (menuSearch) {
        menuSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = menuItems.filter(item =>
                (item.name || '').toLowerCase().includes(query) ||
                (item.category || '').toLowerCase().includes(query)
            );
            renderMenu(filtered);
        });
    }

    // --- Form Submit ---
    if (menuForm) {
        menuForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newItem = {
                name: menuName ? menuName.value.trim() : '',
                price: menuPrice ? menuPrice.value : '',
                category: menuCategory ? menuCategory.value : '',
                description: menuDescription ? menuDescription.value.trim() : '',
                available: menuAvailable ? menuAvailable.checked : true,
                image: currentImage
            };
            if (!newItem.name || !newItem.price || !newItem.category) return;

            menuItems.push(newItem);
            localStorage.setItem('menuItems', JSON.stringify(menuItems));
            renderMenu();
            menuForm.reset();
            if (removeImageBtn && !removeImageBtn.hidden) removeImageBtn.click();
        });
    }

    // --- Global Actions ---
    window.deleteMenuItem = (index) => {
        if (confirm('Are you sure you want to delete this item?')) {
            menuItems.splice(index, 1);
            localStorage.setItem('menuItems', JSON.stringify(menuItems));
            renderMenu();
        }
    };

    window.editMenuItem = (index) => {
        const item = menuItems[index];
        if (!item) return;
        if (menuName) menuName.value = item.name;
        if (menuPrice) menuPrice.value = item.price;
        if (menuCategory) menuCategory.value = item.category;
        if (menuDescription) menuDescription.value = item.description || '';
        if (menuAvailable) menuAvailable.checked = item.available !== false;

        if (item.image) {
            currentImage = item.image;
            if (previewImg) { previewImg.src = currentImage; previewImg.hidden = false; }
            if (uploadPlaceholder) uploadPlaceholder.hidden = true;
            if (imagePreview) imagePreview.classList.add('has-image');
            if (uploadBtn) uploadBtn.hidden = true;
            if (removeImageBtn) removeImageBtn.hidden = false;
        }

        menuItems.splice(index, 1);
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
        renderMenu();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    renderMenu();
});
