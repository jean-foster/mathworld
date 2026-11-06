// tasks/trainers/trainer.js
// Общая логика тренажёров. Работает в том же экране, что и Solver.

(function () {

var trainerState = {
    active: false,
    key: null,
    limit: 0,           // ДОБАВИТЬ: сколько примеров надо решить
    solved: 0,          // ДОБАВИТЬ: сколько уже решено
    onFinish: null,     // ДОБАВИТЬ: функция, которая вызовется в конце
    
    config: null,       // результат start()
    example: null,      // текущий пример
    score: 0,
    checked: false
};

var el = {};

function init() {
    el.taskMode    = document.getElementById('solver-task-mode');
    el.trainerMode = document.getElementById('solver-trainer-mode');
    el.example     = document.getElementById('trainer-example');
    el.answer      = document.getElementById('trainer-answer-input');
    el.checkBtn    = document.getElementById('trainer-check-btn');
    el.nextBtn     = document.getElementById('solver-next-btn');
    el.feedback    = document.getElementById('solver-feedback');
    el.counter     = document.getElementById('solver-counter');
    el.topicBadge  = document.getElementById('solver-topic-badge');

var numbersBtn = document.querySelector('.trainer-btn[data-trainer="numbers"]');
if (numbersBtn) numbersBtn.addEventListener('click', function () {
    document.getElementById('modal-numbers').classList.add('active');
});

var numbersModal = document.getElementById('modal-numbers');
if (numbersModal) {
    numbersModal.querySelectorAll('[data-numbers-type]').forEach(function (b) {
        if (b.disabled) return;
        b.addEventListener('click', function () {
            var type = this.dataset.numbersType;
            closeAllModals();
            
            // Проверяем, что выбрал пользователь
            if (type === 'clock') {
                if (window.startClockTrainer) window.startClockTrainer();
            } else if (type === 'digits') {
                if (window.startNumbersTrainer) window.startNumbersTrainer(type);
            }
        });
    });
    var cancelNumbers = numbersModal.querySelector('[data-cancel]');
    if (cancelNumbers) cancelNumbers.addEventListener('click', closeAllModals);
}


// Кнопка «Уравнения»
var eqBtn = document.querySelector('.trainer-btn[data-trainer="equations"]');
if (eqBtn) eqBtn.addEventListener('click', function () {
    document.getElementById('modal-equations-type').classList.add('active');
});

// Выбор типа уравнения
var eqTypeModal = document.getElementById('modal-equations-type');
if (eqTypeModal) {
    eqTypeModal.querySelectorAll('[data-eq-type]').forEach(function (b) {
        b.addEventListener('click', function () {
            var type = this.dataset.eqType; // 'easy', 'hard' или 'bank'
            closeAllModals();
            
            if (type === 'bank') {
                startBankEquationsTrainer();
            } else {
                // Для 'easy' и 'hard' запускаем генератор
                startEquationsTrainer(type);
            }
        });
    });
    
    var cancelEqType = eqTypeModal.querySelector('[data-cancel]');
    if (cancelEqType) cancelEqType.addEventListener('click', closeAllModals);
}

// Выбор сложности
var eqLevelModal = document.getElementById('modal-equations-level');
if (eqLevelModal) {
    eqLevelModal.querySelectorAll('[data-eq-level]').forEach(function (b) {
        b.addEventListener('click', function () {
            var level = this.dataset.eqLevel;
            closeAllModals();
            

          startEquationsTrainer(window._pendingEqType, level);
        });
    });
    
    var cancelEqLevel = eqLevelModal.querySelector('[data-cancel]');
    if (cancelEqLevel) cancelEqLevel.addEventListener('click', closeAllModals);
}


    // Кнопки выбора операции для столбика
    var columnsModal = document.getElementById('modal-columns');
    if (columnsModal) {
columnsModal.querySelectorAll('[data-op]').forEach(function (b) {
    if (b.disabled) return;
    b.addEventListener('click', function () {
        var op = this.dataset.op;
        closeAllModals();
        if (op === 'div') {
            openDivisionTypeModal();
        } else {
            openColumnsRangeModal(op);
        }
    });
});
        var cancelBtn = columnsModal.querySelector('[data-cancel]');
        if (cancelBtn) cancelBtn.addEventListener('click', closeAllModals);
    }


// Кнопка «Примеры по действиям»
var orderBtn = document.querySelector('.trainer-btn[data-trainer="order"]');
if (orderBtn) orderBtn.addEventListener('click', function () {
    document.getElementById('modal-order-level').classList.add('active');
});

var orderModal = document.getElementById('modal-order-level');
if (orderModal) {
    orderModal.querySelectorAll('[data-order-level]').forEach(function (b) {
        b.addEventListener('click', function () {
            var level = this.dataset.orderLevel;
            closeAllModals();
            startOrderTrainer(level);
        });
    });
    var cancelOrder = orderModal.querySelector('[data-cancel]');
    if (cancelOrder) cancelCancelOrder = cancelOrder.addEventListener('click', closeAllModals);
}

// Кнопка «Единицы измерения»
var unitsBtn = document.querySelector('.trainer-btn[data-trainer="units"]');
if (unitsBtn) unitsBtn.addEventListener('click', function () {
    document.getElementById('modal-units').classList.add('active');
});

// Категории в модалке единиц
var unitsModal = document.getElementById('modal-units');
if (unitsModal) {
    unitsModal.querySelectorAll('[data-units]').forEach(function (b) {
        b.addEventListener('click', function () {
            var category = this.dataset.units;
            closeAllModals();
            startUnitsTrainer(category);
        });
    });
    var cancelUnits = unitsModal.querySelector('[data-cancel]');
    if (cancelUnits) cancelUnits.addEventListener('click', closeAllModals);
}

// Кнопка «+ добавить строку» в единицах
var unitsAddBtn = document.getElementById('units-action-add-row');
if (unitsAddBtn) {
    unitsAddBtn.addEventListener('click', addUnitsActionRow);
}

// Кнопки модалки «деление — с остатком / без»
var divTypeModal = document.getElementById('modal-division-type');
if (divTypeModal) {
    divTypeModal.querySelectorAll('[data-remainder]').forEach(function (b) {
        b.addEventListener('click', function () {
            var withRemainder = (this.dataset.remainder === 'yes');
            closeAllModals();
            openDivisionRangeModal(withRemainder);
        });
    });
    var cancelDiv = divTypeModal.querySelector('[data-cancel]');
    if (cancelDiv) cancelDiv.addEventListener('click', closeAllModals);
}

    // Кнопки выбора разряда
    var rangeModal = document.getElementById('modal-columns-range');
    if (rangeModal) {
        rangeModal.querySelectorAll('[data-max]').forEach(function (b) {
            b.addEventListener('click', function () {
                var max = parseInt(this.dataset.max, 10);
                closeAllModals();
                startColumnsTrainer('add', max);
            });
        });
        var cancelBtn2 = rangeModal.querySelector('[data-cancel]');
        if (cancelBtn2) cancelBtn2.addEventListener('click', closeAllModals);
    }

    // Обработчик на кнопку «Таблица умножения»
    var multBtn = document.querySelector('.trainer-btn[data-trainer="multiplication"]');
    if (multBtn) multBtn.addEventListener('click', openMultiplicationModal);
    // Обработчик на кнопку «Примеры в столбик»
    var columnsBtn = document.querySelector('.trainer-btn[data-trainer="columns"]');
    if (columnsBtn) columnsBtn.addEventListener('click', openColumnsModal);
    // Кнопки в модалке таблицы умножения
    var multModal = document.getElementById('modal-multiplication');
    if (multModal) {
        multModal.querySelectorAll('.trainer-num-btn').forEach(function (b) {
            b.addEventListener('click', function () {
                var max = parseInt(this.dataset.max, 10);
                closeAllModals();
                startTrainer('multiplication', max);
            });
        });
        multModal.querySelector('[data-cancel]').addEventListener('click', closeAllModals);
    }

    // Кнопки «Проверить»/«Дальше» в тренажёре
    if (el.checkBtn) {
        // Добавляем свой обработчик, не удаляя существующий
        el.checkBtn.addEventListener('click', trainerCheck);
    }
    if (el.nextBtn) {
        el.nextBtn.addEventListener('click', trainerNext);
    }

    // Enter в поле ответа — сразу проверить
    if (el.answer) {
        el.answer.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (trainerState.checked) trainerNext();
                else trainerCheck();
            }
        });
    }
}

// Универсальная функция для скрытия ВСЕХ тренажеров
function hideAllTrainers() {
    var trainers = [
        'trainer-simple-mode', 
        'trainer-column-mode', 
        'trainer-units-mode', 
        'trainer-rect-mode', 
        'trainer-equations-mode', 
        'trainer-order-mode', 
        'trainer-numbers-mode', 
        'trainer-clock-mode', 
        'trainer-roman-mode' 
    ];
    trainers.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
}

function startUnitsTrainer(category) {
    clearSolverFeedback();
    var screen = document.getElementById('solver-screen');
    screen.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (el.taskMode)    el.taskMode.style.display = 'none';
    if (el.trainerMode) el.trainerMode.style.display = 'block';

    // Прячем все остальные тренажеры
    document.getElementById('trainer-simple-mode').style.display = 'none';
    document.getElementById('trainer-column-mode').style.display = 'none';
    document.getElementById('trainer-units-mode').style.display = 'block';
    document.getElementById('trainer-rect-mode').style.display = 'none';
    document.getElementById('trainer-equations-mode').style.display = 'none';
    document.getElementById('trainer-order-mode').style.display = 'none'; 
    document.getElementById('trainer-numbers-mode').style.display = 'none';
    document.getElementById('trainer-clock-mode').style.display = 'none';
    document.getElementById('trainer-roman-mode').style.display = 'none';

    var taskText = document.getElementById('solver-task-text');
    if (taskText) taskText.style.display = 'none';

    if (el.topicBadge) el.topicBadge.textContent = '📏 Единицы измерения';

    window._unitsState = {
        score: 0,
        example: null,
        config: window.TRAINERS['units'].start(category)
    };

    var counter = document.getElementById('solver-counter');
    if (counter) {
        counter.textContent = 'Очки: 0';
        counter.classList.add('trainer-score-badge');
    }

    // Привязка кнопок (только один раз при запуске)
    document.getElementById('units-solve-btn').onclick = function() {
        this.style.display = 'none';
        document.getElementById('units-actions').style.display = 'flex';
        document.getElementById('units-action-add-row').style.display = 'inline-block';
        document.getElementById('units-check-btn').style.display = 'inline-block';
        addUnitsActionRow(); // Добавляет ровно одну строку
    };
    
    // ВАЖНО: Привязываем обработчик добавления строки ОДИН раз
    document.getElementById('units-action-add-row').onclick = addUnitsActionRow;
    
    document.getElementById('units-check-btn').onclick = checkUnits;
    document.getElementById('units-next-btn').onclick = nextUnitsExample;

    nextUnitsExample();
}

