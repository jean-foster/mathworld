// Единый объект прогресса для всех классов
window.USER_PROGRESS = {
    '1-2': { topics: {}, multiplication: 0, columns_add: 0, columns_sub: 0, totalCorrect: 0, posters: [] },
    '3':   { topics: {}, multiplication: 0, columns_add: 0, columns_sub: 0, totalCorrect: 0, posters: [] },
    '4':   { topics: {}, multiplication: 0, columns_add: 0, columns_sub: 0, totalCorrect: 0, posters: [] }
};

window.POSTER_POOL = [
    { url: 'images/posters/1.jpg', title: 'Картинка 1' },
    { url: 'images/posters/2.jpg', title: 'Картинка 2' },
    { url: 'images/posters/3.jpg', title: 'Картинка 3' },
    { url: 'images/posters/4.jpg', title: 'Картинка 4' },
    { url: 'images/posters/5.jpg', title: 'Картинка 5' }
];

(function migrateColumns() {
    var saved = localStorage.getItem('math_app_progress_v4');
    if (!saved) return;
    try {
        var data = JSON.parse(saved);
        var changed = false;
        ['1-2', '3', '4'].forEach(function(c) {
            if (!data[c]) return;
            var p = data[c];
            var a = p.columns_add || 0;
            var s = p.columns_sub || 0;
            if (s > 0) {
                p.columns_add = a + s;
                p.columns_sub = 0;
                changed = true;
            }
        });
        if (changed) {
            localStorage.setItem('math_app_progress_v4', JSON.stringify(data));
        }
    } catch (e) {}
})();


function loadProgress() {
    var saved = localStorage.getItem('math_app_progress_v4');
    if (saved) {
        try {
            var data = JSON.parse(saved);
            ['1-2', '3', '4'].forEach(function(cls) {
                if (data[cls]) {
                    window.USER_PROGRESS[cls] = Object.assign(window.USER_PROGRESS[cls], data[cls]);
                    if (!Array.isArray(window.USER_PROGRESS[cls].posters)) {
                        window.USER_PROGRESS[cls].posters = [];
                    }
                }
            });
        } catch (e) {}
    }
    var activeClass = document.querySelector('.class-btn.active');
    var cls = activeClass ? activeClass.dataset.class : '1-2';
    renderTree(cls);
}

function saveProgress() {
    localStorage.setItem('math_app_progress_v4', JSON.stringify(window.USER_PROGRESS));
    var activeClass = document.querySelector('.class-btn.active');
    var cls = activeClass ? activeClass.dataset.class : '1-2';
    renderTree(cls);
}

function syncPostersWithProgress(cls) {
    var progress = window.USER_PROGRESS[cls];
    var earned = Math.floor(progress.multiplication / 250);
    var have   = progress.posters.length;
    
    for (var i = have; i < earned; i++) {
        var reward = window.POSTER_POOL[i % window.POSTER_POOL.length];
        if (!reward) break;
        progress.posters.push({
            id: 'p' + i + '_' + Date.now() + '_' + cls,
            url: reward.url,
            title: reward.title,
            placed: false,
            x: 0, y: 0
        });
    }
}

window.addCorrectAnswer = function(category, topicName) {
    var activeBtn = document.querySelector('.class-btn.active');
    var cls = activeBtn ? activeBtn.dataset.class : (window._currentClass || '1-2');
    if (!cls) cls = '1-2';

    // ===== ТАБЛИЦА УМНОЖЕНИЯ (картинки во все классы) =====
    if (category === 'multiplication') {
        ['1-2', '3', '4'].forEach(function(c) {
            var p = window.USER_PROGRESS[c];
            if (!p) return;
            p.totalCorrect++;
            p.multiplication++;
            syncPostersWithProgress(c);
        });
        localStorage.setItem('math_app_progress_v4', JSON.stringify(window.USER_PROGRESS));
        updateSceneCounters();
        return;
    }

    // ===== ПРИМЕРЫ В СТОЛБИК (награды во все классы) =====
    if (category === 'columns_add' || category === 'columns_sub' ||
        category === 'columns_mul' || category === 'columns_div') {

        // В 1-2 класс засчитываем ТОЛЬКО сложение и вычитание
        var isBasic = (category === 'columns_add' || category === 'columns_sub');

        ['1-2', '3', '4'].forEach(function(c) {
            var p = window.USER_PROGRESS[c];
            if (!p) return;
            if (c === '1-2' && !isBasic) return; // 1-2 класс не получает награды за умножение/деление

            p.totalCorrect++;
            p.columns_add = (p.columns_add || 0) + 1;
        });

        localStorage.setItem('math_app_progress_v4', JSON.stringify(window.USER_PROGRESS));
        updateSceneCounters();
        return;
    }

    // ===== ОСТАЛЬНЫЕ ТРЕНАЖЕРЫ (Единицы, Уравнения, Часы, Площадь и т.д.) =====
    // Они НЕ должны влиять на прогресс (книги/звезды/кувшинки) в 1-2 классе!
    if (category === 'units' || category === 'equations' || category === 'clock' || 
        category === 'rect' || category === 'order' || category === 'roman' || category === 'numbers') {
        // Просто выходим, ничего не начисляя
        return;
    }

    // ===== ЗАДАЧИ ПО ТЕМАМ (только активный класс) =====
    var progress = window.USER_PROGRESS[cls];
    if (!progress) return;

    progress.totalCorrect++;

    if (category === 'topic' && topicName) {
        if (!progress.topics[topicName]) progress.topics[topicName] = 0;
        progress.topics[topicName]++;
    }

    syncPostersWithProgress(cls);
    localStorage.setItem('math_app_progress_v4', JSON.stringify(window.USER_PROGRESS));
};

