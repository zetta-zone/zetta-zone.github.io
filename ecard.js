function generateCardHtml(item, number) {
    // 1. ДИНАМИЧЕСКИЕ КЛАССЫ КАРТОЧКИ
    var isTopProject = item.badge && item.badge.toLowerCase().indexOf('top') !== -1;
    var cardClasses = isTopProject ? "ecard top-pick featured" : "ecard";

    // 2. АВТОПОДСТАНОВКА ЦВЕТА ИКОНКИ (c1 - c12)
    var colorNumber = item.color ? parseInt(item.color) : ((number - 1) % 12) + 1;
    var iconClass = "ecard-icon c" + colorNumber;

    // 3. РАНГ (#01, #02 и т.д.)
    var formattedRank = String(number).padStart(2, '0');

    // 4. ДОМЕН ДЛЯ АВТО-ЛОГОТИПА
    var hostFallback = '';
    if (item.href) {
        try {
            var urlObj = new URL(item.href);
            hostFallback = urlObj.hostname.replace(/^www\./, '');
        } catch (e) {
            hostFallback = '';
        }
    }

    // ИСПРАВЛЕНО: Добавлены точные слэши и правильные эндпоинты для иконок
    var logoSrc = hostFallback ? "https://icons.duckduckgo.com/ip3/" + hostFallback + ".ico" : "";
    var googleFallback = hostFallback ? "https://www.google.com/s2/favicons?domain=" + hostFallback + "&sz=128" : "";

    // 5. ПАРСИНГ СПИСКА ПРЕИМУЩЕСТВ
    var featuresHtml = '';
    var featureKeys = ['feat item1', 'feat item2', 'feat item3', 'feat item4'];
    featureKeys.forEach(function(key) {
        if (item[key] && item[key].trim() !== '') {
            featuresHtml += '<div class="feat-item">' + item[key].trim() + '</div>';
        }
    });

    // 6. БЭЙДЖ И НАЗВАНИЕ
    var badgeHtml = isTopProject ? '<div class="top-badge">' + item.badge + '</div>' : '';
    var brandName = item["ecard-name"] || item.id || 'Без названия';
    var withdrawBadge = item["has-faucetpay"] === 'Yes' ? 'FaucetPay / Crypto' : 'Crypto';


 
    // 7. ГЕНЕРАЦИЯ КНОПКИ FAUCETPAY С ТВОЕЙ РЕФЕРАЛЬНОЙ ССЫЛКОЙ
    var withdrawHtml = '';
    var checkFaucetpay = item["has-faucetpay"] ? String(item["has-faucetpay"]).trim() : '';

    if (checkFaucetpay === 'Yes') {
        withdrawHtml = '<a class="w-badge" data-btn="withdraw_faucetpay" data-site="' + (item.id || 'site') + '" data-track="click" href="https://faucetpay.io/r/9771657" rel="noopener" target="_blank" e;">FaucetPay</a> <span class="w-badge">Crypto</span>';
    } else {
        withdrawHtml = '<span class="w-badge">Crypto</span>';
    }







    // 8. СБОРКА ШАБЛОНА СТРОКАМИ
    var html = '';
    html += '<div class="' + cardClasses + '" data-id="' + (item.id || 'site') + '" data-site="' + (item.id || 'site') + '">';
    html += '    <div class="ecard-top-line"></div>';
    html += '    <div class="ecard-head">';
    html += '        <div class="' + iconClass + ' has-logo">';
    // ИСПРАВЛЕНО: Чистое и безопасное переключение на Google, если DuckDuckGo не отдал картинку
    html += '            <img src="' + logoSrc + '" alt="" class="brand-logo" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="if(this.src.indexOf(\'google.com\') === -1) { this.src=\'' + googleFallback + '\'; } else { this.style.display=\'none\'; }"/>';
    html += '            <span class="emoji">' + (item.emoji || '🎁') + '</span>';
    html += '        </div>';
    html += '        <div class="ecard-meta">';
    html += '            <div class="ecard-name">' + brandName + '</div>';
    html += '            <div class="ecard-type">' + (item["ecard-type"] || '') + '</div>';
    html += '        </div>';
    html += '        <div class="ecard-rank">#' + formattedRank + '</div>';
    html += '    </div>';
    html += '    ' + badgeHtml;
    html += '    <div class="feature-pill">';
    html += '        <div class="fp-check">✓</div>';
    html += '        <div class="fp-text">' + (item["fp-text"] || 'Play, Win, and Earn Free Crypto!') + '</div>';
    html += '    </div>';
    html += '    <div class="feat-list">' + featuresHtml + '</div>';
    html += '    <div class="withdraw-row">';
    html += '        <span class="w-label">Withdraw to</span>';
  html += '            ' + withdrawHtml;
    html += '    </div>';
    html += '    <div class="ecard-actions">';
    html += '        <a class="btn btn-earn" data-btn="earn" data-site="' + (item.id || 'site') + '" data-track="click" href="' + (item.href || '#') + '" rel="noopener" target="_blank">' + (item["btn-text"] || 'Get Free Satoshi →') + '</a>';
    html += '    </div>';
    html += '</div>';


        // ... (весь ваш текущий код сборки шаблона html += ...)

    // ДОБАВЬТЕ ЭТУ СТРОКУ ПЕРЕД RETURN:
    console.log("=== ГОТОВЫЙ КОД ДЛЯ КАРТОЧКИ БРЕНДА [" + brandName + "] ===");
    console.log(html);

    return html;

}

async function initSite() {
  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbw5Q28tRp6B1kcTOhC6_RAHL8Lf3fEcj16FO8xNjb_9jOKirnLcWSLUri-mi5CA6jtZ/exec");
    const items = await res.json();

    const sortedByDateItems = items.reverse();
    let counter = 0;

    // Всегда в одну секцию:
    var targetGrid = document.querySelector("#list .card-grid");
    if (!targetGrid) return;

    sortedByDateItems.forEach(item => {
      if (!item) return;
      counter++;
      targetGrid.innerHTML += generateCardHtml(item, counter);
    });

  } catch (err) {
    console.error("Ошибка инициализации сайта:", err);
  }
}

// Запускаем скрипт
initSite();
