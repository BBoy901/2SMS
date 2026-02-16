document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    if (navToggle && nav) {
        navToggle.addEventListener('click', () => nav.classList.toggle('active'));
    }

    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', handleQuoteSubmitDemo);
    }

    const btnEditRequest = document.getElementById('btn-edit-request');
    if (btnEditRequest) {
        btnEditRequest.addEventListener('click', function() {
            const formSuccess = document.getElementById('form-success');
            const form = document.getElementById('quote-form');
            if (formSuccess && form) {
                formSuccess.style.display = 'none';
                form.style.display = 'block';
                form.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    const productSelect = document.getElementById('product_needed');
    const productCustom = document.getElementById('product_custom');
    if (productSelect && productCustom) {
        productSelect.addEventListener('change', function() {
            productCustom.style.display = this.value === '' ? 'block' : 'none';
        });
        if (productSelect.value === '') productCustom.style.display = 'block';
    }

    const params = new URLSearchParams(window.location.search);
    const prefillProduct = params.get('product');
    if (prefillProduct && productSelect) {
        const opt = Array.from(productSelect.options).find(o => o.value === prefillProduct);
        if (opt) {
            productSelect.value = prefillProduct;
            productCustom.style.display = 'none';
        }
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const waToggle = document.getElementById('wa-float-toggle');
    const waWrap = document.getElementById('wa-float-wrap');
    if (waToggle && waWrap) {
        waToggle.addEventListener('click', function() {
            waWrap.classList.toggle('open');
            waToggle.setAttribute('aria-expanded', waWrap.classList.contains('open'));
        });
        document.addEventListener('click', function(e) {
            if (!waWrap.contains(e.target)) {
                waWrap.classList.remove('open');
                waToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('animate-in');
        });
    }, observerOptions);
    document.querySelectorAll('.category-card, .feature-card, .service-card, .product-card').forEach(el => observer.observe(el));

    initProductsFilter();
});

function handleQuoteSubmitDemo(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const errorSpans = form.querySelectorAll('.error-msg');
    errorSpans.forEach(s => { s.textContent = ''; s.style.display = 'none'; });

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();

    let valid = true;
    if (name.length < 2) {
        showError(form.name, 'Name must be at least 2 characters');
        valid = false;
    }
    if (phone.length < 9) {
        showError(form.phone, 'Please enter a valid phone number');
        valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError(form.email, 'Please enter a valid email');
        valid = false;
    }
    if (!valid) return;

    form.style.display = 'none';
    const successEl = document.getElementById('form-success');
    if (successEl) successEl.style.display = 'block';
}

function showError(input, msg) {
    const group = input.closest('.form-group');
    if (group) {
        let span = group.querySelector('.error-msg');
        if (!span) {
            span = document.createElement('span');
            span.className = 'error-msg';
            input.after(span);
        }
        span.textContent = msg;
        span.style.display = 'block';
    }
}

function initProductsFilter() {
    const grid = document.getElementById('products-grid');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('product-search');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const noResults = document.getElementById('no-results');

    if (!grid) return;

    const params = new URLSearchParams(window.location.search);
    const urlCategory = params.get('category') || '';
    if (urlCategory) {
        filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === urlCategory);
        });
    }

    function filterProducts() {
        const search = (searchInput ? searchInput.value : '').toLowerCase().trim();
        const activeBtn = document.querySelector('.filter-btn.active');
        const category = activeBtn ? activeBtn.dataset.category : '';

        let visible = 0;
        grid.querySelectorAll('.product-card').forEach(card => {
            const cardCategory = card.dataset.category || '';
            const cardName = (card.dataset.name || '').toLowerCase();
            const cardDesc = (card.dataset.desc || '').toLowerCase();

            const matchCategory = !category || cardCategory === category;
            const matchSearch = !search || cardName.includes(search) || cardDesc.includes(search);

            const show = matchCategory && matchSearch;
            card.style.display = show ? '' : 'none';
            if (show) visible++;
        });

        if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
    }

    if (searchForm) {
        searchForm.addEventListener('submit', e => { e.preventDefault(); filterProducts(); });
    }
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterProducts();
        });
    });

    filterProducts();
}
