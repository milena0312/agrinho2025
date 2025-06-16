let cesta;
let frutas = [];
let cidade;
let pontuacao = 0;
let velocidadeFruta = 2;
let taxaNovaFruta = 60;
let larguraCesta = 80;
let alturaCesta = 50;
let larguraFruta = 30;
let alturaFruta = 30;
let larguraCidade = 120; // Tamanho da largura da cidade
let alturaCidade = 150; // Aumentado o tamanho da altura da cidade
let velocidadeCesta = 5;
// As variáveis de cor são declaradas aqui, mas inicializadas em setup()
let corCesta;
let corFruta;

// Variáveis para controlar o número total de frutas
let totalFrutasMax = 30; // Define o limite máximo de frutas a serem geradas
let frutasGeradas = 0;   // Contador para as frutas já geradas

// Variável para controlar o estado do jogo
let gameState = 'playing'; // Pode ser 'playing', 'won', 'lost'

// Array para armazenar as árvores
let arvores = [];
// Array para armazenar as nuvens
let nuvens = [];

function setup() {
    createCanvas(600, 400);
    // Agora as cores são definidas dentro de setup(), onde color() está disponível
    corCesta = color(139, 69, 19); // Cor marrom claro para a cesta
    corFruta = color(255, 0, 0);   // Cor vermelha para as frutas

    cesta = new Cesta();
    // Ajusta a posição Y da cidade para que sua base fique no chão verde
    cidade = new Cidade(width - larguraCidade - 10, height - 60 - alturaCidade, larguraCidade, alturaCidade);

    // Adiciona algumas árvores ao fundo, ajustando a posição Y para o chão
    arvores.push(new Arvore(50, height - 60)); // Base da árvore no topo do chão
    arvores.push(new Arvore(150, height - 60));
    arvores.push(new Arvore(250, height - 60));
    arvores.push(new Arvore(350, height - 60));
    arvores.push(new Arvore(450, height - 60));

    // Adiciona algumas nuvens
    nuvens.push(new Nuvem(random(width), random(50, 150), random(1, 2)));
    nuvens.push(new Nuvem(random(width), random(50, 150), random(1, 2)));
    nuvens.push(new Nuvem(random(width), random(50, 150), random(1, 2)));
}

function draw() {
    background(135, 206, 235); // Azul claro como o céu

    // Desenha o sol
    fill(255, 204, 0); // Cor amarela para o sol
    ellipse(width - 70, 70, 80, 80); // Posição (x, y) e tamanho (largura, altura) do sol

    // Desenha o chão verde
    fill(34, 139, 34); // Verde floresta para o chão
    rect(0, height - 60, width, 60); // Desenha um retângulo na parte inferior da tela

    // Desenha as árvores no fundo
    for (let i = 0; i < arvores.length; i++) {
        arvores[i].mostrar();
    }

    // Desenha e atualiza as nuvens
    for (let i = 0; i < nuvens.length; i++) {
        nuvens[i].mostrar();
        nuvens[i].atualizar();
    }

    cidade.mostrar();
    cesta.mostrar();
    cesta.atualizar();

    // Lógica do jogo apenas se estiver no estado 'playing'
    if (gameState === 'playing') {
        // Cria novas frutas aleatoriamente, mas apenas se o limite não foi atingido
        if (frameCount % taxaNovaFruta == 0 && frutasGeradas < totalFrutasMax) {
            frutas.push(new Fruta());
            frutasGeradas++; // Incrementa o contador de frutas geradas
        }

        for (let i = frutas.length - 1; i >= 0; i--) {
            frutas[i].mostrar();
            frutas[i].atualizar();

            if (cesta.coletou(frutas[i])) {
                pontuacao++;
                frutas.splice(i, 1);
            } else if (frutas[i].y > height) {
                frutas.splice(i, 1); // Remove frutas que caem fora da tela
            }
        }

        // Verifica se a cesta chegou na cidade (condição de vitória)
        // A vitória só ocorre se todas as frutas foram coletadas E a cesta chegou na cidade
        if (pontuacao === totalFrutasMax && cesta.x + cesta.largura > cidade.x && cesta.x < cidade.x + cidade.largura &&
            cesta.y + cesta.altura > cidade.y && cesta.y < cidade.y + cidade.altura) {
            gameState = 'won'; // Define o estado como 'won'
        }

        // Verifica a condição de perda: todas as frutas foram geradas E não há mais frutas na tela
        // E a pontuação é menor que o total de frutas que deveriam ser coletadas
        // Isso significa que algumas frutas caíram ou não foram coletadas
        if (frutasGeradas === totalFrutasMax && frutas.length === 0 && pontuacao < totalFrutasMax) {
            gameState = 'lost'; // Define o estado como 'lost'
        }

    } else if (gameState === 'won') {
        // Exibe mensagem de vitória
        textSize(32);
        fill(0);
        textAlign(CENTER, CENTER);
        text("Você entregou as maçãs!", width / 2, height / 2);
        noLoop(); // Para o loop do draw
    } else if (gameState === 'lost') {
        // Exibe mensagem de derrota
        textSize(32);
        fill(0);
        textAlign(CENTER, CENTER);
        text("Você perdeu! Maçãs insuficientes", width / 2, height / 2);
        noLoop(); // Para o loop do draw
    }

    // Mostra a pontuação e frutas restantes (visível em todos os estados)
    textSize(20);
    fill(0);
    textAlign(LEFT, TOP); // Reseta o alinhamento do texto para o canto superior esquerdo
    text("Frutas coletadas: " + pontuacao, 10, 20);
    text("Frutas restantes: " + (totalFrutasMax - frutasGeradas), 10, 45);


    // Movimentação contínua enquanto as teclas estão pressionadas (apenas no estado 'playing')
    if (gameState === 'playing') {
        if (keyIsDown(LEFT_ARROW)) {
            cesta.mover(-velocidadeCesta);
        }
        if (keyIsDown(RIGHT_ARROW)) {
            cesta.mover(velocidadeCesta);
        }
        if (keyIsDown(UP_ARROW)) {
            cesta.moverY(-velocidadeCesta);
        }
        if (keyIsDown(DOWN_ARROW)) {
            cesta.moverY(velocidadeCesta);
        }
    }
}

