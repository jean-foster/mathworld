// tasks/trainers/03-division.js
// Тренажёр: Деление в столбик (уголком)
// Генерирует примеры на лету.

window.TRAINERS = window.TRAINERS || {};

window.TRAINERS["division"] = {
    title: "➗ Деление в столбик",

    start: function (opts) {
        return {
            max: opts.max || 100,
            withRemainder: opts.withRemainder !== false
        };
    },

    next: function (state) {
        var max = state.max;
        var withRemainder = state.withRemainder;
        var divisorMax = (max <= 1000) ? 9 : 99;

        var divisor, dividend, quotient, remainder;

        if (!withRemainder) {
            // Без остатка: делимое = делитель × частное
            divisor = randInt(2, divisorMax);
            quotient = randInt(2, Math.floor(max / divisor));
            dividend = divisor * quotient;
            remainder = 0;
        } else {
            // С остатком: dividend = divisor × quotient + remainder, 0 < remainder < divisor
            divisor = randInt(2, divisorMax);
            quotient = randInt(2, Math.floor(max / divisor));
            remainder = randInt(1, divisor - 1);
            dividend = divisor * quotient + remainder;
            // Ограничиваем по max
            while (dividend > max) {
                quotient = Math.floor(quotient / 2);
                if (quotient < 1) quotient = 1;
                remainder = randInt(1, divisor - 1);
                dividend = divisor * quotient + remainder;
            }
        }

        // Считаем шаги деления — массив цифр частного (для подсказки рендера)
        var qStr = String(quotient);

        return {
            op: ':',
            dividend: dividend,
            divisor: divisor,
            answer: quotient,
            remainder: remainder,
            withRemainder: withRemainder,
            qDigits: qStr.length
        };
    },

    check: function (example, userQuotient, userRemainder) {
        var q = parseInt(String(userQuotient).trim(), 10);
        var r = parseInt(String(userRemainder).trim(), 10);
        if (isNaN(r)) r = 0;
        return {
            correct: (q === example.answer) && (r === example.remainder),
            expectedQ: example.answer,
            expectedR: example.remainder
        };
    }
};

function randInt(min, max) {
    if (max < min) max = min;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}