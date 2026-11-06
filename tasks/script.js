// Задачи по классам (переменные из файлов tasks1-2.js и т.д.)
var tasksByClass = {
    '1-2': typeof tasks1_2 !== 'undefined' ? tasks1_2 : {},
    '3':   typeof tasks3   !== 'undefined' ? tasks3   : {},
    '4':   typeof tasks4   !== 'undefined' ? tasks4   : {}
};

var subTopicsMap = {
    'Зачёт 1': ['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4'],
    'Зачёт 2': ['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4'],
    'Зачёт 3': ['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4'],
    'Зачёт 4': ['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4'],
    'Зачёт 5': ['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4'],
    'Зачёт 6': ['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4'],
    'Зачёт 7': ['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4'],
    'Зачёт 8': ['Вариант 1', 'Вариант 2'],
    'Зачёт 9': ['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4'],
    'Зачёт 10': ['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4'],
    'Зачёт 11': ['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4'],
    'Зачёт 12': ['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4'],
    'Зачёт 13': ['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4'],
    'Зачёт 14': ['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4']
};

var classButtons = document.querySelectorAll('.class-btn');
var topicsTitle = document.getElementById('topics-title');
var topicsList = document.getElementById('topics-list');
var tasksDisplay = document.getElementById('tasks-display');

function renderTopics(className) {
    window._currentClass = className;
    var tc = document.getElementById('topics-container');
    if (tc) tc.style.display = 'block';

    // Настраиваем заголовок
    var titleEl = document.getElementById('topics-title');
    titleEl.textContent = 'Темы для ' + className + ' класса';
    titleEl.classList.add('clickable-title'); // Добавляем стиль кликабельности

    // Получаем элементы
    var listWrapper = document.getElementById('topics-list-wrapper');
    var progressWrapper = document.getElementById('progress-display');
    var progressBtn = document.getElementById('progress-btn');

    // Функция возврата к темам
    function showTopics() {
        listWrapper.style.display = 'block';
        progressWrapper.style.display = 'none';
        titleEl.style.opacity = '1';
    }

    // Функция показа прогресса
    function showProgress() {
        listWrapper.style.display = 'none';
        progressWrapper.style.display = 'block';
        titleEl.style.opacity = '0.6'; // Затемняем заголовок
    }

    // Обработчик клика на заголовок (возврат к темам)
    titleEl.onclick = showTopics;

    // Обработчик клика на кнопку "Мой прогресс"
    progressBtn.onclick = function() {
        showProgress();
        if (typeof window.renderTree === 'function') {
            window.renderTree(className); // Передаем класс!
        }
    };

    // Сбрасываем состояние при переключении класса
    showTopics();

    topicsList.innerHTML = '';
    tasksDisplay.innerHTML = '<div class="placeholder-message">Выбери тему, чтобы увидеть задачи 📚</div>';
    
    // ... Дальше идет твой старый код генерации кнопок тем ...
    var topics = tasksByClass[className];
    // ...
    var topics = tasksByClass[className];
    if (!topics || Object.keys(topics).length === 0) {
        topicsList.innerHTML = '<div class="placeholder-message">Для этого класса пока нет тем 😕</div>';
        return;
    }

    var classTitleMap = { '1-2': '1-2 класса', '3': '3 класса', '4': '4 класса' };
    topicsTitle.textContent = 'Темы для ' + classTitleMap[className];


    Object.keys(topics).forEach(function(topic) {
        var btn = document.createElement('button');
        btn.classList.add('topic-btn');
        btn.textContent = topic;
        btn.dataset.topic = topic;

        btn.addEventListener('click', function() {
            var all = document.querySelectorAll('.topic-btn');
            for (var i = 0; i < all.length; i++) all[i].classList.remove('selected');
            this.classList.add('selected');

            if (subTopicsMap[topic]) {
                renderSubTopics(className, topic, subTopicsMap[topic]);
            } else {
                showTasks(className, topic);
            }
        });

        topicsList.appendChild(btn);
    });
}

