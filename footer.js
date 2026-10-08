class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                <div class="footer-wrap">
                    <div class="footer-top">
                        <div class="footer-btns">
                            <a class="footer-btn" data-btn="top" data-site="footer" data-track="click" href="index.html">Top</a>
                            <a class="footer-btn" data-btn="claim_&amp;_multiply" data-site="footer" data-track="click" href="index.html">Welcome Universe</a>
                            <a class="footer-btn" data-btn="passive_income" data-site="footer" data-track="click" href="passive-income.html">Passive Income</a>
                            <a class="footer-btn" data-btn="more_ways_to_earn" data-site="footer" data-track="click" href="opportunities.html">Opportunities</a>
                            <a class="footer-btn" data-btn="play_&amp;_earn" data-site="footer" data-track="click" href="play-earn.html">Play & Earn</a>
                        </div>
                    </div>
                    
                    <div class="footer-note">Earnings and payout amounts shown are estimates and may vary by country, device, time, and your activity. Always do your own research and play responsibly (18+ for gambling).</div>
                    <div class="footer-note">© 2026 <span style="color: var(--accent); font-weight: bold;">ZETTA</span> — All Rights Reserved.</div>
                </div>
            </footer>
        `;

        // Запуск всей твоей интерактивной логики после того, как футер встал в HTML
        this.initSiteScripts();
    }

    initSiteScripts() {
        // 1. Анимация карточек при скролле (Stagger animation)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.style.animationPlayState = 'running';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.ecard, .fcard').forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });

        // 2. Мини-слайдер (вверху справа)
        (function(){
            const slider = document.querySelector('.mini-slider');
            if(!slider) return;

            const track = slider.querySelector('.ms-track');
            const slides = Array.from(slider.querySelectorAll('.ms-slide'));
            const dots = Array.from(slider.querySelectorAll('.ms-dot'));
            const prev = slider.querySelector('.ms-prev');
            const next = slider.querySelector('.ms-next');
            const viewport = slider.querySelector('.ms-viewport');

            function syncHeight(){
                if(!viewport) return;
                const h = slides[index] ? slides[index].offsetHeight : 0;
                if(h) viewport.style.height = h + 'px';
            }

            let index = 0;
            let timer = null;

            function go(i){
                index = (i + slides.length) % slides.length;
                track.style.transform = `translateX(${-index * 100}%)`;
                dots.forEach((d,di)=>d.classList.toggle('is-active', di===index));
            }

            function start(){
                stop();
                timer = setInterval(()=>go(index+1), 4200);
            }
            function stop(){ if(timer) clearInterval(timer); timer = null; }

            if(prev) prev.addEventListener('click', ()=>{ go(index-1); start(); });
            if(next) next.addEventListener('click', ()=>{ go(index+1); start(); });
            dots.forEach((d,di)=> d.addEventListener('click', ()=>{ go(di); start(); }));

            slider.addEventListener('mouseenter', stop);
            slider.addEventListener('mouseleave', start);

            let x0=null;
            slider.addEventListener('touchstart', (e)=>{ x0=e.touches[0].clientX; stop(); }, {passive:true});
            slider.addEventListener('touchend', (e)=>{
                if(x0===null) return;
                const x1=e.changedTouches[0].clientX;
                const dx=x1-x0;
                if(Math.abs(dx)>40) go(index + (dx<0 ? 1 : -1));
                x0=null;
                start();
            }, {passive:true});

            go(0);
            syncHeight();
            window.addEventListener('resize', syncHeight);
            start();
        })();

        // 3. Мобильное меню (гамбургер)
        (function(){
            const btn = document.getElementById('navToggle');
            const links = document.querySelectorAll('.nav-links a');
            if(!btn) return;
            btn.addEventListener('click', ()=> document.body.classList.toggle('nav-open'));
            links.forEach(a=> a.addEventListener('click', ()=> document.body.classList.remove('nav-open')));
            
            document.addEventListener('click', (e)=>{
                if(!document.body.classList.contains('nav-open')) return;
                const nav = document.querySelector('header');
                if(nav && !nav.contains(e.target)) document.body.classList.remove('nav-open');
            });
        })();

        // 4. Кнопка "Вверх" (Back to top)
        (function(){
            const btn = document.getElementById('backToTop');
            if(!btn) return;
            const onScroll = () => {
                if(window.scrollY > 400) btn.classList.add('is-visible');
                else btn.classList.remove('is-visible');
            };
            window.addEventListener('scroll', onScroll, {passive:true});
            onScroll();
            btn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
        })();

               // 5. Автоматическая подгрузка логотипов брендов по доменам ссылок
        (function(){
            function getHost(href){
                try{
                    var u = new URL(href);
                    return (u.hostname || '').replace(/^www\./,'');
                }catch(e){ return ''; }
            }

            function firstOutboundLink(card){
                var selectors = [
                    "a[data-track='click'][data-btn='earn']",
                    "a[data-track='click'][data-btn='claim']",
                    "a[data-track='click'][data-btn='play']",
                    "a[data-track='click'][data-btn='wallet']",
                    "a[data-track='click'][data-btn='get']",
                    "a.btn-primary",
                    "a.btn"
                ];
                for (var i=0;i<selectors.length;i++){
                    var a = card.querySelector(selectors[i]);
                    if (a && a.getAttribute('href') && /^https?:/i.test(a.getAttribute('href'))) return a;
                }
                var links = card.querySelectorAll("a[href^='http']");
                return links.length ? links[0] : null; // Фикс: берем первый элемент из коллекции
            }

            function setLogo(iconEl, host){
                var img = iconEl.querySelector("img.brand-logo");
                if(!img) return;
                var providers = [
                    "https://clearbit.com" + host,
                    "https://google.com" + host + "&sz=128"
                ];
                var idx = 0;
                img.loading = "lazy";
                img.decoding = "async";
                img.referrerPolicy = "no-referrer";

                function tryNext(){
                    if(idx >= providers.length) return;
                    img.src = providers[idx++];
                }

                img.addEventListener("load", function(){
                    if (img.naturalWidth && img.naturalWidth >= 16) {
                        iconEl.classList.add("has-logo");
                    } else {
                        tryNext();
                    }
                });

                img.addEventListener("error", tryNext);
                tryNext();
            }

            // МАГИЯ: Запускаем поиск карточек только после полной загрузки страницы и DOM-дерева
                  // Улучшенный поиск домена: сначала из data-site, потом из ссылки
            function runAutoLogos() {
                var icons = document.querySelectorAll(".ecard-icon, .fcard-icon, [class*='icon']");
                icons.forEach(function(icon){
                    var card = icon.closest(".ecard, .fcard, .card, [class*='card']");
                    if(!card) return;
                    
                    var host = "";
                    
                    // 1. Проверяем, прописан ли домен прямо в карточке через data-site
                    if (card.hasAttribute('data-site')) {
                        host = card.getAttribute('data-site').replace(/^www\./,'');
                    } 
                    // 2. Если data-site нет, берем домен из первой внешней ссылки
                    else {
                        var a = firstOutboundLink(card);
                        if (a) {
                            host = getHost(a.getAttribute("href"));
                        }
                    }

                    if(!host) return;
                    setLogo(icon, host);
                });
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', runAutoLogos);
            } else {
                runAutoLogos();
            }
        })();
    }
}
customElements.define('main-footer', SiteFooter);
