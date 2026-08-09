# 🎰 CORONADOS DE GLORIA — Simulador de Ruleta

> **Experiencia interactiva de ruleta desarrollada desde cero con HTML, CSS y JavaScript Vanilla.**



\

---

## 🏆 Sobre el proyecto

**Coronados de Gloria** es un simulador interactivo de ruleta desarrollado completamente desde cero utilizando **HTML5, CSS3 y JavaScript Vanilla**, sin frameworks ni motores de videojuegos.

El objetivo del proyecto fue ir más allá de una interfaz visual y construir la lógica necesaria para simular la experiencia de una mesa de ruleta:

* 🎰 Ruleta interactiva
* 🪙 Sistema de fichas
* 💰 Saldo virtual
* 🎯 Diferentes tipos de apuestas
* 🧮 Cálculo automático de premios
* 🎲 Generación aleatoria de resultados
* 🔄 Gestión del estado de la partida
* 🎨 Generación dinámica del tablero
* 📱 Diseño responsive
* ⚡ Actualización de la interfaz en tiempo real
* 💬 Feedback visual para el jugador

El proyecto fue pensado como una demostración práctica de **lógica frontend, manipulación del DOM, gestión de estados, interacción de usuario y diseño de interfaces para experiencias de gaming**.

---

# 🎮 ¿Cómo funciona?

El jugador comienza con un saldo virtual de:

```text
$1.000
```

Puede seleccionar diferentes fichas:

```text
$1   $5   $10   $25   $50
```

Luego puede colocarlas sobre diferentes zonas de la mesa.

Una vez realizadas las apuestas, el jugador puede girar la ruleta.

El sistema:

```text
Seleccionar ficha
       ↓
Realizar apuesta
       ↓
Actualizar saldo
       ↓
Girar ruleta
       ↓
Generar resultado
       ↓
Evaluar apuestas
       ↓
Calcular premios
       ↓
Actualizar saldo
       ↓
Mostrar resultado
```

Todo este flujo ocurre dinámicamente sin recargar la página.

---

# 🧠 Lógica del juego

Uno de los principales objetivos del proyecto fue separar la **interfaz visual** de la **lógica del juego**.

El estado de las apuestas se almacena en:

```javascript
const apuestasActuales = {};
```

Este objeto permite mantener registradas las apuestas realizadas durante la ronda y utilizarlas posteriormente para determinar cuáles fueron ganadoras.

De esta forma, el sistema puede manejar múltiples apuestas simultáneamente.

---

# 🎯 Sistema de apuestas

La mesa permite representar diferentes modalidades de apuestas de ruleta.

### 🔴 Pleno

Apuesta a un único número.

**Pago: 36×**

---

### 🔴 Split

Apuesta a dos números.

**Pago: 18×**

---

### 🔴 Cuadro / Corner

Apuesta a cuatro números.

**Pago: 9×**

---

### 🔴 Seis números

Apuesta a seis números.

**Pago: 6×**

---

### 🔴 Docenas

La mesa se divide en:

* 1ª docena
* 2ª docena
* 3ª docena

**Pago: 3×**

---

### 🔴 Columnas

Permite apostar sobre una de las tres columnas de la mesa.

**Pago: 3×**

---

### 🔵 Apuestas externas

También se contemplan diferentes apuestas externas:

* 1–18
* 19–36
* Par
* Impar
* Celeste
* Blanco

**Pago: 2×**

La evaluación de las apuestas se realiza en función del número ganador y del tipo de apuesta realizada.

---

# 🎰 Sistema de ruleta

La ruleta utiliza una secuencia basada en la distribución de una ruleta europea:

```javascript
const ruedaEuropea = [
    0, 32, 15, 19, 4, 21, 2, 25, 17,
    34, 6, 27, 13, 36, 11, 30, 8,
    23, 10, 5, 24, 16, 33, 1, 20,
    14, 31, 9, 22, 18, 29, 7, 28,
    12, 35, 3, 26
];
```

Cuando el jugador gira la ruleta, se selecciona aleatoriamente una posición:

```javascript
const indiceGanador =
    Math.floor(Math.random() * ruedaEuropea.length);
```

El número seleccionado se convierte en el resultado de la ronda.

