(function() {
    // Генератор целых положительных чисел от min до max
    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // ==================== СРЕДНИЕ ПРИМЕРЫ (ПО ТВОЕЙ КАРТИНКЕ) ====================
    function generateMedium() {
        var type = rand(1, 8);
        var a, b, c, d, e, f, g, ans;

        switch(type) {
            case 1: // a : b + c - d + e + f (35 : 5 + 82 - 65 + 21 + 1)
                b = rand(2, 8); a = b * rand(2, 8); c = rand(50, 80); d = rand(20, 40); e = rand(10, 30); f = rand(1, 9);
                ans = (a / b) + c - d + e + f;
                return { text: a + ' : ' + b + ' + ' + c + ' - ' + d + ' + ' + e + ' + ' + f, answer: ans };

            case 2: // a * b + c * d - (e - f) (9 * 2 + 8 * 7 - (83 - 54))
                a = rand(2, 9); b = rand(2, 9); c = rand(2, 9); d = rand(2, 9); e = rand(60, 90); f = rand(10, 40);
                ans = (a * b) + (c * d) - (e - f);
                return { text: a + ' • ' + b + ' + ' + c + ' • ' + d + ' - ( ' + e + ' - ' + f + ' )', answer: ans };

            case 3: // a + b : c + d + e + f (7 + 42 : 6 + 19 + 58 + 7)
                c = rand(2, 8); b = c * rand(2, 8); a = rand(1, 9); d = rand(10, 40); e = rand(10, 40); f = rand(1, 9);
                ans = a + (b / c) + d + e + f;
                return { text: a + ' + ' + b + ' : ' + c + ' + ' + d + ' + ' + e + ' + ' + f, answer: ans };

            case 4: // a * b + c : d + e - f (9 * 4 + 54 : 9 + 28 - 8)
                a = rand(2, 9); b = rand(2, 9); d = rand(2, 9); c = d * rand(2, 9); e = rand(10, 40); f = rand(1, 20);
                ans = (a * b) + (c / d) + e - f;
                return { text: a + ' • ' + b + ' + ' + c + ' : ' + d + ' + ' + e + ' - ' + f, answer: ans };

            case 5: // a - b * c + d + e - f * g (85 - 9 * 4 + 7 + 4 - 7 * 4)
                a = rand(60, 95); b = rand(2, 9); c = rand(2, 9); d = rand(1, 20); e = rand(1, 20); f = rand(2, 9); g = rand(2, 9);
                ans = a - (b * c) + d + e - (f * g);
                return { text: a + ' - ' + b + ' • ' + c + ' + ' + d + ' + ' + e + ' - ' + f + ' • ' + g, answer: ans };

            case 6: // a : b * c + d : e - f * g (3 : 3 * 9 + 18 : 2 - 2 * 4)
                b = rand(2, 5); a = b * rand(2, 5); c = rand(2, 9); e = rand(2, 5); d = e * rand(2, 9); f = rand(2, 5); g = rand(2, 5);
                ans = (a / b) * c + (d / e) - (f * g);
                return { text: a + ' : ' + b + ' • ' + c + ' + ' + d + ' : ' + e + ' - ' + f + ' • ' + g, answer: ans };

            case 7: // a - b - c * d + e + f (66 - 35 - 5 * 2 + 27 + 22)
                a = rand(50, 90); b = rand(20, 40); c = rand(2, 5); d = rand(2, 5); e = rand(10, 30); f = rand(10, 30);
                ans = a - b - (c * d) + e + f;
                return { text: a + ' - ' + b + ' - ' + c + ' • ' + d + ' + ' + e + ' + ' + f, answer: ans };

            case 8: // a - b - c : d + e - f (65 - 3 - 36 : 4 + 34 - 23)
                a = rand(50, 90); b = rand(1, 20); d = rand(2, 9); c = d * rand(2, 9); e = rand(10, 40); f = rand(10, 30);
                ans = a - b - (c / d) + e - f;
                return { text: a + ' - ' + b + ' - ' + c + ' : ' + d + ' + ' + e + ' - ' + f, answer: ans };
        }
    }



    // ==================== СЛОЖНЫЕ ПРИМЕРЫ (ДО 100 000) ====================
    function generateHard() {
        var type = rand(1, 8);
        var a, b, c, d, e, f, g, ans;

        switch(type) {
            case 1: // a * b + c : d - e
                d = rand(2, 9); c = d * rand(10, 100); 
                a = rand(1000, 9000); b = rand(2, 9); 
                e = rand(1000, 5000);
                ans = a + (c / d) * b - e; 
                if(ans < 0) return generateHard(); // защита от минуса в ответе
                return { text: a + ' + ' + c + ' : ' + d + ' • ' + b + ' - ' + e, answer: ans };

            case 2: // (a + b - c) : d * e
                d = rand(2, 9); e = rand(2, 9);
                var bracket = d * rand(100, 1500); // результат скобки
                c = rand(10000, 50000); 
                a = rand(10000, 40000);
                b = bracket + c - a; // подгоняем b, чтобы скобка дала нужный результат
                
                // Если b получилось отрицательным, генерируем заново
                if (b < 0) return generateHard(); 
                
                ans = bracket * e;
                if (ans > 100000) return generateHard();
                return { text: '( ' + a + ' + ' + b + ' - ' + c + ' ) : ' + d + ' • ' + e, answer: ans };

            case 3: // a * b + (c - d) : e (как 847 * 8 + (42 000 - 39 918) : 6)
                a = rand(100, 900); b = rand(2, 9);
                e = rand(2, 9); var bracket = e * rand(10, 100); // c - d
                d = rand(10000, 30000);
                c = d + bracket;
                ans = (a * b) + (bracket / e);
                if (ans > 100000) return generateHard();
                return { text: a + ' • ' + b + ' + ( ' + c + ' - ' + d + ' ) : ' + e, answer: ans };

            case 4: // a - b : c * d + e (как 602 630 - 297 480 : 37 * 69 + 8 653)
                // Ограничиваем a, чтобы было до 100к
                a = rand(50000, 95000);
                c = rand(10, 99); b = c * rand(10, 100); // делится без остатка
                d = rand(10, 99); e = rand(1000, 5000);
                var sub = (b / c) * d;
                if (sub > a) return generateHard(); // чтобы не ушло в минус
                ans = a - sub + e;
                if (ans > 100000) return generateHard();
                return { text: a + ' - ' + b + ' : ' + c + ' • ' + d + ' + ' + e, answer: ans };

            case 5: // a : b * c + d * e (как 424 410 : 47 * 261... но упрощено до 100к)
                b = rand(10, 99); a = b * rand(100, 900); // a : b
                c = rand(10, 99);
                d = rand(100, 500); e = rand(2, 9);
                ans = (a / b) * c + (d * e);
                if (ans > 100000) return generateHard();
                return { text: a + ' : ' + b + ' • ' + c + ' - 261 + ' + (d * e), answer: (a / b) * c - 261 + (d * e) };

            case 6: // a * b + c : d * e - f (как 3 807 * 98 + (550 701 - 82 989) : 64)
                a = rand(100, 500); b = rand(10, 99); // a * b до 50к
                d = rand(10, 99); c = d * rand(10, 100); // c : d
                e = rand(2, 9); f = rand(1000, 5000);
                var add = (c / d) * e;
                ans = (a * b) + add - f;
                if (ans < 0 || ans > 100000) return generateHard();
                return { text: a + ' • ' + b + ' + ' + c + ' : ' + d + ' • ' + e + ' - ' + f, answer: ans };

            case 7: // (a - b) * c + d : e (как (41 * 134 + 11 978) : (1 211 - 899))
                // Сделаем проще: a * b + c - d * e
                a = rand(100, 500); b = rand(10, 99);
                c = rand(1000, 50000);
                d = rand(100, 500); e = rand(10, 99);
                ans = (a * b) + c - (d * e);
                if (ans < 0 || ans > 100000) return generateHard();
                return { text: a + ' • ' + b + ' + ' + c + ' - ' + d + ' • ' + e, answer: ans };

            case 8: // a * (b + c) : d - e (со скобками, как на фото)
                d = rand(2, 9); b = rand(10, 99); c = rand(10, 99);
                var sum = b + c; if (sum % d !== 0) c = c + (d - (sum % d)); // делаем так, чтобы делилось
                a = rand(10, 99); // a * (b+c)/d 
                var mult = a * ((b + c) / d);
                e = rand(1000, 5000);
                ans = mult - e;
                if (ans < 0 || ans > 100000) return generateHard();
                return { text: a + ' • ( ' + b + ' + ' + c + ' ) : ' + d + ' - ' + e, answer: ans };
        }
    }


    // ПРОСТЫЕ примеры 
    function generateEasy() {
        var type = rand(1, 19); 
        var a, b, c, d, e, div1, div2, div3, div4, div5, div6, div7, div8, div9, div10, mult, product, factors, diff, sum;

        switch(type) {
            case 1: a = rand(50, 90); b = rand(10, 20); c = rand(2, 9); d = rand(2, 9); return { text: a + ' + ' + b + ' - ' + c + ' • ' + d, answer: a + b - c * d };
            case 2: b = rand(2, 9); div1 = rand(2, 9); a = b * div1; c = rand(2, 9); d = rand(10, 50); return { text: a + ' : ' + b + ' • ' + c + ' + ' + d, answer: div1 * c + d };
            case 3: c = rand(2, 9); div2 = rand(2, 9); b = c * div2; div3 = rand(2, 9); a = b * div3; d = rand(2, 9); return { text: a + ' : ( ' + b + ' : ' + c + ' ) • ' + d, answer: div3 * d };
            case 4: b = rand(2, 9); div4 = rand(2, 9); a = b * div4; c = rand(2, 9); e = rand(2, 9); div5 = rand(2, 9); d = e * div5; return { text: a + ' : ' + b + ' • ' + c + ' + ( ' + d + ' : ' + e + ' )', answer: div4 * c + div5 };
            case 5: c = rand(2, 9); div6 = rand(2, 9); b = c * div6; a = rand(40, 90); d = rand(5, 20); return { text: a + ' - ' + b + ' : ' + c + ' - ' + d, answer: a - div6 - d };
            case 6: c = rand(2, 9); div7 = rand(2, 9); b = c * div7; a = rand(60, 90); d = rand(2, 9); return { text: a + ' - ' + b + ' : ' + c + ' • ' + d, answer: a - div7 * d };
            case 7: a = rand(2, 9); c = rand(1, 20); diff = rand(2, 9); b = c + diff; return { text: a + ' • ( ' + b + ' - ' + c + ' )', answer: a * diff };
            case 8: a = rand(2, 9); c = rand(2, 9); div8 = rand(2, 9); b = c * div8; return { text: a + ' • ( ' + b + ' : ' + c + ' )', answer: a * div8 };
            case 9: c = rand(2, 9); div9 = rand(2, 9); sum = c * div9; a = rand(10, sum - 10); b = sum - a; return { text: '( ' + a + ' + ' + b + ' ) : ' + c, answer: div9 };
            case 10: c = rand(2, 9); div10 = rand(2, 9); diff = c * div10; b = rand(5, 20); a = b + diff; return { text: '( ' + a + ' - ' + b + ' ) : ' + c, answer: div10 };
            case 11: d = rand(2, 5); mult = rand(2, 9); product = d * mult; factors = []; for (var i = 2; i <= 9; i++) { if (product % i === 0 && product / i <= 9) factors.push(i); } if (factors.length === 0) { b = 2; c = product / 2; } else { b = factors[rand(0, factors.length - 1)]; c = product / b; } a = rand(10, 50); return { text: a + ' + ' + b + ' • ' + c + ' : ' + d, answer: a + mult };
            case 12: b = rand(2, 10); a = rand(b + 1, 20); c = rand(2, 20); return { text: '( ' + a + ' - ' + b + ' ) + ' + c, answer: (a - b) + c };
            case 13: a = rand(2, 10); b = rand(2, 10); c = rand(2, (a + b) - 1); return { text: '( ' + a + ' + ' + b + ' ) - ' + c, answer: (a + b) - c };
            case 14: b = rand(2, 10); c = rand(2, 10); a = rand((b + c) + 1, 30); return { text: a + ' - ( ' + b + ' + ' + c + ' )', answer: a - (b + c) };
            case 15: c = rand(2, 10); b = rand(c + 1, 20); a = rand(5, 30); return { text: a + ' - ( ' + b + ' - ' + c + ' )', answer: a - (b - c) };
            case 16: a = rand(5, 20); b = rand(5, 20); if (Math.random() > 0.5) { c = rand(2, 15); return { text: a + ' + ' + b + ' - ' + c, answer: a + b - c }; } else { c = rand(2, 15); return { text: a + ' + ' + b + ' + ' + c, answer: a + b + c }; }
            case 17: a = rand(30, 60); b = rand(2, 15); c = rand(2, 15); return { text: a + ' - ' + b + ' - ' + c, answer: a - b - c };
            case 18: a = rand(2, 5); c = rand(1, 5); b = c + rand(2, 5); return { text: a + ' • ( ' + b + ' - ' + c + ' )', answer: a * (b - c) };
            case 19: a = rand(2, 5); b = rand(2, 5); c = rand(2, 4); if (Math.random() > 0.5) return { text: '( ' + a + ' + ' + b + ' ) • ' + c, answer: (a + b) * c }; else return { text: a + ' • ( ' + b + ' + ' + c + ' )', answer: a * (b + c) };
        }
    }

    window.startOrderTrainer = function(level) {
        var screen = document.getElementById('solver-screen');
        screen.classList.add('active');
        document.body.style.overflow = 'hidden';

        document.getElementById('solver-task-mode').style.display = 'none';
        document.getElementById('solver-trainer-mode').style.display = 'block';
        document.getElementById('trainer-simple-mode').style.display = 'none';
        document.getElementById('trainer-column-mode').style.display = 'none';
        document.getElementById('trainer-units-mode').style.display = 'none';
        document.getElementById('trainer-rect-mode').style.display = 'none';
        document.getElementById('trainer-equations-mode').style.display = 'none';
        document.getElementById('trainer-order-mode').style.display = 'block';
        document.getElementById('solver-task-text').style.display = 'none';

        document.getElementById('trainer-numbers-mode').style.display = 'none';
        document.getElementById('trainer-clock-mode').style.display = 'none';
        document.getElementById('trainer-roman-mode').style.display = 'none';

        document.getElementById('trainer-order-mode').style.display = 'block';

        var counter = document.getElementById('solver-counter');
        if (counter) counter.textContent = 'Очки: 0';

        window._orderState = {
            level: level,
            score: 0,
            currentAnswer: 0
        };

        document.getElementById('order-solve-btn').onclick = function() {
            this.style.display = 'none';
            document.getElementById('order-actions-box').style.display = 'flex';
            document.getElementById('order-action-add-row').style.display = 'inline-block';
            document.getElementById('order-answer-box').style.display = 'block';
            document.getElementById('order-check-btn').style.display = 'inline-block';
            addOrderActionRow();
        };
        document.getElementById('order-action-add-row').onclick = addOrderActionRow;
        document.getElementById('order-check-btn').onclick = checkOrder;
        document.getElementById('order-next-btn').onclick = generateOrderExample;
        
        var input = document.getElementById('order-answer-cell');
        input.onkeydown = function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                checkOrder();
            }
        };

        generateOrderExample();
    };

    function generateOrderExample() {
        // ВОТ ТУТ ВЫБИРАЕТСЯ СЛОЖНОСТЬ
                // Выбор сложности
        var example;
        if (window._orderState.level === 'medium') {
            example = generateMedium();
        } else if (window._orderState.level === 'hard') {
            example = generateHard();
        } else {
            example = generateEasy();
        }

        var container = document.getElementById('order-example-container');
        container.innerHTML = '';
        
        var tokens = example.text.split(' ');
        
        tokens.forEach(function(t) {
            if (t === '+' || t === '-' || t === '•' || t === ':') {
                var opGroup = document.createElement('div');
                opGroup.className = 'order-item';
                opGroup.innerHTML = '<input type="text" class="order-priority-cell" maxlength="1">';
                var opSpan = document.createElement('span');
                opSpan.className = 'order-token';
                opSpan.textContent = t;
                opGroup.appendChild(opSpan);
                container.appendChild(opGroup);
            } else {
                var span = document.createElement('span');
                span.className = 'order-token';
                span.textContent = t;
                container.appendChild(span);
            }
        });

        window._orderState.currentAnswer = example.answer;

        document.getElementById('order-actions-box').innerHTML = '';
        document.getElementById('order-answer-cell').value = '';
        document.getElementById('order-answer-cell').classList.remove('correct', 'wrong');
        
        document.getElementById('order-solve-btn').style.display = 'inline-block';
        document.getElementById('order-actions-box').style.display = 'none';
        document.getElementById('order-action-add-row').style.display = 'none';
        document.getElementById('order-answer-box').style.display = 'none';
        document.getElementById('order-check-btn').style.display = 'none';
        document.getElementById('order-next-btn').style.display = 'none';
        document.getElementById('order-feedback').textContent = '';
    }

    function addOrderActionRow() {
        var box = document.getElementById('order-actions-box');
        var index = box.children.length + 1;

        var row = document.createElement('div');
        row.className = 'action-row';
        row.style.background = '#fff';
        row.style.padding = '10px 15px';
        row.style.borderRadius = '15px';
        row.style.width = 'fit-content';
        row.style.margin = '0 auto';
        row.style.boxSizing = 'border-box';
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '10px';

        var num = document.createElement('span');
        num.textContent = index + ')';
        num.style.fontWeight = 'bold';
        num.style.color = '#1e4a6b';
        num.style.fontSize = '1.2rem';
        num.style.whiteSpace = 'nowrap';

        var input = document.createElement('input');
        input.type = 'text';
        input.className = 'action-cell';
        input.style.width = '400px'; 
        input.style.border = '2px solid #c7e2f5';
        input.style.borderRadius = '10px';
        input.style.padding = '10px 15px';
        input.style.fontSize = '1.2rem';
        input.placeholder = 'Действие...';

        var del = document.createElement('button');
        del.className = 'action-del';
        del.textContent = '×';
        del.style.flexShrink = '0';
        del.style.marginLeft = '5px';
        del.onclick = function() { 
            row.remove(); 
            renumberOrderActions();
        };

        row.appendChild(num);
        row.appendChild(input);
        row.appendChild(del);
        box.appendChild(row);
    }

    function renumberOrderActions() {
        var box = document.getElementById('order-actions-box');
        Array.from(box.children).forEach(function(row, index) {
            var num = row.querySelector('span');
            if (num) num.textContent = (index + 1) + ')';
        });
    }

    function checkOrder() {
        var input = document.getElementById('order-answer-cell');
        var userAnswer = parseInt(input.value.trim(), 10);
        var fb = document.getElementById('order-feedback');

        input.classList.remove('correct', 'wrong');

        if (userAnswer === window._orderState.currentAnswer) {
            window._orderState.score++;
            document.getElementById('solver-counter').textContent = 'Очки: ' + window._orderState.score;
            input.classList.add('correct');
            fb.textContent = '🎉 Верно! +1 очко';
            fb.className = 'solver-feedback ok';

            if (window.addCorrectAnswer) window.addCorrectAnswer('topic', 'Примеры по действиям');

            document.getElementById('order-check-btn').style.display = 'none';
            document.getElementById('order-next-btn').style.display = 'inline-block';

            setTimeout(function() {
                if (window._orderState) generateOrderExample();
            }, 1000);
        } else {
            input.classList.add('wrong');
            fb.textContent = '❌ Проверь ответ ещё раз! Правильно расставлен порядок действий?';
            fb.className = 'solver-feedback err';
            input.value = '';
            input.classList.remove('wrong');
            input.focus();
        }
    }
    window.generateEasy = generateEasy;
    window.generateMedium = generateMedium;
    window.generateHard = generateHard;
})();