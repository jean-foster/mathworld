// tasks/trainers/02-columns.js
// Тренажёр: Примеры в столбик (сложение, вычитание, умножение)

window.TRAINERS = window.TRAINERS || {};

window.TRAINERS["columns"] = {
    title: "➕ Примеры в столбик",

    start: function (op, max) {
        return {
            op: op || 'add',
            max: parseInt(max, 10) || 100,
            score: 0
        };
    },

    next: function (state) {
        if (state.op === 'mul') {
            return nextMultiplication(state.max);
        }
        if (state.op === 'sub') {
            return nextSubtraction(state.max);
        }
        return nextAddition(state.max);
    },

    check: function (example, userDigits) {
        var correct = String(example.answer);
        var user = String(userDigits).trim();
        return {
            correct: user === correct,
            expected: correct
        };
    }
};

// ==================== СЛОЖЕНИЕ ====================
function nextAddition(max) {
    var a, b;

    if (max <= 100) {
        // До 100: 2-значные + 2-значные
        a = randInt(10, 89);
        b = randInt(10, Math.max(10, max - a));
        if (a + b > max) b = max - a;
        if (b < 10) b = 10;
    } else if (max <= 1000) {
        // До 1000: 3-значные + 2-3-значные
        var type = Math.random();
        if (type < 0.5) {
            a = randInt(100, 899);
            b = randInt(100, Math.min(max - a, 999));
        } else {
            a = randInt(100, 899);
            b = randInt(10, 99);
        }
        if (a + b > max) b = max - a;
        if (b < 10) b = 10;
    } else {
        // До 10 000: 4-значные + 2-4-значные
        var type2 = Math.random();
        if (type2 < 0.4) {
            // 4-значное + 4-значное
            a = randInt(1000, 8999);
            b = randInt(1000, Math.min(max - a, 9999));
        } else if (type2 < 0.7) {
            // 4-значное + 3-значное
            a = randInt(1000, 8999);
            b = randInt(100, 999);
        } else {
            // 4-значное + 2-значное
            a = randInt(1000, 8999);
            b = randInt(10, 99);
        }
        if (a + b > max) b = max - a;
        if (b < 10) b = 10;
    }

    if (a < b) { var t = a; a = b; b = t; }

    return { op: '+', a: a, b: b, answer: a + b };
}

// ==================== ВЫЧИТАНИЕ ====================
function nextSubtraction(max) {
    var a, b;

    if (max <= 100) {
        a = randInt(30, 99);
        b = randInt(10, a - 1);
    } else if (max <= 1000) {
        a = randInt(200, 999);
        var type = Math.random();
        if (type < 0.5) {
            b = randInt(10, 99);
        } else {
            b = randInt(100, a - 1);
        }
    } else {
        a = randInt(1000, 9999);
        var type2 = Math.random();
        if (type2 < 0.5) {
            b = randInt(10, 99);
        } else {
            b = randInt(100, Math.min(a - 1, 999));
        }
    }

    if (a < b) { var t = a; a = b; b = t; }

    return { op: '−', a: a, b: b, answer: a - b };
}

// ==================== УМНОЖЕНИЕ ====================
function nextMultiplication(max) {
    var a, b;

    if (max <= 100) {
        a = randInt(10, 99);
        b = randInt(2, 9);
        while (a * b > 100) {
            a = randInt(10, 40);
            b = randInt(2, 9);
        }
    } else if (max <= 1000) {
        a = randInt(100, 999);
        b = randInt(2, 9);
        while (a * b > 1000) {
            a = randInt(100, 400);
            b = randInt(2, 9);
        }
    } else {
        a = randInt(100, 999);
        b = randInt(11, 99);
        while (a * b > 10000) {
            a = randInt(100, 400);
            b = randInt(11, 40);
        }
    }

    if (a < b) { var t = a; a = b; b = t; }

    return {
        op: '×',
        a: a,
        b: b,
        answer: a * b,
        partials: computePartials(a, b)
    };
}

function computePartials(a, b) {
    var bStr = String(b);
    var result = [];
    for (var i = 0; i < bStr.length; i++) {
        var digit = parseInt(bStr[bStr.length - 1 - i], 10);
        var value = a * digit;
        result.push({ value: value, shift: i, digit: digit });
    }
    return result;
}

// ==================== УТИЛИТА ====================
function randInt(min, max) {
    if (max < min) max = min;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}