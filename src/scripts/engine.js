// Declaração dos estados (manipulações)
const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points'),
    },
    cardSprites: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },
    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computed-cards",
        computerBOX: document.querySelector("#computed-cards"),
    },
    fieldCards: {
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    },
    actions: {
        button: document.getElementById('next-duel'),
    },
};

// Mapeamento das cartas do jogo
const pathImages = "./src/assets/icons/"
const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf:[1],
        LoseOf:[2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf:[2],
        LoseOf:[0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf:[0],
        LoseOf:[1],
    },
]

// Selecionar pelo id uma carta aleatória
async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

// 
async function createCardImage(idCard, fieldSide) {
    // Criar a carta virada no início do jogo
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    // Carta clicável somente do lado do jogador
    if (fieldSide === state.playerSides.player1) {
        // Mostrar a carta do jogador na esquerda quando passar o mouse em cima
        cardImage.addEventListener("mouseover", ()=> {
            drawSelectCard(idCard);
        });

        cardImage.addEventListener("click", ()=> {
            // Pegar uma carta escolhida randomicamente quando clicar sobre a carta e mostrar no campo de jogo
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }

    return cardImage;
}

// Função para remover todas as cartas do campo de duelo
async function removeAllCardsImages() {
    let { computerBOX, player1BOX } = state.playerSides; 
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

// Função para colocar as cartas na área de disputa
async function setCardsField(cardId) {
    // Remover as outras cartas
    await removeAllCardsImages();

    // Seleção de uma carta aleatória para o computador
    let computerCardId = await getRandomCardId();

    // Mostrar o campo de disputa para os jogadores
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    // Resetar os detalhes das cartas do lado
    await hiddenCardDetails();

    // Incluir imagem da carta no campo de disputa de cada jogador
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    // Verificação do vencedor da rodada
    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

// Resetar os detalhes das cartas do lado
async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

// Função para verificar o ganhador do duelo
async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "DRAW";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = "WIN";
        state.score.playerScore++;
    }

    if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "LOSE";
        state.score.computerScore++;
    }

    await playAudio(duelResults); // Tocar audio

    return duelResults;
}

// Ataulizar o placar do jogo
async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} ! Lose: ${state.score.computerScore}`;
}

// Criar o botão com resultado e reinício
async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

// Função para mostrar a carta do jogador na esquerda quando passa o mouse por cima
async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Atribute : " + cardData[index].type;
}

// Função para lançar cartas
async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        // Sorteio de uma carta aleatória
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

// Função para criar um novo duelo
async function resetDuel(){
    // Limpar carta do menu lateral
    state.cardSprites.avatar.src = "";
    // Esconder o botão com resultado do duelo
    state.actions.button.style.display = "none";
    // Limpar as caixas do duelo
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    // Resetar o duelo - distribuir as cartas novamente
    init();

}

// Função para tocar aúdio
async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);

    try {
        audio.play();
    } catch  {};
}

// Função principal que chamará as outras funções
function init() {
    // Esconder as bordas das imagens
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    // Lançar cartas
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);
}

// Inicialização do estado inicial do jogo
init();