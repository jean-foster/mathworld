(function() {
    var numbersState = {
        score: 0,
        currentAnswer: null
    };

    function initNumbersTrainer() {
        // Кнопка открытия модалки
        var numbersBtn = document.querySelector('.trainer-btn[data-trainer="numbers"]');
        if (numbersBtn) {
            numbersBtn.addEventListener('click', function() {
                document.getElementById('modal-numbers').classList.add('active');
            });
        }

        // Кнопки выбора типа в модалке
        var numbersModal = document.getElementById('modal-numbers');
        if (numbersModal) {
            numbersModal.querySelectorAll('[data-numbers-type]').forEach(function(b) {
                if (b.disabled) return;
                b.addEventListener('click', function() {
                    var type = this.dataset.numbersType;
                    // Закрываем все модалки
                    document.querySelectorAll('.trainer-modal-overlay').forEach(function(m) {
                        m.classList.remove('active');
                    });
                    
                    if (type === 'digits') {
                        startNumbersTrainer('digits');
                    }
                });
            });
            var cancelBtn = numbersModal.querySelector('[data-cancel]');
            if (cancelBtn) cancelBtn.addEventListener('click', function() {
                numbersModal.classList.remove('active');
            });
        }

        // Кнопки управления в самом тренажере
        var checkBtn = document.getElementById('numbers-check-btn');
        var nextBtn = document.getElementById('numbers-next-btn');
        if (checkBtn) checkBtn.addEventListener('click', checkNumbers);
        if (nextBtn) nextBtn.addEventListener('click', nextNumbersExample);
    }

    function startNumbersTrainer(type) {
        var screen = document.getElementById('solver-screen');
        screen.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Скрываем блоки задач
        document.getElementById('solver-task-mode').style.display = 'none';
        document.getElementById('solver-trainer-mode').style.display = 'block';
        document.getElementById('solver-task-text').style.display = 'none';

        // Прячем все остальные тренажеры
        var trainers = ['trainer-simple-mode', 'trainer-column-mode', 'trainer-units-mode', 
                        'trainer-rect-mode', 'trainer-equations-mode', 'trainer-order-mode', 'trainer-clock-mode', 'trainer-roman-mode'];
        trainers.forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        // Показываем наш
        document.getElementById('trainer-numbers-mode').style.display = 'block';

        var globalCheckBtn = document.getElementById('solver-check-btn');
        if (globalCheckBtn) globalCheckBtn.style.display = 'none';

        // Настраиваем шапку
        var badge = document.getElementById('solver-topic-badge');
        if (badge) badge.textContent = '🔢 Разряды числа';

        var counter = document.getElementById('solver-counter');
        if (counter) {
            counter.textContent = 'Очки: 0';
            counter.classList.add('trainer-score-badge');
        }

        numbersState.score = 0;

        nextNumbersExample();
    }

    function nextNumbersExample() {
        var taskBox = document.getElementById('numbers-task');
        var rowsBox = document.getElementById('numbers-rows');
        var fb = document.getElementById('numbers-feedback');
        
        fb.textContent = '';
        fb.className = 'solver-feedback';
        rowsBox.innerHTML = '';

        // Генерируем число от 10 до 999 999
        var num = Math.floor(Math.random() * 999990) + 10;
        taskBox.textContent = 'Число: ' + num;

        var numStr = String(num);
        var len = numStr.length;
        var rankNames = ['единиц', 'десятков', 'сотен', 'тысяч', 'десятков тысяч', 'сотен тысяч'];
        
        // Выбираем 3 случайных разряда
        var ranksToAsk = [];
        while (ranksToAsk.length < 3) {
            var r = Math.floor(Math.random() * len);
            if (ranksToAsk.indexOf(r) === -1) ranksToAsk.push(r);
        }
        ranksToAsk.sort(function(a, b) { return a - b; });

        numbersState.currentAnswer = {};

        ranksToAsk.forEach(function(rankIndex) {
            // Ответ: берем цифру с конца
            var digit = parseInt(numStr[len - 1 - rankIndex], 10);
            numbersState.currentAnswer[rankIndex] = digit;

            // Строка с полем ввода
            var row = document.createElement('div');
            row.className = 'numbers-row';
            
            var label = document.createElement('span');
            label.textContent = 'Сколько ' + rankNames[rankIndex] + ':';
            
            var input = document.createElement('input');
            input.type = 'text';
            input.className = 'numbers-input';
            input.inputMode = 'numeric';
            input.dataset.rank = rankIndex;
            
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') { e.preventDefault(); checkNumbers(); }
            });

            row.appendChild(label);
            row.appendChild(input);
            rowsBox.appendChild(row);
        });

        var firstInput = rowsBox.querySelector('.numbers-input');
        if (firstInput) firstInput.focus();

        document.getElementById('numbers-check-btn').style.display = 'inline-block';
        document.getElementById('numbers-next-btn').style.display = 'none';
    }

    function checkNumbers() {
        var inputs = document.querySelectorAll('.numbers-input');
        var allCorrect = true;
        var fb = document.getElementById('numbers-feedback');

        inputs.forEach(function(input) {
            var rank = input.dataset.rank;
            var correct = numbersState.currentAnswer[rank];
            var user = parseInt(input.value.trim(), 10);
            
            input.classList.remove('correct', 'wrong');
            
            if (isNaN(user)) user = 0; // Если пусто, считаем 0

            if (user === correct) {
                input.classList.add('correct');
            } else {
                input.classList.add('wrong');
                allCorrect = false;
            }
        });

        if (allCorrect) {
            numbersState.score++;
            document.getElementById('solver-counter').textContent = 'Очки: ' + numbersState.score;
            
            if (window.addCorrectAnswer) {
                window.addCorrectAnswer('topic', 'Работа с числами');
            }
            
            fb.textContent = '🎉 Верно! +1 очко';
            fb.className = 'solver-feedback ok';

            document.getElementById('numbers-check-btn').style.display = 'none';
            document.getElementById('numbers-next-btn').style.display = 'inline-block';

            // Автопереход
            setTimeout(function() {
                if (document.getElementById('trainer-numbers-mode').style.display === 'block') {
                    nextNumbersExample();
                }
            }, 1500);
        } else {
            fb.textContent = '❌ Проверь ответы (красные ячейки)';
            fb.className = 'solver-feedback err';
        }
    }

    // Запускаем инициализацию при загрузке страницы
    document.addEventListener('DOMContentLoaded', initNumbersTrainer);

    // Экспортируем для смешанного раунда
    window.startNumbersTrainer = startNumbersTrainer;
})();