(function () {
    function renderCheatsheet() {
        var container = document.getElementById('cheatsheet-container');
        if (!container) return;
        
        // Защита от повторной отрисовки
        if (container.dataset.rendered === '1') return; 
        container.dataset.rendered = '1';

        var html = `
        <style>
            /* --- Общая сетка (всё друг под другом) --- */
            .cheat-wrapper { display: flex; flex-direction: column; gap: 20px; }
            .cheat-row-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }
            .cheat-row-4col { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
            @media (max-width: 900px) {
                .cheat-row-2col, .cheat-row-4col { grid-template-columns: 1fr; }
            }

            /* --- Базовые стили --- */
            .cheat-section {
                background: #ffffff; border: 3px solid #2a9d8f; border-radius: 20px;
                padding: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); box-sizing: border-box;
            }
            .cheat-title {
                font-size: 1.2rem; font-weight: 800; color: #b34700; margin-bottom: 10px;
                display: flex; align-items: center; gap: 8px; font-family: 'Comfortaa', sans-serif;
            }

            /* --- Таблица умножения --- */
            .cheat-mult .mult-table { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
            .cheat-mult .mult-cell {
                background: #eaf6fd; border-radius: 8px; padding: 8px 5px; text-align: center;
                font-size: 0.9rem; font-weight: 600; color: #1e4a6b; line-height: 1.4;
            }
            .cheat-mult .mult-cell b { color: #b34700; }

            /* --- Меры величин --- */
            .measure-list { display: flex; flex-direction: column; gap: 8px; font-size: 1rem; color: #1e4a6b; font-weight: 600; }
            .measure-list span { color: #e67e22; font-weight: 800; }

            /* --- Доли --- */
            .fractions-container { display: flex; flex-direction: column; align-items: center; gap: 15px; margin-top: 10px; }
            .frac-bars-wrap { display: flex; flex-direction: column; gap: 6px; width: 100%; }
            .frac-bar-svg { width: 100%; height: 32px; }
            .frac-bar-svg rect { fill: #fff3bf; stroke: #1e4a6b; stroke-width: 2; }
            .frac-bar-svg .filled { fill: #a8e6a3; }
            .frac-bar-svg text { font-family: 'Comfortaa', sans-serif; font-weight: 800; font-size: 14px; fill: #1e4a6b; text-anchor: middle; dominant-baseline: central; }
            .frac-circles-wrap { display: flex; justify-content: space-around; width: 100%; margin-top: 10px; }
            .frac-circle-item { display: flex; flex-direction: column; align-items: center; gap: 5px; }
            .frac-circle-svg { width: 60px; height: 60px; }
            .frac-circle-svg circle { fill: #fff3bf; stroke: #1e4a6b; stroke-width: 2.5; }
            .frac-circle-svg .filled { fill: #a8e6a3; stroke: #1e4a6b; stroke-width: 2.5; }
            .frac-circle-svg text { font-family: 'Comfortaa', sans-serif; font-weight: 800; font-size: 14px; fill: #1e4a6b; text-anchor: middle; dominant-baseline: central; }

            /* --- Уравнения --- */
            .equations-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-family: 'Comfortaa', sans-serif; }
            .eq-box { background: #f0faf6; border: 2px dashed #2a9d8f; border-radius: 12px; padding: 12px; font-size: 1.1rem; line-height: 1.5; color: #1e4a6b; }
            .eq-box strong { color: #b34700; font-size: 1.2rem; }
            .eq-line { display: block; border-top: 2px solid #1e4a6b; padding-top: 4px; margin-top: 4px; }

            /* --- Карточки действий --- */
            .cheat-actions-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; align-items: stretch; }
            .comp-box { background: #f0faf6; border: 2px dashed #2a9d8f; border-radius: 12px; padding: 12px 10px; text-align: center; display: flex; flex-direction: column; justify-content: space-between; align-items: center; height: 130px; box-sizing: border-box; }
            .comp-label { font-size: 0.8rem; color: #7a5a00; text-transform: uppercase; line-height: 1.2; margin-bottom: 5px; font-weight: 700; }
            .comp-row { display: flex; justify-content: center; align-items: center; gap: 4px; font-size: 1.2rem; white-space: nowrap; width: 100%; }
            .comp-num { font-size: 1.5rem; font-weight: 800; color: #1e4a6b; }
            .comp-sign { font-size: 1.3rem; font-weight: 800; color: #e67e22; }
            .comp-answer { color: #2a9d8f; }

            /* --- Сравнение --- */
            .compare-row { display: flex; justify-content: center; align-items: center; gap: 20px; font-size: 1.5rem; font-weight: 800; color: #1e4a6b; padding: 5px; }
            .compare-row span { color: #d35400; font-size: 2rem; }
        </style>

        <div class="cheat-wrapper">
            
            <!-- РЯД 1: Таблица умножения и Меры -->
            <div class="cheat-row-2col">
                <div class="cheat-section cheat-mult">
                    <div class="cheat-title">✖️ Таблица умножения</div>
                    <div class="mult-table">
                        <div class="mult-cell"><b>2</b>×2=4<br><b>2</b>×3=6<br><b>2</b>×4=8<br><b>2</b>×5=10<br><b>2</b>×6=12<br><b>2</b>×7=14<br><b>2</b>×8=16<br><b>2</b>×9=18</div>
                        <div class="mult-cell"><b>3</b>×2=6<br><b>3</b>×3=9<br><b>3</b>×4=12<br><b>3</b>×5=15<br><b>3</b>×6=18<br><b>3</b>×7=21<br><b>3</b>×8=24<br><b>3</b>×9=27</div>
                        <div class="mult-cell"><b>4</b>×2=8<br><b>4</b>×3=12<br><b>4</b>×4=16<br><b>4</b>×5=20<br><b>4</b>×6=24<br><b>4</b>×7=28<br><b>4</b>×8=32<br><b>4</b>×9=36</div>
                        <div class="mult-cell"><b>5</b>×2=10<br><b>5</b>×3=15<br><b>5</b>×4=20<br><b>5</b>×5=25<br><b>5</b>×6=30<br><b>5</b>×7=35<br><b>5</b>×8=40<br><b>5</b>×9=45</div>
                        <div class="mult-cell"><b>6</b>×2=12<br><b>6</b>×3=18<br><b>6</b>×4=24<br><b>6</b>×5=30<br><b>6</b>×6=36<br><b>6</b>×7=42<br><b>6</b>×8=48<br><b>6</b>×9=54</div>
                        <div class="mult-cell"><b>7</b>×2=14<br><b>7</b>×3=21<br><b>7</b>×4=28<br><b>7</b>×5=35<br><b>7</b>×6=42<br><b>7</b>×7=49<br><b>7</b>×8=56<br><b>7</b>×9=63</div>
                        <div class="mult-cell"><b>8</b>×2=16<br><b>8</b>×3=24<br><b>8</b>×4=32<br><b>8</b>×5=40<br><b>8</b>×6=48<br><b>8</b>×7=56<br><b>8</b>×8=64<br><b>8</b>×9=72</div>
                        <div class="mult-cell"><b>9</b>×2=18<br><b>9</b>×3=27<br><b>9</b>×4=36<br><b>9</b>×5=45<br><b>9</b>×6=54<br><b>9</b>×7=63<br><b>9</b>×8=72<br><b>9</b>×9=81</div>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 20px;">
                    <div class="cheat-section">
                        <div class="cheat-title">📏 Мера длины</div>
                        <div class="measure-list">
                            <div>1 см = <span>10 мм</span></div>
                            <div>1 дм = <span>10 см</span> = 100 мм</div>
                            <div>1 м = <span>10 дм</span> = 100 см</div>
                            <div>1 км = <span>1000 м</span></div>
                        </div>
                    </div>
                    <div class="cheat-section">
                        <div class="cheat-title">⚖️ Мера массы</div>
                        <div class="measure-list">
                            <div>1 кг = <span>1000 г</span></div>
                            <div>1 ц = <span>100 кг</span></div>
                            <div>1 т = <span>10 ц</span> = 1000 кг</div>
                        </div>
                    </div>
                    <div class="cheat-section">
                        <div class="cheat-title">⏱️ Мера времени</div>
                        <div class="measure-list">
                            <div>1 мин = <span>60 сек</span></div>
                            <div>1 час = <span>60 мин</span> = 3600 сек</div>
                            <div>1 сутки = <span>24 часа</span></div>
                            <div>1 год = <span>12 мес</span> = 365 дней</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- РЯД 2: Доли и Уравнения -->
            <div class="cheat-row-2col">
                <div class="cheat-section">
                    <div class="cheat-title">🍕 Доли</div>
                    <div class="fractions-container">
                        <div class="frac-bars-wrap">
                            <svg class="frac-bar-svg" viewBox="0 0 100 20" preserveAspectRatio="none">
                                <rect x="0" y="0" width="100" height="20" class="filled"/>
                                <text x="50" y="10">1</text>
                            </svg>
                            <svg class="frac-bar-svg" viewBox="0 0 100 20" preserveAspectRatio="none">
                                <rect x="0" y="0" width="50" height="20" class="filled"/>
                                <rect x="50" y="0" width="50" height="20"/>
                                <text x="25" y="10">1/2</text>
                            </svg>
                            <svg class="frac-bar-svg" viewBox="0 0 100 20" preserveAspectRatio="none">
                                <rect x="0" y="0" width="25" height="20" class="filled"/>
                                <rect x="25" y="0" width="25" height="20"/>
                                <rect x="50" y="0" width="25" height="20"/>
                                <rect x="75" y="0" width="25" height="20"/>
                                <text x="12.5" y="10">1/4</text>
                            </svg>
                            <svg class="frac-bar-svg" viewBox="0 0 100 20" preserveAspectRatio="none">
                                <rect x="0" y="0" width="12.5" height="20" class="filled"/>
                                <rect x="12.5" y="0" width="12.5" height="20"/>
                                <rect x="25" y="0" width="12.5" height="20"/>
                                <rect x="37.5" y="0" width="12.5" height="20"/>
                                <rect x="50" y="0" width="12.5" height="20"/>
                                <rect x="62.5" y="0" width="12.5" height="20"/>
                                <rect x="75" y="0" width="12.5" height="20"/>
                                <rect x="87.5" y="0" width="12.5" height="20"/>
                                <text x="6.25" y="10">1/8</text>
                            </svg>
                        </div>
                        <div class="frac-circles-wrap">
                            <div class="frac-circle-item">
                                <svg class="frac-circle-svg" viewBox="0 0 40 40">
                                    <circle cx="20" cy="20" r="18" class="filled"/>
                                </svg>
                            </div>
                            <div class="frac-circle-item">
                                <svg class="frac-circle-svg" viewBox="0 0 40 40">
                                    <circle cx="20" cy="20" r="18"/>
                                    <path d="M20,20 L20,2 A18,18 0 0,1 20,38 Z" class="filled"/>
                                    <text x="20" y="20">1/2</text>
                                </svg>
                            </div>
                            <div class="frac-circle-item">
                                <svg class="frac-circle-svg" viewBox="0 0 40 40">
                                    <circle cx="20" cy="20" r="18"/>
                                    <path d="M20,20 L20,2 A18,18 0 0,1 38,20 Z" class="filled"/>
                                    <text x="20" y="20">1/4</text>
                                </svg>
                            </div>
                            <div class="frac-circle-item">
                                <svg class="frac-circle-svg" viewBox="0 0 40 40">
                                    <circle cx="20" cy="20" r="18"/>
                                    <path d="M20,20 L20,2 A18,18 0 0,1 32.7,7.3 Z" class="filled"/>
                                    <text x="20" y="20">1/8</text>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cheat-section">
                    <div class="cheat-title">⚖️ Уравнения</div>
                    <div class="equations-grid">
                        <div class="eq-box">
                            6 · x = 36<br>
                            x = 36 : 6<br>
                            <strong>x = 6</strong>
                            <span class="eq-line">6 · 6 = 36</span>
                        </div>
                        <div class="eq-box">
                            24 : x = 6<br>
                            x = 24 : 6<br>
                            <strong>x = 4</strong>
                            <span class="eq-line">24 : 4 = 6</span>
                        </div>
                        <div class="eq-box">
                            x · 2 = 36<br>
                            x = 36 : 2<br>
                            <strong>x = 18</strong>
                            <span class="eq-line">18 · 2 = 36</span>
                        </div>
                        <div class="eq-box">
                            x : 2 = 12<br>
                            x = 12 · 2<br>
                            <strong>x = 24</strong>
                            <span class="eq-line">24 : 2 = 12</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- РЯД 3: Карточки действий -->
            <div class="cheat-row-4col">
                <div class="cheat-section">
                    <div class="cheat-title" style="font-size: 1rem;">➕ Сложение</div>
                    <div class="comp-box">
                        <div class="comp-label">Слагаемое + Слагаемое = Сумма</div>
                        <div class="comp-row"><span class="comp-num">12</span><span class="comp-sign">+</span><span class="comp-num">8</span><span class="comp-sign">=</span><span class="comp-num comp-answer">20</span></div>
                    </div>
                </div>
                <div class="cheat-section">
                    <div class="cheat-title" style="font-size: 1rem;">➖ Вычитание</div>
                    <div class="comp-box">
                        <div class="comp-label">Уменьшаемое − Вычитаемое = Разность</div>
                        <div class="comp-row"><span class="comp-num">15</span><span class="comp-sign">−</span><span class="comp-num">7</span><span class="comp-sign">=</span><span class="comp-num comp-answer">8</span></div>
                    </div>
                </div>
                <div class="cheat-section">
                    <div class="cheat-title" style="font-size: 1rem;">✖️ Умножение</div>
                    <div class="comp-box">
                        <div class="comp-label">Множитель × Множитель = Произведение</div>
                        <div class="comp-row"><span class="comp-num">4</span><span class="comp-sign">×</span><span class="comp-num">6</span><span class="comp-sign">=</span><span class="comp-num comp-answer">24</span></div>
                    </div>
                </div>
                <div class="cheat-section">
                    <div class="cheat-title" style="font-size: 1rem;">➗ Деление</div>
                    <div class="comp-box">
                        <div class="comp-label">Делимое : Делитель = Частное</div>
                        <div class="comp-row"><span class="comp-num">18</span><span class="comp-sign">:</span><span class="comp-num">3</span><span class="comp-sign">=</span><span class="comp-num comp-answer">6</span></div>
                    </div>
                </div>
            </div>

            <!-- РЯД 4: Периметр и Сравнение -->
            <div class="cheat-row-2col">
                <div class="cheat-section">
                    <div class="cheat-title">📐 Периметр и Площадь</div>
                    <div class="measure-list">
                        <div>Прямоугольник:</div>
                        <div><span>P = (a + b) × 2</span></div>
                        <div><span>S = a × b</span></div>
                        <div>Квадрат:</div>
                        <div><span>P = a × 4</span></div>
                        <div><span>S = a × a</span></div>
                    </div>
                </div>
                <div class="cheat-section">
                    <div class="cheat-title">⚖️ Сравнение</div>
                    <div class="compare-row"><span>&gt;</span> больше</div>
                    <div class="compare-row"><span>=</span> равно</div>
                    <div class="compare-row"><span>&lt;</span> меньше</div>
                </div>
            </div>

        </div>
        `;

        container.innerHTML = html;
    }

    window.renderCheatsheet = renderCheatsheet;

    // Надёжный запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderCheatsheet);
    } else {
        renderCheatsheet();
    }
    
    // Страховка на случай поздней подгрузки
    window.addEventListener('load', renderCheatsheet);
})();