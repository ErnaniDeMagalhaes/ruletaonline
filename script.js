document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('tablero');
    const ruedaContainer = document.getElementById('rueda');
    const btnGirar = document.getElementById('btnGirar');
    const btnLimpiar = document.getElementById('btnLimpiar');
    const chips = document.querySelectorAll('.chip');

    // --- ESTADO DEL JUEGO Y SALDO ---
    let balance = 1000;          
    let fichaSeleccionada = 5;
    const apuestasActuales = {};

    let balanceDisplay = document.querySelector('.user-balance') || document.getElementById('balance') || document.getElementById('saldo');
    if (!balanceDisplay) {
        balanceDisplay = document.createElement('div');
        balanceDisplay.className = 'user-balance';
        balanceDisplay.style.cssText = "font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #fff;";
        balanceDisplay.innerText = `Saldo: $${balance}`;
        if (grid && grid.parentNode) {
            grid.parentNode.insertBefore(balanceDisplay, grid);
        }
    }

    function actualizarSaldoUI() {
        if (balanceDisplay) {
            balanceDisplay.innerText = `Saldo: $${balance}`;
        }
    }
    actualizarSaldoUI();

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('selected'));
            chip.classList.add('selected');
            fichaSeleccionada = parseInt(chip.getAttribute('data-value')) || 5;
        });
    });

    const ruedaEuropea = [
        0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 
        23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
    ];
    const numerosCelestes = [1, 3, 5, 7, 9, 12, 14, 18, 21, 16, 19, 23, 27, 25, 30, 32, 36, 34];

    const frasesFutboleras = [
        "¡Cabeza, corazón y huevos! ¡Hay que seguir!",
        "¡Vamos a buscar el partido!",
        "¡No bajemos los brazos, dale que se puede!",
        "¡Hasta la última pelota!",
        "¡Estamos vivos!",
        "¡Vamos que se puede!",
        "¡A darlo vuelta!",
        "¡No se negocia la actitud!",
        "¡Hay que dejarlo todo!",
        "¡El partido está abierto!",
        "¡A buscar la victoria!"
    ];

    // Dibujar Rueda
    const radio = 120;
    const gradosPorCasilla = 360 / ruedaEuropea.length;
    ruedaEuropea.forEach((num, index) => {
        const angulo = index * gradosPorCasilla;
        const rad = (angulo - 90) * (Math.PI / 180);
        const x = Math.round(radio * Math.cos(rad));
        const y = Math.round(radio * Math.sin(rad));

        const numDiv = document.createElement('div');
        numDiv.className = 'wheel-number';
        numDiv.innerText = num;
        if (num === 0) numDiv.classList.add('green');
        else if (numerosCelestes.includes(num)) numDiv.classList.add('celeste');
        else numDiv.classList.add('blanco');

        numDiv.style.left = `calc(50% + ${x}px - 12px)`;
        numDiv.style.top = `calc(50% + ${y}px - 12px)`;
        ruedaContainer.appendChild(numDiv);
    });

    // --- CONTENEDOR DE ANUNCIO SEGURO (Sin desbordes laterales) ---
    const wheelContainerParent = ruedaContainer.parentNode;
    const anuncioBox = document.createElement('div');
    anuncioBox.id = 'anuncioResultado';
    anuncioBox.style.cssText = `
        width: 100%;
        max-width: 100%;
        height: 52px;
        min-height: 52px;
        max-height: 52px;
        background-color: rgba(27, 38, 59, 0.98);
        border: 2px solid #74acdf;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 4px 10px;
        margin-bottom: 15px;
        font-size: 0.75rem;
        font-weight: bold;
        color: #ffffff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        box-sizing: border-box;
        overflow: hidden;
        flex-shrink: 0;
        flex-grow: 0;
    `;
    anuncioBox.innerHTML = "<div>¡Hacé tus apuestas y girá la ruleta!</div>";
    wheelContainerParent.insertBefore(anuncioBox, ruedaContainer);

    function mostrarAnuncioPantalla(linea1, linea2 = "", colorBorde = "#74acdf", colorTexto = "#ffffff") {
        anuncioBox.style.borderColor = colorBorde;
        anuncioBox.innerHTML = `
            <div style="color: ${colorTexto}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;">${linea1}</div>
            ${linea2 ? `<div style="color: #cbd5e1; font-size: 0.7rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; margin-top: 2px;">${linea2}</div>` : ''}
        `;
    }

    // --- CONSTRUCCIÓN DEL TABLERO ---
    const cellZero = document.createElement('div');
    cellZero.className = 'cell green';
    cellZero.innerText = '0';
    cellZero.dataset.tipo = 'numero';
    cellZero.dataset.valor = '0';
    configurarCeldaClick(cellZero);
    grid.appendChild(cellZero);

    const matrizNumeros = {};

    for (let col = 1; col <= 12; col++) {
        let gridCol = col + 1;
        let n1 = col * 3;     
        let n2 = (col * 3) - 1; 
        let n3 = (col * 3) - 2; 

        crearCeldaNum(n1, gridCol, 1);
        crearCeldaNum(n2, gridCol, 2);
        crearCeldaNum(n3, gridCol, 3);

        matrizNumeros[`${gridCol},1`] = n1;
        matrizNumeros[`${gridCol},2`] = n2;
        matrizNumeros[`${gridCol},3`] = n3;
    }

    function crearCeldaNum(numero, columna, fila) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.style.gridColumn = columna;
        cell.style.gridRow = fila;
        cell.innerText = numero;
        cell.dataset.tipo = 'numero';
        cell.dataset.valor = numero;

        if (numerosCelestes.includes(numero)) cell.classList.add('celeste');
        else cell.classList.add('blanco');

        configurarCeldaClick(cell);
        grid.appendChild(cell);
    }

    // --- CREAR CAPA OVERLAY ---
    const overlay = document.createElement('div');
    overlay.className = 'board-overlay';
    grid.style.position = 'relative'; 
    grid.appendChild(overlay);

    function crearPuntoApuesta(tipo, valores, col, row, claseCss) {
        const spot = document.createElement('div');
        spot.className = `bet-spot ${claseCss}`;
        spot.style.gridColumn = col;
        spot.style.gridRow = row;
        spot.dataset.tipo = tipo;
        spot.dataset.valor = valores;

        configurarCeldaClick(spot);
        overlay.appendChild(spot); 
    }

    for (let c = 2; c <= 12; c++) {
        for (let r = 1; r <= 3; r++) {
            let numA = matrizNumeros[`${c},${r}`];
            let numB = matrizNumeros[`${c+1},${r}`];
            if (numA !== undefined && numB !== undefined) {
                crearPuntoApuesta('split', `${numA},${numB}`, c + 1, r, 'split-v');
            }
        }
    }

    for (let c = 2; c <= 13; c++) {
        for (let r = 1; r <= 2; r++) {
            let numA = matrizNumeros[`${c},${r}`];
            let numB = matrizNumeros[`${c},${r+1}`];
            if (numA !== undefined && numB !== undefined) {
                crearPuntoApuesta('split', `${numA},${numB}`, c, r + 1, 'split-h');
            }
        }
    }

    for (let c = 2; c <= 12; c++) {
        for (let r = 1; r <= 2; r++) {
            let n1 = matrizNumeros[`${c},${r}`];
            let n2 = matrizNumeros[`${c+1},${r}`];
            let n3 = matrizNumeros[`${c},${r+1}`];
            let n4 = matrizNumeros[`${c+1},${r+1}`];
            if (n1 && n2 && n3 && n4) {
                crearPuntoApuesta('corner', `${n1},${n2},${n3},${n4}`, c + 1, r + 1, 'corner');
            }
        }
    }

    crearPuntoApuesta('split', `0,3`, 2, 1, 'zero-split');
    crearPuntoApuesta('split', `0,2`, 2, 2, 'zero-split');
    crearPuntoApuesta('split', `0,1`, 2, 3, 'zero-split');
    crearPuntoApuesta('corner', `0,2,3`, 2, 2, 'zero-corner');
    crearPuntoApuesta('corner', `0,1,2`, 2, 3, 'zero-corner');
    crearPuntoApuesta('corner', `0,1,2,3`, 2, 2, 'zero-corner');

    const docenas = [
        { texto: '1st 12', colStart: 2, colSpan: 4, valor: 1 },
        { texto: '2nd 12', colStart: 6, colSpan: 4, valor: 2 },
        { texto: '3rd 12', colStart: 10, colSpan: 4, valor: 3 }
    ];
    
    docenas.forEach(d => {
        const docCell = document.createElement('div');
        docCell.className = 'cell dozen-label';
        docCell.style.gridColumn = `${d.colStart} / span ${d.colSpan}`;
        docCell.style.gridRow = 4;
        docCell.innerText = d.texto;
        docCell.dataset.tipo = 'docena';
        docCell.dataset.valor = d.valor;
        configurarCeldaClick(docCell);
        grid.appendChild(docCell);

        let colSixLine = d.colStart;
        let numsSixLine = [];
        for (let c = d.colStart; c < d.colStart + 2; c++) {
            for (let r = 1; r <= 3; r++) {
                if (matrizNumeros[`${c},${r}`]) numsSixLine.push(matrizNumeros[`${c},${r}`]);
            }
        }
        if (numsSixLine.length > 0) {
            crearPuntoApuesta('line', numsSixLine.join(','), colSixLine, 3, 'six-line-edge');
        }
    });

    const exteriores = [
        { texto: '1-18', span: 2, tipo: 'bajo' },
        { texto: 'PAR', span: 2, tipo: 'par' },
        { texto: 'CELESTE', span: 2, tipo: 'celeste' },
        { texto: 'BLANCO', span: 2, tipo: 'blanco' },
        { texto: 'IMPAR', span: 2, tipo: 'impar' },
        { texto: '19-36', span: 2, tipo: 'alto' }
    ];
    
    let colActual = 2;
    exteriores.forEach(ext => {
        const extCell = document.createElement('div');
        extCell.className = 'cell outside-label';
        extCell.style.gridColumn = `${colActual} / span ${ext.span}`;
        extCell.style.gridRow = 5;
        extCell.innerText = ext.texto;
        extCell.dataset.tipo = ext.tipo;
        configurarCeldaClick(extCell);
        colActual += ext.span;
        grid.appendChild(extCell);
    });

    for (let f = 1; f <= 3; f++) {
        const colLabel = document.createElement('div');
        colLabel.className = 'cell col-label';
        colLabel.style.gridColumn = 14;
        colLabel.style.gridRow = f;
        colLabel.innerText = '2 to 1';
        colLabel.dataset.tipo = 'columna';
        colLabel.dataset.valor = f;
        configurarCeldaClick(colLabel);
        grid.appendChild(colLabel);
    }

    function configurarCeldaClick(elemento) {
        elemento.addEventListener('click', (e) => {
            e.stopPropagation();

            if (balance < fichaSeleccionada) {
                mostrarAnuncioPantalla("¡Saldo insuficiente!", "Elige una ficha menor", "#ff4d4d", "#ff4d4d");
                return;
            }

            balance -= fichaSeleccionada;
            actualizarSaldoUI();

            const clave = `${elemento.dataset.tipo}-${elemento.dataset.valor || elemento.innerText}`;
            apuestasActuales[clave] = (apuestasActuales[clave] || 0) + fichaSeleccionada;

            let chipVisual = elemento.querySelector('.bet-chip');
            if (!chipVisual) {
                chipVisual = document.createElement('div');
                chipVisual.className = 'bet-chip';
                elemento.appendChild(chipVisual);
            }
            chipVisual.innerText = apuestasActuales[clave];
        });
    }

    btnLimpiar.addEventListener('click', () => {
        let totalDevuelto = 0;
        for (let clave in apuestasActuales) {
            totalDevuelto += apuestasActuales[clave];
            delete apuestasActuales[clave];
        }
        balance += totalDevuelto;
        actualizarSaldoUI();
        document.querySelectorAll('.bet-chip').forEach(el => el.remove());
        mostrarAnuncioPantalla("Apuestas limpiadas", "Hacé una nueva jugada");
    });

    // --- GIRO DE LA RULETA ---
    let gradosTotalesAcumulados = 0;
    let estaGirando = false;

    btnGirar.addEventListener('click', () => {
        if (estaGirando) return;

        if (Object.keys(apuestasActuales).length === 0) {
            mostrarAnuncioPantalla("¡Coloca al menos una ficha!", "Para poder girar la ruleta", "#ff4d4d", "#ff4d4d");
            return;
        }

        estaGirando = true;
        btnGirar.disabled = true;
        mostrarAnuncioPantalla("Girando la ruleta...", "¡Que sea un golazo!", "#d4af37", "#d4af37");

        const indiceGanador = Math.floor(Math.random() * ruedaEuropea.length);
        const numeroGanador = ruedaEuropea[indiceGanador];
        
        const vueltasExtra = 360 * 5; 
        const gradosObjetivo = indiceGanador * gradosPorCasilla;
        
        gradosTotalesAcumulados += vueltasExtra + (360 - (gradosTotalesAcumulados % 360)) + gradosObjetivo;
        
        ruedaContainer.style.transition = 'transform 4.5s cubic-bezier(0.15, 0.90, 0.15, 1.0)';
        ruedaContainer.style.transform = `rotate(-${gradosTotalesAcumulados}deg)`;

        setTimeout(() => {
            estaGirando = false;
            btnGirar.disabled = false;
            
            verificarPremiosGanadores(numeroGanador);
        }, 4500);
    });

    // --- EVALUADOR Y MULTIPLICADOR DE PREMIOS ---
    function verificarPremiosGanadores(numeroGanador) {
        let totalGanado = 0;

        for (let clave in apuestasActuales) {
            let montoApostado = apuestasActuales[clave];
            let partes = clave.split('-');
            let tipo = partes[0];
            let valor = partes.slice(1).join('-'); // Por si el valor contiene guiones (ej. "1-18")

            let ganoApuesta = false;
            let multiplicador = 0;

            if (tipo === 'numero') {
                if (parseInt(valor) === numeroGanador) {
                    ganoApuesta = true;
                    multiplicador = 36; 
                }
            } else if (tipo === 'split') {
                let nums = valor.split(',').map(Number);
                if (nums.includes(numeroGanador)) {
                    ganoApuesta = true;
                    multiplicador = 18; 
                }
            } else if (tipo === 'corner' || tipo === 'line') {
                let nums = valor.split(',').map(Number);
                if (nums.includes(numeroGanador)) {
                    ganoApuesta = true;
                    multiplicador = tipo === 'corner' ? 9 : 6; 
                }
            } else if (tipo === 'docena') {
                // Docenas: 1st 12 (1-12) -> 1, 2nd 12 (13-24) -> 2, 3rd 12 (25-36) -> 3
                let docenaGanadora = 0;
                if (numeroGanador >= 1 && numeroGanador <= 12) docenaGanadora = 1;
                else if (numeroGanador >= 13 && numeroGanador <= 24) docenaGanadora = 2;
                else if (numeroGanador >= 25 && numeroGanador <= 36) docenaGanadora = 3;

                if (parseInt(valor) === docenaGanadora) {
                    ganoApuesta = true;
                    multiplicador = 3; 
                }
            } else if (tipo === 'columna') {
                // Columnas / Filas (2 to 1):
                // Fila 1 (arriba): números que dejan residuo 0 al dividir por 3 (3, 6, 9...)
                // Fila 2 (centro): números que dejan residuo 2 al dividir por 3 (2, 5, 8...)
                // Fila 3 (abajo): números que dejan residuo 1 al dividir por 3 (1, 4, 7...)
                let colGanadora = 0;
                if (numeroGanador !== 0) {
                    let resto = numeroGanador % 3;
                    if (resto === 0) colGanadora = 1;
                    else if (resto === 2) colGanadora = 2;
                    else if (resto === 1) colGanadora = 3;
                }

                if (parseInt(valor) === colGanadora) {
                    ganoApuesta = true;
                    multiplicador = 3; 
                }
            } else if (tipo === 'par') {
                if (numeroGanador !== 0 && numeroGanador % 2 === 0) {
                    ganoApuesta = true;
                    multiplicador = 2; 
                }
            } else if (tipo === 'impar') {
                if (numeroGanador !== 0 && numeroGanador % 2 !== 0) {
                    ganoApuesta = true;
                    multiplicador = 2; 
                }
            } else if (tipo === 'celeste') {
                if (numerosCelestes.includes(numeroGanador)) {
                    ganoApuesta = true;
                    multiplicador = 2; 
                }
            } else if (tipo === 'blanco') {
                if (numeroGanador !== 0 && !numerosCelestes.includes(numeroGanador)) {
                    ganoApuesta = true;
                    multiplicador = 2; 
                }
            } else if (tipo === 'bajo') {
                if (numeroGanador >= 1 && numeroGanador <= 18) {
                    ganoApuesta = true;
                    multiplicador = 2; 
                }
            } else if (tipo === 'alto') {
                if (numeroGanador >= 19 && numeroGanador <= 36) {
                    ganoApuesta = true;
                    multiplicador = 2; 
                }
            }

            if (ganoApuesta) {
                totalGanado += montoApostado * multiplicador;
            }
        }

        if (totalGanado > 0) {
            balance += totalGanado;
            actualizarSaldoUI();
            mostrarAnuncioPantalla(`¡GOOOL! Salió el ${numeroGanador} ⚽`, `¡Ganaste $${totalGanado}!`, "#d4af37", "#d4af37");
        } else {
            let fraseAleatoria = frasesFutboleras[Math.floor(Math.random() * frasesFutboleras.length)];
            mostrarAnuncioPantalla(`Salió el ${numeroGanador}.`, fraseAleatoria, "#74acdf", "#ffffff");
        }

        for (let clave in apuestasActuales) delete apuestasActuales[clave];
        document.querySelectorAll('.bet-chip').forEach(el => el.remove());
    }
});