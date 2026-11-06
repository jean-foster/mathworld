(function() {
    var romanState = {
        score: 0,
        mode: 'toArabic', // 'toArabic' (прочитать) или 'toRoman' (составить)
        targetNumber: 0,
        targetRoman: '',
        userRoman: ''
    };

    var romanMap = [
        { val: 1000, sym: 'M' },
        { val: 900, sym: 'CM' },
        { val: 500, sym: 'D' },
        { val: 400, sym: 'CD' },
        { val: 100, sym: 'C' },
        { val: 90, sym: 'XC' },
        { val: 50, sym: 'L' },
        { val: 40, sym: 'XL' },
        { val: 10, sym: 'X' },
        { val: 9, sym: 'IX' },
        { val: 5, sym: 'V' },
        { val: 4, sym: 'IV' },
        { val: 1, sym: 'I' }
    ];

    function initRoman() {
        // Обработчик кнопки в модалке
        var romanBtn = document.querySelector('[data-numbers-type="roman"]');
        if (romanBtn) {
            romanBtn.addEventListener('click', function() {
                // Закрываем модалки
                document.querySelectorAll('.trainer-modal-overlay').forEach(function(m) {
                    m.classList.remove('active');
                });
                startRomanTrainer();
            });
        }

        // Кнопки управления
        var checkBtn = document.getElementById('roman-check-btn');
        if (checkBtn) checkBtn.addEventListener('click', checkRoman);

        var nextBtn = document.getElementById('roman-next-btn');
        if (nextBtn) nextBtn.addEventListener('click', nextRomanExample);

        var clearBtn = document.getElementById('roman-clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                romanState.userRoman = '';
                document.getElementById('roman-user-input').value = '';
            });
        }

        // Кнопки с римскими цифрами
        var keyboard = document.getElementById('roman-keyboard');
        if (keyboard) {
            keyboard.querySelectorAll('.roman-key').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var sym = this.dataset.sym;
                    var input = document.getElementById('roman-user-input');
                    if (input) {
                        input.value += sym;
                    }
                });
            });
        }
    }

    function startRomanTrainer() {
        var screen = document.getElementById('solver-screen');
        screen.classList.add('active');
        document.body.style.overflow = 'hidden';

        document.getElementById('solver-task-mode').style.display = 'none';
        document.getElementById('solver-trainer-mode').style.display = 'block';
        document.getElementById('solver-task-text').style.display = 'none';

        // Прячем все остальные тренажеры
        var trainers = ['trainer-simple-mode', 'trainer-column-mode', 'trainer-units-mode', 
                        'trainer-rect-mode', 'trainer-equations-mode', 'trainer-order-mode', 
                        'trainer-numbers-mode', 'trainer-clock-mode', 'trainer-numbers-mode', 'trainer-clock-mode'];
        trainers.forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        document.getElementById('trainer-roman-mode').style.display = 'block';

        var globalCheckBtn = document.getElementById('solver-check-btn');
        if (globalCheckBtn) globalCheckBtn.style.display = 'none';

        var badge = document.getElementById('solver-topic-badge');
        if (badge) badge.textContent = '🏛️ Римские числа';

        var counter = document.getElementById('solver-counter');
        if (counter) {
            counter.textContent = 'Очки: 0';
            counter.classList.add('trainer-score-badge');
        }

        romanState.score = 0;
        nextRomanExample();
    }

    // Перевод числа в римское
    function toRoman(num) {
        var res = '';
        for (var i = 0; i < romanMap.length; i++) {
            while (num >= romanMap[i].val) {
                res += romanMap[i].sym;
                num -= romanMap[i].val;
            }
        }
        return res;
    }

    function nextRomanExample() {
        romanState.mode = Math.random() > 0.5 ? 'toArabic' : 'toRoman';
        romanState.userRoman = '';
        
        // Генерируем число от 1 до 1000
        romanState.targetNumber = Math.floor(Math.random() * 1000) + 1;
        romanState.targetRoman = toRoman(romanState.targetNumber);

        var taskText = document.getElementById('roman-task-text');
        var inputContainer = document.getElementById('roman-input-container');
        var keyboard = document.getElementById('roman-keyboard');
        var feedback = document.getElementById('roman-feedback');
        
        feedback.textContent = '';
        feedback.className = 'solver-feedback';

        if (romanState.mode === 'toArabic') {
            // РЕЖИМ 1: РИМСКОЕ -> АРАБСКОЕ
            taskText.innerHTML = 'Запиши арабскими цифрами: <strong>' + romanState.targetRoman + '</strong>';
            
            keyboard.style.display = 'none';
            inputContainer.style.display = 'block';
            document.getElementById('roman-arabic-input').style.display = 'inline-block';
            document.getElementById('roman-user-input').style.display = 'none';
            
            var input = document.getElementById('roman-arabic-input');
            input.value = '';
            input.classList.remove('correct', 'wrong');
            
            setTimeout(function() { if(input) input.focus(); }, 50);

        } else {
            // РЕЖИМ 2: АРАБСКОЕ -> РИМСКОЕ (с клавиатуры)
            taskText.innerHTML = 'Запиши римскими цифрами: <strong>' + romanState.targetNumber + '</strong>';
            
            keyboard.style.display = 'flex';
            inputContainer.style.display = 'block';
            document.getElementById('roman-arabic-input').style.display = 'none';
            
            var romanInput = document.getElementById('roman-user-input');
            romanInput.style.display = 'inline-block';
            romanInput.style.width = '100%';
            romanInput.style.maxWidth = '400px'; // Широкое поле
            romanInput.style.fontSize = '1.8rem'; // Чуть меньше шрифт
            romanInput.style.letterSpacing = '2px'; // Расстояние между буквами
            
            romanInput.value = '';
            romanInput.classList.remove('correct', 'wrong');
        }

        document.getElementById('roman-check-btn').style.display = 'inline-block';
        document.getElementById('roman-next-btn').style.display = 'none';
    }

    function checkRoman() {
        var feedback = document.getElementById('roman-feedback');
        var isCorrect = false;

        if (romanState.mode === 'toArabic') {
            var input = document.getElementById('roman-arabic-input');
            var userVal = parseInt(input.value.trim(), 10);
            
            input.classList.remove('correct', 'wrong');
            
            if (userVal === romanState.targetNumber) {
                isCorrect = true;
                input.classList.add('correct');
            } else {
                input.classList.add('wrong');
                feedback.textContent = '❌ Неверно. ' + romanState.targetRoman + ' — это ' + romanState.targetNumber;
                feedback.className = 'solver-feedback err';
            }

        } else {
            var romanInput = document.getElementById('roman-user-input');
            var userRoman = romanInput.value.trim().toUpperCase();
            
            romanInput.classList.remove('correct', 'wrong');
            
            if (userRoman === romanState.targetRoman) {
                isCorrect = true;
                romanInput.classList.add('correct');
            } else {
                romanInput.classList.add('wrong');
                feedback.textContent = '❌ Неверно. ' + romanState.targetNumber + ' — это ' + romanState.targetRoman;
                feedback.className = 'solver-feedback err';
            }
        }

        if (isCorrect) {
            romanState.score++;
            document.getElementById('solver-counter').textContent = 'Очки: ' + romanState.score;
            
            if (window.addCorrectAnswer) window.addCorrectAnswer('topic', 'Римские числа');
            
            feedback.textContent = '🎉 Верно! +1 очко';
            feedback.className = 'solver-feedback ok';

            document.getElementById('roman-check-btn').style.display = 'none';
            document.getElementById('roman-next-btn').style.display = 'inline-block';

            setTimeout(function() {
                if (document.getElementById('trainer-roman-mode').style.display === 'block') {
                    nextRomanExample();
                }
            }, 1500);
        } else {
            feedback.className = 'solver-feedback err';
        }
    }

    document.addEventListener('DOMContentLoaded', initRoman);
    window.startRomanTrainer = startRomanTrainer;
})();