function collectBooks(cls) {
    var progress = window.USER_PROGRESS[cls];
    var books = [];
    
    Object.keys(progress.topics).forEach(function (topic) {
        var n = Math.floor(progress.topics[topic] / 15);
        for (var i = 0; i < n; i++) books.push({ title: topic, color: pickTopicColor(topic), type: 'topic' });
    });

    var cTot = progress.columns_add || 0;
    var c = Math.floor(cTot / 50);
    for (var i = 0; i < c; i++) books.push({ title: 'Столбик', color: '#2a9d8f', type: 'columns' });
    
    return books;
}

function pickTopicColor(topic) {
    var palette = ['#1d3557','#457b9d','#6a4c93','#8e44ad','#b5179e','#f72585','#e76f51','#f4a261','#2a9d8f','#264653','#588157','#bc6c25','#9a031e','#3d5a80','#5f0f40','#0f4c5c'];
    var hash = 0;
    for (var i = 0; i < topic.length; i++) hash = (hash * 31 + topic.charCodeAt(i)) >>> 0;
    return palette[hash % palette.length];
}

function updateSceneCounters() {
    var activeBtn = document.querySelector('.class-btn.active');
    var cls = activeBtn ? activeBtn.dataset.class : (window._currentClass || '1-2');
    if (!cls) cls = '1-2';

    var pMain = window.USER_PROGRESS[cls] || {};
    var multCount = pMain.multiplication || 0;
    var colCount  = pMain.columns_add || 0;

    var multEl = document.getElementById('mult-counter');
    if (multEl) {
        var multAwards = Math.floor(multCount / 250);
        multEl.innerHTML =
            '<span class="mult-counter-icon">✖️</span>' +
            '<span class="mult-counter-value">' + multCount + '</span>' +
            '<span class="mult-counter-tip">' +
                'Правильных ответов в таблице умножения: <b>' + multCount + '</b><br>' +
                'Каждые 250 ответов = 1 картинка (заработано: ' + multAwards + ')' +
            '</span>';
    }

    var colEl = document.getElementById('columns-counter');
    if (colEl) {
        var colAwards = Math.floor(colCount / 50);
        colEl.innerHTML =
            '<span class="mult-counter-icon">➕</span>' +
            '<span class="mult-counter-value">' + colCount + '</span>' +
            '<span class="mult-counter-tip">' +
                'Примеров в столбик: <b>' + colCount + '</b><br>' +
                'Каждые 50 примеров = 1 награда (заработано: ' + colAwards + ')' +
            '</span>';
    }
}

window.updateMultCounter = updateSceneCounters;


function renderTree(className) {
    var container = document.getElementById('tree-container');
    var spaceContainer = document.getElementById('space-container');
    var lakeContainer = document.getElementById('lake-container');
    
    if (!container || !spaceContainer || !lakeContainer) return;

    container.style.display = 'none';
    spaceContainer.style.display = 'none';
    lakeContainer.style.display = 'none';

    container.innerHTML = '';
    spaceContainer.innerHTML = '';
    lakeContainer.innerHTML = '';

    if (className === '4') {
        lakeContainer.style.display = 'block';
        if (typeof renderLakeTree === 'function') {
            renderLakeTree(lakeContainer, className);
        }
        return;
    }

    if (className === '3') {
        spaceContainer.style.display = 'block';
        if (typeof ensureSpaceInventoryModal === 'function') ensureSpaceInventoryModal();
        if (typeof renderSpaceTree === 'function') {
            renderSpaceTree(spaceContainer, className);
        }
        return;
    }

    container.style.display = 'block';
    var books = collectBooks(className);
    container.innerHTML = '';

    var scene = document.createElement('div');
    scene.className = 'scene';

    var countersWrap = document.createElement('div');
    countersWrap.className = 'scene-counters';

    var multCounter = document.createElement('div');
    multCounter.className = 'mult-counter';
    multCounter.id = 'mult-counter';
    countersWrap.appendChild(multCounter);

    var colCounter = document.createElement('div');
    colCounter.className = 'mult-counter';
    colCounter.id = 'columns-counter';
    countersWrap.appendChild(colCounter);

    scene.appendChild(countersWrap);

    var posterZone = document.createElement('div');
    posterZone.className = 'poster-zone';
    posterZone.id = 'poster-zone';
    scene.appendChild(posterZone);

    var cabinet = document.createElement('div');
    cabinet.className = 'cabinet';
    cabinet.innerHTML = `
        <div class="cabinet-top"></div>
        <div class="cabinet-body">
            <div class="cabinet-back"></div>
            <div class="cabinet-shelves"></div>
        </div>
        <div class="cabinet-base"></div>
    `;
    scene.appendChild(cabinet);

    var shelvesWrap = cabinet.querySelector('.cabinet-shelves');
    var SHELVES = 5, PER_SHELF = 10, maxBooks = SHELVES * PER_SHELF;
    var extraCount = 0;
    if (books.length > maxBooks) { extraCount = books.length - maxBooks; books = books.slice(0, maxBooks); }

    for (var s = 0; s < SHELVES; s++) {
        var shelf = document.createElement('div');
        shelf.className = 'cabinet-shelf';
        var row = document.createElement('div');
        row.className = 'shelf-books';
        var start = s * PER_SHELF, end = Math.min(start + PER_SHELF, books.length);
        for (var i = start; i < end; i++) row.appendChild(makeBookEl(books[i], i - start));
        shelf.appendChild(row);
        var board = document.createElement('div');
        board.className = 'shelf-board';
        shelf.appendChild(board);
        shelvesWrap.appendChild(shelf);
    }
    if (extraCount > 0) {
        var more = document.createElement('div');
        more.className = 'shelf-more';
        more.textContent = '… и ещё ' + extraCount + ' книг(и)';
        cabinet.appendChild(more);
    }

    var chest = makeChestEl();
    scene.appendChild(chest);

    container.appendChild(scene);

    renderPosters(posterZone);
    ensureInventoryModal();
    enableDropOnZone(posterZone);
    updateMultCounter(className);
    updateSceneCounters();
}

