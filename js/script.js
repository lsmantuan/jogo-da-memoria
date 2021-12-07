var view = {
    // exibe uma mensage na tela
    exibirMensagem: function(texto) {
        var areaMensagem = document.getElementById("areaMensagem");
        areaMensagem.innerHTML = texto;
    },

    // altera o status da carta
    virarCarta: function(carta, status) {
        var areaCarta = document.getElementById(carta);
        if (status === "visivel") {
            areaCarta.style.backgroundImage = "url(/imagens/" + model.consultarImagem(carta) + ".jpg)";
            areaCarta.classList.remove("oculta")
            areaCarta.classList.add("visivel")
        } else if (status === "oculta") {
            areaCarta.style.backgroundImage = "url(/imagens/00.jpg)";
            areaCarta.classList.remove("visivel")
            areaCarta.classList.add("oculta")
        }
    }
};

var model = {
    tempo: 1000,
    viradas: 0,
    palpites: {par: ["",""] },
    pares: [{par: ["", ""], imagem: "", virada: false},
            {par: ["", ""], imagem: "", virada: false}],

    consultarImagem: function(carta) {
        for (let i = 0; i < this.pares.length; i++) {
            var parImagem = this.pares[i].par.indexOf(carta);
            if (parImagem >= 0) {
                return this.pares[i].imagem;
            }
        }
    },

    // atribui aleatoriamente imagens nas cartas
    atribuirImagem: function() {
        for (let i = 0; i < this.pares.length; i++) {
            var imagemAtribuida = i + 1;
            this.pares[i].imagem = imagemAtribuida.addZero();
        }
    },

    // adiciona o palpite e verifica se houve dois acertos
    adicionarPalpite: function(posicao) {
        var palpite = this.palpites.par;
        if (!palpite[0]) {
            palpite[0] = posicao;
        } else if (!palpite[1]) {
            if (posicao !== palpite[0]) {
                palpite[1] = posicao;
                if (model.compararPalpite()) {
                    view.exibirMensagem ("Parabéns");
                    var cartaA = document.getElementById(palpite[0]);
                    var cartaB = document.getElementById(palpite[1]);
                    cartaA.onclick = "";
                    cartaB.onclick = "";
                    palpite[0] = "";
                    palpite[1] = "";
                    this.viradas++;
                    if (model.verificarVitoria()) {
                        view.exibirMensagem ("Terminou!");
                    }
                } else {
                    view.exibirMensagem ("Errou!");
                    setTimeout(function() {
                        view.virarCarta(palpite[0], "oculta");
                        view.virarCarta(palpite[1], "oculta");
                        palpite[0] = "";
                        palpite[1] = "";
                    }, this.tempo);
                };
            };
        };
    },

    verificarVitoria: function() {
        if (this.pares.length === this.viradas) {
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
                }
            };
        };
        return false;
    },
    
    criarPar: function() {
        var parGerado = [];
        for (let i = 0; i < this.pares.length; i++) {
                do {
                    var linha = Math.floor(Math.random() * this.pares.length);
                    var coluna = Math.floor(Math.random() * this.pares.length)
                    var parTeste = linha + "" + coluna;
                    console.log(parTeste);
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
    model.atribuirImagem();
    }
};

var controller = {
    virar: function(event) {
        var alvo = event.target.id;
        view.virarCarta(alvo, "visivel");
        model.adicionarPalpite(alvo);
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
    var cartas = document.getElementsByClassName("carta");
    for (let i = 0; i < cartas.length; i++) {
        cartas[i].onclick = controller.virar;
    }
};

model.criarPares();