window.BANKS = window.BANKS || {};
window.BANKS["Зачёт 13"] = [
    // --- Вариант 1 ---
    { id: 1364, variant: 1, text: "В магазин привезли 150 кг картофеля. До обеда продали две пятых всего картофеля. Сколько килограммов картофеля продали?", answer: 60, answerLabel: "кг", actions: [{ left: 150, op: ":", right: 5, result: 30 }, { left: 30, op: "·", right: 2, result: 60 }] },
    { id: 1365, variant: 1, text: "В соревновании участвовали 36 девочек. Они составляли две пятых всех участников. Сколько всего детей участвовало в соревновании?", answer: 90, answerLabel: "детей", actions: [{ left: 36, op: ":", right: 2, result: 18 }, { left: 18, op: "·", right: 5, result: 90 }] },

    // --- Вариант 2 ---
    { id: 1366, variant: 2, text: "Из 125 посаженных вдоль улицы деревьев три пятых — липы. Сколько лип посадили?", answer: 75, answerLabel: "лип", actions: [{ left: 125, op: ":", right: 5, result: 25 }, { left: 25, op: "·", right: 3, result: 75 }] },
    { id: 1367, variant: 2, text: "Мальчик прочитал три четвертых книги, что составило 78 страниц. Сколько всего страниц в книге?", answer: 104, answerLabel: "страницы", actions: [{ left: 78, op: ":", right: 3, result: 26 }, { left: 26, op: "·", right: 4, result: 104 }] },

    // --- Вариант 3 ---
    { id: 1368, variant: 3, text: "Туристы проехали 360 км, из них три восьмых — на поезде. Сколько километров они проехали на поезде?", answer: 135, answerLabel: "км", actions: [{ left: 360, op: ":", right: 8, result: 45 }, { left: 45, op: "·", right: 3, result: 135 }] },
    { id: 1369, variant: 3, text: "Автобус проехал 120 км, что составило две третьих всего пути. Какова длина всего пути?", answer: 180, answerLabel: "км", actions: [{ left: 120, op: ":", right: 2, result: 60 }, { left: 60, op: "·", right: 3, result: 180 }] },

    // --- Вариант 4 ---
    { id: 1370, variant: 4, text: "На полке 40 книг. Из них две пятых — сказки. Сколько книг со сказками?", answer: 16, answerLabel: "книг", actions: [{ left: 40, op: ":", right: 5, result: 8 }, { left: 8, op: "·", right: 2, result: 16 }] },
    { id: 1371, variant: 4, text: "Три четвертых задуманного числа равно 15. Чему равно задуманное число?", answer: 20, answerLabel: "", actions: [{ left: 15, op: ":", right: 3, result: 5 }, { left: 5, op: "·", right: 4, result: 20 }] }
];