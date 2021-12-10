var view = {
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
                areaCarta.style.transform = "rotateY(180deg)"
            } else if (status === "verso") {
                areaCarta.style.transform = "rotateY(0deg)"
            }
        }        
    }
};

var model = {
    tempo: 1000,
    tempoInicial: "",
    tempoFinal: "",
    tempoTotal: 0,
    paresVirados: 0,
    totalPares: 2,
    totalTentativas: 0,
    palpites: {par: ["",""]},
    pares: [{par: ["", ""], imagem: "", virada: false}, {par: ["", ""], imagem: "", virada: false}],
    personagens: {imagem: ["01", "02"], nome: ["George Costanza", "Dwight Schrute"] },

    // atribui as imagens nos pares
    atribuirImagemPar: function() {
        for (let i = 0; i < this.totalPares; i++) {
            var imagemAtribuida = i + 1;
            this.pares[i].imagem = imagemAtribuida.addZero();
        }
    },

    // atribui as imagens nas cartas
    atribuirImagemDiv: function() {
        for (let i = 0; i < this.totalPares; i++) {
            for (let j = 0; j < this.pares[i].par.length; j++) {
                var cartaVerso = document.getElementById("V" + this.pares[i].par[j]);
                cartaVerso.style.backgroundImage = "url(imagens/" + this.pares[i].imagem + ".jpg)";
            }
        }
    },

    // retorna a imagem da carta clicada
    consultarImagem: function(alvo) {
        for (let i = 0; i < this.totalPares; i++) {
            var parImagem = this.pares[i].par.indexOf(alvo);
            if (parImagem >= 0) {
                return this.pares[i].imagem;
            }
        }
    },

    // retorna o personagem da carta clicada
    consultarPersonagem: function(alvo) {
        var imagem = this.consultarImagem(alvo);
        var indice = this.personagens.imagem.indexOf(imagem);
        var personagem = this.personagens.nome[indice];
        return personagem;
    },

    // adiciona o palpite e verifica se houve dois acertos
    adicionarPalpite: function(alvo) {
        var palpite = this.palpites.par;
            if (!palpite[0]) {
                palpite[0] = alvo;
            } else {
                palpite[1] = alvo;
                    if (model.compararPalpite()) {
                        view.exibirMensagem("Parabéns. Continue tentando...");
                        model.reiniciarJogo("completo");
                        this.paresVirados++;
                        if (model.verificarVitoria()) {
                            this.tempoTotal = model.cronometro("fim");
                            view.exibirMensagem("Parabéns. Você terminou após " + this.totalTentativas + " tentativas e em " + this.tempoTotal + " segundos!");
                            setTimeout(function() {
                                view.exibirMensagem("Clique em iniciar para começar!")
                            }, this.tempo * 4)
                        }
                    } else {
                        model.desativarVirar();
                        view.exibirMensagem("Errou! Continue tentando...");
                        setTimeout(function() {
                            model.reiniciarJogo("parcial");
                            model.ativarVirar();
                        }, this.tempo);
                    };
            };
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
            cartas[i].onclick = controller.virar;
        }
    },

    // coloca o jogo na configuração inicial
    reiniciarJogo: function(tipo) {
        if (tipo === "completo") {
            for (let i = 0; i < this.totalPares; i++) {
                var palpite = this.palpites.par;
                var carta = document.getElementById(palpite[i]);
                var par = this.pares[i];
                par.virada = false;
                carta.onclick = "";
                palpite[i] = "";           
            };           
        } else if (tipo === "parcial") {
            for (let i = 0; i < this.totalPares; i++) {
                var palpite = this.palpites.par;
                view.virarCarta(palpite[i], "verso");
                palpite[i] = "";
            };
        };
    },

    // verifica se o jogo terminou
    verificarVitoria: function() {
        if (this.pares.length === this.paresVirados) {
            return true;
        }
    },

    // verifica se os dois palpites estão no mesmo par
    compararPalpite: function() {
        for (let j = 0; j < this.pares.length; j++) {
            var virada = this.pares[j].virada;
            var acertos = 0;
            for (let i = 0; i < this.pares.length; i++) {
                var palpite = this.palpites.par[i];
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
   
    //------------------------------------------------------//

    criarPar: function() {
        var parGerado = [];
        for (let i = 0; i < this.pares.length; i++) {
                do {
                    var linha = Math.floor(Math.random() * this.pares.length);
                    var coluna = Math.floor(Math.random() * this.pares.length)
                    var parTeste = linha + "" + coluna;
                } while (model.existePar(parTeste));
                parGerado.push(parTeste);  
        }
        return parGerado;
    },

    existePar: function(parCompara) {
        for (let i = 0; i < this.pares.length; i++) {
            var parExiste = this.pares[i].par.indexOf(parCompara);
            if (parExiste >= 0) {
                return true;
            } else {
                return false;
            }
        }
    },

    igualPar: function(parCompara) {
        if (parCompara[0] === parCompara[1]) {
            return true;
        }
    },

    criarPares: function() {
        for (let i = 0; i < this.pares.length; i++) {
            do {
                var parCorreto = model.criarPar();
            } while (model.igualPar(parCorreto));
           this.pares[i].par = parCorreto;        
        }
    model.atribuirImagemPar();
    model.atribuirImagemDiv();
    model.paresVirados = 0;
    model.totalTentativas = 0;
    },

    exibirCartas: function() {
        var c = this.totalPares;

        for (let i = 0; i < c; i++) {
            for (let j = 0; j < c; j++) {
            view.virarCarta(i + "" + j, "frente");
            }
        };

        setTimeout(function() {
            for (let i = 0; i < c; i++) {
                for (let j = 0; j < c; j++) {
                view.virarCarta(i + "" + j, "verso");
                }
            };
        }, this.tempo);
    },

    cronometro: function(tipo) {
        if (tipo === "inicio") {
            this.tempoInicial = new Date();
        } else if (tipo === "fim") {
            this.tempoFinal = new Date();
            var tempoTotal = Math.abs(this.tempoFinal.getTime() - this.tempoInicial.getTime());
            return Math.round(tempoTotal / 1000);
        }
    }
};

var controller = {
    virar: function(event) {
        var alvo = event.target.id;
        var lado = event.target.className;
        if (lado === "frente") {
            view.virarCarta(alvo, "frente");
            model.totalTentativas++;
            model.adicionarPalpite(alvo);
            view.exibirPersonagem(model.consultarPersonagem(alvo));
        }
    },

    iniciar: function() {
        model.cronometro("inicio");
        model.exibirCartas();
        model.criarPares();
        model.ativarVirar();
        setTimeout(function() {
            view.exibirMensagem("Clique nas cartas para virar.")
        }, model.tempo)
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