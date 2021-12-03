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
            areaCarta.classList.remove("oculta")
            areaCarta.classList.add("visivel")
        } else if (status === "oculta") {
            areaCarta.classList.remove("visivel")
            areaCarta.classList.add("oculta")
        }
    }
};

var model = {
    tempo: 1000,
    viradas: 0,
    tabuleiro: 2,
    palpites: {par: ["",""] },
    pares: [{par: ["00", "01"], virada: false},
            {par: ["10", "11"], virada: false}],

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
        linha = Math.floor(Math.random() * this.tabuleiro);
        coluna = Math.floor(Math.random() * this.tabuleiro);
        var parNovo = [];

        for (let i = 0; i < this.pares.length; i++) {
            parNovo.push(linha + "" + coluna);
        };
        return parNovo;
    },

    igualPar: function(parGerado) {
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            
        }
    }
};



model.criarPar();

var controller = {
    virar: function(event) {
        var alvo = event.target.id;
        view.virarCarta(alvo, "visivel");
        model.adicionarPalpite(alvo);
    }
};

window.onload = function() {
    var cartas = document.getElementsByClassName("carta");
    for (let i = 0; i < cartas.length; i++) {
        cartas[i].onclick = controller.virar;
    }
}