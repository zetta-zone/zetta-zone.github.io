// Catalog data, local preferences, and shared helpers.
let data=window.CATALOG_DATA;
      const $=s=>document.querySelector(s);
      function readStore(key,fallback){try{const value=JSON.parse(localStorage.getItem(key));return value??fallback}catch{return fallback}}
      function writeStore(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
      let cat="Все",onlySaved=false,chosen=new Set(),saved=new Set(Array.isArray(readStore("zz2saved",[]))?readStore("zz2saved",[]):[]),ratings=readStore("zz2ratings",{});
      function esc(x){return String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}function toast(t){$("#toast").textContent=t;$("#toast").classList.add("show");setTimeout(()=>$("#toast").classList.remove("show"),2200)}
      function all(){return data.map(p=>({...p}))}
      function riskBadge(p){const labels={low:["Риск: низкий","green"],medium:["Риск: средний","yellow"],high:["Риск: высокий","red"]};const [label,color]=labels[p.riskLevel]||["Риск: не оценён",""];return `<span class="tag ${color}">${label}</span>`}
      const EDITORIAL_CRITERIA = [
        {key:"design",name:"Дизайн и интерфейс",desc:"Оформление, читаемость, структура и визуальное качество."},
        {key:"usability",name:"Удобство использования",desc:"Регистрация, навигация, понятность и простота действий."},
        {key:"earningMethods",name:"Возможности заработка",desc:"Разнообразие способов заработка и возможность работать без рефералов."},
        {key:"earningDifficulty",name:"Сложность заработка",desc:"Время, усилия, регулярные действия и сложность достижения вывода."},
        {key:"withdrawal",name:"Пополнение и вывод средств",desc:"Минимум вывода, комиссии, скорость, способы и проверенный опыт выплат."},
        {key:"accountSecurity",name:"Безопасность аккаунта",desc:"Пароль, подтверждение email, 2FA, защита входа и восстановление доступа."},
        {key:"profitability",name:"Доходность и окупаемость",desc:"Фактический доход, расходы, вложения и реалистичность окупаемости."},
        {key:"riskReliability",name:"Риски и надёжность",desc:"Прозрачность правил, история работы, обязательства и риск потери средств."},
        {key:"accessibility",name:"Доступность и совместимость",desc:"Мобильная версия, приложения, языки и ограничения по странам."},
        {key:"engagement",name:"Интерес и вовлечённость",desc:"Насколько интересно проводить время, разнообразие и отсутствие рутины."}
      ];
      function editorialScore(p, key="overall") {
        const ratings = p.editorialRatings || {};
        const values = EDITORIAL_CRITERIA.map(c => Number(ratings[c.key])).filter(n => Number.isFinite(n) && n >= 1 && n <= 5);
        if (key !== "overall") { const n = Number(ratings[key]); return Number.isFinite(n) && n >= 1 && n <= 5 ? n : null; }
        return values.length >= 6 ? values.reduce((a,b)=>a+b,0)/values.length : null;
      }
      function starsText(score) { return score == null ? "Не проверено" : `★ ${Number(score).toFixed(1)}/5`; }
      function editorialMarkup(p) {
        const overall = editorialScore(p);
        const checked = p.ratingCheckedAt ? ` · Проверено: ${esc(p.ratingCheckedAt)}` : "";
        const rows = EDITORIAL_CRITERIA.map(c => {
          const score = editorialScore(p,c.key);
          const comment = (p.editorialComments || {})[c.key];
          return `<div class="editorial-row"><div class="editorial-row-head"><b>${c.name}</b><span class="editorial-score ${score == null ? "is-empty" : ""}">${score == null ? "Не проверено" : "★".repeat(score)+"☆".repeat(5-score)+` <em>${score}/5</em>`}</span></div><p class="editorial-criterion-desc">Что оценивается: ${esc(c.desc)}</p>${comment ? `<p class="editorial-comment"><b>Комментарий автора:</b> ${esc(comment)}</p>` : `<p class="editorial-comment is-empty">Комментарий автора пока не добавлен.</p>`}</div>`;
        }).join("");
        return `<details class="editorial-details"><summary><span>Оценка ZETTA-ZONE</span><strong>${overall == null ? "В процессе проверки" : `★ ${overall.toFixed(1)}/5`}</strong><small>10 критериев${checked}</small></summary><div class="editorial-body"><p class="editorial-explain">Оценка автора и комментарии. Пустые оценки не учитываются в общем балле.</p>${rows}</div></details>`;
      }

      // Shared Supabase community ratings (one vote per browser identity and project).
      const communityRatings = new Map();
      let myVoterId = readStore("zz_community_voter_id", "");
      if (!myVoterId) {
        myVoterId = (window.crypto && crypto.randomUUID)
          ? crypto.randomUUID()
          : "v-" + Date.now().toString(36) + Math.random().toString(36).slice(2);
        writeStore("zz_community_voter_id", myVoterId);
      }
      function supabaseHeaders(extra = {}) {
        return { apikey: window.ZETTA_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${window.ZETTA_SUPABASE_PUBLISHABLE_KEY}`,
          ...extra };
      }
      async function loadCommunityRatings() {
        if (!window.ZETTA_SUPABASE_URL || !window.ZETTA_SUPABASE_PUBLISHABLE_KEY) return;
        try {
          const response = await fetch(`${window.ZETTA_SUPABASE_URL}/rest/v1/project_ratings?select=project_id,voter_id,score`, {headers: supabaseHeaders()});
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const rows = await response.json();
          communityRatings.clear();
          for (const row of rows) {
            const current = communityRatings.get(row.project_id) || {sum: 0, count: 0, mine: 0};
            current.sum += Number(row.score) || 0; current.count++;
            if (row.voter_id === myVoterId) current.mine = Number(row.score) || 0;
            communityRatings.set(row.project_id, current);
          }
          render();
        } catch (error) { console.warn("Не удалось загрузить оценки сообщества:", error); }
      }
      async function submitCommunityRating(projectId, score, button) {
        if (!window.ZETTA_SUPABASE_URL || !window.ZETTA_SUPABASE_PUBLISHABLE_KEY) { toast("Рейтинг пока не настроен"); return; }
        const current = communityRatings.get(projectId);
        if (current && current.mine) { toast("Ты уже оценил эту карточку с этого браузера"); return; }
        if (button) button.disabled = true;
        try {
          const response = await fetch(`${window.ZETTA_SUPABASE_URL}/rest/v1/project_ratings`, {
            method: "POST", headers: supabaseHeaders({"Content-Type":"application/json", Prefer:"return=minimal"}),
            body: JSON.stringify({project_id: String(projectId), voter_id: myVoterId, score})
          });
          if (!response.ok) {
            if (response.status === 409) throw new Error("Для этой карточки уже есть голос с этого браузера.");
            throw new Error(`Supabase ответил ${response.status}. Проверь политики доступа.`);
          }
          toast("Спасибо! Твоя оценка учтена");
          await loadCommunityRatings();
        } catch (error) { toast(error.message || "Не удалось отправить оценку"); }
        finally { if (button && button.isConnected) button.disabled = false; }
      }
      function communityRatingMarkup(p) {
        const r = communityRatings.get(String(p.id)) || {sum:0,count:0,mine:0};
        const avg = r.count ? (r.sum / r.count).toFixed(1) : "—";
        const stars = [1,2,3,4,5].map(n => `<button type="button" class="community-star ${r.mine >= n ? "selected" : ""}" data-community-rate="${n}" data-project-id="${esc(p.id)}" aria-label="Оценить на ${n} из 5" title="${n} из 5" ${r.mine ? "disabled" : ""}>★</button>`).join("");
        return `<div class="community-rating"><div class="community-rating-summary"><strong>🏆 Приз зрительских симпатий · ★ ${avg}</strong><span>${r.count} ${r.count===1?"голос":r.count>=2&&r.count<=4?"голоса":"голосов"}</span></div><div class="community-rating-vote"><span>${r.mine ? "Твоя оценка:" : "Оцени проект:"}</span>${stars}</div></div>`;
      }




      // Resolve community names, aliases, icons, and links for each card.
      function communityBadge(name, p) {
        const key = String(name || "").trim();
        const normalized = key.toLowerCase().replace(/[^a-z]/g, "");

        const icons = {
          x: {
            cls: "community-x",
            svg: '<path d="M5 4h4l10 16h-4L5 4zm0 16L19 4h-3L5 20z" fill="currentColor"/>'
          },
          twitter: {
            cls: "community-x",
            svg: '<path d="M5 4h4l10 16h-4L5 4zm0 16L19 4h-3L5 20z" fill="currentColor"/>'
          },
          discord: {
            cls: "community-discord",
            svg: '<path d="M6 7Q12 3 18 7l2 10q-4 4-8 2-4 2-8-2L6 7zm3 5v3m6-3v3" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"/>'
          },
          youtube: {
            cls: "community-youtube",
            svg: '<path d="M5 8Q12 5 19 8v8q-7 3-14 0z" fill="currentColor"/><path d="m10 10 5 3-5 3z" fill="#fff"/>'
          },
          telegram: {
            cls: "community-telegram",
            svg: '<path d="M4 11 20 5l-4 15-4-5-4-2 8-6-10 5z" fill="currentColor"/>'
          },
      	telegramBot: {
      		  cls: "community-telegram-bot",
      		  svg: '<path d="M12 3a2 2 0 0 0-2 2v1H7a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-3V5a2 2 0 0 0-2-2zm-4 8h2v2H8zm6 0h2v2h-2zm-5 4h6v2H9z" fill="currentColor"/>'
      		},
        };

       const aliases = {
        x: ["X", "Twitter", "x"],
        twitter: ["Twitter", "X", "twitter"],
        discord: ["Discord", "discord"],
        youtube: ["YouTube", "Youtube", "youtube"],
        telegram: ["Telegram", "telegram"],
        "telegram-бот": ["Telegram-бот", "Телеграм-бот", "Telegram bot"]
      };

        const links = p.communityLinks || {};
        const possibleKeys = aliases[normalized] || [key];

        let url = "";
        for (const linkKey of possibleKeys) {
          if (links[linkKey]) {
            url = links[linkKey];
            break;
          }
        }

        const icon = icons[normalized];

        if (!icon) {
          return /^https?:\/\//i.test(url)
            ? `<a class="community-chip" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(key)} ↗</a>`
            : "";
        }

        const content =
          `<svg viewBox="0 0 24 24" aria-hidden="true">${icon.svg}</svg>`;

        if (/^https?:\/\//i.test(url)) {
          return `<a class="community-pixel ${icon.cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(key)}" title="${esc(key)}">${content}</a>`;
        }

        return `<span class="community-pixel ${icon.cls}" title="${esc(key)} — ссылка пока не добавлена" aria-label="${esc(key)}">${content}</span>`;
      }

function platformBadges(p) {
  const platforms = Array.isArray(p.platforms) ? p.platforms : [p.platforms || p.platform || ""];
const available = new Set(platforms.map(x => String(x).toLowerCase()));
  const items = [
    ["web", "🌐", available.has("web") || available.has("веб")],
    ["ios", "iOS", available.has("ios")],
    ["android", "🤖", available.has("android")]
  ];

  return `<div class="platform-badges">${items.map(([name, icon, active]) =>
    `<span class="platform-badge ${active ? "active" : "inactive"}"
      title="${name}${active ? " доступен" : " недоступен"}">${icon}</span>`
  ).join("")}</div>`;
}


      	// Filter, sort, and render the catalog cards.
function render(){let q=$("#search").value.toLowerCase(),sort=$("#sort").value,st=$("#status").value,ad=$("#adFilter").value;
                   
let arr = all().filter(p => {
  const categoryMatch =
    cat === "Все" ||
    (cat === "FaucetPay" ? p.faucetpay === "Да" : p.cat === cat);

  const searchMatch =
    !q ||
    (p.n + " " + p.d + " " + p.cat + " " + p.sub + " " + p.faucetpay)
      .toLowerCase()
      .includes(q);

  const statusMatch =
    st === "all" || (st === "verified" ? p.verified : !p.verified);

  const savedMatch = !onlySaved || saved.has(p.id);

  const adMatch =
    ad === "all" ||
    (ad === "unknown"
      ? !["low", "medium", "high"].includes(p.adLevel)
      : p.adLevel === ad);

  return categoryMatch && searchMatch && statusMatch && savedMatch && adMatch;
});

                  
                  const missingLast = (a,b,scoreFn) => { const av=scoreFn(a),bv=scoreFn(b); if(av==null&&bv==null)return 0; if(av==null)return 1; if(bv==null)return -1; return bv-av; };
                  if(sort==="rating")arr.sort((a,b)=>missingLast(a,b,p=>Number(p.r)>0?Number(p.r):null));
                  if(sort==="name")arr.sort((a,b)=>a.n.localeCompare(b.n));
                  if(sort==="reviews")arr.sort((a,b)=>(Number(b.reviews)||0)-(Number(a.reviews)||0));
                  if(sort==="community")arr.sort((a,b)=>missingLast(a,b,p=>{const r=communityRatings.get(String(p.id));return r&&r.count?r.sum/r.count:null}));
                  if(sort.startsWith("editorial:")){const key=sort.split(":")[1];arr.sort((a,b)=>missingLast(a,b,p=>editorialScore(p,key)));}
                  $("#count").textContent=arr.length;$("#grid").innerHTML=arr.length?arr.map(p=>`
      <article class="card" style="--card-accent:${esc(p.brandAccent||"#8b7cff")};--card-wash:${esc(p.brandTint||"#171d2e")}">
      <div class="top">
      <div class="logo ${p.tone}">${p.logoUrl?`<img src="${esc(p.logoUrl)}" alt="${esc(p.n)}" loading="lazy">`:`<span class="rc-mark" aria-label="${esc(p.n)}">${esc(p.s||p.n.slice(0,1))}</span>`}</div>
      <div>
      <div class="name">${p.n}</div>
      <div class="subtitle">${p.sub}</div>
      ${platformBadges(p)}
      </div><button class="fav" data-fav="${p.id}" aria-label="Избранное">${saved.has(p.id)?"♥":"♡"}</button>
      </div>
      
      
      <div class="tags">
        <span class="tag">${p.cat}</span>
        <span class="tag ${p.verified?"green":"red"}">${p.verified?"✓ Выплаты проверены":"! Выплаты не проверены"}</span>
        ${riskBadge(p)}
        ${(() => {
          const ad = p.adLevel || "unknown";
          const labels = {
            low: ["🟢 Реклама не мешает", "green"],
            medium: ["🟡 Много рекламы", "yellow"],
            high: ["🔴 Агрессивная реклама", "red"],
            unknown: ["❔ Реклама не проверена", ""]
          };
          const item = labels[ad] || labels.unknown;
          return `<span class="tag ${item[1]}">${item[0]}</span>`;
        })()}
      </div>

      <p class="desc">${p.d}</p>
      <div class="card-rating">
      <div class="card-rating-info">
      <span class="stars">★</span>${p.r>0?`<b class="rating">${p.r.toFixed(1)}</b>`:`<span class="mut">—</span>`}<span class="rating-count">(${p.ratingSource||((Number(p.reviews)||0)+" оценок")})</span>
      </div>
      </div>
      ${communityRatingMarkup(p)}
      ${editorialMarkup(p)}

      <div class="metrics">

      		  <div class="metric">
      			<span class="metric-icon" aria-hidden="true">⏱️</span>
      			<div class="metric-copy"><b>Раз в час</b><span>Кран</span></div>
      		  </div>

        <div class="metric">
      					  <span class="metric-icon" style="width:25px;height:25px;overflow:hidden;flex:0 0 25px">

      				<img class="metric-token-icon" width="23" height="23"
        style="width:23px!important;height:23px!important;max-width:23px;max-height:23px;object-fit:contain;display:block"
      						   src="${p.id === 'rollercoin' ? './icons/rlt.svg' : 'https://miningblocks.club/pageAssets/img/criptos/block.png'}"
      						   alt="${p.id === 'rollercoin' ? 'RLT' : 'Blocks'}">
      					</span>
      			<div class="metric-copy">

      				  <b>${p.inGameCurrency || "—"}</b><span>Своя валюта</span>
      			</div>

       </div>

      		  <div class="metric">
      			<span class="metric-icon" aria-hidden="true">🎁</span>
      			<div class="metric-copy"><b>Возможности</b><span>Бонусы · крафт · пулы</span>
      			</div>
      		  </div>
      </div>

        <label class="comparecheck"><input type="checkbox" data-pick="${p.id}" ${chosen.has(p.id)?"checked":""}> Добавить к сравнению</label>
        <div class="cardfoot">
        <button class="btn" data-detail="${p.id}">Подробнее</button>${(p.registrationUrl||p.referralUrl)?`<a class="btn primary referral-cta" href="${esc(p.registrationUrl||p.referralUrl)}" target="_blank" rel="noopener">${esc(p.referralCta||"Перейти к регистрации")}</a>
        `:`<button class="btn primary referral-cta" type="button" disabled title="Ссылка пока не добавлена">${esc(p.referralCta||"Ссылка пока не добавлена")}</button>`}</div>
        </article>`).join(""):`<div class="empty">Ничего не найдено — попробуй изменить фильтры.</div>`;$("#savedN").textContent=saved.size;updateCompare()}
   
// Keep comparison selection and its sticky toolbar in sync.
      function updateCompare(){$("#compN").textContent=chosen.size+"/3";$("#compNames").textContent=[...chosen].map(id=>data.find(p=>p.id===id)?.n).join(" · ")||"Выбери 2–3 проекта";$("#comparebar").classList.toggle("show",chosen.size>0);$("#compareBtn").disabled=chosen.size<2}
      // Modal lifecycle and detail-card rendering.
      function openModal(s){$("#modal").innerHTML=s;$("#backdrop").classList.add("open")}function close(){$("#backdrop").classList.remove("open")}
      function specialFeatureIcon(title){const t=String(title||"").toLowerCase();if(/ежеднев|лояльност|частот|награ|вход/.test(t))return {icon:"⏱️",color:"#48c8ed"};if(/регистрац|реферал|стартов|бонус/.test(t))return {icon:"🎁",color:"#f6c85f"};if(/токен|короб|задан/.test(t))return {icon:"📦",color:"#ff8b67"};if(/майнер|мощност|энерг/.test(t))return {icon:"⚡",color:"#f7d35b"};if(/валют|blocks|rlt|предмет/.test(t))return {icon:"🪙",color:"#b88bff"};if(/подар/.test(t))return {icon:"🎉",color:"#f278ae"};if(/multi|мульти/.test(t))return {icon:"⛏️",color:"#4bd5a3"};if(/крафт|merge|маркет/.test(t))return {icon:"🧰",color:"#9b8cff"};return {icon:"✨",color:"#8b7cff"}}
      
      function details(id){
       let p=all().find(x=>x.id===id);if(!p)return;
       const text=v=>v?esc(v):'<span class="profile-unknown">Не указано</span>';
    
        const tags=a=>Array.isArray(a)&&a.length?`
       <div class="profile-tags">${a.map(x=>`<span class="profile-tag">${esc(x)}</span>`).join("")}</div>`:'<p class="profile-unknown">Не указано</p>';

const paymentStatusRow = (name, supported) =>
  `<div class="profile-fact">
    <b>${name}</b>
    <span class="support-badge ${supported ? "is-supported" : "is-unsupported"}">
      ${supported ? "✓ Поддерживается" : "✕ Не поддерживается"}
    </span>
  </div>`;

const paymentLink = (name, url) =>
    /^https?:\/\//i.test(url || "")
    ? `<a class="referral-link" href="${esc(url)}" target="_blank" rel="noopener">${name} ↗</a>`
    : name;

const withdrawalRow = `<div class="profile-fact">
  <b>Способ вывода</b>
  <span>${[
    p.faucetpaySupported ? paymentLink("FaucetPay", p.faucetpayReferralUrl) : "",
    p.directWalletSupported ? paymentLink("Direct Wallet", p.directWalletReferralUrl) : "",
    p.withdrawalMethods ? esc(p.withdrawalMethods) : ""
  ].filter(Boolean).join(" · ") || "Не указано"}</span>
</div>`;

const paymentRows =
  paymentStatusRow("FaucetPay", p.faucetpaySupported) +
  paymentStatusRow("Direct Wallet", p.directWalletSupported) +
  withdrawalRow;
        
      const coinIcons = (a, p) => {
        if (!Array.isArray(a) || !a.length) {
          return `<p class="profile-unknown">Не указано</p>`;
        }

        if (p.id === "rollercoin") {
          const icons = {
            BTC: "btc", ETH: "eth", DOGE: "doge", BNB: "bnb",
            POL: "matic", SOL: "sol", TRX: "trx", XRP: "xrp",
            LTC: "ltc", ALGO: "algo", BUSD: "busd", TON: "ton",
            USDT: "usdt", wFLOKI: "floki", wPEPE: "pepe", wSHIB: "shib"
          };

          return `<div class="coin-icons rollercoin-coins">${a.map(x => {
            const slug = icons[x];
            return `<span class="rc-coin" title="${esc(x)}">${
              slug
                ? `<img

      		  src="${x === 'wFLOKI'
        ? 'https://rollercoin.com/static/img/wallet/wfloki.svg?v=1.13'
        : x === 'wPEPE'
          ? 'https://rollercoin.com/static/img/wallet/wpepe.svg?v=1.13'
          : x === 'wSHIB'
            ? 'https://rollercoin.com/static/img/wallet/wshib.svg?v=1.13'
            : 'https://static.rollercoin.com/static/img/icons/currencies/' + slug + '.svg?v=1.13'}"


      	alt="${esc(x)}">`
                : `<b>${esc(x)}</b>`
            }</span>`;
          }).join("")}</div>`;
        }

        return `<div class="coin-icons">${a.map(x =>
          `<img class="coin-image" src="https://miningblocks.club/pageAssets/img/criptos/${esc(x.toLowerCase())}.png" alt="${esc(x)}">`
        ).join("")}</div>`;
      };

      const list = a => Array.isArray(a) && a.length
        ? `<ul>${a.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`
        : `<p class="profile-unknown">Пока не добавлено</p>`;

       const platformIconUrls={"Android":"https://productionassets.rollercoin.com/main-app/62c229986d3afe4488e026e2ed1a84f0/assets/img/6pSJf71QQ1vm0tCqWNPCj.svg","Андроид":"https://productionassets.rollercoin.com/main-app/62c229986d3afe4488e026e2ed1a84f0/assets/img/6pSJf71QQ1vm0tCqWNPCj.svg","iOS":"https://productionassets.rollercoin.com/main-app/62c229986d3afe4488e026e2ed1a84f0/assets/img/D1BzArQVmxWZ-AaPf0VKBj.svg"};
       const platformIcons=a=>`<div class="platform-icons">${(Array.isArray(a)?a:[]).map(name=>{const url=platformIconUrls[name]||platformIconUrls[name.toLowerCase()];return url?`<span class="platform-icon-wrap active" title="${esc(name)}"><img class="platform-icon" src="${url}" alt="${esc(name)}"></span>`:''}).join('')}</div>`; const source=p.source&&/^https?:\/\//i.test(p.source)?`<a class="profile-source" href="${esc(p.source)}" target="_blank" rel="noopener">${esc(p.source)}</a>`:'<span class="profile-unknown">Не указан</span>';
       const isPresent=v=>v&&!/^нет\b|не проверено|не подтверждено/i.test(String(v).trim());
       const functions=[...(p.earningTypes||[]),isPresent(p.miners)?'Майнеры':'',isPresent(p.craft)?'Крафт майнеров':'',isPresent(p.marketplace)?'Рынок игроков — покупка и продажа майнеров':''].filter(Boolean);
       const available=[...(p.pros||[]),isPresent(p.miners)?'Виртуальные майнеры':'',isPresent(p.craft)?'Крафт майнеров':'',/свой пул|собственн/i.test(p.pools||'')?'Можно создать свой пул':'',isPresent(p.marketplace)?'Есть рынок игроков':''].filter(Boolean);
       openModal(`<div class="modalhead"><div>
       <div class="eyebrow">${esc(p.cat)}</div>
       <h2 id="mt">${p.logoUrl?`<img class="detail-logo" src="${esc(p.logoUrl)}" alt="${esc(p.n)}">`:`<span class="detail-logo detail-logo-fallback" role="img" aria-label="${esc(p.n)}">${esc(p.s||p.n.slice(0,1))}</span>
       `}${esc(p.n)}</h2>
       <div class="subtitle">${text(p.sub)}</div>${platformBadges(p)}
       <div class="profile-rating">
       <span class="profile-rating-star">★</span>
       <b>${p.r>0?p.r.toFixed(1):"—"} / 5</b><span>${p.ratingSource||"Оценка каталога"}</span></div></div>
       <div class="site-metrics">
       <div class="site-metric">
       <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true"><rect x="4" y="6" width="24" height="22" rx="2"/>
       <path d="M10 3v7M22 3v7M4 13h24M10 18h4M18 18h4M10 23h4"/></svg>
       <div class="site-metric-copy"><b>${text(p.daysOnline)}</b><span>${text(p.daysOnlineLabel||"ДНЕЙ РАБОТАЕТ")}</span>
       
       </div></div><div class="site-metric"><svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><circle cx="16" cy="9" r="7"/><path d="M3 28c0-6.7 5.8-11 13-11s13 4.3 13 11v2H3z"/></svg>
       
       <div class="site-metric-copy"><b>${text(p.usersCount)}</b><span>ПОЛЬЗОВАТЕЛЕЙ</span></div></div><div class="site-metric"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><path d="m5 17 8 8L28 8"/></svg><div class="site-metric-copy"><b>${text(p.paymentsCount)}</b><span>${text(p.paymentsCountLabel||"ВЫПЛАТ")}</span></div></div></div><button class="close" data-close aria-label="Закрыть">×</button></div>
       <p>${text(p.d)}</p>
       <section class="profile-item profile-wide accent-cyan"><h3 class="economy-heading">
       <span class="economy-mark" aria-hidden="true">🎮</span>
       <span>Игровая экономика и бонусы</span></h3>
       <div class="special-grid">${(p.specialFeatures||[]).map(feature=>{const badge=specialFeatureIcon(feature.title);return `<div class="special-card">
       <h4><span class="special-icon" style="--feature-color:${badge.color}" aria-hidden="true">${badge.icon}</span><span>${esc(feature.title)}</span></h4><p>${esc(feature.text)}</p>
       </div>`}).join('')}</div></section>
       <div class="profile-grid">
        <section class="profile-item accent-cyan"><h3 class="section-heading"><span class="section-heading-icon icon-opportunity" aria-hidden="true">✦</span>Возможности</h3>${list(functions)}</section>
          <section class="profile-item pros-cons"><h3 class="section-heading"><span class="section-heading-icon icon-balance" aria-hidden="true">⚖️</span>Плюсы и минусы</h3><div class="pros-cons-part positive"><h4><span class="section-heading-icon icon-plus" aria-hidden="true">＋</span>Плюсы</h4>${list(p.pros)}</div><div class="pros-cons-divider"></div><div class="pros-cons-part negative"><h4><span class="section-heading-icon icon-minus" aria-hidden="true">−</span>Минусы</h4>${list(p.cons)}</div></section>
        <section class="profile-item"><h3>Механики и условия</h3>
        <div class="profile-fact"><b>Майнеры</b><span>${text(p.miners)}</span></div>
        <div class="profile-fact"><b>Крафт</b><span>${text(p.craft)}</span></div>
        <div class="profile-fact"><b>Merge</b><span>${text(p.merge)}</span></div>
        <div class="profile-fact"><b>Пулы</b><span>${text(p.pools)}</span></div>
        <div class="profile-fact"><b>Рынок игроков</b><span>${text(p.marketplace)}</span></div>
        <div class="profile-fact"> <b>Продажа майнеров / инвентаря</b> <span>${text(p.resale)}</span></div></section>
<section class="profile-item">
  <h3>Вывод средств</h3>

  <div class="profile-fact">
    <b>Минимум</b>
    <span>${text(p.minWithdraw)}</span>
  </div>

${paymentRows}

  <p><b>${esc(p.coinLabel || "Можно майнить и выводить:")}</b></p>
  ${coinIcons(p.coins, p)}

  <div class="profile-fact">
    <b>Дополнительная валюта вывода</b>
    <span>
    <span class="withdrawal-token">₮ USDT</span>
    </span>
  </div>

  <!-- Дополнительное примечание о выводе можно добавить при необходимости. -->
</section>

        
       <section class="profile-item profile-wide"><h3>Источник и проверка</h3><p><b>Источник:</b> ${source}</p><p><b>Источник данных:</b> ${text(p.checkedAt)}</p>
        <p><b>Дата запуска:</b> ${text(p.launchDate)}</p>
        <p><b>Статус:</b> ${p.verified?'Пользователь подтвердил успешные выводы и выплаты':'Черновик · проверьте данные перед публикацией'}</p>
        </section>
         <section class="profile-item profile-wide risk-details ${esc(p.riskLevel||'')}"><h3>Риск и результат проверки</h3>
      
<div class="profile-fact"><b>Уровень риска</b>${riskBadge(p)}</div>
<div class="profile-fact"><b>Навязчивость рекламы</b>${(() => {
  const labels = {
    low: ["🟢 Реклама не мешает", "green"],
    medium: ["🟡 Много рекламы", "yellow"],
    high: ["🔴 Агрессивная реклама", "red"],
    unknown: ["❔ Реклама не проверена", ""]
  };
  const item = labels[p.adLevel] || labels.unknown;
  return `<span class="tag ${item[1]}">${item[0]}</span>`;
})()}</div>
<p>${text(p.riskDetails)}</p>

         ${text(p.riskDetails)}</p><p><b>Выплаты:</b> ${text(p.verificationDetails|| (p.verified?'Проверены':'Не проверены'))}</p>
         </section>
 </div>


        <section class="profile-item profile-wide accent-cyan rate-project"><h3>${p.ratingSource?"Внешняя оценка":"Оценка ZETTA-ZONE"}</h3><div class="card-rating-info"><span class="stars">★</span>${p.r>0?`<b class="rating">${p.r.toFixed(1)}</b>`:`<span class="mut">—</span>`}<span class="rating-count">(${Number(p.reviews)||0} оценок)</span></div><p>${p.ratingNote?esc(p.ratingNote):"Пояснение к оценке можно добавить позже."}</p><p class="profile-status">Оценка каталога выставляется вручную; общую оценку пользователей подключим отдельно.</p></section> <div class="actions">
        <button class="btn" data-pickmodal="${esc(p.id)}">⚖ Добавить к сравнению</button>${(p.registrationUrl||p.referralUrl)?`<a class="btn primary" href="${esc(p.registrationUrl||p.referralUrl)}" target="_blank" rel="noopener">${esc(p.referralCta||"Перейти к регистрации ↗")}</a>${p.referralUrl?`
        <button class="btn copy-ref-btn" data-copy-ref="${esc(p.id)}">Скопировать реферальную ссылку</button>`:''}`:p.referralCta?`<button class="btn primary" disabled title="Добавь реферальную ссылку в catalog-data.js">${esc(p.referralCta)}</button>`:p.referralBonus?`<button class="btn primary" disabled>${esc(p.referralBonus)}</button>`:''}<button class="btn" data-close>Готово</button></div><section class="profile-item community-section accent-cyan"><h3>Сообщества</h3><div class="community-badges detail-communities">${(p.communities||[]).map(name=>communityBadge(name,p)).join("")||'<span class="profile-unknown">Ссылки добавим позже</span>'}</div></section>`)
      }
      // Build the comparison table for selected projects.
      function compareModal(){let ps=[...chosen].map(id=>all().find(p=>p.id===id));if(ps.length<2){toast("Выбери минимум два проекта");return}let rows=[["Категория",p=>p.cat],["Оценка проекта",p=>p.r>0?"★ "+p.r.toFixed(1)+(p.ratingSource?" ("+p.ratingSource+")":""):"Не выставлена"],["Условия",p=>p.fee],["Платформы",p=>p.platform],["Денежные вложения",p=>p.risk],["Проверка",p=>p.verified?"Проверен":"Не подтверждён"],["Функции",p=>p.features.join(", ")],["Плюсы",p=>p.pros.join("; ")],["Минусы",p=>p.cons.join("; ")]];openModal(`<div class="modalhead"><div><div class="eyebrow">Инструмент выбора</div><h2>Сравнение проектов</h2><p class="mut">Сравни условия и ограничения, не только рейтинг.</p></div><button class="close" data-close>×</button></div><div class="tablewrap"><table class="ctable"><thead><tr><th>Параметр</th>${ps.map(p=>`<th>${p.n}</th>`).join("")}</tr></thead><tbody>${rows.map(([l,f])=>`<tr><td>${l}</td>${ps.map(p=>`<td>${esc(f(p))}</td>`).join("")}</tr>`).join("")}</tbody></table></div><p class="note">Оценки сообщества для этой карточки пока отсутствуют. Условия проверь на официальном сайте.</p><button class="btn primary" data-close>Готово</button>`)}
      // Event handlers for card actions, filters, favorites, and comparison.
      $("#grid").addEventListener("click",e=>{const rate=e.target.closest("[data-community-rate]");if(rate){submitCommunityRating(rate.dataset.projectId,Number(rate.dataset.communityRate),rate);return}let f=e.target.closest("[data-fav]");if(f){saved.has(f.dataset.fav)?saved.delete(f.dataset.fav):saved.add(f.dataset.fav);writeStore("zz2saved",[...saved]);render();toast(saved.has(f.dataset.fav)?"В избранном ♥":"Удалено из избранного");return}let d=e.target.closest("[data-detail]");if(d){details(d.dataset.detail);return}if(e.target.closest("[data-go]"))toast("Ссылка на сайт для этого демо-проекта не задана.")});
      $("#grid").addEventListener("change",e=>{let c=e.target.closest("[data-pick]");if(!c)return;if(c.checked){if(chosen.size>=3){c.checked=false;toast("Максимум 3 проекта");return}chosen.add(c.dataset.pick)}else chosen.delete(c.dataset.pick);updateCompare()});
      $("#modal").addEventListener("click",e=>{if(e.target.closest("[data-close]")){close();return}let copy=e.target.closest("[data-copy-ref]");if(copy){const project=data.find(x=>x.id===copy.dataset.copyRef);if(project?.referralUrl){const box=document.createElement("textarea");box.value=project.referralUrl;box.style.position="fixed";box.style.opacity="0";document.body.appendChild(box);box.select();const ok=document.execCommand("copy");box.remove();toast(ok?"Реферальная ссылка скопирована":"Не удалось скопировать ссылку")}return}let p=e.target.closest("[data-pickmodal]");if(p){if(!chosen.has(p.dataset.pickmodal)){if(chosen.size>=3){toast("Максимум 3 проекта");return}chosen.add(p.dataset.pickmodal)}close();render();toast("Добавлено к сравнению")}});
      $("#backdrop").addEventListener("click",e=>{if(e.target.id==="backdrop")close()});document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});$("#search").addEventListener("input",render);$("#sort").addEventListener("change",render);$("#status").addEventListener("change",render);$("#adFilter").addEventListener("change",render);
      $("#chips").addEventListener("click",e=>{let c=e.target.closest("[data-cat]");if(!c)return;cat=c.dataset.cat;$("#chips").querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x===c));render()});
      $("#reset").addEventListener("click",()=>{$("#search").value="";$("#sort").value="featured";$("#status").value="all";$("#adFilter").value="all";cat="Все";onlySaved=false;$("#chips").querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x.dataset.cat==="Все"));render()});
      function showSaved(){onlySaved=!onlySaved;$("#savedBtn").classList.toggle("primary",onlySaved);render();$("#catalog").scrollIntoView({behavior:"smooth"})}$("#savedBtn").addEventListener("click",showSaved);$("#communitySaved").addEventListener("click",()=>{onlySaved=true;render();$("#catalog").scrollIntoView({behavior:"smooth"})});$("#startCompare").addEventListener("click",()=>{toast("Отметь чекбоксы у 2–3 карточек");$("#catalog").scrollIntoView({behavior:"smooth"})});$("#clear").addEventListener("click",()=>{chosen.clear();render()});$("#compareBtn").addEventListener("click",compareModal);
 

      // Загружаем карточки из Google Sheets, сохраняя ручные карточки.
      function loadSheetCatalog() {
        if (!window.CATALOG_FEED_URL) return;

        const manualData = Array.isArray(window.CATALOG_DATA)
          ? window.CATALOG_DATA
          : [];

        window.zettazoneCatalogLoaded = function(payload) {
          if (!payload || !Array.isArray(payload.items)) {
            data = manualData;
            render();
            return;
          }

          const merged = new Map();

          // Сначала добавляем карточки, созданные вручную.
          manualData.forEach(p => {
            if (p && p.id) merged.set(p.id, p);
          });

          // Затем добавляем одобренные карточки из таблицы.
          payload.items.forEach(p => {
            if (
              p &&
              p.id &&
              p.n &&
              p.url &&
              /^https?:\/\//i.test(p.url) &&
              !merged.has(p.id)
            ) {
              merged.set(p.id, p);
            }
          });

          data = [...merged.values()];
          render();
        };

        const script = document.createElement("script");
        script.src =
          window.CATALOG_FEED_URL +
          (window.CATALOG_FEED_URL.includes("?") ? "&" : "?") +
          "callback=zettazoneCatalogLoaded&_=" + Date.now();

        script.onerror = () => {
          toast("Не удалось загрузить карточки из таблицы.");
        };

        document.head.appendChild(script);
      }

render();
      loadCommunityRatings();
      loadSheetCatalog();