function renderSubTopics(className, parentTopic, variants) {
    tasksDisplay.innerHTML = '';

    var subContainer = document.createElement('div');
    subContainer.classList.add('subtopics-container');

    var subTitle = document.createElement('p');
    subTitle.classList.add('subtopics-title');
    subTitle.textContent = 'Выбери вариант:';
    subContainer.appendChild(subTitle);

    var wrapper = document.createElement('div');
    wrapper.classList.add('subtopics-list');

    variants.forEach(function(variant, index) {
        var subBtn = document.createElement('button');
        subBtn.classList.add('subtopic-btn');
        subBtn.textContent = variant;

        subBtn.addEventListener('click', function() {
            var all = wrapper.querySelectorAll('.subtopic-btn');
            for (var i = 0; i < all.length; i++) all[i].classList.remove('selected');
            this.classList.add('selected');
            showTaskByVariant(className, parentTopic, index);
        });

        wrapper.appendChild(subBtn);
    });

    subContainer.appendChild(wrapper);
    tasksDisplay.appendChild(subContainer);

    var hint = document.createElement('div');
    hint.classList.add('placeholder-message');
    hint.textContent = 'Нажми на вариант, чтобы увидеть задачу 👆';
    tasksDisplay.appendChild(hint);
}

function showTasks(className, topicName) {
    if (window.Trainer && window.Trainer.isActive && window.Trainer.isActive()) {
        window.Trainer.exit();
    }

    // Если для темы есть банк задач — открываем Solver (модалка выбора количества)
    if (window.BANKS && window.BANKS[topicName] && window.BANKS[topicName].length > 0) {
        if (window.Solver && typeof window.Solver.open === 'function') {
            window.Solver.open(topicName);
            return;
        }
    }

    // Fallback: просто показать текст
    var topics = tasksByClass[className];
    if (!topics || !topics[topicName]) {
        tasksDisplay.innerHTML = '<div class="placeholder-message">Задачи не найдены 🤔</div>';
        return;
    }
    var arr = topics[topicName];
    if (!arr || arr.length === 0) {
        tasksDisplay.innerHTML = '<div class="placeholder-message">Для этой темы пока нет задач 😴</div>';
        return;
    }
    var html = '';
    arr.forEach(function (task, index) {
        html += '<div class="task-item"><strong>' + (index + 1) + '.</strong> ' + task + '</div>';
    });
    tasksDisplay.innerHTML = html;
}



function showTaskByVariant(className, topicName, variantIndex) {
    if (window.Trainer && window.Trainer.isActive && window.Trainer.isActive()) {
        window.Trainer.exit();
    }

    if (window.BANKS && window.BANKS[topicName] && window.BANKS[topicName].length > 0) {
        if (window.Solver && typeof window.Solver.openVariant === 'function') {
            window.Solver.openVariant(topicName, variantIndex + 1);
            return;
        }
    }

    var topics = tasksByClass[className];
    if (!topics || !topics[topicName]) return;
    var arr = topics[topicName];
    if (!arr || !arr[variantIndex]) return;
    tasksDisplay.innerHTML = '<div class="task-item">' + arr[variantIndex] + '</div>';
}

// Навешиваем обработчики
for (var i = 0; i < classButtons.length; i++) {
    classButtons[i].addEventListener('click', function() {
        var className = this.dataset.class;
        for (var j = 0; j < classButtons.length; j++) classButtons[j].classList.remove('active');
        this.classList.add('active');
        renderTopics(className);
    });

}