function makeBookEl(book, idx) {
    var el = document.createElement('div');
    el.className = 'book';
    el.style.background = book.color;
    el.style.animationDelay = (idx * 0.04) + 's';
    
    var spine = document.createElement('span');
    spine.className = 'book-spine';
    el.appendChild(spine);
    
    var title = document.createElement('span');
    title.className = 'book-title';
    title.textContent = book.title;
    el.appendChild(title);

    // Добавляем красивую плашку вместо стандартного title
    var tip = document.createElement('div');
    tip.className = 'book-tooltip';
    tip.textContent = book.title;
    el.appendChild(tip);

    return el;
}

function makeChestEl() {
    var chest = document.createElement('div');
    chest.className = 'mchest';
    chest.id = 'mchest';
    chest.title = 'Сундук с картинками';

    var lid = document.createElement('div');
    lid.className = 'mchest-lid';
    chest.appendChild(lid);

    var body = document.createElement('div');
    body.className = 'mchest-body';
    chest.appendChild(body);

    var lock = document.createElement('div');
    lock.className = 'mchest-lock';
    chest.appendChild(lock);

    var badge = document.createElement('div');
    badge.className = 'mchest-badge';
    badge.id = 'mchest-badge';
    chest.appendChild(badge);

    chest.addEventListener('click', function () {
        openInventory();
    });

    updateChestBadge();
    return chest;
}

function updateChestBadge() {
    var badge = document.getElementById('mchest-badge');
    if (!badge) return;
    var activeBtn = document.querySelector('.class-btn.active');
    var cls = activeBtn ? activeBtn.dataset.class : (window._currentClass || '1-2');
    var posters = window.USER_PROGRESS[cls].posters || [];
    var unplaced = posters.filter(function (p) { return !p.placed; }).length;
    badge.textContent = unplaced > 0 ? unplaced : '';
    badge.style.display = unplaced > 0 ? 'flex' : 'none';
}

function renderPosters(zone) {
    zone.innerHTML = '';
    var activeBtn = document.querySelector('.class-btn.active');
    var cls = activeBtn ? activeBtn.dataset.class : (window._currentClass || '1-2');
    var posters = window.USER_PROGRESS[cls].posters || [];
    
    posters.forEach(function (p) {
        if (!p.placed) return;
        var el = document.createElement('div');
        el.className = 'poster';
        el.style.left = p.x + '%';
        el.style.top  = p.y + '%';
        el.dataset.id = p.id;

        el.style.transition = 'left 0.4s cubic-bezier(0.25, 1, 0.5, 1), top 0.4s cubic-bezier(0.25, 1, 0.5, 1), transform 0.2s ease, box-shadow 0.2s ease';

        var img = document.createElement('img');
        img.src = p.url;
        img.alt = p.title;
        img.draggable = false;
        el.appendChild(img);

        var removeBtn = document.createElement('button');
        removeBtn.className = 'poster-remove';
        removeBtn.textContent = '×';
        removeBtn.title = 'Снять со стены и вернуть в сундук';
        removeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            p.placed = false;
            saveProgress();
            setTimeout(updateChestBadge, 10);
        });
        el.appendChild(removeBtn);

        zone.appendChild(el);
    });
    
    updateChestBadge();
}

