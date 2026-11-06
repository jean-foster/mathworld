// tasks/trainers/04-units.js
// Тренажёр: Перевод единиц измерения
// Банк заданий — свой, составлен по образцу сборника Узоровой/Нефедовой

window.TRAINERS = window.TRAINERS || {};

// ==================== БАНК ЗАДАНИЙ ====================
// ==================== БАНК ЗАДАНИЙ ====================
// Составлен по образцу сборника Узоровой/Нефедовой.
// Числа изменены, структура сохранена.

window.UNITS_BANK = {

    // ==================================================
    // ДЛИНА
    // ==================================================
    length: [
        // ---- Прямые (крупные → мелкие) ----
        { value: 6,   from: 'км', to: 'м',  answer: 6000 },
        { value: 9,   from: 'км', to: 'м',  answer: 9000 },
        { value: 12,  from: 'км', to: 'м',  answer: 12000 },
        { value: 15,  from: 'км', to: 'м',  answer: 15000 },
        { value: 4,   from: 'м',  to: 'дм', answer: 40 },
        { value: 7,   from: 'м',  to: 'дм', answer: 70 },
        { value: 13,  from: 'м',  to: 'дм', answer: 130 },
        { value: 25,  from: 'м',  to: 'дм', answer: 250 },
        { value: 3,   from: 'м',  to: 'см', answer: 300 },
        { value: 8,   from: 'м',  to: 'см', answer: 800 },
        { value: 11,  from: 'м',  to: 'см', answer: 1100 },
        { value: 14,  from: 'м',  to: 'см', answer: 1400 },
        { value: 5,   from: 'дм', to: 'см', answer: 50 },
        { value: 12,  from: 'дм', to: 'см', answer: 120 },
        { value: 18,  from: 'дм', to: 'см', answer: 180 },
        { value: 6,   from: 'дм', to: 'мм', answer: 600 },
        { value: 9,   from: 'дм', to: 'мм', answer: 900 },
        { value: 4,   from: 'см', to: 'мм', answer: 40 },
        { value: 15,  from: 'см', to: 'мм', answer: 150 },
        { value: 22,  from: 'см', to: 'мм', answer: 220 },
        { value: 2,   from: 'км', to: 'м',  answer: 2000 },
        { value: 7,   from: 'км', to: 'м',  answer: 7000 },
        { value: 10,  from: 'км', to: 'м',  answer: 10000 },
        { value: 16,  from: 'м',  to: 'дм', answer: 160 },
        { value: 9,   from: 'м',  to: 'см', answer: 900 },
        { value: 20,  from: 'дм', to: 'см', answer: 200 },
        { value: 30,  from: 'см', to: 'мм', answer: 300 },
        { value: 8,   from: 'дм', to: 'мм', answer: 800 },
        { value: 5,   from: 'км', to: 'м',  answer: 5000 },
        { value: 6,   from: 'м',  to: 'дм', answer: 60 },

        // ---- Обратные (мелкие → крупные) ----
        { value: 6000, from: 'м',  to: 'км', answer: 6 },
        { value: 3000, from: 'м',  to: 'км', answer: 3 },
        { value: 9000, from: 'м',  to: 'км', answer: 9 },
        { value: 12000, from: 'м', to: 'км', answer: 12 },
        { value: 80,   from: 'дм', to: 'м',  answer: 8 },
        { value: 500,  from: 'см', to: 'м',  answer: 5 },
        { value: 200,  from: 'см', to: 'м',  answer: 2 },
        { value: 1500, from: 'м',  to: 'км', answer: 1.5 },
        { value: 90,   from: 'см', to: 'дм', answer: 9 },
        { value: 400,  from: 'мм', to: 'см', answer: 40 },
        { value: 700,  from: 'мм', to: 'дм', answer: 7 },
        { value: 300,  from: 'см', to: 'дм', answer: 30 },
        { value: 2500, from: 'м',  to: 'км', answer: 2.5 },
        { value: 110,  from: 'см', to: 'дм', answer: 11 },
        { value: 900,  from: 'мм', to: 'см', answer: 90 }
    ],

    // ==================================================
    // МАССА
    // ==================================================
    mass: [
        // ---- Прямые ----
        { value: 3,   from: 'т',  to: 'кг', answer: 3000 },
        { value: 7,   from: 'т',  to: 'кг', answer: 7000 },
        { value: 5,   from: 'т',  to: 'кг', answer: 5000 },
        { value: 12,  from: 'т',  to: 'кг', answer: 12000 },
        { value: 4,   from: 'ц',  to: 'кг', answer: 400 },
        { value: 9,   from: 'ц',  to: 'кг', answer: 900 },
        { value: 15,  from: 'ц',  to: 'кг', answer: 1500 },
        { value: 6,   from: 'кг', to: 'г',  answer: 6000 },
        { value: 12,  from: 'кг', to: 'г',  answer: 12000 },
        { value: 25,  from: 'кг', to: 'г',  answer: 25000 },
        { value: 5,   from: 'т',  to: 'ц',  answer: 50 },
        { value: 8,   from: 'т',  to: 'ц',  answer: 80 },
        { value: 11,  from: 'т',  to: 'ц',  answer: 110 },
        { value: 3,   from: 'кг', to: 'г',  answer: 3000 },
        { value: 18,  from: 'кг', to: 'г',  answer: 18000 },
        { value: 40,  from: 'ц',  to: 'кг', answer: 4000 },

        // ---- Обратные ----
        { value: 5000, from: 'кг', to: 'т',  answer: 5 },
        { value: 8000, from: 'кг', to: 'т',  answer: 8 },
        { value: 3000, from: 'кг', to: 'т',  answer: 3 },
        { value: 12000, from: 'кг', to: 'т', answer: 12 },
        { value: 600,  from: 'кг', to: 'ц',  answer: 6 },
        { value: 1200, from: 'кг', to: 'ц',  answer: 12 },
        { value: 4000, from: 'г',  to: 'кг', answer: 4 },
        { value: 9000, from: 'г',  to: 'кг', answer: 9 },
        { value: 700,  from: 'кг', to: 'ц',  answer: 7 },
        { value: 2000, from: 'кг', to: 'т',  answer: 2 },
        { value: 25000, from: 'кг', to: 'т', answer: 25 },
        { value: 1500, from: 'кг', to: 'ц',  answer: 15 },
        { value: 7000, from: 'г',  to: 'кг', answer: 7 },
        { value: 800,  from: 'кг', to: 'ц',  answer: 8 },
        { value: 10000, from: 'кг', to: 'т', answer: 10 }
    ],

    // ==================================================
    // ВРЕМЯ
    // ==================================================
    time: [
        // ---- Прямые ----
        { value: 3,  from: 'ч',   to: 'мин', answer: 180 },
        { value: 4,  from: 'ч',   to: 'мин', answer: 240 },
        { value: 6,  from: 'ч',   to: 'мин', answer: 360 },
        { value: 8,  from: 'ч',   to: 'мин', answer: 480 },
        { value: 12, from: 'ч',   to: 'мин', answer: 720 },
        { value: 5,  from: 'мин', to: 'с',   answer: 300 },
        { value: 7,  from: 'мин', to: 'с',   answer: 420 },
        { value: 10, from: 'мин', to: 'с',   answer: 600 },
        { value: 15, from: 'мин', to: 'с',   answer: 900 },
        { value: 2,  from: 'сут', to: 'ч',   answer: 48 },
        { value: 3,  from: 'сут', to: 'ч',   answer: 72 },
        { value: 5,  from: 'сут', to: 'ч',   answer: 120 },
        { value: 10, from: 'ч',   to: 'мин', answer: 600 },
        { value: 2,  from: 'ч',   to: 'с',   answer: 7200 },
        { value: 3,  from: 'мин', to: 'с',   answer: 180 },
        { value: 20, from: 'мин', to: 'с',   answer: 1200 },

        // ---- Обратные ----
        { value: 120, from: 'мин', to: 'ч',   answer: 2 },
        { value: 180, from: 'мин', to: 'ч',   answer: 3 },
        { value: 240, from: 'мин', to: 'ч',   answer: 4 },
        { value: 360, from: 'мин', to: 'ч',   answer: 6 },
        { value: 300, from: 'с',   to: 'мин', answer: 5 },
        { value: 420, from: 'с',   to: 'мин', answer: 7 },
        { value: 600, from: 'с',   to: 'мин', answer: 10 },
        { value: 900, from: 'с',   to: 'мин', answer: 15 },
        { value: 48,  from: 'ч',   to: 'сут', answer: 2 },
        { value: 72,  from: 'ч',   to: 'сут', answer: 3 },
        { value: 120, from: 'ч',   to: 'сут', answer: 5 },
        { value: 240, from: 'ч',   to: 'сут', answer: 10 },
        { value: 7200, from: 'с',  to: 'ч',   answer: 2 },
        { value: 10800, from: 'с', to: 'ч',   answer: 3 },
        { value: 600, from: 'мин', to: 'ч',   answer: 10 }
    ],

    // ==================================================
    // ПЛОЩАДЬ
    // ==================================================
    area: [
        // ---- Прямые ----
        { value: 3,  from: 'м²', to: 'дм²', answer: 300 },
        { value: 5,  from: 'м²', to: 'дм²', answer: 500 },
        { value: 7,  from: 'м²', to: 'см²', answer: 70000 },
        { value: 2,  from: 'дм²', to: 'см²', answer: 200 },
        { value: 4,  from: 'дм²', to: 'см²', answer: 400 },
        { value: 9,  from: 'дм²', to: 'см²', answer: 900 },
        { value: 6,  from: 'см²', to: 'мм²', answer: 600 },
        { value: 8,  from: 'см²', to: 'мм²', answer: 800 },
        { value: 12, from: 'см²', to: 'мм²', answer: 1200 },
        { value: 1,  from: 'га',  to: 'м²', answer: 10000 },
        { value: 2,  from: 'га',  to: 'м²', answer: 20000 },
        { value: 3,  from: 'га',  to: 'а',  answer: 300 },
        { value: 5,  from: 'а',   to: 'м²', answer: 500 },
        { value: 4,  from: 'км²', to: 'га', answer: 400 },

        // ---- Обратные ----
        { value: 300,  from: 'дм²', to: 'м²',  answer: 3 },
        { value: 500,  from: 'дм²', to: 'м²',  answer: 5 },
        { value: 200,  from: 'см²', to: 'дм²', answer: 2 },
        { value: 900,  from: 'см²', to: 'дм²', answer: 9 },
        { value: 600,  from: 'мм²', to: 'см²', answer: 6 },
        { value: 1200, from: 'мм²', to: 'см²', answer: 12 },
        { value: 10000, from: 'м²', to: 'га',  answer: 1 },
        { value: 500,  from: 'м²',  to: 'а',   answer: 5 },
        { value: 800,  from: 'см²', to: 'дм²', answer: 8 },
        { value: 2000, from: 'мм²', to: 'см²', answer: 20 }
    ],

    // ==================================================
    // ОБЪЁМ
    // ==================================================
    volume: [
        // ---- Прямые ----
        { value: 3,  from: 'м³', to: 'дм³', answer: 3000 },
        { value: 5,  from: 'м³', to: 'дм³', answer: 5000 },
        { value: 7,  from: 'м³', to: 'дм³', answer: 7000 },
        { value: 2,  from: 'дм³', to: 'см³', answer: 2000 },
        { value: 4,  from: 'дм³', to: 'см³', answer: 4000 },
        { value: 9,  from: 'дм³', to: 'см³', answer: 9000 },
        { value: 1,  from: 'м³', to: 'л',   answer: 1000 },
        { value: 2,  from: 'м³', to: 'л',   answer: 2000 },
        { value: 5,  from: 'дм³', to: 'л',   answer: 5 },
        { value: 8,  from: 'дм³', to: 'л',   answer: 8 },
        { value: 3,  from: 'л',  to: 'мл',   answer: 3000 },
        { value: 6,  from: 'л',  to: 'мл',   answer: 6000 },

        // ---- Обратные ----
        { value: 3000, from: 'дм³', to: 'м³',  answer: 3 },
        { value: 5000, from: 'дм³', to: 'м³',  answer: 5 },
        { value: 2000, from: 'см³', to: 'дм³', answer: 2 },
        { value: 9000, from: 'см³', to: 'дм³', answer: 9 },
        { value: 1000, from: 'л',   to: 'м³',  answer: 1 },
        { value: 5000, from: 'л',   to: 'м³',  answer: 5 },
        { value: 3000, from: 'мл',  to: 'л',   answer: 3 },
        { value: 7000, from: 'мл',  to: 'л',   answer: 7 }
    ],

    // ==================================================
    // СКОРОСТЬ
    // ==================================================
    speed: [
        { value: 60, from: 'км/ч', to: 'м/мин', answer: 1000 },
        { value: 36, from: 'км/ч', to: 'м/с',   answer: 10 },
        { value: 72, from: 'км/ч', to: 'м/с',   answer: 20 },
        { value: 18, from: 'км/ч', to: 'м/с',   answer: 5 },
        { value: 54, from: 'км/ч', to: 'м/с',   answer: 15 },
        { value: 90, from: 'км/ч', to: 'м/с',   answer: 25 },
        { value: 108, from: 'км/ч', to: 'м/с',  answer: 30 },
        { value: 120, from: 'км/ч', to: 'м/мин', answer: 2000 },
        { value: 3,  from: 'м/с',  to: 'м/мин', answer: 180 },
        { value: 5,  from: 'м/с',  to: 'м/мин', answer: 300 },
        { value: 2,  from: 'м/с',  to: 'км/ч',  answer: 7.2 },
        { value: 10, from: 'м/с',  to: 'км/ч',  answer: 36 }
    ]
};// ==================== ТРЕНАЖЁР ====================
window.TRAINERS["units"] = {
    title: "📏 Единицы измерения",

    start: function (category) {
        return {
            category: category || 'length',
            score: 0,
            usedKeys: []
        };
    },

    next: function (state) {
        var pool;

        if (state.category === 'mixed') {
            pool = [];
            Object.keys(window.UNITS_BANK).forEach(function (key) {
                window.UNITS_BANK[key].forEach(function (item) {
                    pool.push(item);
                });
            });
        } else {
            pool = window.UNITS_BANK[state.category] || window.UNITS_BANK.length;
        }

        if (!pool || pool.length === 0) {
            return { value: 1, from: 'м', to: 'см', answer: 100 };
        }

        // Выбираем случайное задание, которого ещё не было
        var item, key, attempts = 0;
        do {
            item = pool[Math.floor(Math.random() * pool.length)];
            key = item.value + '|' + item.from + '|' + item.to;
            attempts++;
        } while (state.usedKeys.indexOf(key) !== -1 && attempts < 50);

        state.usedKeys.push(key);

        // Сброс истории, когда прошли почти всё
        if (state.usedKeys.length > pool.length * 0.9) {
            state.usedKeys = [];
        }

        return {
            value: item.value,
            from: item.from,
            to: item.to,
            answer: item.answer
        };
    },

    check: function (example, userAnswer) {
        var user = parseInt(String(userAnswer).trim(), 10);
        return {
            correct: user === example.answer,
            expected: example.answer
        };
    }
};