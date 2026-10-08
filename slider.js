class MiniSlider extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <style>
                /* Стили слайдера из твоего style.css */
                .mini-slider {
                  position: relative; width: 100%; max-width: min(520px, 100%); margin-left: auto;
                  border-radius: 18px; padding: 18px 18px 14px;
                  background: linear-gradient(135deg, rgba(5, 25, 35, 0.78), rgba(8, 40, 60, 0.60));
                  border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 18px 60px rgba(0,0,0,0.38);
                  overflow: hidden; z-index: 1;
                }
                .ms-viewport { position: relative; overflow: hidden; border-radius: 14px; }
                .ms-track { display: flex; transition: transform 450ms cubic-bezier(.2,.9,.2,1); will-change: transform; }
                .ms-slide {
                  min-width: 100%; display: flex; align-items: center; gap: 14px; padding: 16px 14px;
                  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
                  border-radius: 14px; backdrop-filter: blur(10px);
                }
                .ms-icon {
                  width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center;
                  justify-content: center; font-size: 22px; border: 1px solid rgba(255,255,255,0.10);
                  box-shadow: 0 10px 24px rgba(0,0,0,0.22); background: var(--card); overflow: hidden;
                }
                .ms-icon img { width: 100%; height: 100%; object-fit: cover; }
                .ms-copy { flex: 1; min-width: 0; }
                .ms-title { font-family: 'Cabinet Grotesk', sans-serif; font-weight: 800; letter-spacing: -0.4px; color: var(--text); }
                .ms-sub { font-size: 11px; color: var(--muted); margin-top: 2px; }
                .ms-link { display: inline-flex; gap: 6px; align-items: center; margin-top: 8px; font-size: 12px; color: var(--accent); text-decoration: none; font-weight: 700; }
                .ms-link:hover { text-decoration: underline; }
                .ms-nav {
                  position: absolute; top: 50%; transform: translateY(-60%); width: 34px; height: 34px;
                  border-radius: 12px; border: 1px solid rgba(255,255,255,0.10); background: rgba(0,0,0,0.22);
                  color: rgba(255,255,255,0.85); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 3; user-select: none;
                }
                .ms-prev { left: 12px; } .ms-next { right: 12px; }
                .ms-nav:hover { background: rgba(0,0,0,0.42); color: var(--accent); }
            </style>

            <div class="mini-slider">
                <div class="ms-viewport">
                    <div class="ms-track" id="sliderTrack">
                        <!-- Слайды сгенерируются автоматически скриптом ниже -->
                    </div>
                </div>
                <div class="ms-nav ms-prev">←</div>
                <div class="ms-nav ms-next">→</div>
            </div>
        `;

        this.buildSlides();
    }

    buildSlides() {
        // 🔥 ТВОЙ СПИСОК ПРОЕКТОВ ДЛЯ СЛАЙДЕРА (Просто меняй названия и ссылки здесь!)
        const featuredProjects = [
            { name: "Bybit Exchange", path: "/bybit", desc: "Top crypto exchange. Claim your welcome bonuses!", domain: "bybit.com" },
            { name: "Freecash", path: "/freecrypto", desc: "Earn up to \$250 per task. Instant crypto withdrawals.", domain: "freecash.com" },
            { name: "Rollercoin", path: "/rollercoin", desc: "Build your virtual mining empire and earn real BTC.", domain: "rollercoin.com" },
            { name: "Grass Network", path: "/grass", desc: "Sell your unused internet bandwidth completely passively.", domain: "getgrass.io" }
        ];

        const track = this.querySelector('#sliderTrack');
        let slidesHtml = '';

        featuredProjects.forEach(p => {
            slidesHtml += `
                <div class="ms-slide">
                    <div class="ms-icon">
                        <img src="https://clearbit.com{p.domain}" onerror="this.src='https://google.com{p.domain}&sz=128'" alt="${p.name}">
                    </div>
                    <div class="ms-copy">
                        <div class="ms-title">${p.name}</div>
                        <div class="ms-sub">${p.desc}</div>
                        <a href="${p.path}" class="ms-link">START EARNING NOW →</a>
                    </div>
                </div>
            `;
        });

        track.innerHTML = slidesHtml;

        // Запуск логики переключения слайдов (перенесена из твоего старого футера)
        this.initSliderLogic();
    }

    initSliderLogic() {
        const track = this.querySelector('.ms-track');
        const slides = Array.from(this.querySelectorAll('.ms-slide'));
        const prev = this.querySelector('.ms-prev');
        const next = this.querySelector('.ms-next');
        const viewport = this.querySelector('.ms-viewport');
        
        if (!track || slides.length === 0) return;

        let index = 0;
        let timer = null;

        function syncHeight() {
            if (!viewport || !slides[index]) return;
            viewport.style.height = slides[index].offsetHeight + 'px';
        }

        const go = (i) => {
            index = (i + slides.length) % slides.length;
            track.style.transform = `translateX(${-index * 100}%)`;
            syncHeight();
        };

        const start = () => { stop(); timer = setInterval(() => go(index + 1), 4200); };
        const stop = () => { if (timer) clearInterval(timer); timer = null; };

        prev.addEventListener('click', () => { go(index - 1); start(); });
        next.addEventListener('click', () => { go(index + 1); start(); });

        this.addEventListener('mouseenter', stop);
        this.addEventListener('mouseleave', start);

        // Mobile swipe
        let x0 = null;
        this.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; stop(); }, { passive: true });
        this.addEventListener('touchend', (e) => {
            if (x0 === null) return;
            const dx = e.changedTouches[0].clientX - x0;
            if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
            x0 = null;
            start();
        }, { passive: true });

        // Инициализация стартового состояния
        setTimeout(() => { go(0); syncHeight(); }, 100);
        window.addEventListener('resize', syncHeight);
        start();
    }
}
customElements.define('crypto-slider', MiniSlider);
