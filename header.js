<<<<<<< Updated upstream
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
                        <a class="nav-link" href="/best/index.html">Best</a>
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
        
        if (path === '/' || path === '') {
            path = '/index.html';
        }

        const links = this.querySelectorAll('.nav-link');
        links.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (!linkPath) return;

            if (path === linkPath || path.endsWith(linkPath) || window.location.href.includes(linkPath)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    initToggleMenu() {
        const toggleBtn = this.querySelector('#navToggle');
        const nav = this.querySelector('header');
        const links = this.querySelectorAll('.nav-links a');
        if (!toggleBtn) return;

        const closeMenu = () => {
            document.body.classList.remove('nav-open');
            toggleBtn.textContent = '☰';
            toggleBtn.setAttribute('aria-label', 'Open menu');
            toggleBtn.setAttribute('aria-expanded', 'false');
        };

        const syncMenuState = () => {
            const isOpen = document.body.classList.contains('nav-open');
            toggleBtn.textContent = isOpen ? '✕' : '☰';
            toggleBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
            toggleBtn.setAttribute('aria-expanded', String(isOpen));
        };

        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            document.body.classList.toggle('nav-open');
            syncMenuState();
        });

        links.forEach(link => link.addEventListener('click', closeMenu));

        document.addEventListener('click', (e) => {
            if (!document.body.classList.contains('nav-open')) return;
            if (nav && !nav.contains(e.target)) closeMenu();
        });
    }
}

if (!customElements.get('main-header')) {
    customElements.define('main-header', SiteHeader);
}   
=======
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
    const links = this.querySelector('.nav-links');
    if (!toggleBtn || !links) return;

    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isHidden = links.style.display === 'none' || getComputedStyle(links).display === 'none';
        links.style.display = isHidden ? 'flex' : 'none';
        toggleBtn.textContent = isHidden ? '✕' : '☰';
    });

    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            if(window.innerWidth <= 900){
                links.style.display = 'none';
                toggleBtn.textContent = '☰';
            }
        });
    });

    document.addEventListener('click', (e) => {
        if(getComputedStyle(links).display === 'flex' && !e.target.closest('header')){
            links.style.display = 'none';
            toggleBtn.textContent = '☰';
        }
    });
}   

   
   

// Регистрируем компонент, только если он ещё не был зарегистрирован
if (!customElements.get('main-header')) {
    customElements.define('main-header', SiteHeader);
}
>>>>>>> Stashed changes