// Модалка правил
document.addEventListener('DOMContentLoaded', function () {
    var rulesBtn = document.getElementById('rules-btn');
    var rulesModal = document.getElementById('rules-modal');
    var rulesClose = document.getElementById('rules-close');
    var rulesTitle = document.getElementById('rules-title');
    var rulesContent = document.getElementById('rules-content');

    if (rulesBtn && rulesModal) {
        rulesBtn.addEventListener('click', function () {
            // Проверяем, какой класс сейчас активен
            var activeClassBtn = document.querySelector('.class-btn.active');
            var className = activeClassBtn ? activeClassBtn.dataset.class : '1-2';

            if (className === '1-2') {
                // ПРАВИЛА ДЛЯ КОМНАТЫ
                rulesTitle.textContent = '🎓 Как заработать награды (1-2 класс)';
                rulesContent.innerHTML = `
                    <div class="rules-card">
                        <div class="rules-icon">📚</div>
                        <div class="rules-text">
                            <h4>Книги на полку</h4>
                            <p>Каждые <b>15 правильно решённых задач</b> одной темы = <b>1 книга</b> в шкафу.</p>
                            <p>Каждые <b>50 примеров в столбик</b> (сложение и вычитание) = <b>1 книга</b>.</p>
                        </div>
                    </div>
                    <div class="rules-card">
                        <div class="rules-icon">🖼️</div>
                        <div class="rules-text">
                            <h4>Картинки для стены</h4>
                            <p>Каждые <b>250 правильно решённых примеров</b> в тренажёре «Таблица умножения» = <b>1 картинка</b>.</p>
                            <p>Картинки хранятся в сундуке. Нажми на сундук, чтобы достать картинку и повесить её на стену вокруг шкафа.</p>
                        </div>
                    </div>
                `;




                       } else if (className === '3') {
                // ПРАВИЛА ДЛЯ КОСМОСА (3 класс)
                rulesTitle.textContent = '🎓 Как заработать награды (3 класс)';
                rulesContent.innerHTML = `
                    <div class="rules-card">
                        <div class="rules-icon">⭐</div>
                        <div class="rules-text">
                            <h4>Звёзды на небе</h4>
                            <p>Каждые <b>15 правильно решённых задач</b> одной темы = <b>1 звезда</b>.</p>
                            <p>Каждые <b>50 примеров в столбик</b> = <b>1 звезда</b>.</p>
                            <p>Наведи мышку на звезду, чтобы узнать, за какую тему она далась.</p>
                        </div>
                    </div>
                    <div class="rules-card">
                        <div class="rules-icon">🪐</div>
                        <div class="rules-text">
                            <h4>Планеты в ракете</h4>
                            <p>Каждые <b>250 правильно решённых примеров</b> в тренажёре «Таблица умножения» = <b>1 планета</b>.</p>
                            <p>Планеты хранятся в ракете в левом нижнем углу. Нажми на ракету, чтобы достать планету и запустить её на небо.</p>
                        </div>
                    </div>
                `;
            } else if (className === '4') {
                // ПРАВИЛА ДЛЯ ОЗЕРА (4 класс)
                rulesTitle.textContent = '🎓 Как заработать награды (4 класс)';
                rulesContent.innerHTML = `
                    <div class="rules-card">
                        <div class="rules-icon">🌸</div>
                        <div class="rules-text">
                            <h4>Кувшинки на озере</h4>
                            <p>Каждые <b>15 правильно решённых задач</b> одной темы = <b>1 цветок (кувшинка)</b>.</p>
                            <p>Каждые <b>50 примеров в столбик</b> = <b>1 цветок (кувшинка)</b>.</p>
                        </div>
                    </div>
                    <div class="rules-card">
                        <div class="rules-icon">🖼️</div>
                        <div class="rules-text">
                            <h4>Листья с картинками</h4>
                            <p>Каждые <b>250 правильно решённых примеров</b> в тренажёре «Таблица умножения» = <b>1 лист с картинкой</b>.</p>
                            <p>Листья хранятся в кораблике в левом нижнем углу. Нажми на кораблик, чтобы достать лист и положить его на воду.</p>
                        </div>
                    </div>
                `;
            }




            rulesModal.classList.add('active');
        });
    }

    if (rulesClose && rulesModal) {
        rulesClose.addEventListener('click', function () {
            rulesModal.classList.remove('active');
        });
    }

    if (rulesModal) {
        rulesModal.addEventListener('click', function (e) {
            if (e.target === rulesModal) rulesModal.classList.remove('active');
        });
    }
});