class Cesta {
    constructor() {
        this.largura = larguraCesta;
        this.altura = alturaCesta;
        this.x = width / 2 - this.largura / 2;
        this.y = height - 100;
        this.velocidadeX = 0;
        this.velocidadeY = 0;
        this.cor = corCesta;
        this.design = 1; // Variável para controlar o design
    }

    mostrar() {
        push(); // Salva as configurações de estilo atuais
        translate(this.x + this.largura / 2, this.y + this.altura / 2); // Centraliza a cesta para rotação

        if (this.design === 1) {
            // Design 1: Retângulo básico com uma alça simples
            fill(this.cor);
            rect(-this.largura / 2, -this.altura / 2, this.largura, this.altura);
            // Desenha a alça
            noFill(); // Sem preenchimento para a alça
            stroke(this.cor); // Cor da borda da alça
            strokeWeight(2); // Espessura da borda
            arc(0, -this.altura / 2, this.largura * 0.8, this.altura * 0.8, PI, TWO_PI); // Alça em forma de arco
            noStroke(); // Remove a borda para os próximos desenhos
            fill(this.cor); // Volta ao preenchimento da cesta
        } else if (this.design === 2) {
            // Design 2: Elipse
            fill(this.cor);
            ellipse(0, 0, this.largura, this.altura);
        } else if (this.design === 3) {
           // Design 3: Cesta inclinada
            fill(this.cor);
            rotate(radians(30));  //clinando a cesta
            rect(-this.largura / 2, -this.altura / 2, this.largura, this.altura);
        } else if (this.design === 4) {
            // Design 4: Cesta com bordas arredondadas
             fill(this.cor);
             rect(-this.largura / 2, -this.altura / 2, this.largura, this.altura, 10); // O último parâmetro é o raio do arredondamento
        } else if (this.design === 5) {
              // Design 5: Triângulo
              fill(this.cor);
              triangle(-this.largura / 2, this.altura / 2, this.largura / 2, this.altura / 2, 0, -this.altura / 2);
        }

        pop(); // Restaura as configurações de estilo
    }

    atualizar() {
        this.x += this.velocidadeX;
        this.y += this.velocidadeY;
        this.x = constrain(this.x, 0, width - this.largura);
        this.y = constrain(this.y, 0, height - this.altura);
        this.velocidadeX = 0;
        this.velocidadeY = 0;
    }

    mover(dir) {
        this.velocidadeX = dir;
    }

    moverY(dir) {
        this.velocidadeY = dir;
    }

    coletou(fruta) {
        let d = dist(this.x + this.largura / 2, this.y + this.altura / 2, fruta.x, fruta.y);
        return d < this.largura / 2 + fruta.diametro / 2;
    }

    mudarDesign(novoDesign) {
        this.design = novoDesign;
    }
}

class Fruta {
    constructor() {
        this.diametro = random(20, 40);
        this.x = random(this.diametro / 2, width - this.diametro / 2);
        this.y = -this.diametro;
        this.velocidade = velocidadeFruta;
        this.cor = corFruta; // Usa a cor vermelha definida para as frutas
    }

    mostrar() {
        fill(this.cor);
        ellipse(this.x, this.y, this.diametro);
    }

