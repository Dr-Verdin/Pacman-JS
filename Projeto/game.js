const canvas = document.getElementById("canvas");           // Obtendo o elemento canvas.
const canvasContext = canvas.getContext("2d");              // Obtendo o contexto de desenho (2D) do canvas.
const pacmanFrames = document.getElementById("animation");  // Obtendo o gif para a animação do Pac-man.
const ghostFrames = document.getElementById("ghosts");      // Obtendo a imagem para a animação dos fantasmas.

// Função para desenhar um retangulo no canvas:
let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

// Definindo as direções:
const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;

// Configurações do jogo:
let lives = 3;                                          // Número de vidas do Pac-man.
let ghostCount = 4;                                     // Número de fantasmas.
let ghostImageLocations = [                             // Localização dos fantasmas na imagem.
    { x: 0, y: 0 },
    { x: 176, y: 0 },
    { x: 0, y: 121 },
    { x: 176, y: 121 },
];
let fps = 30;                                           // Taxa de quadros por segundo.
let pacman;                                             // Pac-man.
let ghosts = [];                                        // Fantasmas.
let oneBlockSize = 20;                                  // Tamanho de um bloco do grid no jogo.
let score = 0;                                          // Score.
let wallSpaceWidth = oneBlockSize / 1.3;                // Largura dos espaçoes nas paredes.
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;   // Margem das paredes no bloco, posição certa.
let wallInnerColor = "black";                           // Cor interna das paredes.

// Mapa do jogo:
let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1],
    [0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0],
    [1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1],
    [0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0],
    [1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 1],
    [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Função que define posições-alvo específicas para os fantasmas no mapa:
let randomTargetsForGhosts = [
    { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
    { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: (map.length - 2) * oneBlockSize },
];

// Função que cria um novo objeto Pac-man:
let createNewPacman = () => {
    pacman = new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize / 5
    );
};

// Função que é responsavel pelo ciclo do jogo:
let gameLoop = () => {
    update();
    draw();
};

// Função que chama a função 'gameLoop' a cada intervalo de tempo:
let gameInterval = setInterval(gameLoop, 1000 / fps);

// FUnção que restarta na posição inicial os fantasmas e o Pac-man:
let restartPacmanAndGhosts = () => {
    createNewPacman();
    createGhosts();
};

// Função que registra as colisões com os fantasmas:
let onGhostCollision = () => {
    lives--;
    restartPacmanAndGhosts();
    if (lives == 0) {
    }
};

// Função que atualiza o estado do jogo a cada ciclo:
let update = () => {
    pacman.moveProcess();
    pacman.eat();
    updateGhosts();
    
    if (pacman.checkGhostCollision(ghosts)) {
        onGhostCollision();
    }
};

// Função que desenhas os 'dots' (comidas) no jogo:
let drawFoods = () => {
    for(let i = 0; i < map.length; i++){
        for(let j = 0; j < map[0].length; j++){
            if(map[i][j] == 2){
                createRect(
                    j * oneBlockSize + oneBlockSize / 3,
                    i * oneBlockSize + oneBlockSize / 3,
                    oneBlockSize / 4,
                    oneBlockSize / 4,
                    "#FFB998"
                );
            }
        }
    }
};

// Função que desenha as vidas do Pac-man no jogo:
let drawRemainingLives = () => {
    for(let i = 0; i < lives; i++){
        canvasContext.drawImage(
            pacmanFrames,
            2 * oneBlockSize,
            0,
            oneBlockSize, oneBlockSize, 
            285 + i * oneBlockSize, 
            oneBlockSize * map.length + 12,
            oneBlockSize, oneBlockSize
        );
    }
};

// Função que desenha o Score do jogo:
let drawScore = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(
        "High Score: " + score,
        0,
        oneBlockSize * (map.length + 1) + 5
    );
};

// Função que desenha a interface do jogo a cada quadro:
let draw = () => {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    createRect(0, 0, canvas.width, canvas.height, "black");
    drawWalls();
    drawFoods();
    drawGhosts();
    pacman.draw();
    drawScore();
    drawRemainingLives();
};

// Função responsável por criar o labirinto:
let drawWalls = () => {
    for(let i = 0; i  < map.length; i++){
        for(let j = 0; j < map[0].length; j++){
            if(map[i][j] == 1){
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize,
                    oneBlockSize,
                    oneBlockSize,
                    "#1515B5"
                );

                // Para as paredes adjacentes:
                if(j > 0 && map[i][j-1] == 1){
                    createRect(
                        j * oneBlockSize,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }
                if(j < map[0].length - 1 && map[i][j+1] == 1){
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }
                if(i < map.length - 1 && map[i+1][j] == 1){
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }
                if(i > 0 && map[i-1][j] == 1){
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }
            }
        }
    }
};

// Função que tem como objetivo criar e adicionar fantasmas: 
let createGhosts = () => {
    ghosts = [];
    for(let i = 0; i < ghostCount; i++){
        let newGhost = new Ghost(
            9 * oneBlockSize + (i%2 == 0 ? 0 : 1) * oneBlockSize,   // Define a posição X do fantasma.
            9 * oneBlockSize,                                       // Define a posição Y do fantasma.
            oneBlockSize,                                           // Largura do fantasma.
            oneBlockSize,                                           // Altura do fantasma.
            pacman.speed / 2,                                       // Velocidade do fantasma (metade da velocidade do pacman).
            ghostImageLocations[i % 4].x,                           // A posição X da imagem do fantasma (usando um índice cíclico de 0 a 3).
            ghostImageLocations[i % 4].y,                           // A posição Y da imagem do fantasma (usando um índice cíclico de 0 a 3)        
            124,
            116,
            6 + i
        );
        ghosts.push(newGhost);                                      // Adiciona o fantasma recém-criado ao array 'ghosts'.
    }
};

createNewPacman();
createGhosts();
gameLoop();

// Função que captura pressionamentos de teclas para controlar a movimentação do Pac-man:
window.addEventListener("keydown", (event) => {
    let k = event.keyCode;

    setTimeout(() => {
        if(k == 37 || k == 65){ // left
            pacman.nextDirection = DIRECTION_LEFT;
        } else if(k == 38 || k == 87){ // up
            pacman.nextDirection = DIRECTION_UP;
        } else if(k == 39 || k == 68){ // right
            pacman.nextDirection = DIRECTION_RIGHT;
        } else if(k == 40 || k == 83){ // bottom
            pacman.nextDirection = DIRECTION_BOTTOM;
        }
    }, 1);
});