// Управление новогодней гирляндой
document.addEventListener('DOMContentLoaded', function () {
    var toggleBtn = document.getElementById('garland-toggle');
    var garlands = document.querySelectorAll('.garland');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            // Переключаем класс у гирлянд
            garlands.forEach(function(g) {
                g.classList.toggle('hidden');
            });
            // Меняем вид кнопки
            this.classList.toggle('off');
            
            // Меняем emoji (ёлочка / перечёркнутая ёлочка)
            if (this.classList.contains('off')) {
                this.textContent = '🎄'; // или можно '🚫' но ёлочка приятнее
                this.title = 'Включить гирлянды';
            } else {
                this.textContent = '🎄';
                this.title = 'Выключить гирлянды';
            }
        });
    }
});

// Переключение вкладок "Тренажёры" и "Справочник"
document.addEventListener('DOMContentLoaded', function () {
    var tabTrainers = document.getElementById('tab-trainers');
    var tabGuide = document.getElementById('tab-guide');
    var viewTrainers = document.getElementById('trainers-view');
    var viewGuide = document.getElementById('guide-view');
    var guideContent = document.getElementById('guide-content');
    
    // Получаем элементы для управления темами
    var topicsContainer = document.getElementById('topics-container');
    var topicsWrapper = document.getElementById('topics-list-wrapper');
    var topicsHeader = document.querySelector('.topics-header-row');

    function renderGuide() {
        if (!guideContent || !window.GUIDE_DATA) return;
        guideContent.innerHTML = '';
        window.GUIDE_DATA.forEach(function(section) {
            var h3 = document.createElement('h3');
            h3.textContent = section.title;
            var div = document.createElement('div');
            div.innerHTML = section.content;
            guideContent.appendChild(h3);
            guideContent.appendChild(div);
        });
    }

    // Клик по вкладке "Тренажёры"
    if (tabTrainers) {
        tabTrainers.addEventListener('click', function () {
            tabTrainers.classList.add('active');
            tabGuide.classList.remove('active');
            
            if (viewTrainers) viewTrainers.style.display = 'block';
            if (viewGuide) viewGuide.style.display = 'none';
            
            // Прячем блок тем (если он был открыт)
            if (topicsContainer) topicsContainer.style.display = 'none';
        });
    }

    // Клик по вкладке "Справочник"
    if (tabGuide) {
        tabGuide.addEventListener('click', function () {
            tabGuide.classList.add('active');
            tabTrainers.classList.remove('active');
            
            if (viewTrainers) viewTrainers.style.display = 'none'; // прячем тренажеры
            if (viewGuide) viewGuide.style.display = 'block';    // показываем справочник
            
            // ВАЖНО: Показываем контейнер тем, но прячем сами темы внутри него,
            // чтобы справочник (если он лежит внутри) не сломался.
            if (topicsContainer) topicsContainer.style.display = 'block';
            if (topicsWrapper) topicsWrapper.style.display = 'none';
            if (topicsHeader) topicsHeader.style.display = 'none';
            
            renderGuide();
        });
    }

    // Клик по кнопкам классов (чтобы справочник прятался, а темы показывались)
    var classButtons = document.querySelectorAll('.class-btn');
    classButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (tabTrainers) tabTrainers.classList.add('active');
            if (tabGuide) tabGuide.classList.remove('active');
            
            if (viewGuide) viewGuide.style.display = 'none'; // прячем справочник
            if (viewTrainers) viewTrainers.style.display = 'block';
            
            // Возвращаем темам их нормальный вид
            if (topicsWrapper) topicsWrapper.style.display = 'block';
            if (topicsHeader) topicsHeader.style.display = 'flex'; // или block, как у тебя в css
        });
    });
});