    atualizar() {
        this.y += this.velocidade;
    }
}

// Nova classe para representar uma árvore
class Arvore {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.troncoLargura = random(10, 20);
        this.troncoAltura = random(50, 100);
        this.copaDiametro = random(60, 100);
    }

    mostrar() {
        push();
        // Tronco
        fill(139, 69, 19); // Marrom
        rect(this.x - this.troncoLargura / 2, this.y - this.troncoAltura, this.troncoLargura, this.troncoAltura);

        // Copa
        fill(34, 139, 34); // Verde floresta
        ellipse(this.x, this.y - this.troncoAltura - this.copaDiametro / 4, this.copaDiametro, this.copaDiametro);
        pop();
    }
}

// Nova classe para representar uma nuvem
class Nuvem {
    constructor(x, y, velocidade) {
        this.x = x;
        this.y = y;
        this.velocidade = velocidade;
        this.largura = random(80, 150);
        this.altura = random(30, 60);
    }

    mostrar() {
        fill(255, 255, 255, 200); // Branco com alguma transparência
        noStroke();
        // Desenha a forma da nuvem com várias elipses
        ellipse(this.x, this.y, this.largura, this.altura);
        ellipse(this.x - this.largura * 0.3, this.y + this.altura * 0.2, this.largura * 0.7, this.altura * 0.7);
        ellipse(this.x + this.largura * 0.3, this.y + this.altura * 0.2, this.largura * 0.7, this.altura * 0.7);
        ellipse(this.x - this.largura * 0.1, this.y - this.altura * 0.3, this.largura * 0.6, this.altura * 0.6);
    }

    atualizar() {
        this.x += this.velocidade;
        // Se a nuvem sair da tela, reposiciona-a no lado oposto
        if (this.x > width + this.largura / 2) {
            this.x = -this.largura / 2;
            this.y = random(50, 150); // Posição Y aleatória para variar
            this.velocidade = random(1, 2); // Velocidade aleatória para variar
        }
    }
}

class Cidade {
    constructor(x, y, largura, altura) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
    }

    mostrar() {
        // Desenha a base do prédio
        fill(100); // Cor cinza escura para o prédio
        rect(this.x, this.y, this.largura, this.altura);

        // Desenha janelas
        let numJanelasX = 3; // Mais janelas na largura
        let numJanelasY = 6; // Aumentado o número de janelas na altura para preencher o prédio mais alto
        // Ajustar o tamanho da janela e espaçamento para uma aparência mais arrumada
        let janelaLargura = (this.largura - (numJanelasX + 1) * 8) / numJanelasX; // 8 pixels de margem entre janelas e bordas
        let janelaAltura = (this.altura - (numJanelasY + 1) * 8) / numJanelasY;
        let espacamentoX = (this.largura - numJanelasX * janelaLargura) / (numJanelasX + 1);
        let espacamentoY = (this.altura - numJanelasY * janelaAltura) / (numJanelasY + 1);


        for (let j = 0; j < numJanelasY; j++) {
            for (let i = 0; i < numJanelasX; i++) {
                push(); // Salva o estado atual do estilo
                fill(100, 150, 200); // Cor azul mais escura para as janelas
                stroke(50); // Cor da borda da janela
                strokeWeight(1); // Espessura da borda
                rect(this.x + espacamentoX + i * (janelaLargura + espacamentoX),
                     this.y + espacamentoY + j * (janelaAltura + espacamentoY),
                     janelaLargura, janelaAltura);
                pop(); // Restaura o estado do estilo
            }
        }

        // Desenha um telhado plano (para prédio)
        fill(80); // Cor mais escura para o telhado
        rect(this.x, this.y - 10, this.largura, 10); // Telhado plano
    }
}

function keyPressed() {
  // Apenas permite movimento e mudança de design se o jogo estiver 'playing'
  if (gameState === 'playing') {
    if (keyCode === LEFT_ARROW) {
      cesta.mover(-velocidadeCesta);
    } else if (keyCode === RIGHT_ARROW) {
      cesta.mover(velocidadeCesta);
    } else if (keyCode === UP_ARROW) {
      cesta.moverY(-velocidadeCesta);
    } else if (keyCode === DOWN_ARROW) {
      cesta.moverY(velocidadeCesta);
    }

    // Mudando o design da cesta com os números de 1 a 5
    if (key === '1') {
      cesta.mudarDesign(1); // Retângulo
    } else if (key === '2') {
      cesta.mudarDesign(2); // Elipse
    } else if (key === '3') {
      cesta.mudarDesign(3); // Retangulo inclinado
    } else if (key === '4') {
      cesta.mudarDesign(4); // Retangulo com bordas arredondadas
    } else if (key === '5') {
      cesta.mudarDesign(5); // Triângulo
    }
  }
}
