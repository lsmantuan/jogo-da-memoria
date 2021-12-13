view = {
    // exibe a mensagem na tela
    exibirMensagem: function(texto) {
        var areaMensagem = document.getElementById("areaMensagem");
        areaMensagem.innerHTML = texto;
    },

    // exibe o nome do personagem na tela
    exibirPersonagem: function(texto) {
        var areaPersonagem = document.getElementById("areaPersonagem");
        areaPersonagem.innerHTML = texto;
    },

    // rotaciona a carta
    virarCarta: function(carta, status) {
    if (carta.length === 2) {
            var areaCarta = document.getElementById("C" + carta);
            if (status === "frente") {
                areaCarta.style.transform = "rotateY(180deg)";
            } else if (status === "verso") {
                areaCarta.style.transform = "rotateY(0deg)";
            };
        };   
    }
};

var model = {
    tempoInicial: "",
    tempoFinal: "",
    tempoTotal: 0,
    paresVirados: 0,
    totalPares: 8,
    totalTentativas: 0,
    palpites: ["",""],
    pares: [{par: ["", ""], imagem: "01", virada: false}, 
            {par: ["", ""], imagem: "02", virada: false},
            {par: ["", ""], imagem: "03", virada: false},
            {par: ["", ""], imagem: "04", virada: false},
            {par: ["", ""], imagem: "05", virada: false},
            {par: ["", ""], imagem: "06", virada: false},
            {par: ["", ""], imagem: "07", virada: false},
            {par: ["", ""], imagem: "08", virada: false}],
    personagens: {imagem: ["01", "02", "03", "04", "05", "06", "07", "08"], 
                  nome: ["Cosmo", "Dwight", "George", "Gob", "Larry", "Liz", "Saul", "Selina"] },

    // atribui as imagens nas cartas
    atribuirImagemDiv: function() {
        for (let i = 0; i < this.pares.length; i++) {
            for (let j = 0; j < 2; j++) {
                var cartaVerso = document.getElementById("V" + this.pares[i].par[j]);
                cartaVerso.style.backgroundImage = "url(imagens/" + this.pares[i].imagem + ".jpg)";
            };
        };
    },

    // retorna a imagem da carta clicada
    consultarImagem: function(alvo) {
        for (let i = 0; i < this.pares.length; i++) {
            var parImagem = this.pares[i].par.indexOf(alvo);
            if (parImagem >= 0) {
                return this.pares[i].imagem;
            };
        };
    },

    // retorna o personagem da carta clicada
    consultarPersonagem: function(alvo) {
        var imagem = model.consultarImagem(alvo);
        var indice = this.personagens.imagem.indexOf(imagem);
        var personagem = this.personagens.nome[indice];
        return personagem;
    },

    // adiciona o palpite e verifica se houve dois acertos
    adicionarPalpite: function(alvo) {
        var palpite = this.palpites;
            if (!palpite[0]) {
                palpite[0] = alvo;
            } else {
                palpite[1] = alvo;
                    if (model.compararPalpite()) {
                        view.exibirMensagem("Acertou!");
                        model.configurarPartida("completo");
                        this.paresVirados++;
                        if (model.verificarVitoria()) {
                            this.tempoTotal = model.cronometro("fim");
                            view.exibirMensagem("Parabéns. Você terminou após " + this.totalTentativas + " tentativas e em " + this.tempoTotal + " segundos!");
                            setTimeout(function() {
                                view.exibirMensagem("Clique em iniciar para começar!");
                            }, 2000);
                        };
                    } else {
                        model.desativarVirar();
                        view.exibirMensagem("Errou!");
                        setTimeout(function() {
                            model.configurarPartida("parcial");
                            model.ativarVirar();
                        }, 1000);
                    };
            };
    },

    // coloca o jogo na configuração inicial VERIFICAR VERIFICAR VERIFICAR VERIFICAR
    configurarPartida: function(tipo) {
        if (tipo === "completo") {
            for (let i = 0; i < 2; i++) { 
                var palpite = this.palpites;
                var carta = document.getElementById(palpite[i]);
                //var par = this.pares[i];
                //par.virada = true;
                carta.onclick = "";
                palpite[i] = "";
            };           
        } else if (tipo === "parcial") {
            for (let i = 0; i < 2; i++) {
                var palpite = this.palpites;
                view.virarCarta(palpite[i], "verso");
                palpite[i] = "";
            };
        };
    },

    // verifica se o jogo terminou
    verificarVitoria: function() {
        if (this.pares.length === this.paresVirados) {
            return true;
        } else {
            return false;
        }
    },

    // desativa o clique nas cartas
    desativarVirar: function() {
        var cartas = document.getElementsByClassName("carta");
        for (let i = 0; i < cartas.length; i++) {
            cartas[i].onclick = "";
        }
    },

    // ativa o clique nas cartas
    ativarVirar: function() {
        var cartas = document.getElementsByClassName("carta");
        for (let i = 0; i < cartas.length; i++) {
            cartas[i].onclick = controller.virar
        }
    },

    // verifica se os dois palpites estão no mesmo par 
    compararPalpite: function() {
        for (let j = 0; j < this.pares.length; j++) {
            var virada = this.pares[j].virada;
            var acertos = 0;
            for (let i = 0; i < 2; i++) {
                var palpite = this.palpites[i];
                if (!virada) {
                    var carta = this.pares[j].par.indexOf(palpite);
                    if (carta >= 0) {
                        acertos++;
                        if (acertos === 2) {
                            this.pares[j].virada = true;
                            return true;
                        };
                    };    
                };
            };
        };
        return false;
    },

    // exibe todas as cartas
    exibirCartas: function() {
        for (let i = 0; i < this.totalPares / 2; i++) {
            for (let j = 0; j < this.totalPares / 2; j++) {
            view.virarCarta(i + "" + j, "frente");
            }
        };
        setTimeout(function() {
            for (let i = 0; i < model.totalPares / 2; i++) {
                for (let j = 0; j < model.totalPares / 2; j++) {
                view.virarCarta(i + "" + j, "verso");
                }
            };
        }, 3000);
    },

    // calcula o tempo gasto em segundos
    cronometro: function(tipo) {
        if (tipo === "inicio") {
            this.tempoInicial = new Date();
        } else if (tipo === "fim") {
            this.tempoFinal = new Date();
            var tempoTotal = Math.abs(this.tempoFinal.getTime() - this.tempoInicial.getTime());
            return Math.round(tempoTotal / 1000);
        }
    },

    limparParesCartas: function() {
        var vazio = ["", ""]
        for (let i = 0; i < this.pares.length; i++) {
            for (let j = 0; j < 2; j++) {
                par = this.pares[i].par[j];
                virada = this.pares[i].virada
                this.pares[i].par.push(vazio)
                console.log(par);
                console.log(virada);
            }
        }
    },

    // cria pares de cartas
    criarParesCartas: function() {
        model.limparParesCartas();
        for (let i = 0; i < this.pares.length; i++) {
            do {
                var parCorreto = model.criarParCartas();
            } while (model.comparaCarta(parCorreto));
            this.pares[i].par = parCorreto;
        }
        model.atribuirImagemDiv();
        model.paresVirados = 0;
        model.totalTentativas = 0;
    },

    // retorna um par aleatório de cartas (adicionar verificação de cartas iguais)
    criarParCartas: function() {
        var parProvisorio = [];
            for (let i = 0; i < 2; i++) {
                do {
                    var linha = Math.floor(Math.random() * (this.totalPares / 2));
                    var coluna = Math.floor(Math.random() * (this.totalPares / 2));
                    var cartaProvisoria = linha + "" + coluna;
                } while (model.existeCarta(cartaProvisoria));
                parProvisorio.push(cartaProvisoria);
            };
            return parProvisorio;
    },

    // verifica se a carta existe nos pares do array
    existeCarta: function(cartaTeste) {
        for (let i = 0; i < this.pares.length; i++) {
            var cartaExiste = this.pares[i].par.indexOf(cartaTeste);
            if (cartaExiste >= 0) {
            return true;
            };
        };
        return false;
    },

    comparaCarta: function(parTeste) {
        if (parTeste[0] === parTeste[1]) {
            return true;
        }
    }
};

var controller = {
    // rotaciona a carta
    virar: function(event) {
        var alvo = event.target.id;
        var lado = event.target.className;
        if (lado === "frente") {
            view.virarCarta(alvo, "frente");
            model.totalTentativas++;
            model.adicionarPalpite(alvo);
            view.exibirPersonagem(model.consultarPersonagem(alvo));
        };
    },

    // inicia o jogo
    iniciar: function() {
        model.cronometro("inicio");
        model.criarParesCartas();
        model.exibirCartas();
        model.ativarVirar();
        setTimeout(function() {
            view.exibirMensagem("Clique nas cartas para virar.")
        }, 1000);
    }
};

Number.prototype.addZero = function() {
    var valor = this;
    if (valor < 10) {
        return "0" + valor;   
    } else {
        return valor;               
    }
};

window.onload = function() {
    var iniciar = document.getElementById("iniciar")
    iniciar.onclick = controller.iniciar;
};

model.limparParesCartas();