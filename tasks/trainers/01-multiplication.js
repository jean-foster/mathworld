// tasks/trainers/01-multiplication.js
// Тренажёр: Таблица умножения
// Генерирует примеры вида a × b, где a и b — случайные от 2 до maxNumber.

window.TRAINERS = window.TRAINERS || {};

window.TRAINERS["multiplication"] = {
    title: "✖️ Таблица умножения",

    // Запуск: возвращает объект с настройками
    start: function (maxNumber) {
        var max = parseInt(maxNumber, 10) || 10;
        return {
            maxNumber: max,
            currentExample: null,
            score: 0
        };
    },

    // Сгенерировать новый пример
next: function (state) {
    var max = state.maxNumber;
    var a, b;

    if (max <= 10) {
        // Для 1-2 класса: оба числа однозначные от 2 до 9
        a = randInt(2, 9);
        b = randInt(2, 9);
    } else {
        // Одно однозначное, второе двузначное
        a = randInt(2, 9);
        b = randInt(10, max);
        if (Math.random() < 0.5) {
            var t = a; a = b; b = t;
        }
    }

    return {
        text: a + " × " + b + " = ?",
        answer: a * b
    };
},

    // Проверить ответ
    check: function (example, userAnswer) {
        var n = parseInt(String(userAnswer).trim(), 10);
        return {
            correct: n === example.answer,
            expected: example.answer
        };
    }
};

// Утилита: случайное целое в диапазоне
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}