function nextUnitsExample() {
    var trainer = window.TRAINERS['units'];
    if (!trainer) return;

    var example = trainer.next(window._unitsState.config);
    window._unitsState.example = example;

    var taskBox = document.getElementById('units-task');
    taskBox.innerHTML =
        '<span class="units-from">' + example.value + ' ' + example.from + '</span>' +
        '<span class="units-eq">=</span>' +
        '<input type="text" class="units-answer-input" id="units-answer-input" ' +
        'inputmode="numeric" placeholder="?">' +
        '<span class="units-to">' + example.to + '</span>';

    // Сброс интерфейса
    document.getElementById('units-actions').innerHTML = '';
    document.getElementById('units-actions').style.display = 'none';
    document.getElementById('units-action-add-row').style.display = 'none';
    document.getElementById('units-solve-btn').style.display = 'inline-block';
    document.getElementById('units-check-btn').style.display = 'none';
    document.getElementById('units-next-btn').style.display = 'none';

    var input = document.getElementById('units-answer-input');
    input.focus();

    var fb = document.getElementById('units-feedback');
    fb.textContent = '';
    fb.className = 'solver-feedback';

    // Enter для проверки
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            checkUnits();
        }
    });
}

function addUnitsActionRow() {
    var box = document.getElementById('units-actions');
    if (!box) return;

    var row = document.createElement('div');
    row.className = 'action-row';
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.background = '#fff';
    row.style.padding = '10px 15px';
    row.style.borderRadius = '15px';
    row.style.width = '100%';
    row.style.maxWidth = '600px';
    row.style.boxSizing = 'border-box';
    row.style.margin = '0 auto 10px auto';

    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'action-cell';
    input.style.flex = '1';
    input.style.width = '100%';
    input.style.border = '2px solid #c7e2f5';
    input.style.borderRadius = '10px';
    input.style.padding = '10px 15px';
    input.style.fontSize = '1.1rem';
    input.style.background = '#f9fdff';
    input.placeholder = 'Напиши здесь своё решение...';

    var del = document.createElement('button');
    del.className = 'action-del';
    del.textContent = '×';
    del.style.marginLeft = '15px';
    del.style.flexShrink = '0';
    del.onclick = function() { row.remove(); };

    row.appendChild(input);
    row.appendChild(del);
    box.appendChild(row);
}

function checkUnits() {
    var example = window._unitsState.example;
    var input = document.getElementById('units-answer-input');
    if (!example || !input) return;

    var user = parseInt(input.value.trim(), 10);
    var fb = document.getElementById('units-feedback');

    input.classList.remove('correct', 'wrong');

    if (user === example.answer) {
        window._unitsState.score++;
        updateUnitsScore();
        input.classList.add('correct');
        fb.textContent = '🎉 Верно! +1 очко';
        fb.className = 'solver-feedback ok';

        // Прячем Проверить, показываем Дальше
        document.getElementById('units-check-btn').style.display = 'none';
        document.getElementById('units-next-btn').style.display = 'inline-block';

        // Автоматический переход через 1.5 сек
        setTimeout(function () {
            if (document.getElementById('units-next-btn').style.display !== 'none') {
                nextUnitsExample();
            }
        }, 1500);
    } else {
        input.classList.add('wrong');
        fb.textContent = '❌ Проверь ответ ещё раз!';
        fb.className = 'solver-feedback err';
        input.value = '';
        input.classList.remove('wrong');
        input.focus();
    }
}

function updateUnitsScore() {
    var counter = document.getElementById('solver-counter');
    if (counter) counter.textContent = 'Очки: ' + window._unitsState.score;
}


// ----- МОДАЛКИ -----
function openMultiplicationModal() {
    document.getElementById('modal-multiplication').classList.add('active');
}

function openColumnsModal() {
    document.getElementById('modal-columns').classList.add('active');
}



function openColumnsRangeModal(op) {
    var title = document.getElementById('columns-range-title');
    var sub   = document.getElementById('columns-range-sub');
    var box   = document.getElementById('columns-range-buttons');

    if (op === 'add') {
        title.textContent = '➕ Сложение в столбик';
        sub.textContent = 'Выбери разряд чисел:';
        box.innerHTML =
            '<button class="trainer-num-btn" data-max="100">до 100</button>' +
            '<button class="trainer-num-btn" data-max="1000">до 1000</button>' +
            '<button class="trainer-num-btn" data-max="10000">до 10 000</button>';
    } else if (op === 'sub') {
        title.textContent = '➖ Вычитание в столбик';
        sub.textContent = 'Выбери разряд чисел:';
        box.innerHTML =
            '<button class="trainer-num-btn" data-max="100">до 100</button>' +
            '<button class="trainer-num-btn" data-max="1000">до 1000</button>' +
            '<button class="trainer-num-btn" data-max="10000">до 10 000</button>';
    } else if (op === 'mul') {
        title.textContent = '✖️ Умножение в столбик';
        sub.textContent = 'Выбери разряд чисел:';
        box.innerHTML =
            '<button class="trainer-num-btn" data-max="100">до 100</button>' +
            '<button class="trainer-num-btn" data-max="1000">до 1000</button>' +
            '<button class="trainer-num-btn" data-max="10000">до 10 000</button>';
    }

    // Перенавешиваем обработчики на новые кнопки
    box.querySelectorAll('[data-max]').forEach(function (b) {
        b.addEventListener('click', function () {
            var max = parseInt(this.dataset.max, 10);
            closeAllModals();
            startColumnsTrainer(window._pendingOp || 'add', max);
        });
    });

    window._pendingOp = op;
    document.getElementById('modal-columns-range').classList.add('active');
}



function openDivisionTypeModal() {
    document.getElementById('modal-division-type').classList.add('active');
}

function openDivisionRangeModal(withRemainder) {
    window._pendingDivision = { withRemainder: withRemainder };
    var title = document.getElementById('columns-range-title');
    var sub   = document.getElementById('columns-range-sub');
    var box   = document.getElementById('columns-range-buttons');

    title.textContent = '➗ Деление в столбик';
    sub.textContent = 'Выбери разряд чисел:';
    box.innerHTML =
        '<button class="trainer-num-btn" data-max="1000">до 1000</button>' +
        '<button class="trainer-num-btn" data-max="10000">до 10 000</button>';

    box.querySelectorAll('[data-max]').forEach(function (b) {
        b.addEventListener('click', function () {
            var max = parseInt(this.dataset.max, 10);
            closeAllModals();
            startDivisionTrainer(window._pendingDivision.withRemainder, max);
        });
    });

    document.getElementById('modal-columns-range').classList.add('active');
}


function closeAllModals() {
    document.querySelectorAll('.trainer-modal-overlay').forEach(function (m) {
        m.classList.remove('active');
    });
}
// Очищает сообщения и подсветку, оставшиеся от режима задач
function clearSolverFeedback() {
    var fb = document.getElementById('solver-feedback');
    if (fb) {
        fb.textContent = '';
        fb.className = 'solver-feedback';
    }
    // Прячем блок ответа и снимаем подсветку с полей задач
    var answerBox = document.getElementById('answer-box');
    if (answerBox) answerBox.classList.remove('active');

    var answerCell = document.getElementById('answer-cell');
    if (answerCell) {
        answerCell.value = '';
        answerCell.classList.remove('correct', 'wrong');
    }

    var actionsBox = document.getElementById('actions-box');
    if (actionsBox) actionsBox.innerHTML = '';

    var actionAddRow = document.getElementById('action-add-row');
    if (actionAddRow) actionAddRow.style.display = 'none';
}

function startTrainer(key, param) {
    clearSolverFeedback();
    var trainer = window.TRAINERS && window.TRAINERS[key];
    if (!trainer) return;

    trainerState.active = true;
    trainerState.key = key;
    trainerState.config = trainer.start(param);
    trainerState.score = 0;
    trainerState.checked = false;

    var screen = document.getElementById('solver-screen');
    screen.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (el.taskMode)    el.taskMode.style.display = 'none';
    if (el.trainerMode) el.trainerMode.style.display = 'block';

    // Скрываем ВСЕ другие режимы
    document.getElementById('trainer-simple-mode').style.display = 'block';
    document.getElementById('trainer-column-mode').style.display = 'none';
    document.getElementById('trainer-units-mode').style.display = 'none';
    document.getElementById('trainer-rect-mode').style.display = 'none';
    document.getElementById('trainer-equations-mode').style.display = 'none';
    document.getElementById('trainer-order-mode').style.display = 'none'; 
    document.getElementById('trainer-numbers-mode').style.display = 'none';
    document.getElementById('trainer-clock-mode').style.display = 'none';
    document.getElementById('trainer-roman-mode').style.display = 'none';

    window._columnsState = null;
    window._unitsState = null;
    window._rectState = null;

    var taskText = document.getElementById('solver-task-text');
    if (taskText) taskText.style.display = 'none';

    if (el.topicBadge) el.topicBadge.textContent = trainer.title;
    updateScore();

    var globalCheckBtn = document.getElementById('solver-check-btn');
    if (globalCheckBtn) {
        globalCheckBtn.style.display = 'inline-block';
        globalCheckBtn.onclick = function() { trainerCheck(); };
    } else {
        // На случай если кнопка скрыта — покажем
        var btn = document.querySelector('.solver-btn.primary');
        if (btn) {
            btn.style.display = 'inline-block';
            btn.onclick = function() { trainerCheck(); };
        }
    }
    if (el.nextBtn)  el.nextBtn.style.display = 'none';

    trainerNext();
}

