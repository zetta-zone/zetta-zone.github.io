/* Laboratory project records use the retained shared V5 renderer. */
(()=>{'use strict';
const base=V4_PROJECTS[0],unknown='Не проверено',date='10.11.2026';
function art(d,title){const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760"><rect width="1200" height="760" fill="#111e30"/><g fill="none" stroke="${d.accent}" stroke-width="3" opacity=".5"><rect x="110" y="140" width="230" height="330" rx="20"/><rect x="485" y="140" width="230" height="330" rx="20"/><rect x="860" y="140" width="230" height="330" rx="20"/><path d="M340 300h145m230 0h145"/>${[110,485,860].map(x=>[180,270,360].map(y=>`<rect x="${x+35}" y="${y}" width="160" height="65" rx="8"/>`).join('')).join('')}</g><text x="70" y="85" fill="${d.accent}" font-size="38" font-family="Arial" font-weight="bold">${d.name}</text><text x="70" y="580" fill="#eef5ff" font-size="34" font-family="Arial">${title}</text><text x="70" y="645" fill="#a9bdcf" font-size="23" font-family="Arial">Схема для лаборатории · не скриншот игры</text></svg>`;return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)}
function make(d){const p=structuredClone(base);Object.assign(p,{id:d.id,name:d.name,labPreview:true,demo:false,testInstance:false,draft:true,cover:0,officialUrl:d.home,registrationUrl:d.home,category:'Play2Earn / Симуляторы майнинга',categoryId:'mining',categoryLabel:'Симуляторы майнинга',essence:d.essence,short:d.essence,description:d.lead+' '+d.essence+' Эта карточка подготовлена для проверки общего редактора. Описание основано на публичных материалах проекта. Аккаунт, покупки и получение выплат не проверялись.',freeStart:d.id==='rollercoin'||d.id==='mining-blocks'?true:null,deposit:null,verified:'unverified',verificationLabel:'Выплаты не проверены',risk:'Не оценён',platforms:['Браузер'],ratings:{community:{average:0,count:0},external:null},editorial:{overall:null,criteria:[],note:'Оценка не выставлена'},withdrawalLabel:'Минимумы, сети и комиссии не проверены',stats:[{value:'—',label:'Год запуска · не проверен'},{value:'—',label:'Пользователи · не проверено'},{value:date,label:'Дата подготовки карточки'}],overview:{lead:d.lead,text:d.essence+' Публичное описание не подтверждает доходность или получение выплат.'},features:d.features,previewFeatures:d.features.map(f=>f[1]),highlights:d.features.slice(0,2).map(f=>({icon:f[0],title:f[1]})),pros:[['Понятная тема игры',d.lead],['Несколько элементов развития',d.features.slice(0,3).map(f=>f[1]).join(', ')+'.'],['Доступен официальный источник','Ссылки доступны в разделе проверки.']],cons:[['Выплаты не проверены','Нет проверки получения средств ZETTA-ZONE.'],['Условия могут измениться','Проверьте действующие правила в аккаунте проекта.'],['Нет расчёта доходности','Покупки и игровая мощность не гарантируют окупаемость.']],comparisonValues:{freeStart:d.id==='limercoin'?'Требует проверки':'Заявлен проектом; получение не проверено',deposit:unknown,mining:'Виртуальный симулятор',merge:unknown,market:d.features.some(f=>f[1]==='Рынок')?'Заявлен':unknown,withdrawal:unknown,risk:'Не оценён'},sources:Object.fromEntries(d.sources.map(([note,url],i)=>['source'+i,{note,url,checkedAt:'2026-11-10'}])),internal:{updated:date,projectId:d.id,officialUrl:d.home,source:d.sources.map(x=>x[1]).join(' · '),comment:'Лабораторная карточка. Числа и оценки HashGarden не перенесены.'}});
const t={accent:d.accent,soft:'#1c3048',paper:'#152538',bg:'#0c1624',ink:'#eef5ff',muted:'#acbdce',line:'#36516d'};p.theme={dark:t,light:{accent:'#315b85',soft:'#e5edf5',paper:'#ffffff',bg:'#f2f6fa',ink:'#172c3d',muted:'#576b7f',line:'#b9ccdc'}};
p.logo='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="160" height="160" rx="28" fill="#193049"/><text x="80" y="101" text-anchor="middle" font-size="55" font-family="Arial" fill="${d.accent}">${d.mark}</text></svg>`);
p.coins=d.coins.map(([ticker,name])=>({ticker,name,color:d.accent,min:unknown,fee:unknown,time:unknown,network:unknown,deposit:unknown,use:'Упомянуто в описании; вывод не подтверждён',method:unknown}));
p.mechanics={start:[['01','Изучите проект','Откройте официальный сайт и правила.'],['02',d.features[0][1],d.features[0][2]],['03',d.features[1][1],d.features[1][2]]],power:[['01','Игровая мощность',d.active],['02','Распределение',d.passive],['03','Актуальные условия','Проверяйте ограничения и сроки в правилах проекта.']],limits:[['01','Без проверки выплат','Получение средств не проверялось.'],['02','Без расчёта окупаемости','Финансовый результат не установлен.'],['03','Публичные сведения','Карточка не заменяет действующие правила игры.']]};
p.slides=['Обзор проекта','Возможности','Механика','Финансы','Плюсы и минусы','Проверка','Итог'].map((title,i)=>({image:art(d,title),title,text:'Редакционная схема для предпросмотра. Замените на нужное изображение через редактор.',tag:String(i+1).padStart(2,'0')+' / СХЕМА',placeholder:true}));
p.detailCopy={copy0:d.name+' · виртуальный майнинг',copy1:'Что это за проект',copy2:p.overview.lead,copy3:p.overview.text,copy4:'Возможности проекта',copy5:'Как устроена игра',copy6:d.active,copy7:d.passive,copy8:'Экономика и условия',copy9:'Старт: изучите актуальные правила',copy10:'Бесплатные предложения и доступность функций проверяйте на официальном сайте.',copy11:d.currency,copy12:'Игровая валюта / обозначение. Условия использования и обмена требуют проверки.',copy13:'Способы пополнения, минимумы и комиссии не проверены. Данные HashGarden сюда не перенесены.',copy14:'Валюты и обозначения',copy15:'Перечень неполный; наличие обозначения не подтверждает возможность внешнего вывода.',copy16:'Сети, минимумы, комиссии и сроки оставлены незаполненными.',copy17:'Преимущества и ограничения',copy18:'Что можно изучить',copy19:'Что требует проверки',copy20:'Источники и проверка',copy21:'Изучены публичные описания. Аккаунт и получение выплат не проверялись.',copy22:'Публичные страницы проекта, дата подготовки: '+date+'.',copy23:'Независимой проверки получения средств нет.',copy24:'Уровень риска не оценён.',copy25:'Рекламная нагрузка внутри аккаунта не проверена.',copy26:'Ссылки на источники открываются кнопкой ниже.',copy27:'Предварительная карточка '+d.name,copy28:'Карточка позволяет проверить общий шаблон и редактор на данных другого проекта. Итоговая оценка не выставлена.',copy29:'Развитие виртуального оборудования',copy30:'До покупок изучите правила и ограничения.',copy31:'Схемы галереи — редакционные, а не скриншоты игры.',copy32:'Вернуться в тестовую лабораторию.',copy33:'<a href="./">Каталог лаборатории ↗</a>'};return p}
for(const d of [
  {
    "id": "rollercoin",
    "name": "RollerCoin",
    "mark": "RC",
    "accent": "#ffb64c",
    "home": "https://rollercoin.com/",
    "sources": [
      [
        "Как устроена игра",
        "https://rollercoin.com/how-it-works"
      ],
      [
        "Официальный FAQ",
        "https://faq.rollercoin.com/rollercoin/f.a.q./basics"
      ]
    ],
    "essence": "Развивайте виртуальную майнинг-комнату: мини-игры, оборудование и распределение игровой мощности.",
    "features": [
      [
        "⌘",
        "Мини-игры",
        "Игровая активность позволяет получать мощность."
      ],
      [
        "▦",
        "Виртуальные майнеры",
        "Оборудование и стойки используются для развития комнаты."
      ],
      [
        "⇄",
        "Рынок",
        "На главной заявлены сделки с майнерами, стойками и деталями."
      ],
      [
        "◎",
        "Распределение мощности",
        "Выбор направлений виртуального майнинга."
      ]
    ],
    "currency": "RLT",
    "coins": [
      [
        "BTC",
        "Bitcoin"
      ],
      [
        "RLT",
        "RollerToken"
      ]
    ],
    "lead": "Браузерная игра о развитии виртуальной майнинг-комнаты.",
    "active": "Мини-игры и развитие оборудования.",
    "passive": "Игровая мощность участвует в распределении наград; условия зависят от правил проекта."
  },
  {
    "id": "limercoin",
    "name": "Limercoin",
    "mark": "LC",
    "accent": "#82d45a",
    "home": "https://limercoin.com/",
    "sources": [
      [
        "Официальное описание",
        "https://limercoin.com/"
      ],
      [
        "Официальный FAQ",
        "https://limercoin.com/faq"
      ]
    ],
    "essence": "Обустройте пространство с майнерами и стойками, играйте и распределяйте мощность между пулами.",
    "features": [
      [
        "▦",
        "Майнеры и стойки",
        "Оборудование размещается на стойках в игровом пространстве."
      ],
      [
        "⌘",
        "Мини-игры",
        "Победы дают дополнительную временную мощность."
      ],
      [
        "◎",
        "Распределение мощности",
        "Мощность можно распределять между доступными пулами."
      ],
      [
        "⌁",
        "Приглашения",
        "На сайте представлена реферальная программа."
      ]
    ],
    "currency": "LMT",
    "coins": [
      [
        "BTC",
        "Bitcoin"
      ],
      [
        "LMT",
        "Limercoin Token"
      ]
    ],
    "lead": "Виртуальное пространство, оборудование и управление мощностью.",
    "active": "Мини-игры и управление игровым пространством.",
    "passive": "Сайт описывает распределение наград в зависимости от доли мощности в пуле."
  },
  {
    "id": "mining-blocks",
    "name": "Mining Blocks",
    "mark": "MB",
    "accent": "#7ca9ff",
    "home": "https://miningblocks.club/",
    "sources": [
      [
        "Описание и порядок старта",
        "https://miningblocks.club/"
      ]
    ],
    "essence": "Активируйте виртуальные пространство, питание и майнер, затем присоединяйтесь к пулу.",
    "features": [
      [
        "▦",
        "Виртуальный майнинг",
        "На сайте описана активация пространства, питания и майнера."
      ],
      [
        "◎",
        "Майнинг-пулы",
        "Можно присоединиться к пулу; сайт также заявляет роль владельца пула."
      ],
      [
        "◇",
        "Стартовое оборудование",
        "Главная предлагает бесплатный майнер и источник питания; получение не проверено."
      ],
      [
        "◷",
        "Раунды наград",
        "На главной заявлены раунды по 30 минут и распределение по вкладу в пул."
      ]
    ],
    "currency": "Не установлена",
    "coins": [
      [
        "?",
        "Состав валют требует проверки"
      ]
    ],
    "lead": "Симулятор виртуального майнинга с участием в пулах.",
    "active": "Подготовка оборудования и выбор пула.",
    "passive": "Сайт описывает распределение награды победившего пула между его участниками."
  }
]){const p=make(d);V4_PROJECTS.push(p);if(new URLSearchParams(location.search).get('project')===p.id)window.DEMO_PROJECT=p}
// Put requested projects first in the laboratory; retain the original examples.
V4_PROJECTS.sort((a,b)=>(a.labPreview?0:1)-(b.labPreview?0:1));
})();
