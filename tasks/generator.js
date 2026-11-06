// tasks/generator.js
// Конструктор задания: выбор тем и тренажёров со счётчиками.
(function () {

var state = {
    total: 5,
    // { topicName: count }
    topicCounts: {},
    // { trainerKey: count }
    trainerCounts: {}
};

var el = {};

function init() {
    el.overlay        = document.getElementById('generator-overlay');
    el.closeBtn       = document.getElementById('generator-close');
    el.cancelBtn      = document.getElementById('gen-cancel');
    el.startBtn       = document.getElementById('gen-start');
    el.topicsBox      = document.getElementById('generator-topics');
    el.trainersBox    = document.getElementById('generator-trainers');
    el.distributed    = document.getElementById('generator-distributed');
    el.remaining      = document.getElementById('generator-remaining');

    if (!el.overlay) return;

    // Общее количество
    document.querySelectorAll('.gen-count-btn').forEach(function (b) {
        b.addEventListener('click', function () {
            document.querySelectorAll('.gen-count-btn').forEach(function (x) {
                x.classList.remove('active');
            });
            this.classList.add('active');
            state.total = parseInt(this.dataset.total, 10);
            updateStatus();
        });
    });

    el.closeBtn.addEventListener('click', close);
    el.cancelBtn.addEventListener('click', close);
    el.startBtn.addEventListener('click', startGeneration);

    // Закрытие по клику на фон
    el.overlay.addEventListener('click', function (e) {
        if (e.target === el.overlay) close();
    });
}

// ---------- ОТКРЫТИЕ ----------
function open() {
    resetCounts();
    renderTopics();
    renderTrainers();
    updateStatus();
    el.overlay.classList.add('active');
}

function close() {
    el.overlay.classList.remove('active');
}

function resetCounts() {
    state.total = 5;
    state.topicCounts = {};
    state.trainerCounts = {};

    // сброс кнопок общего количества
    document.querySelectorAll('.gen-count-btn').forEach(function (b) {
        b.classList.toggle('active', b.dataset.total === '5');
    });
}

// ---------- СПИСОК ТЕМ ----------
function renderTopics() {
    el.topicsBox.innerHTML = '';

    var banks = window.BANKS || {};
    var topicNames = Object.keys(banks).filter(function (name) {
        return Array.isArray(banks[name]) && banks[name].length > 0;
    });

    if (topicNames.length === 0) {
        el.topicsBox.innerHTML = '<div class="placeholder-message">Нет доступных тем</div>';
        return;
    }

    topicNames.forEach(function (name) {
        state.topicCounts[name] = 0;
        el.topicsBox.appendChild(makeRow(name, 'topic', banks[name].length));
    });
}

// ---------- СПИСОК ТРЕНАЖЁРОВ ----------
function renderTrainers() {
    el.trainersBox.innerHTML = '';

    var trainers = window.TRAINERS || {};
    var keys = Object.keys(trainers);

    if (keys.length === 0) {
        el.trainersBox.innerHTML = '<div class="placeholder-message">Нет доступных тренажёров</div>';
        return;
    }

    keys.forEach(function (key) {
        state.trainerCounts[key] = 0;
        el.trainersBox.appendChild(makeRow(trainers[key].title, 'trainer', null, key));
    });
}

// ---------- СТРОКА СО СЧЁТЧИКОМ ----------
function makeRow(displayName, type, availableCount, key) {
    var row = document.createElement('div');
    row.className = 'generator-row';

    var nameSpan = document.createElement('span');
    nameSpan.className = 'generator-row-name';
    nameSpan.textContent = displayName;

    var counter = document.createElement('div');
    counter.className = 'generator-row-counter';

    var minus = document.createElement('button');
    minus.className = 'gen-counter-btn';
    minus.textContent = '−';

    var value = document.createElement('span');
    value.className = 'gen-counter-value';
    value.textContent = '0';

    var plus = document.createElement('button');
    plus.className = 'gen-counter-btn';
    plus.textContent = '+';

    minus.addEventListener('click', function () {
        if (type === 'topic') {
            if (state.topicCounts[displayName] > 0) {
                state.topicCounts[displayName]--;
                value.textContent = state.topicCounts[displayName];
                updateStatus();
            }
        } else {
            if (state.trainerCounts[key] > 0) {
                state.trainerCounts[key]--;
                value.textContent = state.trainerCounts[key];
                updateStatus();
            }
        }
    });

    plus.addEventListener('click', function () {
        var distributed = getDistributed();

        // Если тема пустая — предупреждение
        if (type === 'topic' && (!availableCount || availableCount === 0)) {
            alert('Тема пока не наполнена задачами.');
            return;
        }

        // Проверка: не превышаем ли общее количество (2A)
        if (distributed >= state.total) {
            alert('Уже распределено ' + state.total + ' из ' + state.total + '. Уменьшите счётчик в другой теме, чтобы добавить здесь.');
            return;
        }

        if (type === 'topic') {
            state.topicCounts[displayName]++;
            value.textContent = state.topicCounts[displayName];
        } else {
            state.trainerCounts[key]++;
            value.textContent = state.trainerCounts[key];
        }
        updateStatus();
    });

    counter.appendChild(minus);
    counter.appendChild(value);
    counter.appendChild(plus);

    row.appendChild(nameSpan);
    row.appendChild(counter);
    return row;
}

// ---------- СТАТУС ----------
function getDistributed() {
    var sum = 0;
    Object.keys(state.topicCounts).forEach(function (k) { sum += state.topicCounts[k]; });
    Object.keys(state.trainerCounts).forEach(function (k) { sum += state.trainerCounts[k]; });
    return sum;
}

function updateStatus() {
    var distributed = getDistributed();
    var remaining = state.total - distributed;

    el.distributed.textContent = 'Распределено: ' + distributed + ' / ' + state.total;

    if (remaining > 0) {
        el.remaining.textContent = 'Осталось: ' + remaining;
        el.remaining.className = 'generator-remaining';
        el.startBtn.disabled = false;   // 1B — можно начинать, доберём случайно
    } else if (remaining === 0) {
        el.remaining.textContent = '✓ Готово';
        el.remaining.className = 'generator-remaining ok';
        el.startBtn.disabled = false;
    } else {
        el.remaining.textContent = 'Превышено на ' + (-remaining) + '!';
        el.remaining.className = 'generator-remaining';
        el.startBtn.disabled = true;
    }
}

// ---------- СТАРТ ----------
function startGeneration() {
    var distributed = getDistributed();

    // Собираем выбранные задачи
    var selectedTasks = [];
    Object.keys(state.topicCounts).forEach(function (topicName) {
        var count = state.topicCounts[topicName];
        if (count > 0) {
            selectedTasks.push({ topic: topicName, count: count });
        }
    });

    // Собираем выбранные тренажёры
    var selectedTrainers = [];
    Object.keys(state.trainerCounts).forEach(function (key) {
        var count = state.trainerCounts[key];
        if (count > 0) {
            selectedTrainers.push({ key: key, count: count });
        }
    });

    // 1B: добираем случайно, если меньше total
    if (distributed < state.total && selectedTasks.length + selectedTrainers.length > 0) {
        var need = state.total - distributed;
        // Случайно распределяем между выбранными темами
        var pool = [];
        selectedTasks.forEach(function (t) {
            for (var i = 0; i < t.count; i++) pool.push({ type: 'task', topic: t.topic });
        });
        selectedTrainers.forEach(function (t) {
            for (var i = 0; i < t.count; i++) pool.push({ type: 'trainer', key: t.key });
        });

        // Равномерно добавим недостающие
        for (var i = 0; i < need; i++) {
            var r = pool[Math.floor(Math.random() * pool.length)];
            if (r.type === 'task') {
                // Найти в selectedTasks
                for (var j = 0; j < selectedTasks.length; j++) {
                    if (selectedTasks[j].topic === r.topic) {
                        selectedTasks[j].count++;
                        break;
                    }
                }
            } else {
                for (var j = 0; j < selectedTrainers.length; j++) {
                    if (selectedTrainers[j].key === r.key) {
                        selectedTrainers[j].count++;
                        break;
                    }
                }
            }
        }
    }

    if (selectedTasks.length === 0 && selectedTrainers.length === 0) {
        alert('Выбери хотя бы одну тему или тренажёр.');
        return;
    }

    close();

    if (window.Solver && typeof window.Solver.startMixedRound === 'function') {
        var realTotal = 0;
        selectedTasks.forEach(function(t) { realTotal += t.count; });
        selectedTrainers.forEach(function(t) { realTotal += t.count; });

        window.Solver.startMixedRound({
            tasks: selectedTasks,
            trainers: selectedTrainers,
            total: realTotal
        });
    } else {


        alert('Внутренняя ошибка: Solver.startMixedRound не найден.');
    }
}

window.Generator = {
    init: init,
    open: open,
    close: close
};

document.addEventListener('DOMContentLoaded', init);

})();