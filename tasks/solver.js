// tasks/solver.js
// Полноценный экран решения задачи.

(function () {

// ---------- СОСТОЯНИЕ ----------
var state = {
    topic: null,
    bank: [],
    queue: [],           
    currentIndex: 0,
    totalTasks: 0,
    correctCount: 0,
    wrongTasks: [],      
    currentTask: null,
    answerShown: false,
    taskChecked: false
};
// ---------- СМЕШАННЫЙ РАУНД ----------
var mixedRound = {
    active: false,
    items: [],
    currentIndex: 0,
    score: 0,
    wrongTasks: []
};

// ---------- DOM ----------
var screen, modal, finalScreen;
var els = {};

function init() {
    screen = document.getElementById('solver-screen');
    modal = document.getElementById('count-modal-overlay');
    finalScreen = document.getElementById('final-screen');
    if (!screen) return;

    els = {
        topicBadge:   document.getElementById('solver-topic-badge'),
        counter:      document.getElementById('solver-counter'),
        taskText:     document.getElementById('solver-task-text'),
        condRows:     document.getElementById('condition-rows'),
        condAddRow:   document.getElementById('condition-add-row'),
        toolsPanel:   document.querySelector('.tools-panel'),
        condBox:      document.querySelector('.condition-box'),
        bracketsSvg:  document.getElementById('brackets-svg'),
        solveBtn:     document.getElementById('solver-solve-btn'),
        actionsBox:   document.getElementById('actions-box'),
        actionAddRow: document.getElementById('action-add-row'),
        answerBox:    document.getElementById('answer-box'),
        answerCell:   document.getElementById('answer-cell'),
        answerLabel:  document.getElementById('answer-label'),
        feedback:     document.getElementById('solver-feedback'),
        exitBtn:      document.getElementById('solver-exit-btn'),
        checkBtn:     document.getElementById('solver-check-btn'),
        nextBtn:      document.getElementById('solver-next-btn'),
        taskMode:     document.getElementById('solver-task-mode'),
        trainerMode:  document.getElementById('solver-trainer-mode'),
        example:      document.getElementById('trainer-example'),
        trainerAnswer: document.getElementById('trainer-answer-input')
    };

    els.exitBtn.addEventListener('click', exitToMenu);
    els.condAddRow.addEventListener('click', addConditionRow);
    els.solveBtn.addEventListener('click', revealActions);
    els.actionAddRow.addEventListener('click', addAction);
    
if (els.checkBtn) {
    els.checkBtn.addEventListener('click', function() {
        var tm = document.getElementById('solver-trainer-mode');
        // Если открыт тренажер — не проверяем задачу
        if (tm && tm.style.display === 'block') return;
        
        // Если мы в смешанном раунде и это задача — проверяем
        if (mixedRound.active && mixedRound.items[mixedRound.currentIndex].kind === 'task') {
            checkEverything();
        } else if (!mixedRound.active) {
            checkEverything();
        }
    });
}
    
    els.nextBtn.addEventListener('click', goNextTask);

    document.querySelectorAll('.count-modal-btn').forEach(function (b) {
        b.addEventListener('click', function () {
            var count = parseInt(this.dataset.count, 10);
            modal.classList.remove('active');
            startRound(state.topic, count);
        });
    });

    document.getElementById('final-back-btn').addEventListener('click', function () {
        document.getElementById('final-screen').classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    document.getElementById('count-modal-cancel').addEventListener('click', function () {
        modal.classList.remove('active');
    });

    initBrackets();

    var answerBtn = document.getElementById('solver-show-answer-btn');
    if (answerBtn) answerBtn.addEventListener('click', revealAnswer);
}

// ---------- ОТКРЫТИЕ ЭКРАНА ----------
function openSolver(topicName) {
    if (window.Trainer && window.Trainer.isActive && window.Trainer.isActive()) {
        window.Trainer.exit();
    }

    var taskMode = document.getElementById('solver-task-mode');
    var trainerMode = document.getElementById('solver-trainer-mode');
    if (taskMode) taskMode.style.display = 'block';
    if (trainerMode) trainerMode.style.display = 'none';

    var cw = document.getElementById('column-wrapper');
    if (cw) cw.innerHTML = '';

    state.topic = topicName;
    var bank = (window.BANKS && window.BANKS[topicName]) || [];
    state.bank = bank.filter(function (t) { return !t.special; });

    if (state.bank.length === 0) {
        alert('Для этой темы пока нет задач 😕');
        return;
    }

    document.getElementById('count-modal-title').textContent = topicName;
    modal.classList.add('active');
}

function startRound(topicName, count) {
    if (window.Trainer && window.Trainer.isActive && window.Trainer.isActive()) {
        window.Trainer.exit();
    }

    var taskMode = document.getElementById('solver-task-mode');
    var trainerMode = document.getElementById('solver-trainer-mode');
    if (taskMode) taskMode.style.display = 'block';
    if (trainerMode) trainerMode.style.display = 'none';

    var cw = document.getElementById('column-wrapper');
    if (cw) cw.innerHTML = '';

    // Создаем пул задач из банка
    var bank = state.bank;
    if (!bank || bank.length === 0) {
        alert('В этой теме нет задач!');
        return;
    }

    // Перемешиваем банк (алгоритм Фишера-Йетса)
    var shuffledBank = bank.slice(); 
    for (var i = shuffledBank.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = shuffledBank[i];
        shuffledBank[i] = shuffledBank[j];
        shuffledBank[j] = temp;
    }

    // Если задач в банке МЕНЬШЕ, чем нужно решить, 
    // мы ограничиваем раунд количеством задач в банке, чтобы не было повторов.
    var actualCount = Math.min(count, shuffledBank.length);
    
    if (actualCount < count) {
        // Можно вывести предупреждение, что задач меньше, но начнем раунд
        console.log('В банке только ' + shuffledBank.length + ' задач, раунд будет состоять из ' + actualCount);
    }

    state.totalTasks = actualCount; 
    state.queue = []; // Очищаем очередь

    // Берем ровно actualCount уникальных задач
    for (var k = 0; k < actualCount; k++) {
        state.queue.push(shuffledBank[k]);
    }

    state.currentIndex = 0;
    state.correctCount = 0;
    state.wrongTasks = [];
    screen.classList.add('active');
    document.body.style.overflow = 'hidden';
    loadTask();
}

function shuffleAndPick(arr, n) {
    var pool = arr.slice();
    var out = [];
    while (out.length < n) {
        if (pool.length === 0) pool = arr.slice();
        var i = Math.floor(Math.random() * pool.length);
        out.push(pool.splice(i, 1)[0]);
    }
    return out;
}

// ---------- ЗАГРУЗКА ЗАДАЧИ ----------
function loadTask() {
    if (!state.queue || state.queue.length === 0) return;
    state.currentTask = state.queue[state.currentIndex];
    if (!state.currentTask || !state.currentTask.text) return;

    state.answerShown = false;
    state.taskChecked = false;

    // === СКРЫВАЕМ ВСЕ БЛОКИ ТРЕНАЖЁРОВ (ОСОБЕННО СТОЛБИК) ===
    document.getElementById('trainer-simple-mode').style.display = 'none';
    document.getElementById('trainer-column-mode').style.display = 'none'; // <-- ВОТ ЭТО
    document.getElementById('trainer-units-mode').style.display = 'none';
    document.getElementById('trainer-rect-mode').style.display = 'none';
    document.getElementById('trainer-equations-mode').style.display = 'none';
    document.getElementById('trainer-order-mode').style.display = 'none';
    document.getElementById('trainer-numbers-mode').style.display = 'none';
    document.getElementById('trainer-clock-mode').style.display = 'none';
    document.getElementById('trainer-roman-mode').style.display = 'none';

    // Прячем кнопку проверки
    var globalCheckBtn = document.getElementById('solver-check-btn');
    if (globalCheckBtn) globalCheckBtn.style.display = 'none';

    // ... дальше идет твой старый код (if (window.Trainer && ...) и т.д.)

    if (window.Trainer && window.Trainer.isActive && window.Trainer.isActive()) {
        window.Trainer.exit();
    }
    document.getElementById('solver-task-mode').style.display = 'block';
    document.getElementById('solver-trainer-mode').style.display = 'none';

    var numMode = document.getElementById('trainer-numbers-mode');
    if (numMode) numMode.style.display = 'none';

    els.taskText.style.display = 'block';
    var cw = document.getElementById('column-wrapper');
    if (cw) cw.innerHTML = '';

    clearAllBrackets();
    clearBracketSelection();

    els.topicBadge.textContent = state.topic;
    els.counter.textContent = (state.currentIndex + 1) + ' / ' + state.totalTasks;
    els.taskText.textContent = state.currentTask.text;

    els.condRows.innerHTML = '';
    els.actionsBox.innerHTML = '';
    els.answerBox.classList.remove('active');
    els.answerCell.value = '';
    els.answerCell.classList.remove('correct', 'wrong');
    els.feedback.textContent = '';
    els.feedback.className = 'solver-feedback';
    if (els.bracketsSvg) els.bracketsSvg.innerHTML = '';

    addConditionRow();
    addConditionRow();

    els.checkBtn.style.display = 'none';
    els.nextBtn.style.display = 'none';
    els.solveBtn.style.display = 'inline-block';
    
    // Прячем кнопку "Проверить", если она осталась от тренажера
    var globalCheckBtn = document.getElementById('solver-check-btn');
    if (globalCheckBtn) globalCheckBtn.style.display = 'none';
    els.actionAddRow.style.display = 'none';
    els.answerBox.classList.remove('active');
}

function addConditionRow() {
    var row = document.createElement('div');
    row.className = 'condition-row';
    var num = document.createElement('span');
    num.className = 'condition-row-num';
    num.textContent = els.condRows.children.length + 1 + ')';
    var input = document.createElement('input');
    input.type = 'text';
    var del = document.createElement('button');
    del.className = 'condition-row-del';
    del.textContent = '×';
    del.addEventListener('click', function () {
        row.remove();
        renumberConditions();
    });
    row.appendChild(num);
    row.appendChild(input);
    row.appendChild(del);
    els.condRows.appendChild(row);
    renumberConditions();
}

function renumberConditions() {
    Array.from(els.condRows.children).forEach(function (row, i) {
        row.querySelector('.condition-row-num').textContent = (i + 1) + ')';
    });
}

function revealActions() {
    els.solveBtn.style.display = 'none';
    els.actionAddRow.style.display = 'block';
    if (state.currentTask.noAction) {
        revealAnswer();
        return;
    }
    addAction();
}

function addAction() {
    var idx = els.actionsBox.children.length + 1;
    var row = document.createElement('div');
    row.className = 'action-row';
    var num = document.createElement('span');
    num.className = 'action-num';
    num.textContent = idx + ')';

    var left = makeCell('left', 60);
    var op = makeOpCell();
    var right = makeCell('right', 60);
    var eq = document.createElement('span');
    eq.style.fontSize = '1.3rem';
    eq.style.fontWeight = '800';
    eq.textContent = '=';
    var result = makeCell('result', 70);

    var found = document.createElement('div');
    found.className = 'action-found';
    found.innerHTML = '(<input type="text" data-role="found">)';

    var del = document.createElement('button');
    del.className = 'action-del';
    del.textContent = '×';
    del.addEventListener('click', function () {
        row.remove();
        renumberActions();
    });

    row.appendChild(num);
    row.appendChild(left);
    row.appendChild(op);
    row.appendChild(right);
    row.appendChild(eq);
    row.appendChild(result);
    row.appendChild(found);
    row.appendChild(del);
    els.actionsBox.appendChild(row);
    renumberActions();
}

function makeCell(role, width) {
    var inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'action-cell';
    inp.dataset.role = role;
    inp.style.width = width + 'px';
    return inp;
}
function makeOpCell() {
    var sel = document.createElement('select');
    sel.className = 'action-op';
    sel.dataset.role = 'op';
    ['+', '−', '·', ':'].forEach(function (s) {
        var o = document.createElement('option');
        o.value = s; o.textContent = s;
        sel.appendChild(o);
    });
    return sel;
}
function renumberActions() {
    Array.from(els.actionsBox.children).forEach(function (row, i) {
        row.querySelector('.action-num').textContent = (i + 1) + ')';
    });
}

function revealAnswer() {
    els.answerBox.classList.add('active');
    els.answerLabel.textContent = state.currentTask.answerLabel || 'ответ';
    els.answerCell.focus();
    els.actionAddRow.style.display = 'none';
    els.checkBtn.style.display = 'inline-block';
    els.nextBtn.style.display = 'none';
}

function checkEverything() {
    if (!mixedRound.active && window.Trainer && window.Trainer.isActive && window.Trainer.isActive()) return;
    if (state.taskChecked) return;

    var task = state.currentTask;
    if (!task) return;

    if (els.answerCell.value.trim() === '') {
        els.feedback.textContent = '⚠️ Впиши ответ в окошко внизу!';
        els.feedback.className = 'solver-feedback err';
        return;
    }

    var userAnswer = parseFloat(String(els.answerCell.value).replace(',', '.'));
    var correctAnswer = parseFloat(String(task.answer).replace(',', '.'));

    var answerOk = (userAnswer === correctAnswer);

    markCell(els.answerCell, answerOk);

    state.taskChecked = true;

    if (answerOk) {
        state.correctCount++;
        if (window.addCorrectAnswer) {
            window.addCorrectAnswer('topic', state.topic);
        }
        els.feedback.textContent = '🎉 Молодец! Всё верно!';
        els.feedback.className = 'solver-feedback ok';
    } else {
        els.feedback.textContent = '🤔 Неправильно. Правильный ответ: ' + task.answer;
        els.feedback.className = 'solver-feedback err';
    }

    els.checkBtn.style.display = 'none';
    els.nextBtn.style.display = 'inline-block';

    if (state.currentIndex + 1 < state.totalTasks) {
        els.nextBtn.textContent = 'Следующая →';
    } else {
        els.nextBtn.textContent = 'Завершить →';
    }
}

function markCell(cell, ok) {
    cell.classList.remove('correct', 'wrong');
    cell.classList.add(ok ? 'correct' : 'wrong');
}

function parseNum(v) {
    if (v === null || v === undefined) return NaN;
    var s = String(v).trim().replace(',', '.');
    if (s === '') return NaN;
    var n = Number(s);
    return isNaN(n) ? NaN : n;
}

function normalizeOp(op) {
    if (op === '−') return '-';
    if (op === '·') return '*';
    if (op === ':') return '/';
    return op;
}

function goNextTask() {
    // Если это была последняя задача - показываем финал
    if (state.currentIndex + 1 >= state.totalTasks) {
        showFinal();
        return;
    }
    // Иначе переходим к следующей
    state.currentIndex++;
    loadTask();
}

function showFinal() {
    screen.classList.remove('active');
    document.body.style.overflow = 'auto';

    var correct = state.correctCount;
    var total   = state.totalTasks;
    var wrong   = total - correct;

    document.getElementById('final-correct').textContent = correct;
    document.getElementById('final-wrong').textContent   = wrong;
    document.getElementById('final-total').textContent   = total;

    // ===== РАСЧЁТ ОЦЕНКИ =====
    var markEl = document.getElementById('final-mark');
    if (markEl) {
        if (total > 0) {
            var percent = (correct / total) * 100;
            var mark, emoji, word;

            if (percent >= 90)      { mark = 5; emoji = '🌟'; word = 'Отлично!'; }
            else if (percent >= 70) { mark = 4; emoji = '👍'; word = 'Хорошо!'; }
            else if (percent >= 50) { mark = 3; emoji = '🙂'; word = 'Неплохо'; }
            else                    { mark = 2; emoji = '😔'; word = 'Надо повторить'; }

            markEl.textContent = 'Оценка: ' + mark + ' ' + emoji +
                                 ' · ' + word +
                                 ' (' + Math.round(percent) + '%)';
        } else {
            markEl.textContent = 'Оценка: —';
        }
    }

    finalScreen.classList.add('active');
}

var bracketState = { activeType: null, startRowIndex: null };
function initBrackets() {
    document.querySelectorAll('.tool-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var type = this.dataset.bracket;
            selectBracketType(type);
        });
    });
}
function selectBracketType(type) {
    if (bracketState.activeType === type) { clearBracketSelection(); return; }
    clearBracketSelection();
    bracketState.activeType = type;
    document.querySelectorAll('.tool-btn').forEach(function (b) {
        b.classList.toggle('active', b.dataset.bracket === type);
    });
    var rows = els.condRows.querySelectorAll('.condition-row');
    rows.forEach(function (row, idx) {
        var target = document.createElement('div');
        target.className = 'row-target';
        target.dataset.rowIndex = idx;
        target.addEventListener('click', function (e) {
            e.stopPropagation();
            handleTargetClick(idx, target);
        });
        row.appendChild(target);
    });
}



var bracketStartRow = null;

function handleTargetClick(rowIndex, targetEl) {
    if (bracketStartRow === null) {
        bracketStartRow = rowIndex;
        targetEl.classList.add('chosen');
        return;
    }
    if (bracketStartRow === rowIndex) {
        clearBracketSelection();
        return;
    }
    
    var start = Math.min(bracketStartRow, rowIndex);
    var end = Math.max(bracketStartRow, rowIndex);
    
    // Передаем true, если первая строка (start) была нажата РАНЬШЕ, чем нижняя (end)
    var isStartFirst = (bracketStartRow === start);
    
    drawBracket(start, end, bracketState.activeType, isStartFirst);
    clearBracketSelection();
}

function drawBracket(startIdx, endIdx, type, isStartFirst) {
    var layer = document.getElementById('brackets-layer');
    if (!layer) return;

    var rows = els.condRows.querySelectorAll('.condition-row');
    if (startIdx >= rows.length || endIdx >= rows.length) return;

    var input1 = rows[startIdx].querySelector('input');
    var input2 = rows[endIdx].querySelector('input');
    
    var box = els.condBox.getBoundingClientRect();
    var r1 = input1.getBoundingClientRect();
    var r2 = input2.getBoundingClientRect();

    // Разносим скобки на разное расстояние
    var baseX = r1.right - box.left + 15; 
    var x = baseX;

    if (type === 'square') {
        x = baseX + 100;           
    } else if (type === 'round') {
        x = baseX + 200;      
    } else if (type === 'curly') {
        x = baseX + 300;      
    }
    
    var y1 = r1.top - box.top + (r1.height / 2);
    var y2 = r2.top - box.top + (r2.height / 2);
    
    var h = Math.abs(y2 - y1);
    var topY = Math.min(y1, y2);

    var bracketWrap = document.createElement('div');
    bracketWrap.className = 'bracket-item';
    
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    
    // Для квадратной делаем svg шире
    var svgWidth = (type === 'square') ? 100 : 70;
    
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", h + 20);
    svg.style.position = 'absolute';
    svg.style.left = (x - 20) + 'px'; // Сдвигаем влево, чтобы компенсировать выступ
    svg.style.top = (topY - 10) + 'px';
    svg.style.overflow = 'visible';

    var path = document.createElementNS(svgNS, "path");
    var d = "";

    if (type === 'round') {
        // Дуга теперь на 100% ровная по краям (от x=20 до x=20)
        d = "M 20 10 Q 45 " + (h/2 + 10) + ", 20 " + (h + 10);
    } else if (type === 'curly') {
        d = "M 10 10 Q 25 10, 25 " + (h/4 + 10) + " Q 25 " + (h/2 + 10) + ", 33 " + (h/2 + 10) + " Q 25 " + (h/2 + 10) + ", 25 " + (3*h/4 + 10) + " Q 25 " + (h + 10) + ", 10 " + (h + 10);
    } else if (type === 'square') {
        // ШИРОКАЯ квадратная (полка теперь 60px вместо 30px)
        d = "M 20 10 L 80 10 L 80 " + (h + 10) + " L 20 " + (h + 10);
    }

    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#1e4a6b");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(path);

    // --- СТРЕЛОЧКИ ---
    if (type === 'round') {
        // Стрелки ровно по контуру дуги
        var a1 = document.createElementNS(svgNS, "path");
        // Верхняя стрелка
        a1.setAttribute("d", "M 28 10 L 14 6 L 16 16 Z"); 
        a1.setAttribute("fill", "#1e4a6b");
        svg.appendChild(a1);
        
        var a2 = document.createElementNS(svgNS, "path");
        // Нижняя стрелка (зеркальная)
        a2.setAttribute("d", "M 28 " + (h + 10) + " L 14 " + (h + 14) + " L 16 " + (h + 4) + " Z");
        a2.setAttribute("fill", "#1e4a6b");
        svg.appendChild(a2);

    } else if (type === 'square') {
        var a1 = document.createElementNS(svgNS, "path");
        if (isStartFirst) {
            // Если первый клик был СВЕРХУ, а второй СНИЗУ — стрелка ВНИЗУ
            a1.setAttribute("d", "M 15 " + (h + 10) + " L 30 " + (h + 5) + " L 28 " + (h + 15) + " Z");
        } else {
            // Если первый клик был СНИЗУ, а второй СВЕРХУ — стрелка ВВЕРХУ
            a1.setAttribute("d", "M 15 10 L 30 5 L 28 15 Z");
        }
        a1.setAttribute("fill", "#1e4a6b");
        svg.appendChild(a1);
    }

    bracketWrap.appendChild(svg);

    // Ячейка для ответа (ШИРЕ)
    if (type === 'round' || type === 'curly') {
        var qCell = document.createElement('input');
        qCell.type = 'text';
        qCell.className = 'bracket-question';
        qCell.style.position = 'absolute';
        qCell.style.width = '50px';   // Сделал шире
        qCell.style.height = '30px';
        qCell.style.left = (x + 25) + 'px';
        qCell.style.top = (topY + h/2 - 10) + 'px';
        qCell.style.textAlign = 'center';
        qCell.style.fontSize = '1.2rem';
        qCell.placeholder = '?';
        bracketWrap.appendChild(qCell);
    }

    // Кнопка удаления
    var delBtn = document.createElement('button');
    delBtn.className = 'bracket-del';
    delBtn.textContent = '×';
    delBtn.style.position = 'absolute';
    delBtn.style.left = (x + 45) + 'px';
    delBtn.style.top = (topY - 20) + 'px';
    delBtn.onclick = function() {
        bracketWrap.remove();
    };
    bracketWrap.appendChild(delBtn);

    layer.appendChild(bracketWrap);
}

function clearBracketSelection() {
    bracketState.activeType = null;
    bracketState.startRowIndex = null;
    bracketStartRow = null;
    document.querySelectorAll('.tool-btn').forEach(function (b) { b.classList.remove('active'); });
    els.condRows.querySelectorAll('.row-target').forEach(function (t) { 
        t.classList.remove('chosen');
        t.remove(); 
    });
}


function clearAllBrackets() {
    var layer = document.getElementById('brackets-layer');
    if (layer) layer.innerHTML = '';
}
function exitToMenu() {
    screen.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function startMixedRound(options) {
    var items = [];
    
    if (options.tasks) {
        options.tasks.forEach(function(t) {
            for (var i = 0; i < t.count; i++) {
                var bank = (window.BANKS && window.BANKS[t.topic]) || [];
                if (bank.length > 0) {
                    var randomTask = bank[Math.floor(Math.random() * bank.length)];
                    items.push({ kind: 'task', topic: t.topic, task: randomTask });
                }
            }
        });
    }

    if (options.trainers) {
        options.trainers.forEach(function(t) {
            for (var i = 0; i < t.count; i++) {
                items.push({ kind: 'trainer', key: t.key });
            }
        });
    }

    if (items.length === 0) return;

    items.sort(function() { return 0.5 - Math.random(); });

    mixedRound.active = true;
    mixedRound.items = items;
    mixedRound.currentIndex = 0;
    mixedRound.score = 0;
    mixedRound.wrongTasks = [];

    // Скрываем кнопки "Следующая задача" в общем меню, чтобы они не мешали
    els.checkBtn.style.display = 'none';
    els.nextBtn.style.display = 'none';

    screen.classList.add('active');
    document.body.style.overflow = 'hidden';
    goToMixedItem();
}

function goToMixedItem() {
    if (mixedRound.currentIndex >= mixedRound.items.length) {
        mixedRound.active = false;
        screen.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        document.getElementById('final-correct').textContent = mixedRound.score;
        document.getElementById('final-wrong').textContent = mixedRound.items.length - mixedRound.score;
        document.getElementById('final-total').textContent = mixedRound.items.length;
        finalScreen.classList.add('active');
        return;
    }

    var item = mixedRound.items[mixedRound.currentIndex];
    
    els.topicBadge.textContent = 'Смешанный раунд';
    els.counter.textContent = (mixedRound.currentIndex + 1) + ' / ' + mixedRound.items.length;

    if (item.kind === 'task') {
        state.queue = [item.task];
        state.totalTasks = 1;
        state.currentIndex = 0;
        loadTask();
        
        // Принудительно показываем кнопку "Решение"
        var solveBtn = document.getElementById('solver-solve-btn');
        if (solveBtn) solveBtn.style.display = 'inline-block';
        
        els.nextBtn.onclick = function() {
            mixedRound.currentIndex++;
            goToMixedItem();
        };
        
    } else if (item.kind === 'trainer') {
        document.getElementById('solver-task-mode').style.display = 'none';
        document.getElementById('solver-trainer-mode').style.display = 'block';
        
        // ВКЛЮЧАЕМ КНОПКУ ПРОВЕРИТЬ
        var globalCheckBtn = document.getElementById('solver-check-btn');
        if (globalCheckBtn) globalCheckBtn.style.display = 'inline-block';

        // Запускаем тренажеры
        if (item.key === 'multiplication') {
            window.Trainer.start('multiplication', 10);
        } else if (item.key === 'division') {
            if (window.startDivisionTrainer) window.startDivisionTrainer(false, 100);
        } else if (item.key === 'columns') {
            if (window.startColumnsTrainer) window.startColumnsTrainer('add', 1000);
        } else if (item.key === 'units') {
            if (window.startUnitsTrainer) window.startUnitsTrainer('length');
        } else if (item.key === 'equations') {
            if (window.startEquationsTrainer) window.startEquationsTrainer('easy');
        } else if (item.key === 'rect') {
            if (window.startRectTrainer) window.startRectTrainer();
        }

        // ПЕРЕКИДЫВАЕМ НА СЛЕДУЮЩУЮ ЗАДАЧУ ЧЕРЕЗ 2 СЕКУНДЫ
        setTimeout(function() {
            mixedRound.currentIndex++;
            goToMixedItem();
        }, 2000);
    }
}
function openVariant(topicName, variantIndex) {
    if (window.Trainer && window.Trainer.isActive && window.Trainer.isActive()) {
        window.Trainer.exit();
    }
    var bank = (window.BANKS && window.BANKS[topicName]) || [];
    var filtered = bank.filter(function (t) { return !t.special; });
    if (filtered.length === 0) {
        alert('Для этой темы пока нет задач 😕');
        return;
    }
    state.topic = topicName;
    state.bank = filtered;

    document.getElementById('count-modal-title').textContent = topicName + ' — Вариант ' + variantIndex;
    modal.classList.add('active');
}

window.Solver = {
    init: init,
    open: openSolver,
    openVariant: openVariant,
    exitToMenu: exitToMenu,
    startMixedRound: startMixedRound
};

document.addEventListener('DOMContentLoaded', init);
})();