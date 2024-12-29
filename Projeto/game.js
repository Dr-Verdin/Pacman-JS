const canvas = document.getElementById('canvas');           // Obtem o elemento do canvas no HTML
const canvasContext = canvas.getContext("2d");              // Obtem o contexto 2d do canvas, que permite desenhar nele
const pacmanFrames = document.getElementById("pacman");     // Obtem o elemento de imagem com o id "pacman" para animar o Pac-Man
const ghostFrames = document.getElementById("ghosts");      // Obtem o elemento de imagem com o id "ghosts" para animar os fantasmas

// Função para desenhar retângulos (usadas paras paredes e outros elementos)
let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;                // Define a cor de preencimento 
    canvasContext.fillRect(x, y, width, height);    // Desenha o retangulo
};

// COnfigurações do jogo:
let fps = 30;                                               // Frames por segundo (taxa de atualização do jogo)
let oneBlockSize = 20;                                      // Tamamho de cada "bloco" no mapa
let wallColor = "#2121de";                                  // Cor das paredes (azul)
let wallSpaceWidth = oneBlockSize / 1.3;                    // Largura das bordas internas das paredes
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;       // Distancia entre as bordas internas
let wallInnerColor = "black";                               // Cor das bordas internas das paredes (preto)

// Mapa do jogo: 1 representa as paredes e 2 representa espaços vazios
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

// Função principal do loop do jogo, que é chamada repetidamente
let gameLoop = () => {
    update()    // Atualiza o estado do jogo
    draw()      // Desenha os elementos na tela
};

// Função para atualizar o estado do jogo
let update = () => {
    // Update game state
};

// Função para desenhar tudo na tela
let draw = () => {
    createRect(0, 0, canvas.width, canvas.height, "black"); // Limpa a tela, desenhando um retângulo preto para o fundo
    drawWalls()                                             // Desenha as paredes do labirinto
};

// Intervalo que chama a função gameLoop a cada "1/fps" segundos
let gameInterval = setInterval(gameLoop, 1000/fps);

// Função para desenhar as paredes no mapa, com bordas internas
let drawWalls = () => {
    // Percorre cada célula do mapa
    for(let i = 0; i  < map.length; i++){
        for(let j = 0; j < map[0].length; j++){
            // Se a célula for uma parede (== 1)
            if(map[i][j] == 1){
                // Desenha a parede principal
                createRect(
                    j * oneBlockSize, 
                    i * oneBlockSize, 
                    oneBlockSize, 
                    oneBlockSize, 
                    wallColor
                );

                // Desenha as bordas internas, se existirem (se houver paredes adjacentes)
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
                if(i > 0 && map[i-1][j] == 1){
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize, 
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
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
            }
        }
    }
};