function ensureInventoryModal() {
    if (document.getElementById('inventory-modal')) return;

    var modal = document.createElement('div');
    modal.id = 'inventory-modal';
    modal.className = 'inv-overlay';
    modal.innerHTML = `
        <div class="inv-window">
            <div class="inv-header">
                <span class="inv-title">🎁 Сундук с картинками</span>
                <button class="inv-close" id="inv-close">×</button>
            </div>
            <div class="inv-hint">Кликни по картинке, чтобы повесить её на стену 👆</div>
            <div class="inv-grid" id="inv-grid"></div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('inv-close').addEventListener('click', closeInventory);
    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeInventory();
    });
}

function openInventory() {
    var modal = document.getElementById('inventory-modal');
    if (!modal) return;
    renderInventoryGrid();
    modal.classList.add('active');
}

function closeInventory() {
    var modal = document.getElementById('inventory-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.classList.remove('lake-inv-overlay');
        var win = modal.querySelector('.inv-window');
        if (win) win.classList.remove('lake-inv-window');

        var titleEl = modal.querySelector('.inv-title');
        if (titleEl) titleEl.textContent = '🎁 Сундук с картинками';
        
        var hintEl = modal.querySelector('.inv-hint');
        if (hintEl) hintEl.textContent = 'Кликни по картинке, чтобы повесить её на стену 👆';

    }
}

function renderInventoryGrid() {
    var grid = document.getElementById('inv-grid');
    if (!grid) return;
    grid.innerHTML = '';

    var activeBtn = document.querySelector('.class-btn.active');
    var cls = activeBtn ? activeBtn.dataset.class : (window._currentClass || '1-2');
    var posters = window.USER_PROGRESS[cls].posters || [];
    var unplaced = posters.filter(function (p) { return !p.placed; });

    if (unplaced.length === 0) {
        grid.innerHTML = '<div class="inv-empty">Пока пусто. Реши 250 примеров на умножение — получишь плакат, который сможешь повесить на стену!</div>';
        return;
    }

    unplaced.forEach(function (p) {
        var cell = document.createElement('div');
        cell.className = 'inv-cell';
        cell.title = p.title + ' (клик — повесить)';

        var img = document.createElement('img');
        img.src = p.url;
        img.alt = p.title;
        img.draggable = false;
        cell.appendChild(img);

        cell.addEventListener('click', function () {
            var pos = findFreeSpot();
            p.placed = true;
            p.x = pos.x;
            p.y = pos.y;
            saveProgress();
            closeInventory();
            setTimeout(updateChestBadge, 10);
        });

        grid.appendChild(cell);
    });
}

function enableDropOnZone(zone) {
    zone.addEventListener('mousedown', function (e) {
        var posterEl = e.target.closest('.poster');
        if (!posterEl) return;
        if (e.target.closest('.poster-remove')) return; 

        e.preventDefault();

        var posterId = posterEl.dataset.id;
        var activeBtn = document.querySelector('.class-btn.active');
        var cls = activeBtn ? activeBtn.dataset.class : (window._currentClass || '1-2');
        var posterData = window.USER_PROGRESS[cls].posters.find(function(p) { return p.id === posterId; });
        if (!posterData) return;

        var zoneRect = zone.getBoundingClientRect();

        posterEl.style.position = 'fixed';
        posterEl.style.zIndex = '9999';
        posterEl.style.pointerEvents = 'none';
        posterEl.style.transition = 'none';

        function moveAt(clientX, clientY) {
            posterEl.style.left = clientX + 'px';
            posterEl.style.top  = clientY + 'px';
        }

        moveAt(e.clientX, e.clientY);

        function onMouseMove(e) {
            moveAt(e.clientX, e.clientY);
        }

        function onMouseUp(e) {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onMouseUp);

            var x = ((e.clientX - zoneRect.left) / zoneRect.width) * 100;
            var y = ((e.clientY - zoneRect.top) / zoneRect.height) * 100;

            x = Math.max(4, Math.min(96, x));
            y = Math.max(4, Math.min(96, y));

            posterEl.style.position = '';
            posterEl.style.zIndex = '';
            posterEl.style.pointerEvents = '';
            posterEl.style.transition = '';

            posterEl.style.left = x + '%';
            posterEl.style.top  = y + '%';

            posterData.x = x;
            posterData.y = y;
            localStorage.setItem('math_app_progress_v4', JSON.stringify(window.USER_PROGRESS));
        }

        function onTouchMove(e) {
            e.preventDefault();
            moveAt(e.touches[0].clientX, e.touches[0].clientY);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onMouseUp);
    });
}

function findFreeSpot() {
    var activeBtn = document.querySelector('.class-btn.active');
    var cls = activeBtn ? activeBtn.dataset.class : (window._currentClass || '1-2');
    var placed = (window.USER_PROGRESS[cls].posters || []).filter(function (p) { return p.placed; });
    var zones = [
        { xMin: 3,  xMax: 18, yMin: 5, yMax: 85 },
        { xMin: 82, xMax: 97, yMin: 5, yMax: 85 },
        { xMin: 22, xMax: 78, yMin: 2, yMax: 8 },
        { xMin: 22, xMax: 78, yMin: 92, yMax: 98 }
    ];
    for (var a = 0; a < 30; a++) {
        var z = zones[Math.floor(Math.random() * zones.length)];
        var x = z.xMin + Math.random() * (z.xMax - z.xMin);
        var y = z.yMin + Math.random() * (z.yMax - z.yMin);
        var ok = true;
        for (var i = 0; i < placed.length; i++) {
            if (Math.abs(placed[i].x - x) < 10 && Math.abs(placed[i].y - y) < 12) { ok = false; break; }
        }
        if (ok) return { x: x, y: y };
    }
    return { x: 5 + Math.random() * 10, y: 10 + Math.random() * 70 };
}

window.renderTree = renderTree;
document.addEventListener('DOMContentLoaded', loadProgress);


// ==================== КОСМОС ====================
function makeStarSVG(color) {
    return `
        <svg viewBox="0 0 24 24" width="100%" height="100%" fill="${color}">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
    `;
}

function renderSpaceTree(container, cls) {
    var progress = window.USER_PROGRESS[cls];
    container.innerHTML = '';

    var stars = [];
    Object.keys(progress.topics).forEach(function (topic) {
        var n = Math.floor(progress.topics[topic] / 15);
        for (var i = 0; i < n; i++) stars.push({ title: 'Тема: ' + topic, color: '#ffd166' });
    });
    var cTot = progress.columns_add || 0;
    var c = Math.floor(cTot / 50);
    for (var i = 0; i < c; i++) stars.push({ title: 'Столбик', color: '#a8e6a3' });

    var maxStars = 40;
    if (stars.length > maxStars) stars = stars.slice(0, maxStars);

    var scene = document.createElement('div');
    scene.className = 'space-scene';

    var countersWrap = document.createElement('div');
    countersWrap.className = 'scene-counters';

    var multCounter = document.createElement('div');
    multCounter.className = 'mult-counter space';
    multCounter.id = 'mult-counter';
    countersWrap.appendChild(multCounter);

    var colCounter = document.createElement('div');
    colCounter.className = 'mult-counter space';
    colCounter.id = 'columns-counter';
    countersWrap.appendChild(colCounter);

    scene.appendChild(countersWrap);

    var planetZone = document.createElement('div');
    planetZone.className = 'planet-zone';
    planetZone.id = 'planet-zone';
    scene.appendChild(planetZone);

    var starPositions = [
        [10, 15], [20, 30], [8, 50], [15, 75], [25, 10], [30, 45], [35, 25],
        [45, 8], [50, 20], [48, 60], [55, 80], [60, 35], [65, 15], [70, 50],
        [75, 25], [80, 65], [85, 10], [88, 40], [90, 70], [95, 55], [40, 85],
        [15, 90], [25, 65], [60, 90], [80, 90], [5, 35], [35, 70], [70, 85]
    ];

    for (var i = 0; i < stars.length && i < starPositions.length; i++) {
        var sEl = document.createElement('div');
        sEl.className = 'space-star';
        sEl.style.left = starPositions[i][0] + '%';
        sEl.style.top = starPositions[i][1] + '%';
        sEl.innerHTML = makeStarSVG(stars[i].color);
        
        var tooltip = document.createElement('div');
        tooltip.className = 'star-tooltip';
        tooltip.textContent = stars[i].title;
        sEl.appendChild(tooltip);

        scene.appendChild(sEl);
    }

    var rocket = document.createElement('div');
    rocket.className = 'mrocket';
    rocket.id = 'mrocket';
    rocket.title = 'Инвентарь с планетами';
    rocket.innerHTML = `
        <div class="rocket-body">
            <div class="rocket-window"></div>
            <div class="rocket-fin left"></div>
            <div class="rocket-fin right"></div>
            <div class="rocket-fire"></div>
        </div>
        <div class="mchest-badge" id="mrocket-badge"></div>
    `;
    rocket.addEventListener('click', function() {
        openSpaceInventory();
    });
    scene.appendChild(rocket);

    container.appendChild(scene);

    renderPlanets(planetZone);
    updateRocketBadge();
    enablePlanetDrop(planetZone);
    updateMultCounter(cls);
    updateSceneCounters();
}

function renderPlanets(zone) {
    zone.innerHTML = '';
    var activeBtn = document.querySelector('.class-btn.active');
    var cls = activeBtn ? activeBtn.dataset.class : (window._currentClass || '1-2');
    var posters = window.USER_PROGRESS[cls].posters || [];
    
    posters.forEach(function (p) {
        if (!p.placed) return;
        var el = document.createElement('div');
        el.className = 'planet';
        el.style.left = p.x + '%';
        el.style.top  = p.y + '%';
        el.dataset.id = p.id;

        var img = document.createElement('img');
        img.src = p.url;
        img.alt = p.title;
        img.draggable = false;
        el.appendChild(img);

        var removeBtn = document.createElement('button');
        removeBtn.className = 'planet-remove';
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            p.placed = false;
            saveProgress();
            setTimeout(updateRocketBadge, 10);
        });
        el.appendChild(removeBtn);

        zone.appendChild(el);
    });
    updateRocketBadge();
}

function ensureSpaceInventoryModal() {
    if (document.getElementById('space-inventory-modal')) return;

    var modal = document.createElement('div');
    modal.id = 'space-inventory-modal';
    modal.className = 'inv-overlay space-inv-overlay';
    modal.innerHTML = `
        <div class="inv-window space-inv-window">
            <div class="inv-header">
                <span class="inv-title">🚀 Планеты</span>
                <button class="inv-close" id="space-inv-close">×</button>
            </div>
            <div class="inv-hint">Кликни по планете, чтобы запустить её на небо</div>
            <div class="inv-grid space-inv-grid" id="space-inv-grid"></div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('space-inv-close').addEventListener('click', function() {
        modal.classList.remove('active');
    });
    modal.addEventListener('click', function (e) {
        if (e.target === modal) modal.classList.remove('active');
    });
}

