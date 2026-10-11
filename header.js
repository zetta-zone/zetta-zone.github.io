class SiteHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header>
                <nav class="nav-inner">
                    <a class="logo" data-btn="logo" data-site="nav" data-track="click" href="/index.html">ZETA<span class="logo-sub"> - Zone</span></a>
                    <div class="nav-links">
                        <a class="nav-link" href="/index.html">Top</a>
                        <a class="nav-link" href="/claim-multiply/index.html">Claim &amp; Multiply</a>
                        <a class="nav-link" href="/passive-income/index.html">Passive Income</a>
                        <a class="nav-link" data-btn="earning_apps" data-site="nav" data-track="click" href="/earning-apps/index.html">Earning Apps</a>
                        <a class="nav-link" href="/play-earn/index.html">Play &amp; Earn</a>
                        <a class="nav-link" href="/more-ways-to-earn/index.html">More Ways to Earn</a>
                        <a class="nav-link" href="/contact/index.html">Contact</a>
                    </div>
                    <button aria-label="Open menu" class="nav-toggle" id="navToggle">☰</button>
                    <div class="lang-switch">
                        <a class="social-btn lang-btn active" data-btn="lang_en" data-site="nav" data-track="click" href="#">EN</a>
                    </div>
                </nav>
            </header>
        `;

        this.setActivePage();
        this.initToggleMenu();
    }

    setActivePage() {
        let path = window.location.pathname;
        
        // Корректная обработка корня сайта
        if (path === '/' || path === '') {
            path = '/index.html';
        }

        const links = this.querySelectorAll('.nav-link');
        links.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (!linkPath) return;

            // Проверяем точное совпадение или окончание пути (на случай локального запуска)
            if (path === linkPath || path.endsWith(linkPath) || window.location.href.includes(linkPath)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    initToggleMenu() {
        const toggleBtn = this.querySelector('#navToggle');
        if (!toggleBtn) return;

        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.toggle('nav-open');
            
            if (document.body.classList.contains('nav-open')) {
                toggleBtn.textContent = '✕';
            } else {
                toggleBtn.textContent = '☰';
            }
        });
    }
}

// Регистрируем компонент, только если он ещё не был зарегистрирован
if (!customElements.get('main-header')) {
    customElements.define('main-header', SiteHeader);
}
