window.TRAINERS = window.TRAINERS || {};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomLetter() {
    var letters = ['x', 'y', 't', 'm', 'p', 'k', 'z', 'a', 'n'];
    return letters[Math.floor(Math.random() * letters.length)];
}

window.TRAINERS["equations"] = {
    title: "⚖️ Уравнения",

    start: function (type) {
        return {
            type: type // 'easy' или 'hard'
        };
    },

    next: function (state) {
        var letter = getRandomLetter();
        var variant, a, b, c, d, x, text, res;

        // ============================================
        // 1. ПРОСТЫЕ УРАВНЕНИЯ
        // ============================================
        if (state.type === 'easy') {
            variant = getRandomInt(1, 8);

            if (variant === 1) { // x + a = b
                a = getRandomInt(1, 50); x = getRandomInt(1, 50); b = x + a;
                text = letter + " + " + a + " = " + b;
            } else if (variant === 2) { // a + x = b
                a = getRandomInt(1, 50); x = getRandomInt(1, 50); b = a + x;
                text = a + " + " + letter + " = " + b;
            } else if (variant === 3) { // x - a = b
                a = getRandomInt(1, 50); x = getRandomInt(a + 1, 100); b = x - a;
                text = letter + " − " + a + " = " + b;
            } else if (variant === 4) { // a - x = b
                x = getRandomInt(1, 50); b = getRandomInt(1, 50); a = x + b;
                text = a + " − " + letter + " = " + b;
            } else if (variant === 5) { // x * a = b
                a = getRandomInt(2, 9); x = getRandomInt(2, 9); b = x * a;
                text = letter + " · " + a + " = " + b;
            } else if (variant === 6) { // a * x = b
                a = getRandomInt(2, 9); x = getRandomInt(2, 9); b = a * x;
                text = a + " · " + letter + " = " + b;
            } else if (variant === 7) { // x : a = b
                a = getRandomInt(2, 9); b = getRandomInt(2, 9); x = a * b;
                text = letter + " : " + a + " = " + b;
            } else { // a : x = b
                b = getRandomInt(2, 9); x = getRandomInt(2, 9); a = x * b;
                text = a + " : " + letter + " = " + b;
            }
            return { text: text, varName: letter, answer: x };
        }

        // ============================================
        // 2. СЛОЖНЫЕ УРАВНЕНИЯ
        // ============================================
        if (state.type === 'hard') {
            variant = getRandomInt(1, 8);

            // 1. (k + a) + b = res
            if (variant === 1) {
                x = getRandomInt(10, 50); 
                a = getRandomInt(2, 10); 
                b = getRandomInt(2, 20);
                res = (x + a) + b;
                text = "(" + letter + " + " + a + ") + " + b + " = " + res;
            } 
            // 2. a + (x + b) = res
            else if (variant === 2) {
                x = getRandomInt(10, 50);
                a = getRandomInt(2, 20);
                b = getRandomInt(2, 30);
                res = a + (x + b);
                text = a + " + (" + letter + " + " + b + ") = " + res;
            }
            // 3. (t - a) - b = res
            else if (variant === 3) {
                a = getRandomInt(10, 30);
                b = getRandomInt(10, 40);
                x = getRandomInt(a + b + 5, 150);
                res = (x - a) - b;
                text = "(" + letter + " − " + a + ") − " + b + " = " + res;
            }
            // 4. a - (m - b) = res
            else if (variant === 4) {
                b = getRandomInt(20, 50);
                x = getRandomInt(b + 10, 200); // Чтобы m - b > 0
                a = x + getRandomInt(10, 100); // a > x - b, чтобы ответ был положительным
                res = a - (x - b);
                text = a + " − (" + letter + " − " + b + ") = " + res;
            }
            // 5. a * x + b = res
            else if (variant === 5) {
                a = getRandomInt(2, 9);
                x = getRandomInt(2, 10);
                b = getRandomInt(2, 15);
                res = (a * x) + b;
                text = a + " · " + letter + " + " + b + " = " + res;
            }
            // 6. a * x + b = res (большие числа)
            else if (variant === 6) {
                a = getRandomInt(100, 200);
                x = getRandomInt(100, 300);
                b = getRandomInt(20, 80);
                res = (a * x) + b;
                text = a + " · " + letter + " + " + b + " = " + res;
            }
            // 7. (2x - a) : b = 0
            else if (variant === 7) {
                x = getRandomInt(10, 50);
                a = 2 * x;
                b = getRandomInt(10, 50);
                text = "(2" + letter + " − " + a + ") : " + b + " = 0";
            }
              // 8. (a + b) : x = c или (a - b) : x = c
            else if (variant === 8) {
                x = getRandomInt(2, 9);
                c = getRandomInt(2, 10); // результат
                
                var operation = Math.random() > 0.5 ? '+' : '−';

                if (operation === '+') {
                    // (a + b) : x = c
                    a = getRandomInt(10, 50); // Первое число
                    b = getRandomInt(10, 50); // Второе число
                    var sum = a + b;          // Сумма
                    // Подгоняем c, чтобы (a+b) делилось на x без остатка
                    c = Math.floor(sum / x); 
                    // Корректируем b, чтобы все было идеально
                    b = (c * x) - a; 
                    if (b < 0) { b = a; c = Math.floor((a + b) / x); }
                    text = "(" + a + " + " + b + ") : " + letter + " = " + c;
                } else {
                    // (a - b) : x = c
                    b = getRandomInt(5, 20); 
                    c = getRandomInt(2, 10);
                    var diff = x * c; // Разность
                    a = diff + b; // Уменьшаемое
                    text = "(" + a + " − " + b + ") : " + letter + " = " + c;
                }
            }
            return { text: text, varName: letter, answer: x };
        }

        return { text: "x + 0 = 0", varName: "x", answer: 0 };
    },

    check: function (example, userAnswer) {
        var userNum = parseInt(String(userAnswer).trim(), 10);
        return {
            correct: userNum === example.answer,
            expected: example.answer
        };
    }
};