function openSpaceInventory() {
    var modal = document.getElementById('space-inventory-modal');
    if (!modal) return;
    renderSpaceInventoryGrid();
    modal.classList.add('active');
}

function renderSpaceInventoryGrid() {
    var grid = document.getElementById('space-inv-grid');
    if (!grid) return;
    grid.innerHTML = '';

    var activeBtn = document.querySelector('.class-btn.active');
    var cls = activeBtn ? activeBtn.dataset.class : (window._currentClass || '1-2');
    var posters = window.USER_PROGRESS[cls].posters || [];
    var unplaced = posters.filter(function (p) { return !p.placed; });

    if (unplaced.length === 0) {
        grid.innerHTML = '<div class="inv-empty">Пока пусто. Реши 250 примеров на умножение — получишь планету!</div>';
        return;
    }

    unplaced.forEach(function (p) {
        var cell = document.createElement('div');
        cell.className = 'inv-cell space-inv-cell';
        cell.title = p.title;

        var img = document.createElement('img');
        img.src = p.url;
        img.alt = p.title;
        img.draggable = false;
        cell.appendChild(img);

        cell.addEventListener('click', function () {
            var pos = findFreeSpaceSpot();
            p.placed = true;
            p.x = pos.x;
            p.y = pos.y;
            saveProgress();
            document.getElementById('space-inventory-modal').classList.remove('active');
            setTimeout(updateRocketBadge, 10);
        });

        grid.appendChild(cell);
    });
}

function updateRocketBadge() {
    var badge = document.getElementById('mrocket-badge');
    if (!badge) return;
    var activeBtn = document.querySelector('.class-btn.active');
    var cls = activeBtn ? activeBtn.dataset.class : (window._currentClass || '1-2');
    var posters = window.USER_PROGRESS[cls].posters || [];
    var unplaced = posters.filter(function (p) { return !p.placed; }).length;
    badge.textContent = unplaced > 0 ? unplaced : '';
    badge.style.display = unplaced > 0 ? 'flex' : 'none';
}

function enablePlanetDrop(zone) {
    zone.addEventListener('mousedown', function (e) {
        var planetEl = e.target.closest('.planet');
        if (!planetEl) return;
        if (e.target.closest('.planet-remove')) return; 

        e.preventDefault();

        var posterId = planetEl.dataset.id;
        var activeBtn = document.querySelector('.class-btn.active');
        var cls = activeBtn ? activeBtn.dataset.class : (window._currentClass || '1-2');
        var posterData = window.USER_PROGRESS[cls].posters.find(function(p) { return p.id === posterId; });
        if (!posterData) return;

        var zoneRect = zone.getBoundingClientRect();

        planetEl.style.position = 'fixed';
        planetEl.style.zIndex = '9999';
        planetEl.style.pointerEvents = 'none';
        planetEl.style.transition = 'none';

        function moveAt(clientX, clientY) {
            planetEl.style.left = clientX + 'px';
            planetEl.style.top  = clientY + 'px';
        }

        moveAt(e.clientX, e.clientY);

        function onMouseMove(e) {
            moveAt(e.clientX, e.clientY);
        }

        function onMouseUp(e) {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onMouseUp);

            var x = ((e.clientX - zoneRect.left) / zoneRect.width) * 100;
            var y = ((e.clientY - zoneRect.top)  / zoneRect.height) * 100;

            x = Math.max(4, Math.min(96, x));
            y = Math.max(4, Math.min(96, y));

            planetEl.style.position = '';
            planetEl.style.zIndex = '';
            planetEl.style.pointerEvents = '';
            planetEl.style.transition = '';
            planetEl.style.left = x + '%';
            planetEl.style.top  = y + '%';

            posterData.x = x;
            posterData.y = y;
            localStorage.setItem('math_app_progress_v4', JSON.stringify(window.USER_PROGRESS));
        }

        function onTouchMove(e) {
            e.preventDefault();
            moveAt(e.touches[0].clientX, e.touches[0].clientY);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onMouseUp);
    });
}

