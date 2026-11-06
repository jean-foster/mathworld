window.TRAINERS["rect"] = {
    title: "📐 Площадь и периметр",

    start: function () {
        return { score: 0 };
    },

        next: function () {
        var type = randInt(1, 6); // Теперь 6 типов

        if (type === 1) {
            var a, b;
            do {
                a = randInt(2, 10);
                b = randInt(2, 10);
            } while (a === b || a * b >= 100 || 2 * (a + b) >= 100);

            return {
                type: 'type1',
                a: a, b: b,
                area: a * b,
                perimeter: 2 * (a + b),
                text: 'Начерти прямоугольник со сторонами ' + a + ' и ' + b + ' клеток. Найди его периметр и площадь.'
            };
        }

        if (type === 2) {
            var isMore = Math.random() > 0.5;
            var small, big, times, per;
            do {
                times = randInt(2, 4);
                small = randInt(2, 8);
                big = small * times;
                per = 2 * (big + small);
            } while (big * small >= 100 || per >= 100);

            var text = '';
            if (isMore) {
                text = 'Начерти прямоугольник, одна сторона которого равна ' + big + ' клеток, а другая в ' + times + ' раза меньше. Найди его площадь и периметр.';
            } else {
                text = 'Начерти прямоугольник, одна сторона которого равна ' + small + ' клеток, а другая в ' + times + ' раза больше. Найди его площадь и периметр.';
            }

            return {
                type: 'type2',
                a: big, b: small,
                area: big * small,
                perimeter: per,
                text: text
            };
        }

        if (type === 3) {
            var a, b, perimeter;
            do {
                a = randInt(2, 10);
                b = randInt(2, 10);
                perimeter = 2 * (a + b);
            } while (a * b >= 100 || perimeter >= 100 || a === b);

            return {
                type: 'type3',
                a: a, b: b,
                area: a * b,
                perimeter: perimeter,
                text: 'Начерти прямоугольник с периметром ' + perimeter + ' (клеток).'
            };
        }

        if (type === 4) {
            var area, a, b;
            do {
                area = randInt(4, 64); 
                var divisors = [];
                for (var i = 2; i <= 10; i++) {
                    if (area % i === 0 && area / i <= 20) { 
                        divisors.push(i);
                    }
                }
            } while (divisors.length === 0);

            a = divisors[Math.floor(Math.random() * divisors.length)];
            b = area / a;

            return {
                type: 'type4',
                a: a, b: b,
                area: area,
                perimeter: 2 * (a + b),
                text: 'Начерти прямоугольник с площадью ' + area + ' (клеток).'
            };
        }

        if (type === 5) {
            var side, area;
            do {
                side = randInt(2, 10);
                area = side * side;
            } while (area >= 100);

            return {
                type: 'type5',
                a: side, b: side,
                area: area,
                perimeter: 4 * side,
                text: 'Начерти квадрат с площадью ' + area + ' (клеток).'
            };
        }

        var side2, per2;
        do {
            side2 = randInt(2, 12);
            per2 = 4 * side2;
        } while (per2 >= 100);

        return {
            type: 'type6',
            a: side2, b: side2,
            area: side2 * side2,
            perimeter: per2,
            text: 'Начерти квадрат с периметром ' + per2 + ' (клеток).'
        };
    },
};

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}