function startColumnsTrainer(op, max) {
    clearSolverFeedback();
    var screen = document.getElementById('solver-screen');
    screen.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (el.taskMode)    el.taskMode.style.display = 'none';
    if (el.trainerMode) el.trainerMode.style.display = 'block';

    document.getElementById('trainer-simple-mode').style.display = 'none';
    document.getElementById('trainer-column-mode').style.display = 'block';
    document.getElementById('trainer-units-mode').style.display = 'none';
    document.getElementById('trainer-rect-mode').style.display = 'none';
    document.getElementById('trainer-equations-mode').style.display = 'none'; 
    document.getElementById('trainer-order-mode').style.display = 'none'; 
    document.getElementById('trainer-numbers-mode').style.display = 'none';
    document.getElementById('trainer-clock-mode').style.display = 'none';
    document.getElementById('trainer-roman-mode').style.display = 'none';

    document.getElementById('column-wrapper').innerHTML = '';
    window._divisionState = null;

    var taskText = document.getElementById('solver-task-text');
    if (taskText) taskText.style.display = 'none';

    var opNames = { 'add': '➕ Сложение', 'sub': '➖ Вычитание', 'mul': '✖️ Умножение' };
    if (el.topicBadge) el.topicBadge.textContent = opNames[op] || 'Столбик';

    window._columnsState = {
        op: op,
        max: max,
        score: 0,
        example: null
    };

    var counter = document.getElementById('solver-counter');
    if (counter) {
        counter.textContent = 'Очки: 0';
        counter.classList.add('trainer-score-badge');
    }

    var globalCheckBtn = document.getElementById('solver-check-btn');
    if (globalCheckBtn) {
        globalCheckBtn.style.display = 'inline-block';
        globalCheckBtn.onclick = function() { checkColumn(); };
    }
    updateColumnsScore();
    nextColumnsExample();
}

function startDivisionTrainer(withRemainder, max) {
    clearSolverFeedback();
    var screen = document.getElementById('solver-screen');
    screen.classList.add('active');
    document.body.style.overflow = 'hidden';

var globalCheckBtn = document.getElementById('solver-check-btn');
    if (globalCheckBtn) globalCheckBtn.style.display = 'none';

    if (el.taskMode)    el.taskMode.style.display = 'none';
    if (el.trainerMode) el.trainerMode.style.display = 'block';

    document.getElementById('trainer-simple-mode').style.display = 'none';
    document.getElementById('trainer-column-mode').style.display = 'block';
    document.getElementById('trainer-units-mode').style.display = 'none';
    document.getElementById('trainer-rect-mode').style.display = 'none';
    document.getElementById('trainer-equations-mode').style.display = 'none'; 
    document.getElementById('trainer-order-mode').style.display = 'none'; 
    document.getElementById('trainer-numbers-mode').style.display = 'none';
    document.getElementById('trainer-clock-mode').style.display = 'none';
    document.getElementById('trainer-roman-mode').style.display = 'none';
    document.getElementById('column-wrapper').innerHTML = '';
    window._columnsState = null;

    var taskText = document.getElementById('solver-task-text');
    if (taskText) taskText.style.display = 'none';

    if (el.topicBadge) el.topicBadge.textContent = '➗ Деление в столбик';

    window._divisionState = {
        withRemainder: withRemainder,
        max: max,
        score: 0,
        example: null
    };

    var globalCheckBtn = document.getElementById('solver-check-btn');
    if (globalCheckBtn) {
        globalCheckBtn.style.display = 'inline-block';
        globalCheckBtn.onclick = function() { checkDivision(); };
    }
    updateDivisionScore();
    nextDivisionExample();
}

function updateDivisionScore() {
    var counter = document.getElementById('solver-counter');
    if (counter) {
        counter.textContent = 'Очки: ' + window._divisionState.score;
        counter.classList.add('trainer-score-badge');
    }
}

function nextDivisionExample() {
    var trainer = window.TRAINERS['division'];
    if (!trainer) return;

    var example = trainer.next({
        max: window._divisionState.max,
        withRemainder: window._divisionState.withRemainder
    });
    window._divisionState.example = example;

    renderDivision(example);

    var checkBtn = document.getElementById('solver-check-btn');
    var nextBtn  = document.getElementById('solver-next-btn');
    checkBtn.style.display = 'inline-block';
    checkBtn.onclick = function () { checkDivision(); };
    nextBtn.style.display = 'none';

    var fb = document.getElementById('solver-feedback');
    fb.textContent = '';
    fb.className = 'solver-feedback';
}


function divisionInputKeydown(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        checkDivision();
    }
}

function renderDivision(example) {
    var wrapper = document.getElementById('column-wrapper');
    wrapper.innerHTML = '';

    var dividendStr = String(example.dividend);
    var divisorStr  = String(example.divisor);
    var answerStr   = String(example.answer);

    var box = document.createElement('div');
    box.className = 'division-box';

    // ================= ЛЕВАЯ ЧАСТЬ =================
    var left = document.createElement('div');
    left.className = 'division-left';

    // --- Строка 1: делимое ---
    var dividendRow = document.createElement('div');
    dividendRow.className = 'division-row division-dividend';
    for (var i = 0; i < dividendStr.length; i++) {
        var cell = document.createElement('div');
        cell.className = 'column-digit-cell';
        cell.style.display = 'flex';
        cell.style.alignItems = 'center';
        cell.style.justifyContent = 'center';
        cell.style.background = '#eaf6fd';
        cell.textContent = dividendStr[i];
        dividendRow.appendChild(cell);
    }
    left.appendChild(dividendRow);

    // --- 6 промежуточных строк (3 пары) с линиями-минусами ---
    var PARTIAL_ROWS = 7;
    for (var row = 0; row < PARTIAL_ROWS; row++) {
        var emptyRow = document.createElement('div');
        emptyRow.className = 'division-row';

        // Ячейки для ввода




        for (var j = 0; j < dividendStr.length; j++) {
            var input = document.createElement('input');
            input.type = 'text';
            input.className = 'column-digit-cell column-partial-cell';
            input.maxLength = 1;
            input.inputMode = 'numeric';
            input.dataset.partialRow = row;
            input.dataset.partialCol = j;
            input.addEventListener('keydown', divisionInputKeydown);

            // Автопереход ВПРАВО (деление)
            input.addEventListener('input', function () {
                if (this.value.length === 1) {
                    var next = this.nextElementSibling;
                    if (next && next.classList.contains('column-digit-cell')) {
                        next.focus();
                    }
                }
            });

            emptyRow.appendChild(input);
        }



        left.appendChild(emptyRow);

        // После 2-й, 4-й, 6-й строки (индексы 1, 3, 5) — линия с минусом
        if (row === 0 || row === 2 || row === 4 || row === 6) {
            // Минус отдельным элементом СЛЕВА (вне линии)
            var minusRow = document.createElement('div');
            minusRow.className = 'division-minus-row';
            minusRow.textContent = '−';
            left.appendChild(minusRow);

            // Линия
            var lineRow = document.createElement('div');
            lineRow.className = 'division-line-row';
            var lineSpan = document.createElement('span');
            lineSpan.className = 'division-horizontal-line';
            lineRow.appendChild(lineSpan);
            left.appendChild(lineRow);
        }
    }

    // --- Строка остатка (всегда) ---
    var remRow = document.createElement('div');
    remRow.className = 'division-row division-remainder-row';

    // Отступ = dividendStr.length - 2 пустых ячеек
    var spacerCount = dividendStr.length - 2;
    if (spacerCount < 0) spacerCount = 0;
    for (var k = 0; k < spacerCount; k++) {
        var emptySp = document.createElement('div');
        emptySp.className = 'column-digit-empty';
        remRow.appendChild(emptySp);
    }

    var remCell = document.createElement('input');
    remCell.type = 'text';
    remCell.className = 'column-digit-cell';
    remCell.id = 'division-remainder-input';
    remCell.maxLength = 3;
    remCell.inputMode = 'numeric';
    remCell.placeholder = 'ост.';
    remCell.style.textAlign = 'center';
    remCell.addEventListener('keydown', divisionInputKeydown);
    remRow.appendChild(remCell);
    left.appendChild(remRow);

    box.appendChild(left);

    // ================= ПРАВАЯ ЧАСТЬ =================
    var right = document.createElement('div');
    right.className = 'division-right';

    // Делитель
    var divRow = document.createElement('div');
    divRow.className = 'division-row division-divisor';
    for (var i = 0; i < divisorStr.length; i++) {
        var dcell = document.createElement('div');
        dcell.className = 'column-digit-cell';
        dcell.style.display = 'flex';
        dcell.style.alignItems = 'center';
        dcell.style.justifyContent = 'center';
        dcell.style.background = '#fff3bf';
        dcell.textContent = divisorStr[i];
        divRow.appendChild(dcell);
    }
    right.appendChild(divRow);

    // Линия-уголок
    var lineRow = document.createElement('div');
    lineRow.className = 'division-line';
    right.appendChild(lineRow);

    // Частное


    var qRow = document.createElement('div');
    qRow.className = 'division-row division-quotient';





        for (var i = 0; i < answerStr.length; i++) {
        var qc = document.createElement('input');
        qc.type = 'text';
        qc.className = 'column-digit-cell division-quotient-cell';
        qc.maxLength = 1;
        qc.inputMode = 'numeric';
        qc.dataset.qIndex = i;
        qc.addEventListener('keydown', divisionInputKeydown);

        // Автопереход ВПРАВО (частное деления)
        qc.addEventListener('input', function () {
            if (this.value.length === 1) {
                var next = this.nextElementSibling;
                if (next && next.classList.contains('division-quotient-cell')) {
                    next.focus();
                }
            }
        });

        qRow.appendChild(qc);
    }





    right.appendChild(qRow);

    box.appendChild(right);
    wrapper.appendChild(box);

    setTimeout(function () {
        var firstQ = wrapper.querySelector('.division-quotient-cell');
        if (firstQ) firstQ.focus();
    }, 50);
}



function checkDivision() {
    var example = window._divisionState.example;

    // Проверяем ЧАСТНОЕ
    var qCells = document.querySelectorAll('.division-quotient-cell');
    var qAllCorrect = true;
    var expectedQ = String(example.answer);

    qCells.forEach(function (c, i) {
        var v = c.value.trim();
        c.classList.remove('correct', 'wrong');
        if (v === expectedQ[i]) {
            c.classList.add('correct');
        } else {
            c.classList.add('wrong');
            qAllCorrect = false;
        }
    });

    // Проверяем ОСТАТОК
    var remInput = document.getElementById('division-remainder-input');
    var rCorrect = true;

    if (example.remainder !== 0) {
        // остаток есть — проверяем
        if (remInput) {
            remInput.classList.remove('correct', 'wrong');
            var userR = parseInt(remInput.value.trim(), 10);
            if (userR === example.remainder) {
                remInput.classList.add('correct');
            } else {
                remInput.classList.add('wrong');
                rCorrect = false;
            }
        }
    } else {
        // остаток 0 — НЕ проверяем
        if (remInput) {
            remInput.classList.remove('wrong');
            remInput.classList.add('correct');
        }
    }

    // Итог
    var allCorrect = qAllCorrect && rCorrect;
    var fb = document.getElementById('solver-feedback');

    if (allCorrect) {
        if (window._divisionState) window._divisionState.score++;
        updateDivisionScore();

        if (window.addCorrectAnswer) {
            window.addCorrectAnswer('columns_div');
        }

        fb.textContent = '🎉 Верно! +1 очко';
        fb.className = 'solver-feedback ok';

        // ПРОВЕРКА ЛИМИТА
        if (trainerState.limit > 0 && trainerState.solved >= trainerState.limit) {
            var cb = trainerState.onFinish;
            trainerState.limit = 0;
            trainerState.onFinish = null;
            trainerState.active = false;
            if (cb) setTimeout(cb, 900);
            return;
        }

        setTimeout(function () {
            if (window._divisionState) nextDivisionExample();
        }, 900);
    } else {
        fb.textContent = '❌ Проверь частное и остаток';
        fb.className = 'solver-feedback err';
    }
}




