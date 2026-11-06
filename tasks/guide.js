window.GUIDE_DATA = [
    {
        title: "Таблица умножения (Пифагора)",
        content: `
            <div class="guide-table-wrap">
                <table class="pifagor-table">
                    <thead>
                        <tr>
                            <th class="corner-cell">×</th>
                            <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><th>1</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td></tr>
                        <tr><th>2</th><td>2</td><td>4</td><td>6</td><td>8</td><td>10</td><td>12</td><td>14</td><td>16</td><td>18</td><td>20</td></tr>
                        <tr><th>3</th><td>3</td><td>6</td><td>9</td><td>12</td><td>15</td><td>18</td><td>21</td><td>24</td><td>27</td><td>30</td></tr>
                        <tr><th>4</th><td>4</td><td>8</td><td>12</td><td>16</td><td>20</td><td>24</td><td>28</td><td>32</td><td>36</td><td>40</td></tr>
                        <tr><th>5</th><td>5</td><td>10</td><td>15</td><td>20</td><td>25</td><td>30</td><td>35</td><td>40</td><td>45</td><td>50</td></tr>
                        <tr><th>6</th><td>6</td><td>12</td><td>18</td><td>24</td><td>30</td><td>36</td><td>42</td><td>48</td><td>54</td><td>60</td></tr>
                        <tr><th>7</th><td>7</td><td>14</td><td>21</td><td>28</td><td>35</td><td>42</td><td>49</td><td>56</td><td>63</td><td>70</td></tr>
                        <tr><th>8</th><td>8</td><td>16</td><td>24</td><td>32</td><td>40</td><td>48</td><td>56</td><td>64</td><td>72</td><td>80</td></tr>
                        <tr><th>9</th><td>9</td><td>18</td><td>27</td><td>36</td><td>45</td><td>54</td><td>63</td><td>72</td><td>81</td><td>90</td></tr>
                        <tr><th>10</th><td>10</td><td>20</td><td>30</td><td>40</td><td>50</td><td>60</td><td>70</td><td>80</td><td>90</td><td>100</td></tr>
                    </tbody>
                </table>
            </div>
        `
    },
    {
        title: "Названия чисел при действиях",
        content: `
            <div class="actions-grid">
                <!-- Сложение -->
                <div class="action-card card-add">
                    <div class="action-formula">
                        <span class="term">5</span> 
                        <span class="sign">+</span> 
                        <span class="term">3</span> 
                        <span class="sign">=</span> 
                        <span class="result">8</span>
                    </div>
                    <div class="action-label-line">
                        слагаемое + слагаемое = сумма
                    </div>
                </div>

                <!-- Вычитание -->
                <div class="action-card card-sub">
                    <div class="action-formula">
                        <span class="term">8</span> 
                        <span class="sign">−</span> 
                        <span class="term">3</span> 
                        <span class="sign">=</span> 
                        <span class="result">5</span>
                    </div>
                    <div class="action-label-line">
                        уменьшаемое − вычитаемое = разность
                    </div>
                </div>

                <!-- Умножение -->
                <div class="action-card card-mul">
                    <div class="action-formula">
                        <span class="term">2</span> 
                        <span class="sign">×</span> 
                        <span class="term">4</span> 
                        <span class="sign">=</span> 
                        <span class="result">8</span>
                    </div>
                    <div class="action-label-line">
                        множитель × множитель = произведение
                    </div>
                </div>

                <!-- Деление -->
                <div class="action-card card-div">
                    <div class="action-formula">
                        <span class="term">8</span> 
                        <span class="sign">:</span> 
                        <span class="term">2</span> 
                        <span class="sign">=</span> 
                        <span class="result">4</span>
                    </div>
                    <div class="action-label-line">
                        делимое : делитель = частное
                    </div>
                </div>
            </div>
        `
    },
    {
        title: "Классы и разряды чисел",
        content: `
            <div class="ranks-wrap">
                <div class="ranks-header-text">
                    Цифры в записи многозначных чисел разбивают справа налево на группы по три цифры в каждой. Эти группы называют <b>классами</b>.<br>
                    <b>Разряд числа</b> — это позиция (место) цифры в записи числа.
                </div>

                <!-- ВЕРХНИЕ СКОБКИ И КЛАССЫ -->
                <div class="ranks-brackets">
                    <!-- 4 класс -->
                    <div class="bracket-group">
                        <div class="bracket-title">IV<br>Класс<br>миллиардов</div>
                        <svg viewBox="0 0 100 20" class="curly-svg" preserveAspectRatio="none">
                            <path d="M 5 15 Q 25 15, 25 5 Q 25 15, 50 15 Q 75 15, 75 5 Q 75 15, 95 15" fill="none" stroke="#2a9d8f" stroke-width="4" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <!-- 3 класс -->
                    <div class="bracket-group">
                        <div class="bracket-title">III<br>Класс<br>миллионов</div>
                        <svg viewBox="0 0 100 20" class="curly-svg" preserveAspectRatio="none">
                            <path d="M 5 15 Q 25 15, 25 5 Q 25 15, 50 15 Q 75 15, 75 5 Q 75 15, 95 15" fill="none" stroke="#2a9d8f" stroke-width="4" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <!-- 2 класс -->
                    <div class="bracket-group">
                        <div class="bracket-title">II<br>Класс<br>тысяч</div>
                        <svg viewBox="0 0 100 20" class="curly-svg" preserveAspectRatio="none">
                            <path d="M 5 15 Q 25 15, 25 5 Q 25 15, 50 15 Q 75 15, 75 5 Q 75 15, 95 15" fill="none" stroke="#2a9d8f" stroke-width="4" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <!-- 1 класс -->
                    <div class="bracket-group">
                        <div class="bracket-title">I<br>Класс<br>единиц</div>
                        <svg viewBox="0 0 100 20" class="curly-svg" preserveAspectRatio="none">
                            <path d="M 5 15 Q 25 15, 25 5 Q 25 15, 50 15 Q 75 15, 75 5 Q 75 15, 95 15" fill="none" stroke="#2a9d8f" stroke-width="4" stroke-linecap="round"/>
                        </svg>
                    </div>
                </div>

                <!-- САМИ ЦИФРЫ И РАЗРЯДЫ -->
                <div class="ranks-grid">
                    <!-- 4 КЛАСС -->
                    <div class="digit-col c-teal"><div class="big-digit">1</div><div class="vert-rank">12 разряд</div><div class="horiz-rank">сотни</div></div>
                    <div class="digit-col c-blue"><div class="big-digit">4</div><div class="vert-rank">11 разряд</div><div class="horiz-rank">десятки</div></div>
                    <div class="digit-col c-orange"><div class="big-digit">8</div><div class="vert-rank">10 разряд</div><div class="horiz-rank">единицы</div></div>
                    
                    <!-- 3 КЛАСС -->
                    <div class="digit-col c-teal"><div class="big-digit">9</div><div class="vert-rank">9 разряд</div><div class="horiz-rank">сотни</div></div>
                    <div class="digit-col c-blue"><div class="big-digit">5</div><div class="vert-rank">8 разряд</div><div class="horiz-rank">десятки</div></div>
                    <div class="digit-col c-orange"><div class="big-digit">1</div><div class="vert-rank">7 разряд</div><div class="horiz-rank">единицы</div></div>
                    
                    <!-- 2 КЛАСС -->
                    <div class="digit-col c-teal"><div class="big-digit">7</div><div class="vert-rank">6 разряд</div><div class="horiz-rank">сотни</div></div>
                    <div class="digit-col c-blue"><div class="big-digit">8</div><div class="vert-rank">5 разряд</div><div class="horiz-rank">десятки</div></div>
                    <div class="digit-col c-orange"><div class="big-digit">4</div><div class="vert-rank">4 разряд</div><div class="horiz-rank">единицы</div></div>
                    
                    <!-- 1 КЛАСС -->
                    <div class="digit-col c-teal"><div class="big-digit">2</div><div class="vert-rank">3 разряд</div><div class="horiz-rank">сотни</div></div>
                    <div class="digit-col c-blue"><div class="big-digit">9</div><div class="vert-rank">2 разряд</div><div class="horiz-rank">десятки</div></div>
                    <div class="digit-col c-orange"><div class="big-digit">6</div><div class="vert-rank">1 разряд</div><div class="horiz-rank">единицы</div></div>
                </div>

                <div class="ranks-footer">148 миллиардов 951 миллион 784 тысячи 296</div>
            </div>
        `
    }      ,
    {
        title: "Геометрические фигуры",
        content: `
            <div class="shapes-wrap">
                <div class="shapes-row">
                    <div class="shape-item">
                        <div class="shape-label">четырехугольники</div>
                        <svg viewBox="0 0 100 100" class="shape-svg"><polygon points="10,20 90,10 80,90 20,80" fill="none" stroke="#1e4a6b" stroke-width="3"/></svg>
                    </div>
                    <div class="shape-item">
                        <div class="shape-label">прямоугольники</div>
                        <svg viewBox="0 0 100 100" class="shape-svg"><rect x="20" y="10" width="60" height="80" fill="none" stroke="#1e4a6b" stroke-width="3"/></svg>
                    </div>
                    <div class="shape-item">
                        <div class="shape-label">квадрат</div>
                        <svg viewBox="0 0 100 100" class="shape-svg"><rect x="20" y="20" width="60" height="60" fill="none" stroke="#1e4a6b" stroke-width="3"/></svg>
                    </div>
                    <div class="shape-item">
                        <div class="shape-label">треугольники</div>
                        <svg viewBox="0 0 100 100" class="shape-svg"><polygon points="10,10 80,90 10,90" fill="none" stroke="#1e4a6b" stroke-width="3"/></svg>
                    </div>
                    <div class="shape-item">
                        <div class="shape-label">многоугольники</div>
                        <svg viewBox="0 0 100 100" class="shape-svg"><polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="#1e4a6b" stroke-width="3"/></svg>
                    </div>
                    <div class="shape-item">
                        <div class="shape-label">круг</div>
                        <svg viewBox="0 0 100 100" class="shape-svg"><circle cx="50" cy="50" r="40" fill="none" stroke="#1e4a6b" stroke-width="3"/></svg>
                    </div>
                </div>
            </div>
        `
    },
    
    {
        title: "Задачи на движение",
        content: `
            <p><b>Скорость (V)</b> — это расстояние, которое объект проходит за единицу времени.</p>
            <p><b>Время (t)</b> — это время, затраченное на весь путь.</p>
            <p><b>Расстояние (S)</b> — это путь, который прошёл объект.</p>

            <div class="formulas-container">
                <!-- Карточка 1: Расстояние -->
                <div class="formula-card card-s">
                    <div class="formula-icon">🚗</div>
                    <div class="formula-title">Расстояние (S)</div>
                    <div class="formula-main">S = V × t</div>
                    <div class="formula-hint">Скорость умножить на время</div>
                </div>

                <!-- Карточка 2: Скорость -->
                <div class="formula-card card-v">
                    <div class="formula-icon">💨</div>
                    <div class="formula-title">Скорость (V)</div>
                    <div class="formula-main">V = S ÷ t</div>
                    <div class="formula-hint">Расстояние разделить на время</div>
                </div>

                <!-- Карточка 3: Время -->
                <div class="formula-card card-t">
                    <div class="formula-icon">⏱️</div>
                    <div class="formula-title">Время (t)</div>
                    <div class="formula-main">t = S ÷ V</div>
                    <div class="formula-hint">Расстояние разделить на скорость</div>
                </div>
            </div>
        `
    }
];