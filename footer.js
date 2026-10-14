class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                <div class="footer-wrap">
                    <div class="footer-top">
                        <div class="footer-btns">
                            <!-- Все ссылки теперь ведут от корня сайта через слэш "/" для работы в любых подпапках -->
                            <a class="footer-btn" data-btn="top" data-site="footer" data-track="click" href="/index.html">Top</a>
                            <a class="footer-btn" data-btn="claim-multiply" data-site="footer" data-track="click" href="/claim-multiply/index.html">Welcome Universe</a>
                            <a class="footer-btn" data-btn="passive-income" data-site="footer" data-track="click" href="/passive-income/index.html">Passive Income</a>
                            <a class="footer-btn" data-btn="earning-apps" data-site="footer" data-track="click" href="/earning-apps/index.html">Earning Apps</a>
                            <a class="footer-btn" data-btn="more_ways_to_earn" data-site="footer" data-track="click" href="/more-ways-to-earn/index.html">Opportunities</a>
                            <a class="footer-btn" data-btn="play-earn" data-site="footer" data-track="click" href="/play-earn/index.html">Play &amp; Earn</a>
                            <a class="footer-btn" data-btn="contact" data-site="footer" data-track="click" href="/contact/index.html">Contact</a>
                        </div>
                    </div>
                    
                    <div class="footer-note">Earnings and payout amounts shown are estimates and may vary by country, device, time, and your activity. Always do your own research and play responsibly (18+ for gambling).</div>
                    <div class="footer-note">© 2026 <span style="color: var(--accent); font-weight: bold;">ZETTA</span> — All Rights Reserved.</div>
                </div>
            </footer>
        `;

        // Запуск всей интерактивной логики после того, как футер встал в HTML
        this.initSiteScripts();
    }

    initSiteScripts() {
        



        
        // 1. Анимация карточек при скролле (Stagger animation) с защитой от отсутствия элементов
        const cards = document.querySelectorAll('.ecard, .fcard');
        if (cards.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        e.target.style.animationPlayState = 'running';
                    }
                });
            }, { threshold: 0.1 });

            cards.forEach(el => {
                el.style.animationPlayState = 'paused';
                observer.observe(el);
            });
        }

        // 2. Подсветка активных ссылок
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // 3. Мини-слайдер с полной защитой от ошибок
        (function(){
            const slider = document.querySelector('.mini-slider');
            if(!slider) return;

            const track = slider.querySelector('.ms-track');
            const slides = Array.from(slider.querySelectorAll('.ms-slide'));
            const dots = Array.from(slider.querySelectorAll('.ms-dot'));
            const prev = slider.querySelector('.ms-prev');
            const next = slider.querySelector('.ms-next');
            const viewport = slider.querySelector('.ms-viewport');
            
            if(!track || slides.length === 0) return;

            let index = 0;
            let timer = null;

            function syncHeight(){
                if(!viewport) return;
                const h = slides[index] ? slides[index].offsetHeight : 0;
                if(h) viewport.style.height = h + 'px';
            }

            function go(i){
                index = (i + slides.length) % slides.length;
                track.style.transform = `translateX(${-index * 100}%)`;
                dots.forEach((d, di) => d.classList.toggle('is-active', di === index));
                syncHeight();
            }

            function start(){
                stop();
                timer = setInterval(() => go(index + 1), 4200);
            }
            function stop(){ 
                if(timer) clearInterval(timer); 
                timer = null; 
            }

            if(prev) prev.addEventListener('click', () => { go(index - 1); start(); });
            if(next) next.addEventListener('click', () => { go(index + 1); start(); });
            dots.forEach((d, di) => d.addEventListener('click', () => { go(di); start(); }));

            slider.addEventListener('mouseenter', stop);
            slider.addEventListener('mouseleave', start);

            // Swipe (mobile)
            let x0 = null;
            slider.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; stop(); }, {passive:true});
            slider.addEventListener('touchend', (e) => {
                if(x0 === null) return;
                const x1 = e.changedTouches[0].clientX;
                const dx = x1 - x0;
                if(Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
                x0 = null;
                start();
            }, {passive:true});

            go(0);
            window.addEventListener('resize', syncHeight);
            start();
        })();

        // 4. Мобильное меню (гамбургер)
        (function(){
            const btn = document.getElementById('navToggle');
            if(!btn) return;
            
            const links = document.querySelectorAll('.nav-links a');
            
                        btn.addEventListener('click', (e) => {
                e.stopPropagation();
                var links = document.querySelector('.nav-links');
                var body = document.body;
                body.classList.toggle('nav-open');
                if(body.classList.contains('nav-open')){
                    links.style.display = 'flex';
                } else {
                    links.style.display = 'none';
                }
                });   


            links.forEach(a => a.addEventListener('click', () => document.body.classList.remove('nav-open')));
            
            // Закрытие при тапе мимо меню
            document.addEventListener('click', (e) => {
                if(!document.body.classList.contains('nav-open')) return;
                const nav = document.querySelector('header');
                if(nav && !nav.contains(e.target)) document.body.classList.remove('nav-open');
            });
        })();

            // Скрыть меню на мобильных при загрузке
            (function(){
            function checkMobile(){
                var links = document.querySelector('.nav-links');
                if(!links) return;
                if(window.innerWidth <= 900){
                links.style.display = 'none';
                } else {
                links.style.display = '';
                }
            }
            window.addEventListener('resize', checkMobile);
            checkMobile();
            })();   


        // 5. Кнопка "Вверх" (Back to top)
        (function(){
            const btn = document.getElementById('backToTop');
            if(!btn) return;
            const onScroll = () => {
                if(window.scrollY > 400) btn.classList.add('is-visible');
                else btn.classList.remove('is-visible');
            };
            window.addEventListener('scroll', onScroll, {passive:true});
            onScroll();
            btn.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
        })();
    }
}

if (!customElements.get('main-footer')) {
    customElements.define('main-footer', SiteFooter);
}
