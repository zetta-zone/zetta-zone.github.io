class SiteSlider extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div aria-label="Featured picks" class="mini-slider">
                <button aria-label="Previous" class="ms-nav ms-prev">‹</button>
                <button aria-label="Next" class="ms-nav ms-next">›</button>
                <div class="ms-viewport" style="height: 327px;">
                    <div class="ms-track" style="transform: translateX(0%); transition: transform 0.4s ease-in-out;">
                        
                        <!-- SLIDE 1: CoinRepublik -->
                        <article class="ms-slide">
                            <a aria-label="CoinRepublik — build your city, mine real gold" class="ms-banner-html msb-crep" data-btn="banner" data-site="slider_coinrepublik" data-track="click" href="https://www.coinrepublik.com/?i=990014925" rel="noopener" target="_blank">
                                <div class="msb-crep-glow"></div>
                                <div class="msb-left">
                                    <div class="msb-tag">⛏️ #1 Pick Right Now</div>
                                    <h2>Build Your City.<br>Mine <em>Real Gold.</em></h2>
                                    <p class="msb-sub">A real economic strategy game — build your city, run gold mines, complete tasks, and cash out actual 24-karat gold bars and crypto.</p>
                                    <div class="msb-pills">
                                        <div class="msb-pill">🥇 Win 24K Gold Bars</div>
                                        <div class="msb-pill">💰 $1,000+ in Prizes</div>
                                        <div class="msb-pill">🏗️ Free to Play</div>
                                    </div>
                                    <div class="msb-cta">Start Building →</div>
                                </div>
                                <div class="msb-right">
                                    <div class="msb-crep-icon">⛏️</div>
                                </div>
                            </a>
                        </article>

                        <!-- SLIDE 2: Honeygain -->
                        <article class="ms-slide">
                            <a aria-label="Honeygain — $3 signup bonus" class="ms-banner-html msb-honey" data-btn="banner" data-site="slider_honeygain" data-track="click" href="/honeygain" rel="noopener" target="_blank">
                                <div class="msb-hexbg"></div>
                                <div class="msb-left">
                                    <div class="msb-tag">🍯 Passive Income App</div>
                                    <h2>Get <em>$3 FREE</em><br>Just for Signing Up</h2>
                                    <p class="msb-sub">Install once &amp; earn <b>24/7 automatically</b> — share your unused internet bandwidth.</p>
                                    <div class="msb-pills">
                                        <div class="msb-pill">🎁 $3 Instant Bonus</div>
                                        <div class="msb-pill">💸 PayPal / Crypto</div>
                                        <div class="msb-pill">🔒 No effort needed</div>
                                    </div>
                                    <div class="msb-cta">Claim $3 Bonus Now →</div>
                                </div>
                                <div class="msb-right">
                                    <svg fill="none" height="90" style="animation:coinbounce 3s ease-in-out infinite;filter:drop-shadow(0 8px 20px rgba(212,175,55,0.6))" viewBox="0 0 100 100" width="90" xmlns="http://www.w3.org/2000/svg">
                                        <text fill="#3d2800" font-family="Arial Black,sans-serif" font-size="11" font-weight="900" text-anchor="middle" x="50" y="62" style="--darkreader-inline-fill: var(--darkreader-text-3d2800, #d5d1cc);">$3 FREE</text>
                                    </svg>
                                </div>
                            </a>
                        </article>

                        <!-- SLIDE 3: Freecash -->
                        <article class="ms-slide">
                            <a aria-label="Freecash — earn up to $250 per offer" class="ms-banner-html msb-free" data-btn="banner" data-site="slider_freecash" data-track="click" href="/freecash" rel="noopener" target="_blank">
                                <div class="msb-free-burst"></div>
                                <div class="msb-left">
                                    <div class="msb-tag">🔥 Real Cash, Zero Gimmicks</div>
                                    <h2>Earn Up To<em>$250</em></h2>
                                    <p class="msb-sub">Complete offers, try apps, take surveys — <b>paid per offer, every time.</b></p>
                                    <div class="msb-pills">
                                        <div class="msb-pill">💰 Up to $250/offer</div>
                                        <div class="msb-pill">⚡ Instant withdraw</div>
                                        <div class="msb-pill">🎮 Games &amp; Apps</div>
                                    </div>
                                    <div class="msb-cta">Claim Your Cash Now →</div>
                                </div>
                                <div class="msb-right">
                                    <div class="msb-free-bills">
                                        <div class="msb-free-bill">$250</div>
                                        <div class="msb-free-bill">$250</div>
                                        <div class="msb-free-bill">$250</div>
                                    </div>
                                </div>
                            </a>
                        </article>

                        <!-- SLIDE 4: LuckyWatch -->
                        <article class="ms-slide">
                            <a aria-label="LuckyWatch — $0.40 daily passive" class="ms-banner-html msb-lucky" data-btn="banner" data-site="slider_luckywatch" data-track="click" href="/luckywatch" rel="noopener" target="_blank">
                                <div class="msb-lucky-grid"></div>
                                <div class="msb-lucky-blob1"></div>
                                <div class="msb-lucky-blob2"></div>
                                <div class="msb-left">
                                    <div class="msb-tag">▶ Auto-Play Income</div>
                                    <h2>Watch Videos.<br><em>Get Paid.</em></h2>
                                    <div class="msb-lucky-amount">+$0.40 <span>earned every day</span></div>
                                    <div class="msb-pills">
                                        <div class="msb-pill">🤖 Fully Automated</div>
                                        <div class="msb-pill">💸 Daily Payouts</div>
                                        <div class="msb-pill">⏰ Works 24/7</div>
                                    </div>
                                    <div class="msb-cta">Start Earning →</div>
                                </div>
                                <div class="msb-right">
                                    <div class="msb-lucky-playzone">
                                        <div class="msb-lucky-ring"></div>
                                        <div class="msb-lucky-ring"></div>
                                        <div class="msb-lucky-ring"></div>
                                        <div class="msb-lucky-play"></div>
                                    </div>
                                </div>
                            </a>
                        </article>