function updateColumnsScore() {
    var counter = document.getElementById('solver-counter');
    if (counter) {
        counter.textContent = 'Очки: ' + window._columnsState.score;
        counter.classList.add('trainer-score-badge');
    }
}

function nextColumnsExample() {
    var trainer = window.TRAINERS['columns'];
    if (!trainer) return;

    var example = trainer.next({
        op: window._columnsState.op,
        max: window._columnsState.max
    });
    window._columnsState.example = example;

    renderColumn(example);

    var checkBtn = document.getElementById('solver-check-btn');
    var nextBtn  = document.getElementById('solver-next-btn');
    
    if (checkBtn) {
        checkBtn.style.display = 'inline-block';
        checkBtn.onclick = function () { checkColumn(); };
    }
    if (nextBtn) nextBtn.style.display = 'none';

    checkBtn.style.display = 'inline-block';
    checkBtn.onclick = function () { checkColumn(); };
    nextBtn.style.display = 'none';

    var fb = document.getElementById('solver-feedback');
    fb.textContent = '';
    fb.className = 'solver-feedback';
}

function renderColumn(example) {
    var wrapper = document.getElementById('column-wrapper');
    wrapper.innerHTML = '';

    var aStr = String(example.a);
    var bStr = String(example.b);
    var ansStr = String(example.answer);

    var width = Math.max(aStr.length, bStr.length, ansStr.length);
    // Для промежуточных может быть больше разрядов
    if (example.partials) {
        example.partials.forEach(function (p) {
            var pStr = String(p.value) + (p.shift > 0 ? '0'.repeat(p.shift) : '');
            if (pStr.length > width) width = pStr.length;
        });
    }

    aStr = padLeft(aStr, width);
    bStr = padLeft(bStr, width);
    ansStr = padLeft(ansStr, width);

    // Строка переносов (не проверяется)
    var carryRow = document.createElement('div');
    carryRow.className = 'column-row';
    var opSpacer0 = document.createElement('div');
    opSpacer0.className = 'column-op';
    opSpacer0.textContent = '';
    carryRow.appendChild(opSpacer0);
    for (var i = 0; i < width; i++) {
        var c = document.createElement('input');
        c.type = 'text';
        c.className = 'column-carry-cell';
        c.maxLength = 1;
        c.inputMode = 'numeric';

        // Автопереход ВЛЕВО
        c.addEventListener('input', function () {
            if (this.value.length === 1) {
                var prev = this.previousElementSibling;
                if (prev && prev.classList.contains('column-carry-cell')) {
                    prev.focus();
                }
            }
        });

        // Enter — проверить ответ
        c.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                checkColumn();
            }
        });

        // Backspace на пустой — вправо
        c.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && this.value === '') {
                var next = this.nextElementSibling;
                if (next && next.classList.contains('column-carry-cell')) {
                    next.focus();
                }
            }
        });

        carryRow.appendChild(c);
    }
    wrapper.appendChild(carryRow);

    // Строка 1 (a)
    wrapper.appendChild(makeNumberRow(aStr, ''));

    // Строка 2 (b) со знаком × или +
    wrapper.appendChild(makeNumberRow(bStr, example.op));

    // Линия
    var line = document.createElement('div');
    line.className = 'column-line';
    wrapper.appendChild(line);



    // Для умножения — промежуточные строки (только если b двузначное)
    if (example.op === '×' && example.partials && example.partials.length > 1) {
        example.partials.forEach(function (p, index) {
            var pStr = String(p.value);
            var shifted = pStr + '0'.repeat(p.shift);

            var row = document.createElement('div');
            row.className = 'column-row';

            // Знак + появляется у второго и последующих промежуточных
            var opEl = document.createElement('div');
            opEl.className = 'column-op';
            opEl.textContent = (index > 0) ? '+' : '';
            row.appendChild(opEl);

            // Заполняем пустыми ячейками до нужной ширины
            var totalWidth = width;
            var leftPad = totalWidth - shifted.length;
            for (var k = 0; k < leftPad; k++) {
                var empty = document.createElement('div');
                empty.className = 'column-digit-empty';
                row.appendChild(empty);
            }

            // ⬇️ ЯЧЕЙКИ ДЛЯ ВВОДА (не проверяются)
            // Ячейки для ввода (не проверяются)
            for (var j = 0; j < shifted.length; j++) {
                var cell = document.createElement('input');
                cell.type = 'text';
                cell.className = 'column-digit-cell column-partial-cell';
                cell.maxLength = 1;
                cell.inputMode = 'numeric';
                cell.dataset.partialIndex = index;
                cell.dataset.digitIndex = j;

                // Автопереход ВЛЕВО
                cell.addEventListener('input', function () {
                    if (this.value.length === 1) {
                        var prev = this.previousElementSibling;
                        if (prev && prev.classList.contains('column-digit-cell')) {
                            prev.focus();
                            setTimeout(function () {
                                if (prev.setSelectionRange) {
                                    prev.setSelectionRange(prev.value.length, prev.value.length);
                                }
                            }, 0);
                        }
                    }
                });

                // Enter — проверить ответ
                cell.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        checkColumn();
                    }
                });

                // Backspace на пустой — вправо
                cell.addEventListener('keydown', function (e) {
                    if (e.key === 'Backspace' && this.value === '') {
                        var next = this.nextElementSibling;
                        if (next && next.classList.contains('column-digit-cell')) {
                            next.focus();
                        }
                    }
                });

                row.appendChild(cell);
            }
            wrapper.appendChild(row);
        });

        // Вторая линия под промежуточными
        var line2 = document.createElement('div');
        line2.className = 'column-line';
        wrapper.appendChild(line2);
    }

    // Строка ответа — ячейки для ввода
    var ansRow = document.createElement('div');
    ansRow.className = 'column-row column-answer-row';

    var opSpacer2 = document.createElement('div');
    opSpacer2.className = 'column-op';
    opSpacer2.textContent = '';
    ansRow.appendChild(opSpacer2);


    for (var j = 0; j < ansStr.length; j++) {
        var cell = document.createElement('input');
        cell.type = 'text';
        cell.className = 'column-digit-cell';
        cell.maxLength = 1;
        cell.inputMode = 'numeric';
        cell.dataset.index = j;
        cell.style.textAlign = 'center';

        // Автопереход ВЛЕВО
        cell.addEventListener('input', function () {
            if (this.value.length === 1) {
                var prev = this.previousElementSibling;
                if (prev && prev.classList.contains('column-digit-cell')) {
                    prev.focus();
                    setTimeout(function () {
                        if (prev.setSelectionRange) {
                            prev.setSelectionRange(prev.value.length, prev.value.length);
                        }
                    }, 0);
                }
            }
        });

        // Enter — проверить ответ
        cell.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                checkColumn();
            }
        });

        // Backspace на пустой ячейке — идём ВПРАВО (к младшим)
        cell.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && this.value === '') {
                var next = this.nextElementSibling;
                if (next && next.classList.contains('column-digit-cell')) {
                    next.focus();
                    // Ставим курсор в конец
                    setTimeout(function () {
                        if (next.setSelectionRange) {
                            next.setSelectionRange(next.value.length, next.value.length);
                        }
                    }, 0);
                }
            }
        });

        // Стрелки ← → для перемещения между ячейками
        cell.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                var prev = this.previousElementSibling;
                if (prev && prev.classList.contains('column-digit-cell')) {
                    prev.focus();
                }
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                var next = this.nextElementSibling;
                if (next && next.classList.contains('column-digit-cell')) {
                    next.focus();
                }
            }
        });

        ansRow.appendChild(cell);
    }


    wrapper.appendChild(ansRow);

    setTimeout(function () {
        // Фокус на ПОСЛЕДНЮЮ ячейку (младший разряд)
        var cells = wrapper.querySelectorAll('.column-answer-row .column-digit-cell');
        if (cells.length > 0) {
            cells[cells.length - 1].focus();
        }
    }, 50);
}

function makeNumberRow(numStr, sign) {
    var row = document.createElement('div');
    row.className = 'column-row';

    var opEl = document.createElement('div');
    opEl.className = 'column-op';
    opEl.textContent = sign || '';
    row.appendChild(opEl);

    for (var i = 0; i < numStr.length; i++) {
        var ch = numStr[i];
        if (ch === ' ') {
            var empty = document.createElement('div');
            empty.className = 'column-digit-empty';
            row.appendChild(empty);
        } else {
            var cell = document.createElement('div');
            cell.className = 'column-digit-cell';
            cell.style.display = 'flex';
            cell.style.alignItems = 'center';
            cell.style.justifyContent = 'center';
            cell.style.background = '#eaf6fd';
            cell.style.cursor = 'default';
            cell.textContent = ch;
            row.appendChild(cell);
        }
    }
    return row;
}

function padLeft(str, width) {
    while (str.length < width) str = ' ' + str;
    return str;
}


function checkColumn() {
    var example = window._columnsState.example;
    var cells = document.querySelectorAll('.column-answer-row .column-digit-cell');
    var userAnswer = '';
    var allCorrect = true;

    // Собираем все введенные цифры в одну строку
    cells.forEach(function (cell, i) {
        var user = cell.value.trim();
        userAnswer += user; // просто склеиваем
        
        cell.classList.remove('correct', 'wrong');
    });

    // Убираем ведущие нули (если пользователь ввел 07 вместо 7)
    var cleanUser = userAnswer.replace(/^0+/, '');
    if (cleanUser === '') cleanUser = '0';

    var fb = document.getElementById('solver-feedback');
    var expectedStr = String(example.answer);

    // Сравниваем числа, а не строки
    if (parseInt(cleanUser, 10) === example.answer) {
        // Всё верно — красим все ячейки в зеленый
        cells.forEach(function(cell) { cell.classList.add('correct'); });
        
        window._columnsState.score++;
        updateColumnsScore();

        if (window.addCorrectAnswer) {
            if (window._columnsState.op === 'add') window.addCorrectAnswer('columns_add');
            if (window._columnsState.op === 'sub') window.addCorrectAnswer('columns_sub');
            if (window._columnsState.op === 'mul') window.addCorrectAnswer('columns_mul');
            if (window._columnsState.op === 'div') window.addCorrectAnswer('columns_div');
        }

        fb.textContent = '🎉 Верно! +1 очко';
        fb.className = 'solver-feedback ok';

        // ПРОВЕРКА ЛИМИТА
        if (trainerState.limit > 0 && trainerState.solved >= trainerState.limit) {
            var cb = trainerState.onFinish;
            trainerState.limit = 0;
            trainerState.onFinish = null;
            trainerState.active = false;
            if (cb) setTimeout(cb, 900);
            return;
        }

        setTimeout(function () {
            if (window._columnsState) nextColumnsExample();
        }, 900);
    } else {
        // Ошибка — красим все ячейки в красный
        cells.forEach(function(cell) { cell.classList.add('wrong'); });
        fb.textContent = '❌ Проверь ответ ещё раз!';
        fb.className = 'solver-feedback err';
    }
}