function findFreeSpaceSpot() {
    var activeBtn = document.querySelector('.class-btn.active');
    var cls = activeBtn ? activeBtn.dataset.class : (window._currentClass || '1-2');
    var placed = (window.USER_PROGRESS[cls].posters || []).filter(function (p) { return p.placed; });
    var zones = [
        { xMin: 10, xMax: 90, yMin: 10, yMax: 90 },
    ];
    for (var a = 0; a < 40; a++) {
        var z = zones[0];
        var x = z.xMin + Math.random() * (z.xMax - z.xMin);
        var y = z.yMin + Math.random() * (z.yMax - z.yMin);
        var ok = true;
        for (var i = 0; i < placed.length; i++) {
            if (Math.abs(placed[i].x - x) < 15 && Math.abs(placed[i].y - y) < 15) { ok = false; break; }
        }
        if (ok) return { x: x, y: y };
    }
    return { x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 };
}


// ==================== ОЗЕРО (4 КЛАСС) ====================
function renderLakeTree(container, cls) {
    var progress = window.USER_PROGRESS[cls];
    container.innerHTML = '';

    // Сцена
    var scene = document.createElement('div');
    scene.className = 'lake-scene';
    scene.style.position = 'relative';
    scene.style.width = '100%';
    scene.style.minHeight = '520px'; // Защита от схлопывания в полоску
    scene.style.backgroundImage = 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 70%)';

    // Волны
    var wave = document.createElement('div');
    wave.className = 'lake-wave';
    scene.appendChild(wave);

    // Счётчики
    var countersWrap = document.createElement('div');
    countersWrap.className = 'scene-counters';

    var multCounter = document.createElement('div');
    multCounter.className = 'mult-counter';
    multCounter.id = 'mult-counter';
    countersWrap.appendChild(multCounter);

    var colCounter = document.createElement('div');
    colCounter.className = 'mult-counter';
    colCounter.id = 'columns-counter';
    countersWrap.appendChild(colCounter);

    scene.appendChild(countersWrap);

    // Собираем кувшинки
    var flowers = [];
    Object.keys(progress.topics).forEach(function (topic) {
        var n = Math.floor(progress.topics[topic] / 15);
        for (var i = 0; i < n; i++) flowers.push({ title: topic });
    });

    var cTot = progress.columns_add || 0;
    var c = Math.floor(cTot / 50);
    for (var i = 0; i < c; i++) flowers.push({ title: 'Столбик' });

    var maxFlowers = 40;
    if (flowers.length > maxFlowers) flowers = flowers.slice(0, maxFlowers);

    var flowerPositions = [
        [10, 20], [25, 15], [40, 25], [55, 15], [70, 20], [85, 25],
        [15, 40], [30, 35], [45, 45], [60, 35], [75, 40], [90, 45],
        [10, 60], [25, 55], [40, 65], [55, 55], [70, 60], [85, 55],
        [15, 80], [30, 75], [45, 85], [60, 75], [75, 80], [90, 85]
    ];

    for (var i = 0; i < flowers.length && i < flowerPositions.length; i++) {
        var f = document.createElement('div');
        f.className = 'lily-flower';
        f.style.left = flowerPositions[i][0] + '%';
        f.style.top = flowerPositions[i][1] + '%';

        // Создаём красивую плашку
        var tip = document.createElement('div');
        tip.className = 'flower-tooltip';
        tip.textContent = flowers[i].title;
        f.appendChild(tip);

        f.appendChild(makeFlowerSVG(i));
        scene.appendChild(f);
    }

    // Листья с картинками
    var posters = progress.posters || [];
    posters.forEach(function (p, index) {
        if (!p.placed) return;
        var pad = document.createElement('div');
        pad.className = 'lily-pad';
        pad.style.left = p.x + '%';
        pad.style.top = p.y + '%';
        pad.dataset.id = p.id;

        var img = document.createElement('img');
        img.src = p.url;
        img.alt = p.title;
        img.draggable = false;
        pad.appendChild(img);

        // Кнопка удаления (возврат в кораблик)
        var removeBtn = document.createElement('button');
        removeBtn.className = 'lily-remove';
        removeBtn.textContent = '×';
        removeBtn.title = 'Убрать в кораблик';
        
        // Останавливаем перетаскивание при клике на крестик
        removeBtn.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        });

        removeBtn.addEventListener('click', function (e) {
            e.stopPropagation(); // Чтобы не срабатывало перетаскивание
            p.placed = false;
            saveProgress();
            setTimeout(updateBoatBadge, 10);
        });
        pad.appendChild(removeBtn);

        scene.appendChild(pad);
    });

    // Кораблик
    var boat = document.createElement('div');
    boat.className = 'paper-boat';
    boat.id = 'paper-boat';
    boat.innerHTML = `
        <svg viewBox="0 0 80 60">
            <path d="M 10 40 L 70 40 L 60 55 L 20 55 Z" fill="#e8f4f8" stroke="#2a9d8f" stroke-width="3" stroke-linejoin="round"/>
            <path d="M 40 10 L 65 40 L 40 40 Z" fill="#ffffff" stroke="#2a9d8f" stroke-width="3" stroke-linejoin="round"/>
            <path d="M 40 10 L 15 40 L 40 40 Z" fill="#f0faf6" stroke="#2a9d8f" stroke-width="3" stroke-linejoin="round"/>
            <line x1="40" y1="10" x2="40" y2="55" stroke="#1e4a6b" stroke-width="3"/>
        </svg>
        <div class="boat-badge" id="boat-badge"></div>
    `;
    
    boat.addEventListener('click', function() {
        openBoatInventory();
    });
    scene.appendChild(boat);

    container.appendChild(scene);

    // Включаем перетаскивание
    enableLakeDrag(scene);

    // Обновляем
    if (typeof updateSceneCounters === 'function') updateSceneCounters();
    setTimeout(updateBoatBadge, 10);
}


