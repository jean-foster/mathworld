(function() {
    var clockState = {
        score: 0,
        mode: 'set', // 'set' (поставить стрелки) или 'read' (прочитать время)
        targetHour: 12,
        targetMinute: 0,
        currentHour: 12,
        currentMinute: 0,
        activeHand: null // null, 'hour' или 'minute'
    };

    var canvas, ctx;
    var CX = 150, CY = 150, R_OUTER = 140, R_INNER = 100, R_HOUR_HAND = 70, R_MIN_HAND = 110;
    var CLOCK_SIZE = 300;

    function initClock() {
        var checkBtn = document.getElementById('clock-check-btn');
        if (checkBtn) checkBtn.addEventListener('click', checkClock);

        var nextBtn = document.getElementById('clock-next-btn');
        if (nextBtn) nextBtn.addEventListener('click', nextClockExample);
    }

    function startClockTrainer() {
        var screen = document.getElementById('solver-screen');
        screen.classList.add('active');
        document.body.style.overflow = 'hidden';

        document.getElementById('solver-task-mode').style.display = 'none';
        document.getElementById('solver-trainer-mode').style.display = 'block';
        document.getElementById('solver-task-text').style.display = 'none';

        var trainers = ['trainer-simple-mode', 'trainer-column-mode', 'trainer-units-mode', 
                        'trainer-rect-mode', 'trainer-equations-mode', 'trainer-order-mode', 'trainer-numbers-mode', 'trainer-numbers-mode', 'trainer-roman-mode'];
        trainers.forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        document.getElementById('trainer-clock-mode').style.display = 'block';

        var globalCheckBtn = document.getElementById('solver-check-btn');
        if (globalCheckBtn) globalCheckBtn.style.display = 'none';

        var badge = document.getElementById('solver-topic-badge');
        if (badge) badge.textContent = '⏱ Время по часам';

        var counter = document.getElementById('solver-counter');
        if (counter) {
            counter.textContent = 'Очки: 0';
            counter.classList.add('trainer-score-badge');
        }

        clockState.score = 0;
        initCanvas();
        nextClockExample();
    }

    function initCanvas() {
        canvas = document.getElementById('clock-canvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');

        // Один клик — выбираем стрелку или ставим время
        canvas.addEventListener('mousedown', onCanvasClick);
        
        // Тач
        canvas.addEventListener('touchstart', function(e) {
            e.preventDefault();
            var rect = canvas.getBoundingClientRect();
            var touch = e.touches[0];
            onCanvasClick({ clientX: touch.clientX, clientY: touch.clientY });
        }, { passive: false });
    }

    function getCanvasPos(e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (canvas.width / rect.width),
            y: (e.clientY - rect.top) * (canvas.height / rect.height)
        };
    }

    function getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    function getAngle(x, y) {
        var dx = x - CX;
        var dy = y - CY;
        var angle = Math.atan2(dy, dx) * 180 / Math.PI;
        return (angle + 90 + 360) % 360; // 0 = 12 часов, по часовой
    }

    function onCanvasClick(e) {
        if (clockState.mode !== 'set') return;

        var pos = getCanvasPos(e);
        var distCenter = getDistance(pos.x, pos.y, CX, CY);

        if (distCenter > R_OUTER + 10) return;

        // Координаты кончиков стрелок для клика
        var hourAngleRad = ((clockState.currentHour % 12) * 30 - 90) * Math.PI / 180;
        var minAngleRad = (clockState.currentMinute * 6 - 90) * Math.PI / 180;
        
        var hx = CX + Math.cos(hourAngleRad) * R_HOUR_HAND;
        var hy = CY + Math.sin(hourAngleRad) * R_HOUR_HAND;
        var mx = CX + Math.cos(minAngleRad) * R_MIN_HAND;
        var my = CY + Math.sin(minAngleRad) * R_MIN_HAND;

        var distToHour = getDistance(pos.x, pos.y, hx, hy);
        var distToMin = getDistance(pos.x, pos.y, mx, my);

        // 1. ВЫБОР СТРЕЛКИ
        if (clockState.activeHand === null) {
            if (distToHour < 30 && distCenter < R_INNER) {
                clockState.activeHand = 'hour';
                drawClock();
                return;
            }
            if (distToMin < 30 && distCenter > R_INNER) {
                clockState.activeHand = 'minute';
                drawClock();
                return;
            }
            return;
        }

        // 2. УСТАНОВКА ВРЕМЕНИ
        var dx = pos.x - CX;
        var dy = pos.y - CY;
        var angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // Переводим в градусы от 0 (12 часов) по часовой стрелке
        var deg = (angle + 90 + 360) % 360; 

        // МАГНИТНОЕ ПРИЛИПАНИЕ ДЛЯ ЧАСОВОЙ
        if (clockState.activeHand === 'hour') {
            var hour = Math.round(deg / 30);
            if (hour === 0) hour = 12;
            
            clockState.currentHour = hour;
            clockState.activeHand = null;
        } 
        // МАГНИТНОЕ ПРИЛИПАНИЕ ДЛЯ МИНУТНОЙ
        else if (clockState.activeHand === 'minute') {
            // 360 градусов / 60 минут = 6 градусов на 1 минуту.
            // Округляем до ближайших 5 минут (деления на циферблате)
            var minute = Math.round(deg / 6 / 5) * 5;
            if (minute >= 60) minute = 0;
            
            clockState.currentMinute = minute;
            clockState.activeHand = null;
        }
        
        drawClock();
        updateCurrentTimeDisplay();
    }

    function drawClock() {
        if (!ctx) return;
        ctx.clearRect(0, 0, CLOCK_SIZE, CLOCK_SIZE);

        // Циферблат
        ctx.beginPath();
        ctx.arc(CX, CY, R_OUTER, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#1e4a6b';
        ctx.stroke();

        // Внутренний круг
        ctx.beginPath();
        ctx.arc(CX, CY, R_INNER, 0, 2 * Math.PI);
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Цифры
        ctx.fillStyle = '#1e4a6b';
        ctx.font = 'bold 24px Comfortaa, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (var i = 1; i <= 12; i++) {
            var angle = (i * 30 - 90) * Math.PI / 180;
            var x = CX + Math.cos(angle) * (R_OUTER - 30);
            var y = CY + Math.sin(angle) * (R_OUTER - 30);
            ctx.fillText(i.toString(), x, y);
        }

        // Центр
        ctx.beginPath();
        ctx.arc(CX, CY, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#1e4a6b';
        ctx.fill();

        // Часовая стрелка
        var hourAngle = ((clockState.currentHour % 12) * 30 - 90) * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(CX, CY);
        ctx.lineTo(CX + Math.cos(hourAngle) * R_HOUR_HAND, CY + Math.sin(hourAngle) * R_HOUR_HAND);
        ctx.lineWidth = 8;
        // Если выбрана — красная, иначе синяя
        ctx.strokeStyle = (clockState.activeHand === 'hour') ? '#e63946' : '#1e4a6b';
        ctx.lineCap = 'round';
        ctx.stroke();

        // Минутная стрелка
        var minAngle = (clockState.currentMinute * 6 - 90) * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(CX, CY);
        ctx.lineTo(CX + Math.cos(minAngle) * R_MIN_HAND, CY + Math.sin(minAngle) * R_MIN_HAND);
        ctx.lineWidth = 4;
        // Если выбрана — красная, иначе зеленая
        ctx.strokeStyle = (clockState.activeHand === 'minute') ? '#e63946' : '#2a9d8f';
        ctx.stroke();

        // Точка на минутной стрелке
        ctx.beginPath();
        ctx.arc(CX + Math.cos(minAngle) * R_MIN_HAND, CY + Math.sin(minAngle) * R_MIN_HAND, 4, 0, 2 * Math.PI);
        ctx.fillStyle = (clockState.activeHand === 'minute') ? '#e63946' : '#2a9d8f';
        ctx.fill();
    }

    function updateCurrentTimeDisplay() {
        var h = Math.floor(clockState.currentHour);
        if (h === 0) h = 12;
        var m = clockState.currentMinute;
        var display = document.getElementById('clock-current-time');
        if (display) {
            display.textContent = h + ':' + (m < 10 ? '0' : '') + m;
        }
    }


    function nextClockExample() {
        clockState.mode = Math.random() > 0.5 ? 'set' : 'read';
        clockState.activeHand = null;
        
        clockState.targetHour = Math.floor(Math.random() * 24); 
        clockState.targetMinute = Math.floor(Math.random() * 12) * 5;

        var taskText = document.getElementById('clock-task-text');
        var answerBox = document.getElementById('clock-answer-box');
        var setControls = document.getElementById('clock-set-controls');
        var feedback = document.getElementById('clock-feedback');
        var timeDisplay = document.getElementById('clock-current-time');
        
        feedback.textContent = '';
        feedback.className = 'solver-feedback';

        if (clockState.mode === 'set') {
            // ===== РЕЖИМ "ПОСТАВЬ ВРЕМЯ" =====
            taskText.innerHTML = 'Поставь на часах время: <strong>' + clockState.targetHour + ':' + (clockState.targetMinute < 10 ? '0' : '') + clockState.targetMinute + '</strong>';
            
            setControls.style.display = 'block';
            
            // УДАЛЯЕМ ПОЛЯ ВВОДА
            if (answerBox) {
                answerBox.style.display = 'none';
                if (answerBox.parentNode) answerBox.parentNode.removeChild(answerBox); 
            }
            
            // СКРЫВАЕМ ТЕКСТ С ВРЕМЕНЕМ ПОД ЧАСАМИ (ЧТОБЫ РЕБЕНОК НЕ ВИДЕЛ ОТВЕТ)
            if (timeDisplay) {
                timeDisplay.style.display = 'none';
                timeDisplay.textContent = '';
            }

            clockState.currentHour = Math.floor(Math.random() * 12) + 1;
            clockState.currentMinute = Math.floor(Math.random() * 12) * 5;
            
            drawClock();

            document.getElementById('clock-check-btn').style.display = 'inline-block';
            document.getElementById('clock-next-btn').style.display = 'none';

        } else {
            // ===== РЕЖИМ "ПРОЧИТАЙ ВРЕМЯ" =====
            taskText.textContent = 'Запиши время, которое показывают часы:';
            setControls.style.display = 'none';
            
            var parent = document.querySelector('.trainer-clock-mode');
            var existingBox = document.getElementById('clock-answer-box');
            
            // ВОССТАНАВЛИВАЕМ ПОЛЯ ВВОДА
            if (!existingBox && parent) {
                var newBox = document.createElement('div');
                newBox.className = 'answer-box active';
                newBox.id = 'clock-answer-box';
                newBox.style.cssText = 'display: flex; margin: 20px auto; max-width: 400px; justify-content: center; align-items: center; gap: 10px; background: #fff3bf; border: 4px solid #f5b042; border-radius: 25px; padding: 20px 25px;';
                newBox.innerHTML = `
                    <span style="font-size:1.5rem; font-weight:800; color:#b34700;">Время:</span>
                    <input type="text" class="answer-cell" id="clock-answer-h" inputmode="numeric" style="width: 60px; font-size: 1.5rem; text-align:center;" placeholder="Ч">
                    <span style="font-size:1.5rem; font-weight:800; color:#b34700;">:</span>
                    <input type="text" class="answer-cell" id="clock-answer-m" inputmode="numeric" style="width: 60px; font-size: 1.5rem; text-align:center;" placeholder="М">
                `;
                var controls = parent.querySelector('.solver-controls');
                if (controls) {
                    parent.insertBefore(newBox, controls);
                } else {
                    parent.appendChild(newBox);
                }
            } else if (existingBox) {
                existingBox.style.display = 'flex';
                var hInput = document.getElementById('clock-answer-h');
                var mInput = document.getElementById('clock-answer-m');
                hInput.value = '';
                mInput.value = '';
                hInput.classList.remove('correct', 'wrong');
                mInput.classList.remove('correct', 'wrong');
            }
            
            // В РЕЖИМЕ ЧТЕНИЯ ТОЖЕ СКРЫВАЕМ, ЧТОБЫ НЕ ПОДСКАЗЫВАТЬ
            if (timeDisplay) {
                timeDisplay.style.display = 'none';
                timeDisplay.textContent = ''; 
            }

            clockState.currentHour = clockState.targetHour;
            clockState.currentMinute = clockState.targetMinute;
            
            drawClock();

            document.getElementById('clock-check-btn').style.display = 'inline-block';
            document.getElementById('clock-next-btn').style.display = 'none';
        }
    }




    function checkClock() {
        var fb = document.getElementById('clock-feedback');
        var isCorrect = false;

        if (clockState.mode === 'set') {
            // ПРОВЕРЯЕМ ЦИФЕРБЛАТ (стрелки)
            var h = clockState.currentHour; 
            var m = clockState.currentMinute;

            var targetH12 = clockState.targetHour % 12;
            if (targetH12 === 0) targetH12 = 12;
            var currentH12 = h % 12;
            if (currentH12 === 0) currentH12 = 12;

            if (currentH12 === targetH12 && m === clockState.targetMinute) {
                isCorrect = true;
            } else {
                fb.textContent = '❌ Неверно. Ты поставил ' + currentH12 + ':' + (m < 10 ? '0' : '') + m + '. Нужно было поставить ' + targetH12 + ':' + (clockState.targetMinute < 10 ? '0' : '') + clockState.targetMinute;
                fb.className = 'solver-feedback err';
            }

        } else {
            // ПРОВЕРЯЕМ ВВЕДЕННЫЙ ТЕКСТ (в режиме чтения)
            var hInput = document.getElementById('clock-answer-h');
            var mInput = document.getElementById('clock-answer-m');
            if (!hInput || !mInput) return; 

            var userH = parseInt(hInput.value.trim(), 10);
            var userM = parseInt(mInput.value.trim(), 10);

            hInput.classList.remove('correct', 'wrong');
            mInput.classList.remove('correct', 'wrong');

            // УМНАЯ ПРОВЕРКА: 
            // Если на циферблате 3 часа (targetHour = 15 или 3)
            // То и 15, и 3 - это правильный ответ.
            
            // Приводим всё к 12-часовому формату для сравнения
            var targetH12 = clockState.targetHour % 12;
            if (targetH12 === 0) targetH12 = 12;

            var userH12 = userH % 12;
            if (userH12 === 0) userH12 = 12;

            // Если пользователь ввел те же часы (в 12-часовом формате) и те же минуты
            if (userH12 === targetH12 && userM === clockState.targetMinute) {
                isCorrect = true;
                hInput.classList.add('correct');
                mInput.classList.add('correct');
            } else {
                // Если ошибся, подсвечиваем красным
                if (userH12 === targetH12) hInput.classList.add('correct');
                else hInput.classList.add('wrong');

                if (userM === clockState.targetMinute) mInput.classList.add('correct');
                else mInput.classList.add('wrong');

                fb.textContent = '❌ Неверно. На часах ' + targetH12 + ':' + (clockState.targetMinute < 10 ? '0' : '') + clockState.targetMinute;
                fb.className = 'solver-feedback err';
            }
        }

        if (isCorrect) {
            clockState.score++;
            document.getElementById('solver-counter').textContent = 'Очки: ' + clockState.score;
            
            if (window.addCorrectAnswer) window.addCorrectAnswer('topic', 'Время по часам');
            
            fb.textContent = '🎉 Верно! +1 очко';
            fb.className = 'solver-feedback ok';

            document.getElementById('clock-check-btn').style.display = 'none';
            document.getElementById('clock-next-btn').style.display = 'inline-block';

            setTimeout(function() {
                if (document.getElementById('trainer-clock-mode').style.display === 'block') {
                    nextClockExample();
                }
            }, 1500);
        } else {
            fb.className = 'solver-feedback err';
        }
    }


    document.addEventListener('DOMContentLoaded', initClock);
    window.startClockTrainer = startClockTrainer;
})();