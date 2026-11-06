// tasks/trainers/constructor.js

(function() {
    var constructorState = {
        queue: [],
        answers: []
    };

    document.addEventListener('DOMContentLoaded', function() {
        var btn = document.getElementById('constructor-btn');
        if (btn) {
            btn.addEventListener('click', openConstructor);
        }
    });

    function openConstructor() {
        var modal = document.getElementById('constructor-modal');
        if (!modal) return;

        renderConstructorList();
        modal.classList.add('active');

        document.getElementById('constructor-close').onclick = function() {
            modal.classList.remove('active');
        };

        document.getElementById('constructor-generate').onclick = generateWorksheet;
    }

    function createRow(name, type) {
        var row = document.createElement('div');
        row.className = 'constructor-row';
        row.dataset.name = name;
        row.dataset.type = type;

        var safeName = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        
        row.innerHTML = `
            <span class="constructor-topic">${safeName}</span>
            <div class="constructor-controls">
                <button class="constructor-minus">−</button>
                <span class="constructor-count">0</span>
                <button class="constructor-plus">+</button>
            </div>
        `;
        
        var minus = row.querySelector('.constructor-minus');
        var plus = row.querySelector('.constructor-plus');
        var countEl = row.querySelector('.constructor-count');

        minus.onclick = function() {
            var val = parseInt(countEl.textContent);
            if (val > 0) countEl.textContent = val - 1;
        };

        plus.onclick = function() {
            var val = parseInt(countEl.textContent);
            if (val < 20) countEl.textContent = val + 1;
        };

        return row;
    }

    function renderConstructorList() {
        var listContainer = document.getElementById('constructor-list');
        if (!listContainer) return;
        
        listContainer.innerHTML = '';
        
        // 1. ТЕМЫ (Задачи)
        var banks = window.BANKS || {};
        var hasAny = false;
        
        var topicHeader = document.createElement('h4');
        topicHeader.textContent = '📚 Задачи (по темам)';
        topicHeader.style.margin = '10px 0 5px 0';
        topicHeader.style.color = '#1e4a6b';
        listContainer.appendChild(topicHeader);
        
        Object.keys(banks).forEach(function(topicName) {
            if (!banks[topicName] || banks[topicName].length === 0) return;
            hasAny = true;
            listContainer.appendChild(createRow(topicName, 'topic'));
        });

        // 2. ТРЕНАЖЕРЫ
        var trainerHeader = document.createElement('h4');
        trainerHeader.textContent = '🎯 Тренажеры';
        trainerHeader.style.margin = '20px 0 5px 0';
        trainerHeader.style.color = '#1e4a6b';
        listContainer.appendChild(trainerHeader);

        listContainer.appendChild(createRow('Таблица умножения', 'trainer_mult'));
        listContainer.appendChild(createRow('Уравнения (простые)', 'trainer_eq_easy'));
        listContainer.appendChild(createRow('Уравнения (сложные)', 'trainer_eq_hard'));
        listContainer.appendChild(createRow('Примеры в столбик (сложение)', 'trainer_col_add'));
        listContainer.appendChild(createRow('Примеры в столбик (вычитание)', 'trainer_col_sub'));
        listContainer.appendChild(createRow('Примеры в столбик (умножение)', 'trainer_col_mul'));
        listContainer.appendChild(createRow('Примеры по действиям (простые)', 'trainer_order_easy'));
        listContainer.appendChild(createRow('Примеры по действиям (средние)', 'trainer_order_med'));
        listContainer.appendChild(createRow('Примеры по действиям (сложные)', 'trainer_order_hard'));

        if (!hasAny) {
            var p = document.createElement('p');
            p.textContent = 'Нет доступных задач.';
            p.style.textAlign = 'center';
            p.style.color = '#888';
            listContainer.appendChild(p);
        }
    }

    function generateWorksheet() {
        var rows = document.querySelectorAll('.constructor-row');
        var selectedItems = [];

        rows.forEach(function(row) {
            var count = parseInt(row.querySelector('.constructor-count').textContent);
            if (count > 0) {
                selectedItems.push({
                    name: row.dataset.name,
                    type: row.dataset.type,
                    count: count
                });
            }
        });

        if (selectedItems.length === 0) {
            alert('Выбери хотя бы одно задание!');
            return;
        }

        var queue = [];
        var banks = window.BANKS || {};

        selectedItems.forEach(function(item) {
            for (var i = 0; i < item.count; i++) {
                if (item.type === 'topic') {
                    var bank = banks[item.name];
                    if (bank && bank.length > 0) {
                        var task = bank[Math.floor(Math.random() * bank.length)];
                        queue.push({ type: 'text', topic: item.name, text: task.text, answer: task.answer });
                    }
                } 
                else if (item.type === 'trainer_mult') {
                    var t = window.TRAINERS['multiplication'];
                    if (t) {
                        var cfg = t.start(10);
                        var ex = t.next(cfg);
                        queue.push({ type: 'text', topic: 'Умножение', text: ex.text, answer: ex.answer });
                    }
                }
                else if (item.type === 'trainer_eq_easy') {
                    var t = window.TRAINERS['equations'];
                    if (t) {
                        var cfg = t.start('easy', 'easy');
                        var ex = t.next(cfg);
                        queue.push({ type: 'text', topic: 'Уравнения', text: ex.text, answer: ex.answer });
                    }
                }
                else if (item.type === 'trainer_eq_hard') {
                    var t = window.TRAINERS['equations'];
                    if (t) {
                        var cfg = t.start('hard', 'hard');
                        var ex = t.next(cfg);
                        queue.push({ type: 'text', topic: 'Уравнения (слож.)', text: ex.text, answer: ex.answer });
                    }
                }
                else if (item.type === 'trainer_col_add') {
                    var t = window.TRAINERS['columns'];
                    if (t) {
                        var ex = t.next({ op: 'add', max: 1000 });
                        queue.push({ type: 'text', topic: 'Столбик', text: ex.a + ' + ' + ex.b, answer: ex.answer });
                    }
                }
                else if (item.type === 'trainer_col_sub') {
                    var t = window.TRAINERS['columns'];
                    if (t) {
                        var ex = t.next({ op: 'sub', max: 1000 });
                        queue.push({ type: 'text', topic: 'Столбик', text: ex.a + ' − ' + ex.b, answer: ex.answer });
                    }
                }
                else if (item.type === 'trainer_col_mul') {
                    var t = window.TRAINERS['columns'];
                    if (t) {
                        var ex = t.next({ op: 'mul', max: 100 });
                        queue.push({ type: 'text', topic: 'Столбик', text: ex.a + ' × ' + ex.b, answer: ex.answer });
                    }
                }
                else if (item.type === 'trainer_order_easy') {
                    if (window.generateEasy) {
                        var ex = window.generateEasy();
                        queue.push({ type: 'text', topic: 'По действиям', text: ex.text, answer: ex.answer });
                    }
                }
                else if (item.type === 'trainer_order_med') {
                    if (window.generateMedium) {
                        var ex = window.generateMedium();
                        queue.push({ type: 'text', topic: 'По действиям (сред.)', text: ex.text, answer: ex.answer });
                    }
                }
                else if (item.type === 'trainer_order_hard') {
                    if (window.generateHard) {
                        var ex = window.generateHard();
                        queue.push({ type: 'text', topic: 'По действиям (слож.)', text: ex.text, answer: ex.answer });
                    }
                }
            }
        });

        queue.sort(function() { return 0.5 - Math.random(); });
        
        constructorState.queue = queue;
        constructorState.answers = new Array(queue.length).fill('');

        document.getElementById('constructor-modal').classList.remove('active');
        renderWorksheet();
    }

    function renderWorksheet() {
        var screen = document.getElementById('worksheet-screen');
        if (!screen) return;

        var content = document.getElementById('worksheet-content');
        content.innerHTML = '';
        screen.classList.add('active');

        constructorState.queue.forEach(function(item, index) {
            var block = document.createElement('div');
            block.className = 'worksheet-task-block';
            
            block.innerHTML = `
                <div class="worksheet-task-header">
                    <span class="worksheet-task-num">${index + 1}.</span>
                    <span class="worksheet-task-topic">${item.topic}</span>
                </div>
                <div class="worksheet-task-text">${item.text}</div>
                
                <div class="worksheet-task-solution">
                    <textarea class="worksheet-solution-input" placeholder="Запиши здесь своё решение..."></textarea>
                </div>

                <div class="worksheet-task-answer">
                    <span>Ответ: </span>
                    <input type="text" class="worksheet-input" data-index="${index}" inputmode="numeric" placeholder="...">
                </div>
            `;
            content.appendChild(block);

            var input = block.querySelector('.worksheet-input');
            input.addEventListener('input', function() {
                constructorState.answers[index] = this.value;
            });
        });

        var controls = document.createElement('div');
        controls.className = 'worksheet-controls';
        controls.innerHTML = `
            <button class="solver-btn primary" id="worksheet-check-btn" style="font-size: 1.4rem; padding: 18px 50px; box-shadow: 0 8px 0 #14534a;">Проверить всё</button>
            <button class="solver-btn secondary" id="worksheet-back-btn" style="margin-top: 15px;">← Назад в конструктор</button>
        `;
        content.appendChild(controls);

        document.getElementById('worksheet-check-btn').onclick = checkWorksheet;
        document.getElementById('worksheet-back-btn').onclick = function() {
            screen.classList.remove('active');
            openConstructor();
        };
        
        // Показываем стикер
        var stickerBtn = document.getElementById('sticker-toggle-btn');
        if (stickerBtn) {
            stickerBtn.style.display = 'block';
        }
        
        screen.scrollTop = 0;
    }

    function checkWorksheet() {
        var correctCount = 0;
        var wrongList = [];

        constructorState.queue.forEach(function(item, index) {
            var userAnswer = constructorState.answers[index];
            var correctAnswer = item.answer;
            
            var isCorrect = (parseFloat(userAnswer) === parseFloat(correctAnswer));

            if (isCorrect) {
                correctCount++;
            } else {
                wrongList.push({
                    index: index,
                    topic: item.topic,
                    text: item.text,
                    userAns: userAnswer,
                    correctAns: correctAnswer
                });
            }
        });

        showResults(correctCount, constructorState.queue.length, wrongList);
    }

    function showResults(correct, total, wrongList) {
        var modal = document.getElementById('results-modal');
        if (!modal) return;

        var percent = (correct / total) * 100;
        var mark = 2;
        var emoji = '😔';
        if (percent >= 90) { mark = 5; emoji = '🌟'; }
        else if (percent >= 70) { mark = 4; emoji = '👍'; }
        else if (percent >= 50) { mark = 3; emoji = '🙂'; }

        document.getElementById('results-title').textContent = `Оценка: ${mark} ${emoji} (${Math.round(percent)}%)`;
        document.getElementById('results-stats').textContent = `Правильный ответ: ${correct} из ${total}`;

        var resultList = document.getElementById('results-list');
        resultList.innerHTML = '';
        
        if (wrongList.length > 0) {
            wrongList.forEach(function(item) {
                var div = document.createElement('div');
                div.className = 'result-wrong-item';
                div.innerHTML = `
                    <p><strong>№${item.index + 1} (${item.topic})</strong> ${item.text}</p>
                    <p class="result-ans">Твой ответ: <span class="wrong">${item.userAns || '—'}</span> | Правильный ответ: <span class="ok">${item.correctAns}</span></p>
                `;
                resultList.appendChild(div);
            });
        } else {
            resultList.innerHTML = '<p style="color: #2e7d32; font-weight: bold; text-align: center;">Ошибок нет! Молодец!</p>';
        }

        modal.classList.add('active');

        document.getElementById('results-close').onclick = function() {
            modal.classList.remove('active');
        };
    }
})();