function trainerNext() {
    var trainer = window.TRAINERS[trainerState.key];
    if (!trainer) return;

    trainerState.example = trainer.next(trainerState.config);
    trainerState.checked = false;

    // Гарантированно показываем простой режим
    var simpleMode = document.getElementById('trainer-simple-mode');
    var columnMode = document.getElementById('trainer-column-mode');
    if (simpleMode) simpleMode.style.display = 'block';
    if (columnMode) columnMode.style.display = 'none';

    // Показать пример
    el.example.textContent = trainerState.example.text;
    el.answer.value = '';
    el.answer.classList.remove('correct', 'wrong');
    el.answer.disabled = false;
    el.answer.focus();

    var checkBtn = document.getElementById('solver-check-btn');
if (checkBtn) checkBtn.style.display = 'inline-block';
    el.nextBtn.style.display = 'none';
    el.feedback.textContent = '';
    el.feedback.className = 'solver-feedback';
}





function trainerCheck() {
    if (trainerState.checked) return;
    var trainer = window.TRAINERS[trainerState.key];
    if (!trainer) return;

    var result = trainer.check(trainerState.example, el.answer.value);
    trainerState.checked = true;

    if (result.correct) {
        trainerState.score++;
        trainerState.solved++;
        updateScore();

        if (window.addCorrectAnswer && trainerState.key === 'multiplication') {
            window.addCorrectAnswer('multiplication');
        }
        
        if (trainerState.limit > 0 && trainerState.solved >= trainerState.limit) {
            var cb = trainerState.onFinish;
            trainerState.limit = 0;
            trainerState.onFinish = null;
            trainerState.active = false;
            if (cb) setTimeout(cb, 800);
            return;
        }

        el.answer.classList.add('correct');
        el.feedback.textContent = '🎉 Верно! +1 очко';
        el.feedback.className = 'solver-feedback ok';
        el.answer.disabled = true;

        setTimeout(function () {
            if (trainerState.active) trainerNext();
        }, 800);
    } else {
        el.answer.classList.add('wrong');
        el.feedback.textContent = '❌ Проверь ответ ещё раз!';
        el.feedback.className = 'solver-feedback err';
        el.answer.disabled = false;
        el.answer.value = '';
        el.answer.classList.remove('wrong');
        el.answer.focus();
        trainerState.checked = false;
    }
}

function updateScore() {
    if (!el.counter) return;
    el.counter.textContent = 'Очки: ' + trainerState.score;
    el.counter.classList.add('trainer-score-badge');
}

function startEquationsTrainer(type) {
    var screen = document.getElementById('solver-screen');
    screen.classList.add('active');
    document.body.style.overflow = 'hidden';
   var globalCheckBtn = document.getElementById('solver-check-btn');
    if (globalCheckBtn) globalCheckBtn.style.display = 'none';

    if (el.taskMode)    el.taskMode.style.display = 'none';
    if (el.trainerMode) el.trainerMode.style.display = 'block';

    document.getElementById('trainer-simple-mode').style.display = 'none';
    document.getElementById('trainer-column-mode').style.display = 'none';
    document.getElementById('trainer-units-mode').style.display = 'none';
    document.getElementById('trainer-rect-mode').style.display = 'none';
    document.getElementById('trainer-order-mode').style.display = 'none'; 
    document.getElementById('trainer-numbers-mode').style.display = 'none';
    document.getElementById('trainer-equations-mode').style.display = 'block';
    document.getElementById('trainer-clock-mode').style.display = 'none';
    document.getElementById('trainer-roman-mode').style.display = 'none';

    var taskText = document.getElementById('solver-task-text');
    if (taskText) taskText.style.display = 'none';

    if (el.topicBadge) el.topicBadge.textContent = '⚖️ Уравнения';

    // Сохраняем состояние
    window._eqState = {
        type: type, // 'easy' или 'hard'
        score: 0,
        isBankMode: false,
        config: window.TRAINERS['equations'].start(type, type) // Передаем type и как тип, и как level
    };

    var counter = document.getElementById('solver-counter');
    if (counter) {
        counter.textContent = 'Очки: 0';
        counter.classList.add('trainer-score-badge');
    }

    // Привязка кнопок (этот код у тебя уже был)
    document.getElementById('eq-solve-btn').onclick = function() {
        this.style.display = 'none';
        document.getElementById('eq-actions-box').style.display = 'flex';
        document.getElementById('eq-action-add-row').style.display = 'inline-block';
        document.getElementById('eq-check-add-row').style.display = 'inline-block';
        document.getElementById('eq-answer-box').style.display = 'block';
        document.getElementById('eq-check-btn').style.display = 'inline-block';
        addEqActionRow();
    };
    document.getElementById('eq-action-add-row').onclick = function() { addEqActionRow(); };
    document.getElementById('eq-check-add-row').onclick = function() { addEqCheckRow(); };

    nextEquationExample();
}

function startBankEquationsTrainer() {
    clearSolverFeedback();
    var screen = document.getElementById('solver-screen');
    screen.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (el.taskMode)    el.taskMode.style.display = 'none';
    if (el.trainerMode) el.trainerMode.style.display = 'block';

    document.getElementById('trainer-simple-mode').style.display = 'none';
    document.getElementById('trainer-column-mode').style.display = 'none';
    document.getElementById('trainer-units-mode').style.display = 'none';
    document.getElementById('trainer-rect-mode').style.display = 'none';
    document.getElementById('trainer-order-mode').style.display = 'none';
    document.getElementById('trainer-numbers-mode').style.display = 'none';
    document.getElementById('trainer-equations-mode').style.display = 'block';
    document.getElementById('trainer-clock-mode').style.display = 'none';
    document.getElementById('trainer-roman-mode').style.display = 'none';

    var taskText = document.getElementById('solver-task-text');
    if (taskText) taskText.style.display = 'none';

    if (el.topicBadge) el.topicBadge.textContent = '📚 Составить уравнение';

    window._eqState = {
        type: 'bank',
        score: 0,
        isBankMode: true,
        bankIndex: 0,
        // Перемешаем банк
        config: (window.EQUATIONS_BANK || []).sort(function() { return 0.5 - Math.random(); })
    };

    var counter = document.getElementById('solver-counter');
    if (counter) {
        counter.textContent = 'Очки: 0';
        counter.classList.add('trainer-score-badge');
    }

    // Привязка кнопок
    document.getElementById('eq-solve-btn').onclick = function() {
        this.style.display = 'none';
        document.getElementById('eq-actions-box').style.display = 'flex';
        document.getElementById('eq-action-add-row').style.display = 'inline-block';
        document.getElementById('eq-check-add-row').style.display = 'inline-block';
        document.getElementById('eq-answer-box').style.display = 'block';
        document.getElementById('eq-check-btn').style.display = 'inline-block';
        addEqActionRow();
    };
    document.getElementById('eq-action-add-row').onclick = function() { addEqActionRow(); };
    document.getElementById('eq-check-add-row').onclick = function() { addEqCheckRow(); };

        nextEquationExample();
}



function nextEquationExample() {
    var example;
    
    if (window._eqState.isBankMode) {
        // Режим банка задач
        var bank = window._eqState.config;
        if (!bank || bank.length === 0) {
            alert('Банк задач пуст!');
            return;
        }
        if (window._eqState.bankIndex >= bank.length) {
            window._eqState.bankIndex = 0; // Зацикливаем
        }
        
        var item = bank[window._eqState.bankIndex];
        window._eqState.bankIndex++;
        
        // Для банка мы показываем текст задачи, а уравнение скрываем (или показываем как подсказку)
        document.getElementById('trainer-equation-text').textContent = item.text; 
        document.getElementById('eq-answer-label').textContent = "x =";
        
        // Сохраняем ответ
        example = { answer: item.answer, varName: "x", isBank: true };
    } else {
        // Режим генератора
        var trainer = window.TRAINERS['equations'];
        example = trainer.next(window._eqState.config);
        document.getElementById('trainer-equation-text').textContent = example.text;
        document.getElementById('eq-answer-label').textContent = example.varName + " =";
    }

    window._eqState.currentExample = example;

    var input = document.getElementById('eq-answer-cell');
    input.value = '';
    input.classList.remove('correct', 'wrong');

    document.getElementById('eq-actions-box').innerHTML = '';
    document.getElementById('eq-actions-box').style.display = 'none';
    document.getElementById('eq-action-add-row').style.display = 'none';
    document.getElementById('eq-check-add-row').style.display = 'none';
    document.getElementById('eq-answer-box').style.display = 'none';
    document.getElementById('eq-solve-btn').style.display = 'inline-block';
    document.getElementById('eq-check-btn').style.display = 'none';
    document.getElementById('eq-next-btn').style.display = 'none';
    document.getElementById('eq-feedback').textContent = '';

    input.onkeydown = function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            checkEquation();
        }
    };

    document.getElementById('eq-check-btn').onclick = checkEquation;
    document.getElementById('eq-next-btn').onclick = nextEquationExample;
}

function addEqActionRow() {
    var box = document.getElementById('eq-actions-box');
    
    var row = document.createElement('div');
    row.className = 'action-row';
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.background = '#fff';
    row.style.padding = '10px 15px';
    row.style.borderRadius = '15px';
    row.style.width = '100%';
    row.style.boxSizing = 'border-box'; // Чтобы padding не вылезал за края
    row.style.marginBottom = '15px';

    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'action-cell';
    input.style.flex = '1'; // Занимает ВСЁ свободное место
    input.style.width = '100%'; 
    input.style.border = '2px solid #c7e2f5';
    input.style.borderRadius = '10px';
    input.style.padding = '10px 15px';
    input.style.fontSize = '1.2rem';
    input.style.background = '#f9fdff';
    input.placeholder = 'Напиши здесь своё решение...';

    var del = document.createElement('button');
    del.className = 'action-del';
    del.textContent = '×';
    del.style.marginLeft = '15px';
    del.style.flexShrink = '0'; // Чтобы кнопка не сжималась
    del.onclick = function() { row.remove(); };

    row.appendChild(input);
    row.appendChild(del);
    box.appendChild(row);
}