La animación visual de la ruleta y la lógica del resultado están separadas para permitir que la animación se ejecute antes de mostrar el resultado final.

---

# ⚙️ Generación dinámica del tablero

Una de las decisiones técnicas más importantes fue **no escribir manualmente todas las celdas del tablero en HTML**.

La mesa se genera mediante JavaScript.

Por ejemplo:

```javascript
function crearCeldaNum(numero, columna, fila) {
    const cell = document.createElement('div');

    cell.className = 'cell';

    cell.style.gridColumn = columna;
    cell.style.gridRow = fila;

    cell.innerText = numero;
}
```

Esto permite construir el tablero utilizando datos y lógica en lugar de tener decenas de elementos HTML escritos manualmente.

---

# 🔗 Sistema de zonas de apuesta

Una de las partes más interesantes del proyecto es el sistema de **zonas interactivas superpuestas**.

Además de las celdas visibles de la ruleta, se crea una capa adicional:

```javascript
const overlay = document.createElement('div');

overlay.className = 'board-overlay';
```

Sobre esta capa se generan las zonas correspondientes a:

* Splits
* Corners
* Seis números
* Apuestas sobre el 0
* Otras zonas especiales

Esto permite separar:

```text
INTERFAZ VISUAL
      +
ZONAS INTERACTIVAS
```

en lugar de intentar convertir cada elemento visual en una apuesta independiente.

Esta estructura facilita la organización del código y permite agregar nuevas modalidades de apuestas sin reconstruir completamente el tablero.

---

# 💰 Gestión del saldo

El jugador comienza con un saldo virtual de `$1.000`.

Cada vez que coloca una ficha:

```text
Saldo
 ↓
Se descuenta la ficha
 ↓
Se registra la apuesta
```

Cuando la ronda termina:

```text
Resultado
 ↓
Evaluación de apuestas
 ↓
Multiplicador
 ↓
Premio
 ↓
Nuevo saldo
```

En caso de limpiar las apuestas antes de girar la ruleta, el sistema devuelve el valor apostado al saldo disponible.

Esto genera un ciclo completo de gestión de estado durante cada ronda.

---

# 🧮 Motor de premios

El sistema evalúa cada apuesta individualmente.

Conceptualmente:

```text
┌─────────────────────┐
│      APUESTA        │
├─────────────────────┤
│ Tipo                │
│ Valor               │
│ Monto               │
└──────────┬──────────┘
           ↓
   ¿Es ganadora?
           ↓
     Sí ───┴─── No
      ↓          ↓
 Multiplicador   $0
      ↓
 Premio
```

El sistema acumula los premios obtenidos durante la ronda:

```javascript
totalGanado += montoApostado * multiplicador;
```

Finalmente, el resultado se refleja en el saldo del jugador.

---

# 📱 Diseño Responsive

El proyecto fue desarrollado teniendo en cuenta tanto escritorio como dispositivos móviles.

En escritorio:

```text
┌────────────────────────────────────────────┐
│                                            │
│       🎰 RULETA      🎯 TABLERO            │
│                                            │
└────────────────────────────────────────────┘
```

En dispositivos móviles:

```text
┌──────────────────────┐
│      🎰 RULETA       │
│                      │
│         ⭐⭐⭐         │
│                      │
├──────────────────────┤
│       TABLERO        │
│                      │
│  0  3  6  9  12 ... │
│  2  5  8  11 14 ... │
│  1  4  7  10 13 ... │
│                      │
├──────────────────────┤
│      FICHAS          │
├──────────────────────┤
│   LIMPIAR  | GIRAR   │
└──────────────────────┘
```

#

# 🧩 Arquitectura del proyecto

```text
                 CORONADOS DE GLORIA
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
        HTML            CSS       JAVASCRIPT
          │              │              │
     Estructura      Diseño UI      Lógica
          │              │              │
          │         Responsive           │
          │              │              │
          └──────────────┼──────────────┘
                         ↓
                   EXPERIENCIA
                   INTERACTIVA
```

### Tecnologías utilizadas