<!-- SLIDE 5: Betfury -->
<article class="ms-slide">
<a aria-label="BetFury — crypto casino &amp; daily staking" class="ms-banner-html msb-bet" data-btn="banner" data-site="slider_betfury" data-track="click" href="https://betfury.com/?r=User7865756" rel="noopener" target="_blank">
<div class="msb-bet-stars"></div>
<div class="msb-bet-glow"></div>
<div class="msb-left">
<div class="msb-tag">🎰 Crypto Casino + Staking</div>
<h2>Play, Stake &amp;<span> Earn Daily</span></h2>
<p class="msb-sub">Stake BFG tokens &amp; earn <b>passive daily income</b> from the casino bankroll.</p>
<div class="msb-pills">
<div class="msb-pill">💎 Daily staking rewards</div>
<div class="msb-pill">🎰 100+ casino games</div>
<div class="msb-pill">🔥 Daily free claims</div>
</div>
<div class="msb-cta">Start Earning Now →</div>
</div>
<div class="msb-right">
<div class="msb-bet-icon">🎰</div>
</div>
</a>
</article>
<!-- SLIDE 6: Nuggmi -->
<article class="ms-slide">
<a aria-label="Nuggmi — earn crypto with tasks" class="ms-banner-html msb-nug" data-btn="banner" data-site="slider_nuggmi" data-track="click" href="https://nuggmi.com/ref/diksboy" rel="noopener" target="_blank">
<div class="msb-nug-glow"></div>
<div class="msb-left">
<div class="msb-tag">⛏️ Daily Task Rewards</div>
<h2>Complete Tasks,<span> Earn Crypto</span></h2>
<p class="msb-sub">Clean offerwall UX with steady daily rewards — <b>multiple offerwalls in one place.</b></p>
<div class="msb-pills">
<div class="msb-pill">⛏️ Daily task feed</div>
<div class="msb-pill">📱 Mobile friendly</div>
<div class="msb-pill">💰 Referral bonuses</div>
</div>
<div class="msb-cta">Start Earning Now →</div>
</div>
<div class="msb-right">
<div class="msb-nug-icon">⛏️</div>
</div>
</a>
</article>
<!-- SLIDE 7: CoinPayU -->
<article class="ms-slide">
<a aria-label="CoinPayU — PTC view ads earn crypto" class="ms-banner-html msb-cpu" data-btn="banner" data-site="slider_coinpayu" data-track="click" href="https://www.rewardjoy.com/?r=3kg247MFr7Gc" rel="noopener" target="_blank">
<div class="msb-cpu-glow"></div>
<div class="msb-left">
<div class="msb-tag">👁️ View Ads · Get Paid</div>
<h2>Watch Ads,<span> Earn Crypto</span></h2>
<p class="msb-sub">Earn by watching ads &amp; completing tasks — withdraw instantly via FaucetPay.</p>
<div class="msb-pills">
<div class="msb-pill">⚡ PTC + offerwalls</div>
<div class="msb-pill">💸 FaucetPay instant</div>
<div class="msb-pill">🔄 Daily tasks</div>
</div>
<div class="msb-cta">Start Earning Now →</div>
</div>
<div class="msb-right">
<div class="msb-cpu-icon">🦊</div>
</div>
</a>
</article>
<!-- SLIDE: CoinRepublik (repeat) -->
<article class="ms-slide">
<a aria-label="CoinRepublik — real 24K gold bar prizes" class="ms-banner-html msb-crep" data-btn="banner" data-site="slider_coinrepublik" data-track="click" href="https://www.coinrepublik.com/?i=990014925" rel="noopener" target="_blank">
<div class="msb-crep-glow"></div>
<div class="msb-left">
<div class="msb-tag">🏆 Real Prizes, Real Gold</div>
<h2>Every Mine You Build<br><em>Pays Off For Real.</em></h2>
<p class="msb-sub">Manage your economy, expand your gold mines, and compete for real 24-karat gold bars plus daily crypto payouts.</p>
<div class="msb-pills">
<div class="msb-pill">⛏️ Real Gold Mining</div>
<div class="msb-pill">🥇 24K Gold Bar Prizes</div>
<div class="msb-pill">💎 Crypto Payouts</div>
</div>
<div class="msb-cta">Join CoinRepublik →</div>
</div>
<div class="msb-right">
<div class="msb-crep-icon">🥇</div>
</div>
</a>
</article>
<!-- SLIDE 8: Cointiply -->
<article class="ms-slide">
<a aria-label="Cointiply — earn up to $100/day" class="ms-banner-html msb-coin" data-btn="banner" data-site="slider_cointiply" data-track="click" href="https://cointiply.mobi/v23GLn" rel="noopener" target="_blank">
<div class="msb-coin-glow"></div>
<div class="msb-left">
<div class="msb-tag">⚡ Faucet + Offers + Tasks</div>
<h2>Earn Up To<span> $100/Day</span></h2>
<p class="msb-sub">Claim every hour, stack offers &amp; surveys — <b>bonus multiplier grows your earnings automatically.</b></p>
<div class="msb-pills">
<div class="msb-pill">⏱️ Hourly faucet</div>
<div class="msb-pill">📈 Bonus multiplier</div>
<div class="msb-pill">💰 Instant crypto</div>
</div>
<div class="msb-cta">Start Stacking Now →</div>
</div>
<div class="msb-right">
<div class="msb-coin-icon">⚡</div>
</div>
</a>
</article>
<!-- SLIDE 9: MakeYouTask — $1000 contest -->
<article class="ms-slide">
<a aria-label="MakeYouTask — $1000 contest active" class="ms-banner-html msb-myt" data-btn="banner" data-site="slider_makeyoutask" data-track="click" href="https://makeyoutask.com/start/90028" rel="noopener" target="_blank">
<div class="msb-myt-glow"></div>
<div class="msb-left">
<div class="msb-myt-contest">🏆 $1000 REFERRAL CONTEST — ACTIVE NOW</div>
<h2>Complete Tasks,<span> Win $1000</span></h2>
<p class="msb-sub">Massive microtask marketplace with an active contest — earn real cash from microtasks.</p>
<div class="msb-pills">
<div class="msb-pill">🥇 $1000 prize pool</div>
<div class="msb-pill">🛠️ Microtasks daily</div>
<div class="msb-pill">💸 Crypto / PayPal</div>
</div>
<div class="msb-cta">Join &amp; Win Now →</div>
</div>
<div class="msb-right">
<div class="msb-myt-icon">🏆</div>
</div>
</a>
</article>
<!-- SLIDE 10: FaucetCrypto -->
<article class="ms-slide">
<a aria-label="FaucetCrypto — claim every 20 minutes" class="ms-banner-html msb-fc" data-btn="banner" data-site="slider_faucetcrypto" data-track="click" href="https://faucetcrypto.com/r/11065855" rel="noopener" target="_blank">
<div class="msb-fc-glow"></div>
<div class="msb-left">
<div class="msb-tag">🚀 Claim Every 20 Minutes</div>
<h2>Non-Stop<span> Crypto Drops</span></h2>
<p class="msb-sub">Claim every 20 minutes + offerwalls — compound your earnings daily with multipliers.</p>
<div class="msb-pills">
<div class="msb-pill">⏰ Every 20 min</div>
<div class="msb-pill">🎯 Offerwalls bonus</div>
<div class="msb-pill">💸 FaucetPay</div>
</div>
<div class="msb-cta">Claim Free Crypto →</div>
</div>
<div class="msb-right">
<div class="msb-fc-icon">🚀</div>
</div>
</a>
</article>
<!-- SLIDE 11: EarnBitMoon -->
<article class="ms-slide">
<a aria-label="EarnBitMoon — hourly faucet and PTC" class="ms-banner-html msb-ebm" data-btn="banner" data-site="slider_earnbitmoon" data-track="click" href="https://earnbitmoon.club/?ref=1278672" rel="noopener" target="_blank">
<div class="msb-ebm-stars"></div>
<div class="msb-ebm-moon"></div>
<div class="msb-left">
<div class="msb-tag">🌙 Faucet + PTC + Offers</div>
<h2>Earn 24/7 While<span> The Moon Rises</span></h2>
<p class="msb-sub">Faucet hourly + ads + offers — <b>stack micro-earnings day and night.</b></p>
<div class="msb-pills">
<div class="msb-pill">🌙 Hourly claim</div>
<div class="msb-pill">📢 PTC ads</div>
<div class="msb-pill">⚡ Fast cashout</div>
</div>
<div class="msb-cta">Claim Crypto Now →</div>
</div>
<div class="msb-right">
<div class="msb-ebm-icon">🌙</div>
</div>
</a>
</article>
<!-- SLIDE 12: LuckyWatch Contest Special -->
<article class="ms-slide">
<a aria-label="LuckyWatch — $1200 referral contest" class="ms-banner-html msb-lucky" data-btn="banner" data-site="slider_luckywatch" data-track="click" href="https://luckywatch.pro/u/ozehu" rel="noopener" target="_blank">
<div class="msb-lucky-grid"></div>
<div class="msb-lucky-blob1"></div>
<div class="msb-lucky-blob2"></div>
<div class="msb-left">
<div class="msb-tag">🏆 $1200 Referral Contest</div>
<h2>Watch Videos &amp;<em> Win $1200</em></h2>
<div class="msb-lucky-amount">+$0.40 <span>per day — automated</span></div>
<div class="msb-pills">
<div class="msb-pill">🏆 $1200 prize pool</div>
<div class="msb-pill">🤖 Fully automated</div>
<div class="msb-pill">💸 Daily payouts</div>
</div>
<div class="msb-cta">Join Contest Now →</div>
</div>
<div class="msb-right">
<div class="msb-lucky-playzone">
<div class="msb-lucky-ring"></div>
<div class="msb-lucky-ring"></div>
<div class="msb-lucky-ring"></div>
<div class="msb-lucky-play"></div>
</div>
</div>
</a>
</article>
<!-- SLIDE 13: MakeYouTask Duplicate as BetFury -->
<article class="ms-slide">
<a aria-label="BetFury — daily staking and casino rewards" class="ms-banner-html msb-bet" data-btn="banner" data-site="slider_betfury" data-track="click" href="https://betfury.com/?r=User7865756" rel="noopener" target="_blank">
<div class="msb-bet-stars"></div>
<div class="msb-bet-glow"></div>
<div class="msb-left">
<div class="msb-tag">🎰 Play · Stake · Earn Daily</div>
<h2>Earn Passive From<span> Casino Bankroll</span></h2>
<p class="msb-sub">Stake BFG tokens &amp; you get <b>daily dividends from the casino bankroll</b> — 100+ crypto games.</p>
<div class="msb-pills">
<div class="msb-pill">💎 Daily staking rewards</div>
<div class="msb-pill">🎰 100+ games</div>
<div class="msb-pill">🔥 Free daily claims</div>
</div>
<div class="msb-cta">Start Earning Daily →</div>
</div>
<div class="msb-right">
<div class="msb-bet-icon">🎰</div>
</div>
</a>
</article>


                    </div>
                </div>
                
                <!-- Точки пагинации (оставил 4 штуки под количество текущих слайдов) -->
                <div aria-label="Slider dots" class="ms-dots" role="tablist">
                    <button aria-label="Slide 1" class="ms-dot active"></button>
                    <button aria-label="Slide 2" class="ms-dot"></button>
                    <button aria-label="Slide 3" class="ms-dot"></button>
                    <button aria-label="Slide 4" class="ms-dot"></button>
					<button aria-label="Slide 5" class="ms-dot"></button>	
					<button aria-label="Slide 6" class="ms-dot"></button>
					<button aria-label="Slide 7" class="ms-dot"></button>
					<button aria-label="Slide 8" class="ms-dot"></button>
					<button aria-label="Slide 9" class="ms-dot"></button>
					<button aria-label="Slide 10" class="ms-dot"></button>
					<button aria-label="Slide 11" class="ms-dot"></button>
					<button aria-label="Slide 12" class="ms-dot"></button>
					<button aria-label="Slide 13" class="ms-dot"></button>
					
					
					
                </div>
            </div>
        `;

        this.initSlider();
    }

    initSlider() {
        const track = this.querySelector('.ms-track');
        const slides = this.querySelectorAll('.ms-slide');
        const dots = this.querySelectorAll('.ms-dot');
        const nextBtn = this.querySelector('.ms-next');
        const prevBtn = this.querySelector('.ms-prev');
        
        let currentIndex = 0;
        const totalSlides = slides.length;

        if (!track || totalSlides === 0 || !nextBtn || !prevBtn) return;

        const updateSlider = () => {
            // Перемещаем слайды
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Обновляем активную точку пагинации
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };

        // Клик на стрелку вперед
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        });

        // Клик на стрелку назад
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlider();
        });

        // Клик на точки пагинации
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                currentIndex = idx;
                updateSlider();
            });
        });
    }
}

customElements.define('main-slider', SiteSlider);