function addEqCheckRow() {
    var box = document.getElementById('eq-actions-box');
    var row = document.createElement('div');
    row.className = 'action-row';
    row.style.background = '#fff';
    row.style.padding = '10px';
    row.style.borderRadius = '15px';
    row.style.width = '100%';
    row.style.maxWidth = '600px';
    row.style.margin = '0 auto';

    var checkText = document.createElement('span');
    checkText.style.fontSize = '1.2rem';
    checkText.style.color = '#2a9d8f';
    checkText.style.fontWeight = '800';
    checkText.style.whiteSpace = 'nowrap';
    checkText.textContent = 'Проверка: ';

    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'action-cell';
    input.style.flex = '1';
    input.style.border = 'none';
    input.style.background = 'transparent';
    input.style.fontSize = '1.2rem';
    input.placeholder = 'Сделай проверку...';

    var del = document.createElement('button');
    del.className = 'action-del';
    del.textContent = '×';
    del.style.marginLeft = '10px';
    del.onclick = function() { row.remove(); };

    var flexWrap = document.createElement('div');
    flexWrap.style.display = 'flex';
    flexWrap.style.alignItems = 'center';
    flexWrap.style.gap = '10px';
    flexWrap.appendChild(checkText);
    flexWrap.appendChild(input);
    flexWrap.appendChild(del);
    
    row.appendChild(flexWrap);
    box.appendChild(row);
}

function renumberEqActions() {
    var box = document.getElementById('eq-actions-box');
    Array.from(box.children).forEach(function(row, i) {
        row.querySelector('.action-num').textContent = (i + 1) + ')';
    });
}

function checkEquation() {
    var example = window._eqState.currentExample;
    var input = document.getElementById('eq-answer-cell');
    var userNum = parseInt(input.value.trim(), 10);
    var fb = document.getElementById('eq-feedback');

    input.classList.remove('correct', 'wrong');

    if (userNum === example.answer) {
        window._eqState.score++;
        document.getElementById('solver-counter').textContent = 'Очки: ' + window._eqState.score;
        input.classList.add('correct');
        fb.textContent = '🎉 Верно! +1 очко';

        if (window.addCorrectAnswer) {
            window.addCorrectAnswer('topic', 'Уравнения');
        }
        fb.className = 'solver-feedback ok';

        document.getElementById('eq-check-btn').style.display = 'none';
        document.getElementById('eq-next-btn').style.display = 'inline-block';

        setTimeout(function() {
            if (window._eqState) nextEquationExample();
        }, 1000);
    } else {
        input.classList.add('wrong');
        fb.textContent = '❌ Проверь ответ ещё раз!';
        fb.className = 'solver-feedback err';
        input.value = '';
        input.classList.remove('wrong');
        input.focus();
    }
}


// ----- ВЫХОД ИЗ ТРЕНАЖЁРА -----
function exitTrainer() {
    trainerState.active = false;
    trainerState.key = null;
    trainerState.config = null;
    trainerState.example = null;
    trainerState.score = 0;
    trainerState.checked = false;

    document.getElementById('trainer-rect-mode').style.display = 'none';
    document.getElementById('trainer-simple-mode').style.display = 'block';
    document.getElementById('trainer-column-mode').style.display = 'none';
    document.getElementById('trainer-equations-mode').style.display = 'none';
    document.getElementById('trainer-numbers-mode').style.display = 'none';
    window._columnsState = null;

    if (el.taskMode)    el.taskMode.style.display = '';
    if (el.trainerMode) el.trainerMode.style.display = 'none';
    if (el.counter) el.counter.classList.remove('trainer-score-badge');

    // Возвращаем кнопки для обычных задач
    var taskControls = document.getElementById('main-task-controls');
    if (taskControls) taskControls.style.display = 'flex';
    
    // Убираем кнопку проверки тренажёра, чтобы она не висела в задачах
    var globalCheckBtn = document.getElementById('solver-check-btn');
    if (globalCheckBtn) globalCheckBtn.style.display = 'none';

    var screen = document.getElementById('solver-screen');
    screen.classList.remove('active');
    document.body.style.overflow = 'auto';
}



document.addEventListener('DOMContentLoaded', function () {

    init();

    // Кнопка «Площадь и периметр» — сразу запуск
    var areaBtn = document.querySelector('.trainer-btn[data-trainer="area"]');
    if (areaBtn) {
        areaBtn.onclick = function () { // Используем onclick вместо addEventListener
            console.log("Кнопка площади нажата! Запускаем startRectTrainer...");
            startRectTrainer();
        };
    } else {
        console.error("Кнопка data-trainer='area' НЕ НАЙДЕНА в DOM!");
    }



    var exitBtn = document.getElementById('solver-exit-btn');
    if (exitBtn) {
        // Снимаем ВСЕ старые обработчики, ставим один новый
        var newExitBtn = exitBtn.cloneNode(true);
        exitBtn.parentNode.replaceChild(newExitBtn, exitBtn);

        newExitBtn.addEventListener('click', function () {
            if (trainerState.active) {
                exitTrainer();
            } else if (window.Solver && window.Solver.exitToMenu) {
                window.Solver.exitToMenu();
            }
        });
    }
});

// ==================== ПРЯМОУГОЛЬНИК ====================
var rectState = {
    canvas: null,
    ctx: null,
    cellSize: 30,
    cols: 20,
    rows: 20,
    drawing: false,
    startX: 0, startY: 0,
    rect: null,         
    example: null,
    bgBlocks: [] // 
};




function startRectTrainer() {
    clearSolverFeedback();

   var screen = document.getElementById('solver-screen');
    screen.classList.add('active');
    document.body.style.overflow = 'hidden';


    var taskControls = document.getElementById('main-task-controls');
    if (taskControls) taskControls.style.display = 'flex';
    
    var cw = document.getElementById('column-wrapper');
    if (cw) cw.innerHTML = '';

    el.taskMode.style.display = 'none';
    el.trainerMode.style.display = 'block';

    var taskText = document.getElementById('solver-task-text');
    if (taskText) taskText.style.display = 'none';

    // Скрываем все остальные тренажеры
    document.getElementById('trainer-simple-mode').style.display = 'none';
    document.getElementById('trainer-column-mode').style.display = 'none';
    document.getElementById('trainer-units-mode').style.display = 'none';
    document.getElementById('trainer-equations-mode').style.display = 'none'; 
    document.getElementById('trainer-order-mode').style.display = 'none'; 
    document.getElementById('trainer-numbers-mode').style.display = 'none';
    document.getElementById('trainer-clock-mode').style.display = 'none';
    document.getElementById('trainer-roman-mode').style.display = 'none';
    
    // Показываем прямоугольник
    var rectMode = document.getElementById('trainer-rect-mode');
    rectMode.style.display = 'block';

    var globalCheckBtn = document.getElementById('solver-check-btn');
    if (globalCheckBtn) globalCheckBtn.style.display = 'none';

    if (el.topicBadge) el.topicBadge.textContent = '📐 Площадь и периметр';

    rectState.score = 0;
    window._rectConfig = window.TRAINERS['rect'].start();

    var counter = document.getElementById('solver-counter');
    if (counter) {
        counter.textContent = 'Очки: 0';
        counter.classList.add('trainer-score-badge');
    }

    // ▼▼▼ ГЛАВНЫЙ ФИКС: ЕСЛИ В HTML НЕТ ЭЛЕМЕНТОВ, СОЗДАЕМ ИХ САМИ ▼▼▼
    
    // 1. Создаем задание, если его нет
    if (!document.getElementById('rect-task')) {
        var taskDiv = document.createElement('div');
        taskDiv.className = 'rect-task';
        taskDiv.id = 'rect-task';
        rectMode.insertBefore(taskDiv, rectMode.firstChild);
    }

    // 2. Создаем канвас, если его нет
    if (!document.getElementById('rect-canvas')) {
        var canvasWrap = document.createElement('div');
        canvasWrap.className = 'rect-field-wrap';
        canvasWrap.innerHTML = `
            <canvas id="rect-canvas" class="rect-canvas" width="600" height="600"></canvas>
            <div class="rect-hint" id="rect-hint">Зажми левую кнопку мыши и начерти прямоугольник</div>
        `;
        var taskDiv2 = document.getElementById('rect-task');
        if (taskDiv2 && taskDiv2.nextSibling) {
            rectMode.insertBefore(canvasWrap, taskDiv2.nextSibling);
        } else {
            rectMode.appendChild(canvasWrap);
        }
    }

    // 3. Создаем строки для S и P, и кнопки
    var oldFormulas = rectMode.querySelectorAll('.rect-formula');
    oldFormulas.forEach(function(f) { f.remove(); });
    var oldControls = rectMode.querySelector('.solver-controls');
    if (oldControls) oldControls.remove();

    var newFormulas = document.createElement('div');
    newFormulas.innerHTML = `
        <div class="rect-formula" id="rect-s-row" style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 15px;">
            <span class="rect-formula-label" style="font-size: 1.5rem;">S =</span>
            <input type="text" id="rect-s-input" class="rect-cell" placeholder="Решение" style="width: 200px; font-size: 1.2rem; padding: 8px 15px;">
            <span style="font-size: 1.5rem;">=</span>
            <input type="text" id="rect-s-ans" class="rect-cell rect-cell-result" placeholder="Ответ" style="width: 80px; text-align: center; font-size: 1.2rem; padding: 8px;">
        </div>
        <div class="rect-formula" id="rect-p-row" style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 15px;">
            <span class="rect-formula-label" style="font-size: 1.5rem;">P =</span>
            <input type="text" id="rect-p-input" class="rect-cell" placeholder="Решение" style="width: 200px; font-size: 1.2rem; padding: 8px 15px;">
            <span style="font-size: 1.5rem;">=</span>
            <input type="text" id="rect-p-ans" class="rect-cell rect-cell-result" placeholder="Ответ" style="width: 80px; text-align: center; font-size: 1.2rem; padding: 8px;">
        </div>
        <div class="solver-controls" style="margin-top: 15px;">
            <button class="solver-btn primary" id="rect-check-btn">Проверить</button>
            <button class="solver-btn primary" id="rect-next-btn" style="display:none;">Следующее →</button>
        </div>
        <p class="solver-feedback" id="rect-feedback"></p>
    `;
    rectMode.appendChild(newFormulas);

    initRectCanvas();
    
    var checkBtn = document.getElementById('rect-check-btn');
    if (checkBtn) {
        checkBtn.onclick = checkRect;
        checkBtn.style.display = 'inline-block';
    }
    var nextBtn = document.getElementById('rect-next-btn');
    if (nextBtn) nextBtn.onclick = nextRectExample;

    nextRectExample();
}