// ==================== ИГРА ДИНОЗАВРИК ====================
var dinoGameInterval = null;
var isGameRunning = false;
var dinoGameIdCounter = 0; // Чтобы создавать уникальные ID для каждой игры

// Эта функция будет вызываться из guide.js каждый раз, когда открывается справочник
window.initDinoGame = function() {
    var container = document.getElementById('dino-game-container-js');
    if (!container) return;

    // Если игра уже запущена - останавливаем
    if (window.dinoGameInterval) clearInterval(window.dinoGameInterval);
    window.isGameRunning = false;

    var sInput = document.getElementById('dino-s-input');
    var vSpan = document.getElementById('stat-v');
    var tSpan = document.getElementById('stat-t');
    var startBtn = document.getElementById('dino-start-btn');

    // Функция обновления формул (S, V, T)
    function updateStats() {
        var s = parseInt(sInput.value) || 100;
        var v = 5; 
        var t = s / v;
        vSpan.textContent = v;
        tSpan.textContent = t.toFixed(1);
    }

    if (sInput) {
        sInput.oninput = updateStats;
    }
    updateStats();

    if (startBtn) {
        startBtn.onclick = function() {
            if (window.isGameRunning) return;

            container.innerHTML = '';
            
            var dinoGameIdCounter = Date.now();
            var dinoId = 'dino-' + dinoGameIdCounter;
            var cactusId = 'cactus-' + dinoGameIdCounter;
            var gameId = 'game-' + dinoGameIdCounter;

            container.innerHTML = `
                <div class="game" id="${gameId}">
                    <div id="${dinoId}"></div>
                    <div id="${cactusId}"></div>
                </div>
            `;

            var dino = document.getElementById(dinoId);
            var cactus = document.getElementById(cactusId);
            var game = document.getElementById(gameId);

            if (!dino || !cactus || !game) return;

            window.isGameRunning = true;
            var s = parseInt(sInput.value) || 100;
            var v = 5;

            vSpan.textContent = v;
            tSpan.textContent = (s / v).toFixed(1);

            var cactusSpeed = 2;
            function startCactusAnimation() {
                cactus.style.animation = 'none';
                void cactus.offsetWidth;
                cactus.style.animation = `block ${cactusSpeed}s infinite linear`;
            }
            startCactusAnimation();

            function jump() {
                if (!window.isGameRunning) return;
                if (!dino.classList.contains('dino-jump')) {
                    dino.classList.add('dino-jump');
                    setTimeout(function() {
                        dino.classList.remove('dino-jump');
                    }, 300);
                }
            }

            function onKeyDown(e) {
                if (e.code === 'Space' || e.code === 'ArrowUp') {
                    e.preventDefault();
                    jump();
                }
            }

            function onGameClick(e) {
                jump();
            }

            document.addEventListener('keydown', onKeyDown);
            game.addEventListener('click', onGameClick);

            if (window.dinoGameInterval) clearInterval(window.dinoGameInterval);
            
            window.dinoGameInterval = setInterval(function() {
                if (!window.isGameRunning) return;

                var dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("top"));
                var cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));

                if (cactusLeft < 50 && cactusLeft > 0 && dinoTop >= 140) {
                    window.isGameRunning = false;
                    clearInterval(window.dinoGameInterval);
                    
                    var over = document.createElement('div');
                    over.className = 'game-over';
                    over.textContent = 'ИГРА ОКОНЧЕНА';
                    game.appendChild(over);

                    document.removeEventListener('keydown', onKeyDown);
                    game.removeEventListener('click', onGameClick);
                }
            }, 10);

            var speedInterval = setInterval(function() {
                if (!window.isGameRunning) {
                    clearInterval(speedInterval);
                    return;
                }
                v += 5;
                vSpan.textContent = v;
                tSpan.textContent = (s / v).toFixed(1);
                
                cactusSpeed = Math.max(0.8, cactusSpeed - 0.1);
                startCactusAnimation();
            }, 5000);
        };
    }
};