// ==================== РИСУЕМ ФИАЛКУ (ЦЕЛЬНЫЕ ЗАОСТРЁННЫЕ ЛЕПЕСТКИ) ====================
function makeFlowerSVG(seed) {
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");

    // Палитры: нижний слой темнее, верхний — светлее
    var palettes = [
        { dark: '#6a2fa0', mid: '#8e44c9', light: '#c9a3f0', line: '#4d1f7a' }, // Фиолетовый
        { dark: '#8a4dbf', mid: '#b57cf0', light: '#e3ccff', line: '#6a2fa0' }, // Сиреневый
        { dark: '#5b3a9b', mid: '#8e6ad9', light: '#c6b3f0', line: '#3d2470' }, // Индиго
        { dark: '#9a3dbf', mid: '#c47ce0', light: '#f0ccff', line: '#6a1f8a' }  // Розово-фиолетовый
    ];
    var pal = palettes[seed % palettes.length];
    
    // Уникальный ID
    var uid = 'fl' + seed + '_' + Math.random().toString(36).slice(2, 7);

    // Градиенты
    var defs = document.createElementNS(svgNS, "defs");
    function addGradient(id, c1, c2) {
        var g = document.createElementNS(svgNS, "radialGradient");
        g.setAttribute("id", id);
        g.setAttribute("cx", "50%");
        g.setAttribute("cy", "80%");
        g.setAttribute("r", "100%");
        var s1 = document.createElementNS(svgNS, "stop");
        s1.setAttribute("offset", "0%");
        s1.setAttribute("stop-color", c1);
        var s2 = document.createElementNS(svgNS, "stop");
        s2.setAttribute("offset", "100%");
        s2.setAttribute("stop-color", c2);
        g.appendChild(s1);
        g.appendChild(s2);
        defs.appendChild(g);
    }
    addGradient(uid + '_dark',  pal.light, pal.dark);
    addGradient(uid + '_light', '#ffffff', pal.mid);
    svg.appendChild(defs);

    // Лепесток: плавный, округлый у основания, заостряется к кончику
    function petalPath(len, width) {
        var w = width;
        var L = len;
        return [
            'M 0 0',
            // Левая сторона: плавно вверх и наружу
            'C ' + (-w * 0.4) + ' ' + (-L * 0.2) +
            ' ' + (-w * 1.0) + ' ' + (-L * 0.6) +
            ' 0 ' + (-L), // Заострённый верх
            // Правая сторона: плавно вниз и внутрь
            'C ' + ( w * 1.0) + ' ' + (-L * 0.6) +
            ' ' + ( w * 0.4) + ' ' + (-L * 0.2) +
            ' 0 0',
            'Z'
        ].join(' ');
    }

    // Отрисовка слоя
    function drawLayer(count, len, width, fillId, rotateOffset) {
        var g = document.createElementNS(svgNS, "g");
        g.setAttribute("transform", "translate(50 50)");

        for (var k = 0; k < count; k++) {
            var angle = (360 / count) * k + rotateOffset;
            var pg = document.createElementNS(svgNS, "g");
            pg.setAttribute("transform", "rotate(" + angle + ")");

            // Сам лепесток
            var p = document.createElementNS(svgNS, "path");
            p.setAttribute("d", petalPath(len, width));
            p.setAttribute("fill", "url(#" + fillId + ")");
            p.setAttribute("stroke", pal.line);
            p.setAttribute("stroke-width", "1.2");
            p.setAttribute("stroke-linejoin", "round");
            pg.appendChild(p);

            // Тонкие прожилки (3 штуки), сходящиеся к заострённому кончику
            for (var v = -1; v <= 1; v++) {
                var vein = document.createElementNS(svgNS, "path");
                var vx = v * (width * 0.3);
                vein.setAttribute("d", 'M 0 ' + (-len * 0.1) + ' Q ' + (vx * 0.8) + ' ' + (-len * 0.5) + ' 0 ' + (-len * 0.85));
                vein.setAttribute("fill", "none");
                vein.setAttribute("stroke", pal.line);
                vein.setAttribute("stroke-width", "0.6");
                vein.setAttribute("stroke-linecap", "round");
                vein.setAttribute("opacity", "0.3");
                pg.appendChild(vein);
            }
            g.appendChild(pg);
        }
        return g;
    }

    // ===== 1. НИЖНИЙ СЛОЙ (7 лепестков) =====
    svg.appendChild(drawLayer(7, 42, 15, uid + '_dark', 0));

    // ===== 2. ВЕРХНИЙ СЛОЙ (7 лепестков, сдвинуты) =====
    svg.appendChild(drawLayer(7, 30, 11, uid + '_light', 360 / 7 / 2 + 90));

    // ===== 3. СЕРЕДИНКА =====
    var centerG = document.createElementNS(svgNS, "g");
    centerG.setAttribute("transform", "translate(50 50)");

    var ring = document.createElementNS(svgNS, "circle");
    ring.setAttribute("r", "7");
    ring.setAttribute("fill", pal.line);
    centerG.appendChild(ring);

    for (var d = 0; d < 12; d++) {
        var a = (360 / 12) * d;
        var rad = a * Math.PI / 180;
        var dot = document.createElementNS(svgNS, "circle");
        dot.setAttribute("cx", Math.cos(rad) * 4.5);
        dot.setAttribute("cy", Math.sin(rad) * 4.5);
        dot.setAttribute("r", "1.6");
        dot.setAttribute("fill", pal.mid);
        dot.setAttribute("stroke", pal.light);
        dot.setAttribute("stroke-width", "0.5");
        centerG.appendChild(dot);
    }

    var eye = document.createElementNS(svgNS, "circle");
    eye.setAttribute("r", "2.5");
    eye.setAttribute("fill", pal.light);
    centerG.appendChild(eye);

    svg.appendChild(centerG);

    return svg;
}