function initRectCanvas() {
    var canvas = document.getElementById('rect-canvas');
    if (!canvas) return;

    rectState.canvas = canvas;
    rectState.ctx = canvas.getContext('2d');

    canvas.addEventListener('mousedown', rectMouseDown);
    canvas.addEventListener('mousemove', rectMouseMove);
    canvas.addEventListener('mouseup', rectMouseUp);
    canvas.addEventListener('mouseleave', rectMouseUp);

    canvas.addEventListener('touchstart', function (e) {
        e.preventDefault();
        var t = e.touches[0];
        var rect = canvas.getBoundingClientRect();
        rectMouseDown({ clientX: t.clientX, clientY: t.clientY, target: canvas });
    }, { passive: false });
    canvas.addEventListener('touchmove', function (e) {
        e.preventDefault();
        var t = e.touches[0];
        rectMouseMove({ clientX: t.clientX, clientY: t.clientY });
    }, { passive: false });
    canvas.addEventListener('touchend', rectMouseUp);
}

function getCanvasPos(e) {
    var canvas = rectState.canvas;
    var rect = canvas.getBoundingClientRect();
    var x = (e.clientX - rect.left) * (canvas.width / rect.width);
    var y = (e.clientY - rect.top)  * (canvas.height / rect.height);

    var col = Math.round(x / rectState.cellSize);
    var row = Math.round(y / rectState.cellSize);

    col = Math.max(0, Math.min(rectState.cols, col));
    row = Math.max(0, Math.min(rectState.rows, row));

    return { col: col, row: row };
}

function rectMouseDown(e) {
    if (e.target !== rectState.canvas) return;
    var pos = getCanvasPos(e);
    rectState.drawing = true;
    rectState.startX = pos.col;
    rectState.startY = pos.row;
    rectState.rect = null;
    drawRectField();
}

function rectMouseMove(e) {
    if (!rectState.drawing) return;
    var pos = getCanvasPos(e);
    var x1 = Math.min(rectState.startX, pos.col);
    var y1 = Math.min(rectState.startY, pos.row);
    var x2 = Math.max(rectState.startX, pos.col);
    var y2 = Math.max(rectState.startY, pos.row);

    rectState.rect = {
        x: x1, y: y1,
        w: x2 - x1, h: y2 - y1
    };

    drawRectField();
}

function rectMouseUp() {
    rectState.drawing = false;
    var hint = document.getElementById('rect-hint');
    if (hint && rectState.rect && rectState.rect.w > 0 && rectState.rect.h > 0) {
        hint.classList.add('hidden');
    }
}


function drawMinecraftBackground(ctx, cols, rows, cs) {
    var W = cols * cs;
    var H = rows * cs;

    // 1. Если блоков еще нет (новое задание) — генерируем их
    if (rectState.bgBlocks.length === 0) {
        // 1. Голубое море (базовый слой на весь экран)
        rectState.bgBlocks.push({ color: '#a8d8f0', x: 0, y: 0, w: W, h: H });

        function generateRandomBlocks(color, minBlocks, maxBlocks) {
            var numBlocks = Math.floor(Math.random() * (maxBlocks - minBlocks + 1)) + minBlocks;
            for (var i = 0; i < numBlocks; i++) {
                // Рандомный размер от 1 до 5 клеток
                var blockW = Math.floor(Math.random() * 5) + 1; 
                var blockH = Math.floor(Math.random() * 5) + 1;
                
                // Позиция, чтобы блок не вылезал за край
                var startCol = Math.floor(Math.random() * (cols - blockW + 1));
                var startRow = Math.floor(Math.random() * (rows - blockH + 1));
                
                rectState.bgBlocks.push({ 
                    color: color, 
                    x: startCol * cs, 
                    y: startRow * cs, 
                    w: blockW * cs, 
                    h: blockH * cs 
                });
            }
        }

        // Генерируем большие хаотичные куски
        generateRandomBlocks('#a8e6a3', 8, 12); // Трава
        generateRandomBlocks('#ffe8b3', 8, 12); // Песок
    }

    // 2. Отрисовываем сохраненные блоки
    rectState.bgBlocks.forEach(function(block) {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.w, block.h);
    });
}

function drawRectField() {
    var ctx = rectState.ctx;
    var cs = rectState.cellSize;
    var cols = rectState.cols;
    var rows = rectState.rows;
    var W = cols * cs;
    var H = rows * cs;

    // 1. Рисуем фон в стиле Майнкрафт
    drawMinecraftBackground(ctx, cols, rows, cs);

    // 2. Рисуем сетку (полупрозрачную, чтобы фон было видно)
    ctx.strokeStyle = 'rgba(30, 74, 107, 0.2)'; // Темно-синяя прозрачная линия
    ctx.lineWidth = 1;
    for (var i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cs, 0);
        ctx.lineTo(i * cs, H);
        ctx.stroke();
    }
    for (var j = 0; j <= rows; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * cs);
        ctx.lineTo(W, j * cs);
        ctx.stroke();
    }

    // 3. Рисуем сам прямоугольник, который выделяет ученик
    if (rectState.rect) {
        var r = rectState.rect;
        // Полупрозрачная синяя заливка, чтобы видеть фон под ней
        ctx.fillStyle = 'rgba(107, 201, 255, 0.4)';
        ctx.fillRect(r.x * cs, r.y * cs, r.w * cs, r.h * cs);

        // Жирная рамка
        ctx.strokeStyle = '#1e4a6b';
        ctx.lineWidth = 3;
        ctx.strokeRect(r.x * cs, r.y * cs, r.w * cs, r.h * cs);

        // Подписи сторон
        if (r.w > 0 && r.h > 0) {
            ctx.fillStyle = '#b34700';
            ctx.font = 'bold 16px Comfortaa, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(r.w + '', (r.x + r.w / 2) * cs, r.y * cs - 6);

            ctx.save();
            ctx.translate(r.x * cs - 8, (r.y + r.h / 2) * cs);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(r.h + '', 0, 0);
            ctx.restore();
        }
    }
}

function nextRectExample() {
    var example = window.TRAINERS['rect'].next();
    rectState.example = example;

    document.getElementById('rect-task').textContent = example.text;

    rectState.rect = null;
    rectState.bgBlocks = [];
    drawRectField();

    var hint = document.getElementById('rect-hint');
    if (hint) {
        hint.textContent = 'Зажми левую кнопку мыши и начерти прямоугольник';
        hint.classList.remove('hidden');
    }

    var sText = document.getElementById('rect-s-input');
    var sAns = document.getElementById('rect-s-ans');
    var pText = document.getElementById('rect-p-input');
    var pAns = document.getElementById('rect-p-ans');

    if (sText) { sText.value = ''; sText.classList.remove('correct', 'wrong'); }
    if (sAns) { sAns.value = ''; sAns.classList.remove('correct', 'wrong'); }
    
    if (pText) { pText.value = ''; pText.classList.remove('correct', 'wrong'); }
    if (pAns) { pAns.value = ''; pAns.classList.remove('correct', 'wrong'); }

    var sRow = document.getElementById('rect-s-row');
    var pRow = document.getElementById('rect-p-row');


    // Если это 3, 4, 5 или 6 тип — прячем поля ввода (потому что искать площадь/периметр не надо)
    if (example.type === 'type3' || example.type === 'type4' || example.type === 'type5' || example.type === 'type6') {
        if (sRow) sRow.style.display = 'none';
        if (pRow) pRow.style.display = 'none';
    } else {
        // Для 1 и 2 типа — показываем
        if (sRow) sRow.style.display = 'flex';
        if (pRow) pRow.style.display = 'flex';
    }
  

    var checkBtn = document.getElementById('rect-check-btn');
    if (checkBtn) checkBtn.style.display = 'inline-block';
    var nextBtn = document.getElementById('rect-next-btn');
    if (nextBtn) nextBtn.style.display = 'none';

    var fb = document.getElementById('rect-feedback');
    fb.textContent = '';
    fb.className = 'solver-feedback';
}

function checkRect() {
    var example = rectState.example;
    var fb = document.getElementById('rect-feedback');

    var drawnGiven = rectState.rect && rectState.rect.w > 0 && rectState.rect.h > 0;
    var drawnOk = true;

    if (drawnGiven) {
        var rW = rectState.rect.w;
        var rH = rectState.rect.h;
        var rArea = rW * rH;
        var rPerim = 2 * (rW + rH);

        // Проверка в зависимости от типа задания
        if (example.type === 'type3') { 
            drawnOk = (rPerim === example.perimeter);
        } else if (example.type === 'type4') { 
            drawnOk = (rArea === example.area);
        } else if (example.type === 'type5') { 
            // Квадрат по площади (стороны должны быть равны)
            drawnOk = (rW === rH) && (rArea === example.area);
        } else if (example.type === 'type6') { 
            // Квадрат по периметру (стороны должны быть равны)
            drawnOk = (rW === rH) && (rPerim === example.perimeter);
        } else { 
            // 1 и 2 тип
            drawnOk = (rW === example.a && rH === example.b) || (rW === example.b && rH === example.a);
        }
    }

    var allOk = true;
    var hints = [];

    if (!drawnGiven) {
        allOk = false;
        hints.push('Ты не начертил прямоугольник.');
    } else if (!drawnOk) {
        allOk = false;
        hints.push('Прямоугольник начерчен неверно.');
    }

    // Проверяем S и P ТОЛЬКО если это 1 или 2 тип
    if (example.type === 'type1' || example.type === 'type2') {
        var sAns = document.getElementById('rect-s-ans');
        var pAns = document.getElementById('rect-p-ans');

        if (sAns) {
            var sUser = parseInt(sAns.value.trim(), 10);
            sAns.classList.remove('correct', 'wrong');
            if (sUser === example.area) {
                sAns.classList.add('correct');
            } else {
                sAns.classList.add('wrong');
                allOk = false;
                hints.push('Площадь неверна.');
            }
        }

        if (pAns) {
            var pUser = parseInt(pAns.value.trim(), 10);
            pAns.classList.remove('correct', 'wrong');
            if (pUser === example.perimeter) {
                pAns.classList.add('correct');
            } else {
                pAns.classList.add('wrong');
                allOk = false;
                hints.push('Периметр неверен.');
            }
        }
    }

    if (allOk) {
        rectState.score++;
        updateRectScore();
        fb.textContent = '🎉 Молодец! Всё верно!';
        fb.className = 'solver-feedback ok';
        document.getElementById('rect-check-btn').style.display = 'none';
        document.getElementById('rect-next-btn').style.display = 'inline-block';
    } else {
        fb.textContent = '❌ ' + hints.join(' ');
        fb.className = 'solver-feedback err';
    }
}