| Tecnología | Utilización                      |
| ---------- | -------------------------------- |
| HTML5      | Estructura de la interfaz        |
| CSS3       | Diseño, animaciones y responsive |
| JavaScript | Lógica principal del juego       |
| CSS Grid   | Construcción del tablero         |
| DOM API    | Generación dinámica de elementos |
| Git        | Control de versiones             |
| GitHub     | Repositorio y publicación        |

---

# 🧪 Principales desafíos técnicos

### 01. Construcción dinámica del tablero

Crear la mesa mediante JavaScript manteniendo correctamente la distribución de números.

### 02. Sistema de apuestas

Permitir múltiples tipos de apuestas sin duplicar innecesariamente la lógica.

### 03. Zonas interactivas

Crear áreas invisibles sobre la mesa capaces de detectar diferentes tipos de apuestas.

### 04. Gestión del estado

Mantener sincronizados:

* Saldo
* Ficha seleccionada
* Apuestas actuales
* Resultado ganador
* Premio obtenido
* Estado de la ruleta

### 05. Animación

Crear una animación de giro independiente del resultado lógico.

### 06. Responsive Design

Adaptar una interfaz originalmente diseñada como mesa de casino a una experiencia táctil para dispositivos móviles.

---

# 🎨 Identidad visual

El diseño combina una estética de casino con elementos inspirados en la identidad visual argentina.

### Paleta principal

```text
Azul oscuro
      +
Celeste
      +
Dorado
      +
Verde
```

El concepto **"Coronados de Gloria"** busca darle una identidad propia al proyecto en lugar de utilizar una interfaz genérica de casino.

---

# 🚀 Posibles mejoras

La versión actual funciona como una **simulación frontend**.

La arquitectura podría evolucionar hacia un sistema más completo incorporando:

* [ ] Backend
* [ ] Usuarios registrados
* [ ] Autenticación
* [ ] Base de datos
* [ ] Historial de partidas
* [ ] Historial de apuestas
* [ ] Saldo persistente
* [ ] Panel administrativo
* [ ] Estadísticas
* [ ] Comunicación en tiempo real
* [ ] WebSockets
* [ ] Sonidos
* [ ] Animaciones avanzadas
* [ ] Tests automatizados
* [ ] Mejoras de accesibilidad

> **Importante:** este proyecto es una simulación desarrollada con fines educativos y de portfolio. No procesa dinero real ni realiza transacciones de apuestas.

---

# 💼 ¿Qué demuestra este proyecto?

Más allá de la interfaz visual, este proyecto busca demostrar capacidad para trabajar con:

### Frontend

**HTML · CSS · JavaScript · DOM · CSS Grid · Responsive Design**

### Lógica

**Gestión de estados · Randomización · Condicionales · Algoritmos de pago · Evaluación de resultados**

### Interacción

**Eventos · Clicks · Feedback visual · Animaciones · Interfaces táctiles**

### Arquitectura

**Generación dinámica de elementos · Separación entre interfaz y lógica · Sistemas de interacción complejos**

---

# 🎯 Objetivo del proyecto

La idea detrás de **Coronados de Gloria** fue crear un proyecto que demostrara algo más que conocimientos básicos de frontend.

Una interfaz de ruleta parece sencilla visualmente, pero detrás requiere coordinar diferentes sistemas:

```text
INTERACCIÓN DEL USUARIO
          ↓
     APUESTAS
          ↓
    ESTADO DEL JUEGO
          ↓
   RESULTADO ALEATORIO
          ↓
   EVALUACIÓN
          ↓
  CÁLCULO DE PREMIOS
          ↓
 ACTUALIZACIÓN DEL SALDO
          ↓
  FEEDBACK AL USUARIO
```

El desafío fue construir todo este flujo utilizando únicamente **HTML, CSS y JavaScript Vanilla**.

---

# 👨‍💻 Sobre el desarrollador

Este proyecto forma parte de mi portfolio de desarrollo y representa mi interés por crear **experiencias de juego, sistemas de e-commerce y aplicaciones orientadas a la interacción del usuario**.

Mi objetivo es continuar desarrollando proyectos que combinen:

**Diseño + Programación + Lógica + Experiencia de Usuario**

---

## ⭐ Coronados de Gloria

**Un proyecto de frontend.**
**Una simulación de gaming.**
**Un ejercicio de lógica.**

Desarrollado desde cero con:

### HTML · CSS · JavaScript