// ==================== ПЕРЕТАСКИВАНИЕ КУВШИНОК ====================
function enableLakeDrag(zone) {
    zone.addEventListener('mousedown', function (e) {
        // Если кликнули на кнопку удаления — не перетаскиваем
        if (e.target.closest('.lily-remove')) return;

        var padEl = e.target.closest('.lily-pad');
        if (!padEl) return;


        e.preventDefault();

        var posterId = padEl.dataset.id;
        if (!posterId) return;

        var activeBtn = document.querySelector('.class-btn.active');
        var cls = activeBtn ? activeBtn.dataset.class : '4';
        var posterData = (window.USER_PROGRESS[cls].posters || []).find(function (p) {
            return p.id === posterId;
        });
        if (!posterData) return;

        var scene = padEl.closest('.lake-scene') || zone;
        var zoneRect = scene.getBoundingClientRect();

        // Сохраняем текущие проценты, чтобы не было скачка
        var startLeft = padEl.offsetLeft;
        var startTop = padEl.offsetTop;

        padEl.style.position = 'fixed';
        padEl.style.zIndex = '9999';
        padEl.style.pointerEvents = 'none';
        padEl.style.transition = 'none';
        padEl.style.margin = '0';

        function moveAt(clientX, clientY) {
            padEl.style.left = clientX + 'px';
            padEl.style.top  = clientY + 'px';
            padEl.style.transform = 'translate(-50%, -50%)';
        }

        moveAt(e.clientX, e.clientY);

        function onMouseMove(ev) {
            moveAt(ev.clientX, ev.clientY);
        }

        function onMouseUp(ev) {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onMouseUp);

            var x = ((ev.clientX - zoneRect.left) / zoneRect.width) * 100;
            var y = ((ev.clientY - zoneRect.top)  / zoneRect.height) * 100;

            x = Math.max(4, Math.min(96, x));
            y = Math.max(4, Math.min(96, y));

            padEl.style.position = '';
            padEl.style.zIndex = '';
            padEl.style.pointerEvents = '';
            padEl.style.transition = '';
            padEl.style.margin = '';
            padEl.style.left = x + '%';
            padEl.style.top  = y + '%';
            padEl.style.transform = 'translate(-50%, -50%)'; // ВАЖНО: возвращаем центровку

            posterData.x = x;
            posterData.y = y;
            localStorage.setItem('math_app_progress_v4', JSON.stringify(window.USER_PROGRESS));
        }

        function onTouchMove(ev) {
            ev.preventDefault();
            moveAt(ev.touches[0].clientX, ev.touches[0].clientY);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onMouseUp);
    });
}

function updateBoatBadge() {
    var badge = document.getElementById('boat-badge');
    if (!badge) return;
    
    var activeBtn = document.querySelector('.class-btn.active');
    var cls = activeBtn ? activeBtn.dataset.class : '4';
    var posters = window.USER_PROGRESS[cls].posters || [];
    var unplaced = posters.filter(function (p) { return !p.placed; }).length;
    
    badge.textContent = unplaced > 0 ? unplaced : '';
    badge.style.display = unplaced > 0 ? 'flex' : 'none';
}

function openBoatInventory() {
    var modal = document.getElementById('inventory-modal');
    if (!modal) return;

    // Голубой стиль для озера
    modal.classList.add('lake-inv-overlay');
    var win = modal.querySelector('.inv-window');
    if (win) win.classList.add('lake-inv-window');

var titleEl = modal.querySelector('.inv-title');
    if (titleEl) titleEl.textContent = '⛵ Кораблик с кувшинками';
    
    var hintEl = modal.querySelector('.inv-hint');
    if (hintEl) hintEl.textContent = 'Кликни по картинке, чтобы положить её на воду 👆';

    var grid = document.getElementById('inv-grid');
    if (!grid) return;


    var grid = document.getElementById('inv-grid');
    if (!grid) return;
    grid.innerHTML = '';

    var activeBtn = document.querySelector('.class-btn.active');
    var cls = activeBtn ? activeBtn.dataset.class : '4';
    var posters = window.USER_PROGRESS[cls].posters || [];
    var unplaced = posters.filter(function (p) { return !p.placed; });

    if (unplaced.length === 0) {
        grid.innerHTML = '<div class="inv-empty">Пока пусто. Реши 250 примеров на умножение — получишь листик кувшинки!</div>';
        modal.classList.add('active');
        return;
    }

    unplaced.forEach(function (p) {
        var cell = document.createElement('div');
        cell.className = 'inv-cell';

        var img = document.createElement('img');
        img.src = p.url;
        img.alt = p.title;
        img.draggable = false;
        cell.appendChild(img);

        cell.addEventListener('click', function () {
            var pos = (typeof findFreeSpaceSpot === 'function') ? findFreeSpaceSpot() : { x: 50, y: 50 };
            p.placed = true;
            p.x = pos.x;
            p.y = pos.y;
            saveProgress();
            modal.classList.remove('active');
            setTimeout(function() {
                var badge = document.getElementById('boat-badge');
                if (badge) {
                    var unplacedCount = window.USER_PROGRESS[cls].posters.filter(function(x) { return !x.placed; }).length;
                    badge.textContent = unplacedCount > 0 ? unplacedCount : '';
                    badge.style.display = unplacedCount > 0 ? 'flex' : 'none';
                }
            }, 10);
        });

        grid.appendChild(cell);
    });

    modal.classList.add('active');
}