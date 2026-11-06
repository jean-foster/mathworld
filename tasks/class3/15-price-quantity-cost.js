// tasks/class3/15-price-quantity-cost.js
// Тема: Простые задачи на цену, количество, стоимость
// Все сюжеты и числа оригинальные.

window.BANKS = window.BANKS || {};
window.BANKS["Простые задачи на цену, количество, стоимость"] = [
    { id: 716, text: "Одна тарелка стоит 6 рублей. Сколько стоят 4 такие тарелки?", answer: 24, answerLabel: "рубля", actions: [{ left: 6, op: "·", right: 4, result: 24 }] },
    { id: 717, text: "3 одинаковые флешки стоят 24 рубля. Сколько стоит одна флешка?", answer: 8, answerLabel: "рублей", actions: [{ left: 24, op: ":", right: 3, result: 8 }] },
    { id: 718, text: "5 ручек стоят 20 рублей. Сколько стоит одна ручка?", answer: 4, answerLabel: "рубля", actions: [{ left: 20, op: ":", right: 5, result: 4 }] },
    { id: 719, text: "Один блокнот стоит 3 рубля. Сколько стоят 6 таких блокнотов?", answer: 18, answerLabel: "рублей", actions: [{ left: 3, op: "·", right: 6, result: 18 }] },
    { id: 720, text: "4 наклейки стоят 8 рублей. Сколько стоит одна наклейка?", answer: 2, answerLabel: "рубля", actions: [{ left: 8, op: ":", right: 4, result: 2 }] },
    { id: 721, text: "5 одинаковых кукол стоят 30 рублей. Сколько рублей стоит одна кукла?", answer: 6, answerLabel: "рублей", actions: [{ left: 30, op: ":", right: 5, result: 6 }] },
    { id: 722, text: "Заколка стоит 7 рублей. Сколько стоят 3 такие заколки?", answer: 21, answerLabel: "рубль", actions: [{ left: 7, op: "·", right: 3, result: 21 }] },
    { id: 723, text: "6 одинаковых лампочек стоят 54 рубля. Сколько стоит одна лампочка?", answer: 9, answerLabel: "рублей", actions: [{ left: 54, op: ":", right: 6, result: 9 }] },
    { id: 724, text: "За 4 одинаковых стула заплатили 60 рублей. Сколько стоит один стул?", answer: 15, answerLabel: "рублей", actions: [{ left: 60, op: ":", right: 4, result: 15 }] },
    { id: 725, text: "Воздушный шарик стоит 4 рубля. Сколько стоят 6 воздушных шариков?", answer: 24, answerLabel: "рубля", actions: [{ left: 4, op: "·", right: 6, result: 24 }] },
    { id: 726, text: "4 одинаковых мяча стоят 32 рубля. Сколько стоит один мяч?", answer: 8, answerLabel: "рублей", actions: [{ left: 32, op: ":", right: 4, result: 8 }] },
    { id: 727, text: "Газета стоит 3 рубля. Сколько стоят 4 газеты?", answer: 12, answerLabel: "рублей", actions: [{ left: 3, op: "·", right: 4, result: 12 }] },
    { id: 728, text: "1 метр ткани стоит 8 рублей. Сколько метров ткани можно купить на 40 рублей?", answer: 5, answerLabel: "метров", actions: [{ left: 40, op: ":", right: 8, result: 5 }] },
    { id: 729, text: "6 одинаковых гвоздик стоят 42 рубля. Сколько стоит одна гвоздика?", answer: 7, answerLabel: "рублей", actions: [{ left: 42, op: ":", right: 6, result: 7 }] },
    { id: 730, text: "Килограмм конфет стоит 9 рублей. Сколько килограммов конфет можно купить на 63 рубля?", answer: 7, answerLabel: "кг", actions: [{ left: 63, op: ":", right: 9, result: 7 }] },
    { id: 731, text: "Журнал стоит 12 рублей. Сколько стоят 3 журнала?", answer: 36, answerLabel: "рублей", actions: [{ left: 12, op: "·", right: 3, result: 36 }] },
    { id: 732, text: "7 одинаковых ножниц стоят 49 рублей. Сколько стоят одни ножницы?", answer: 7, answerLabel: "рублей", actions: [{ left: 49, op: ":", right: 7, result: 7 }] },
    { id: 733, text: "Кисточка стоит 5 рублей. Сколько кисточек можно купить на 20 рублей?", answer: 4, answerLabel: "кисточки", actions: [{ left: 20, op: ":", right: 5, result: 4 }] },
    { id: 734, text: "Пуговица стоит 4 рубля. Сколько стоят 5 пуговиц?", answer: 20, answerLabel: "рублей", actions: [{ left: 4, op: "·", right: 5, result: 20 }] },
    { id: 735, text: "6 одинаковых книг стоят 72 рубля. Сколько стоит одна книга?", answer: 12, answerLabel: "рублей", actions: [{ left: 72, op: ":", right: 6, result: 12 }] },
    { id: 736, text: "Пара носков стоит 5 рублей. Сколько пар носков можно купить на 35 рублей?", answer: 7, answerLabel: "пар", actions: [{ left: 35, op: ":", right: 5, result: 7 }] },
    { id: 737, text: "Булавка стоит 2 рубля. Сколько рублей стоят 8 булавок?", answer: 16, answerLabel: "рублей", actions: [{ left: 2, op: "·", right: 8, result: 16 }] },
    { id: 738, text: "10 одинаковых ластиков стоят 20 рублей. Сколько стоит один ластик?", answer: 2, answerLabel: "рубля", actions: [{ left: 20, op: ":", right: 10, result: 2 }] },
    { id: 739, text: "Обруч для волос стоит 5 рублей. Сколько обручей можно купить на 25 рублей?", answer: 5, answerLabel: "обручей", actions: [{ left: 25, op: ":", right: 5, result: 5 }] },
    { id: 740, text: "4 открытки стоят 16 рублей. Сколько стоит одна открытка?", answer: 4, answerLabel: "рубля", actions: [{ left: 16, op: ":", right: 4, result: 4 }] },
    { id: 741, text: "Тюбик пасты стоит 3 рубля. Сколько тюбиков пасты можно купить на 27 рублей?", answer: 9, answerLabel: "тюбиков", actions: [{ left: 27, op: ":", right: 3, result: 9 }] },
    { id: 742, text: "Календарь стоит 4 рубля. Сколько рублей стоят 7 календарей?", answer: 28, answerLabel: "рублей", actions: [{ left: 4, op: "·", right: 7, result: 28 }] },
    { id: 743, text: "5 билетов на концерт стоят 45 рублей. Сколько стоит один билет?", answer: 9, answerLabel: "рублей", actions: [{ left: 45, op: ":", right: 5, result: 9 }] },
    { id: 744, text: "Свечка стоит 2 рубля. Сколько свечек можно купить на 14 рублей?", answer: 7, answerLabel: "свечек", actions: [{ left: 14, op: ":", right: 2, result: 7 }] },
    { id: 745, text: "Булочка стоит 4 рубля. Сколько рублей стоят 5 таких булочек?", answer: 20, answerLabel: "рублей", actions: [{ left: 4, op: "·", right: 5, result: 20 }] },
    { id: 746, text: "Брошь стоит 8 рублей. Сколько стоят 3 броши?", answer: 24, answerLabel: "рубля", actions: [{ left: 8, op: "·", right: 3, result: 24 }] },
    { id: 747, text: "У Наташи 6 монет по 10 рублей. Сколько денег у девочки?", answer: 60, answerLabel: "рублей", actions: [{ left: 6, op: "·", right: 10, result: 60 }] },
    { id: 748, text: "4 одинаковых кресла стоят 280 рублей. Сколько стоит одно кресло?", answer: 70, answerLabel: "рублей", actions: [{ left: 280, op: ":", right: 4, result: 70 }] },
    { id: 749, text: "Цена тетради 4 рубля. Сколько стоят 8 таких тетрадей?", answer: 32, answerLabel: "рубля", actions: [{ left: 4, op: "·", right: 8, result: 32 }] },
    { id: 750, text: "7 одинаковых пуговиц стоят 42 рубля. Сколько стоит одна пуговица?", answer: 6, answerLabel: "рублей", actions: [{ left: 42, op: ":", right: 7, result: 6 }] }
];