function updateRectScore() {
    var counter = document.getElementById('solver-counter');
    if (counter) counter.textContent = 'Очки: ' + rectState.score;
}


// ==================== СТИКЕР ДЛЯ РИСОВАНИЯ ====================
(function initSticker() {
    // Создаем кнопку и стикер, если их нет в HTML
    var toggleBtn = document.querySelector('.sticker-toggle-btn');
    if (!toggleBtn) {
        toggleBtn = document.createElement('button');
        toggleBtn.className = 'sticker-toggle-btn';
        toggleBtn.id = 'sticker-toggle-btn';
        toggleBtn.innerHTML = '📝';
        toggleBtn.title = 'Открыть стикер для рисования';
        document.body.appendChild(toggleBtn);
    }

    var wrap = document.querySelector('.sticker-wrap');
    if (!wrap) {
        wrap = document.createElement('div');
        wrap.className = 'sticker-wrap';
        wrap.id = 'sticker-wrap';
        wrap.innerHTML = `
            <div class="sticker-header" id="sticker-header">
                <div class="sticker-magnet"></div>
            </div>
            <canvas id="sticker-canvas"></canvas>
            <button class="sticker-clear" id="sticker-clear-btn">Очистить</button>
            <div class="sticker-resize" id="sticker-resize"></div>
        `;
        document.body.appendChild(wrap);
    }

    var canvas = document.getElementById('sticker-canvas');
    var ctx = canvas.getContext('2d');
    var isDrawing = false;
    var isDragging = false;
    var isResizing = false;
    
    // Настройки кисти
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#1e4a6b'; // Синий цвет, как в тетради

    // Адаптация размера холста при изменении размера стикера
    function resizeCanvas() {
        // Сохраняем текущий рисунок
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Меняем размеры
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Восстанавливаем рисунок
        if (imgData) {
            ctx.putImageData(imgData, 0, 0);
        }
        
        // Восстанавливаем стили (они сбрасываются при изменении размера)
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#1e4a6b';
    }

    // Вызываем при старте, чтобы холст получил размеры
    setTimeout(resizeCanvas, 100);

    // === РИСОВАНИЕ ===
    function getPos(e) {
        var rect = canvas.getBoundingClientRect();
        var clientX = e.touches ? e.touches[0].clientX : e.clientX;
        var clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        // Пересчитываем координаты с учетом масштабирования (если размер холста и CSS не совпадают)
        return {
            x: (clientX - rect.left) * (canvas.width / rect.width),
            y: (clientY - rect.top) * (canvas.height / rect.height)
        };
    }

    function startDraw(e) {
        e.preventDefault(); // Останавливаем скролл и выделение текста
        isDrawing = true;
        var p = getPos(e);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
    }

    function drawMove(e) {
        if (!isDrawing) return;
        e.preventDefault();
        var p = getPos(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    }

    function endDraw() {
        isDrawing = false;
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', drawMove);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseleave', endDraw);

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', drawMove, { passive: false });
    canvas.addEventListener('touchend', endDraw);

    // Очистка
    document.getElementById('sticker-clear-btn').onclick = function(e) {
        e.stopPropagation();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    // === ПЕРЕТАСКИВАНИЕ ===
    var header = document.getElementById('sticker-header');
    var startX, startY, startLeft, startTop;

    header.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = wrap.offsetLeft;
        startTop = wrap.offsetTop;
        e.preventDefault();
    });
    
    header.addEventListener('touchstart', function(e) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startLeft = wrap.offsetLeft;
        startTop = wrap.offsetTop;
    }, { passive: false });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        wrap.style.left = (startLeft + e.clientX - startX) + 'px';
        wrap.style.top = (startTop + e.clientY - startY) + 'px';
        // Сбрасываем bottom и right, чтобы таскалось правильно
        wrap.style.bottom = 'auto';
        wrap.style.right = 'auto';
    });

    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
        wrap.style.left = (startLeft + e.touches[0].clientX - startX) + 'px';
        wrap.style.top = (startTop + e.touches[0].clientY - startY) + 'px';
        wrap.style.bottom = 'auto';
        wrap.style.right = 'auto';
    }, { passive: false });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        isResizing = false;
    });
    document.addEventListener('touchend', function() {
        isDragging = false;
        isResizing = false;
    });

    // === ИЗМЕНЕНИЕ РАЗМЕРА ===
    var resizer = document.getElementById('sticker-resize');
    var startW, startH, startLeftR, startTopR;

    resizer.addEventListener('mousedown', function(e) {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startW = wrap.offsetWidth;
        startH = wrap.offsetHeight;
        startLeftR = wrap.offsetLeft;
        startTopR = wrap.offsetTop;
        e.preventDefault();
        e.stopPropagation();
    });

    resizer.addEventListener('touchstart', function(e) {
        isResizing = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startW = wrap.offsetWidth;
        startH = wrap.offsetHeight;
        startLeftR = wrap.offsetLeft;
        startTopR = wrap.offsetTop;
        e.preventDefault();
        e.stopPropagation();
    }, { passive: false });

    document.addEventListener('mousemove', function(e) {
        if (!isResizing) return;
        var newW = startW + (e.clientX - startX);
        var newH = startH + (e.clientY - startY);
        
        // Минимальные размеры
        if (newW > 150) wrap.style.width = newW + 'px';
        if (newH > 150) wrap.style.height = newH + 'px';
        
        // Пересчитываем холст
        resizeCanvas();
    });

    document.addEventListener('touchmove', function(e) {
        if (!isResizing) return;
        e.preventDefault();
        var newW = startW + (e.touches[0].clientX - startX);
        var newH = startH + (e.touches[0].clientY - startY);
        
        if (newW > 150) wrap.style.width = newW + 'px';
        if (newH > 150) wrap.style.height = newH + 'px';
        
        resizeCanvas();
    }, { passive: false });

    // === ПОКАЗ/СКРЫТИЕ КНОПКИ ===
    // Кнопка появляется, когда открыт экран решения ИЛИ лист заданий
    var checkVisibility = setInterval(function() {
        var solverScreen = document.getElementById('solver-screen');
        var worksheetScreen = document.getElementById('worksheet-screen');
        
        var isSolver = solverScreen && solverScreen.classList.contains('active');
        var isWorksheet = worksheetScreen && worksheetScreen.classList.contains('active');
        
        if (isSolver || isWorksheet) {
            toggleBtn.style.display = 'block';
        } else {
            toggleBtn.style.display = 'none';
            wrap.classList.remove('active'); // Прячем стикер, если ушли с экрана
        }
    }, 500);

    // Переключение стикера
    toggleBtn.onclick = function() {
        wrap.classList.toggle('active');
        
        // При открытии подгоняем размер холста и очищаем его
        if (wrap.classList.contains('active')) {
            setTimeout(function() {
                // Жестко задаем размеры холста, чтобы он совпадал с визуальным размером
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
                
                // Обязательно восстанавливаем настройки кисти после изменения размера
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#1e4a6b';
                
                // Очищаем холст (чтобы старый рисунок не растягивался)
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }, 50);
        }
    };

})();
// ==================== КОНЕЦ СТИКЕРА ====================




// Экспортируем функции запуска для смешанного раунда
window.startColumnsTrainer = startColumnsTrainer;
window.startDivisionTrainer = startDivisionTrainer;
window.startUnitsTrainer = startUnitsTrainer;
window.startEquationsTrainer = startEquationsTrainer;
window.startRectTrainer = startRectTrainer;

window.Trainer = {
    start: startTrainer,
    exit: exitTrainer,
    isActive: function () {
        return trainerState.active === true;
    },
    checkCurrent: function() {
        if (window._divisionState) checkDivision();
        else if (window._columnsState) checkColumn();
        else if (window._unitsState) checkUnits();
        else if (window._eqState) checkEquation();
        else if (window.rectState) checkRect();
        else trainerCheck();
    },
    setMixedLimit: function(limit, callback) {
        trainerState.limit = limit;
        trainerState.solved = 0;
        trainerState.onFinish = callback;
        
        var exitBtn = document.getElementById('solver-exit-btn');
        if (exitBtn) {
            exitBtn.onclick = function() {
                trainerState.limit = 0;
                trainerState.active = false;
                document.getElementById('solver-screen').classList.remove('active');
                document.body.style.overflow = 'auto';
            };
        }
    }
};
// ==================== РИСОВАНИЕ НА ФОНЕ ====================
(function initDrawing() {
    var canvas, ctx, drawing = false;

    function setup() {
        canvas = document.getElementById('solver-canvas');
        if (!canvas) return;

        ctx = canvas.getContext('2d');
        resizeCanvas();

        window.addEventListener('resize', resizeCanvas);

        // Мышка
        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', drawMove);
        canvas.addEventListener('mouseup', endDraw);
        canvas.addEventListener('mouseleave', endDraw);

        // Тач
        canvas.addEventListener('touchstart', function (e) {
            e.preventDefault();
            var t = e.touches[0];
            startDraw({ clientX: t.clientX, clientY: t.clientY });
        }, { passive: false });
        canvas.addEventListener('touchmove', function (e) {
            e.preventDefault();
            var t = e.touches[0];
            drawMove({ clientX: t.clientX, clientY: t.clientY });
        }, { passive: false });
        canvas.addEventListener('touchend', endDraw);

        // Кнопка «Стереть»
        var clearBtn = document.getElementById('solver-clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            });
        }
    }

    function resizeCanvas() {
        if (!canvas) return;
        var w = window.innerWidth;
        var h = window.innerHeight;
        // Сохраняем рисунок при ресайзе
        var imgData = canvas.width > 0 ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;
        canvas.width  = w;
        canvas.height = h;
        if (imgData) {
            ctx.putImageData(imgData, 0, 0);
        }
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#1e4a6b';
    }

    function getPos(e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (canvas.width / rect.width),
            y: (e.clientY - rect.top)  * (canvas.height / rect.height)
        };
    }

    function startDraw(e) {
        drawing = true;
        var p = getPos(e);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
    }

    function drawMove(e) {
        if (!drawing) return;
        var p = getPos(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    }

    function endDraw() {
        drawing = false;
    }

    document.addEventListener('DOMContentLoaded', setup);

})();
})();
