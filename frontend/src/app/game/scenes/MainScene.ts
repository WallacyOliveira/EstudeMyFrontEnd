import * as Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  // 💖 HP
  jogadorHP = 100;
  inimigoHP = 100;

  // 🎨 Gráficos e textos
  jogadorHPBar!: Phaser.GameObjects.Graphics;
  inimigoHPBar!: Phaser.GameObjects.Graphics;
  balao!: Phaser.GameObjects.Graphics;
  perguntaText!: Phaser.GameObjects.Text;
  opcoes: Phaser.GameObjects.Text[] = [];

  // 🏇 Sprites
  player!: Phaser.GameObjects.Sprite;
  enemy!: Phaser.GameObjects.Sprite;

  // 📌 Perguntas
  perguntas = [
    {
      pergunta: "Qual é a capital do Brasil?",
      opcoes: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador", "Fortaleza"],
      resposta: "Brasília",
    },
    {
      pergunta: "Qual é 2 + 2?",
      opcoes: ["3", "4", "5", "6", "7"],
      resposta: "4",
    },
    {
      pergunta: "Qual é a cor do céu?",
      opcoes: ["Verde", "Azul", "Vermelho", "Amarelo", "Preto"],
      resposta: "Azul",
    },
  ];
  perguntaAtual: any;

  // 🎨 Constantes de estilo
  readonly BALAO_X = 50;
  readonly BALAO_Y = 50;
  readonly BALAO_WIDTH = 700; // ajustável dinamicamente se quiser
  readonly BALAO_HEIGHT = 250;
  readonly PADDING = 20;
  readonly OPCOES_GAP = 35;
  readonly LETRAS = ["A", "B", "C", "D", "E"];

  constructor() {
    super("MainScene");
  }

  preload() {
    this.load.image("background", "/img/background-image-login-register.png");
    this.load.image("player", "/img/pixel_art_small (1).png");
    this.load.image("enemy", "/img/cavaleiro_inimigo.png");
  }

  create() {
    this.createBackground();
    this.createSprites();
    this.createHP();
    this.createPerguntaBalao();
    this.loadPergunta();
  }

  // ----------------------
  // Criação de elementos
  // ----------------------
  createBackground() {
    const bg = this.add.image(0, 0, "background").setOrigin(0, 0);
    bg.setDisplaySize(this.scale.width, this.scale.height);

    this.scale.on("resize", (gameSize: Phaser.Structs.Size) => {
      bg.setDisplaySize(gameSize.width, gameSize.height);
    });
  }

  createSprites() {
    this.player = this.add.sprite(150, this.scale.height - 100, "player")
      .setOrigin(0.5, 1)
      .setScale(0.5);

    this.enemy = this.add.sprite(this.scale.width - 150, this.scale.height - 100, "enemy")
      .setOrigin(0.5, 1)
      .setScale(0.3);
  }

  createHP() {
    this.add.text(20, 10, "Jogador", { fontSize: "14px", color: "#fff" });
    this.add.text(220, 10, "Inimigo", { fontSize: "14px", color: "#fff" });

    this.jogadorHPBar = this.add.graphics();
    this.inimigoHPBar = this.add.graphics();
    this.updateHPBars();
  }

  createPerguntaBalao() {
    this.balao = this.add.graphics();
    this.balao.fillStyle(0x222222, 0.8);
    this.balao.fillRoundedRect(this.BALAO_X, this.BALAO_Y, this.BALAO_WIDTH, this.BALAO_HEIGHT, 16);

    this.perguntaText = this.add.text(
      this.BALAO_X + this.PADDING,
      this.BALAO_Y + this.PADDING,
      "Carregando pergunta...",
      {
        fontSize: "18px",
        color: "#fff",
        wordWrap: { width: this.BALAO_WIDTH - this.PADDING * 2 },
      }
    );
  }

  // ----------------------
  // HP
  // ----------------------
  updateHPBars() {
    this.jogadorHPBar.clear();
    this.inimigoHPBar.clear();

    this.jogadorHPBar.fillStyle(0x00ff00, 1);
    this.jogadorHPBar.fillRect(20, 30, (this.jogadorHP / 100) * 150, 15);

    this.inimigoHPBar.fillStyle(0xff0000, 1);
    this.inimigoHPBar.fillRect(220, 30, (this.inimigoHP / 100) * 150, 15);
  }

  // ----------------------
  // Perguntas
  // ----------------------
  loadPergunta() {
    // Embaralhar perguntas para não repetir
    const perguntasShuffle = Phaser.Utils.Array.Shuffle([...this.perguntas]);
    this.perguntaAtual = perguntasShuffle[0];

    this.perguntaText.setText(this.perguntaAtual.pergunta);
    this.renderOpcoes(this.perguntaAtual.opcoes);
  }

  renderOpcoes(opcoesArray: string[]) {
    this.opcoes.forEach((btn) => btn.destroy());
    this.opcoes = [];

    const startX = this.BALAO_X + this.PADDING;
    let startY = this.BALAO_Y + 60;

    opcoesArray.forEach((opcao, index) => {
      const btn = this.createButton(
        `${this.LETRAS[index]}: ${opcao}`,
        startX,
        startY + index * this.OPCOES_GAP,
        () => this.verificarResposta(opcao),
        this.BALAO_WIDTH - this.PADDING * 2
      );
      this.opcoes.push(btn);
    });
  }

  // ----------------------
  // Botão auxiliar
  // ----------------------
  createButton(text: string, x: number, y: number, callback: () => void, width?: number) {
    const btn = this.add.text(x, y, text, {
      fontSize: "16px",
      color: "#fff",
      backgroundColor: "#333",
      padding: { x: 10, y: 6 },
      fixedWidth: width,
    })
    .setInteractive({ useHandCursor: true })
    .on("pointerdown", callback);

    return btn;
  }

  // ----------------------
  // Verificação de resposta
  // ----------------------
  verificarResposta(resposta: string) {
    this.opcoes.forEach((btn) => btn.disableInteractive());

    if (resposta === this.perguntaAtual.resposta) {
      this.inimigoHP = Math.max(this.inimigoHP - Phaser.Math.Between(15, 25), 0);
      this.perguntaText.setText("✅ Acertou! Você atacou!");
      this.animaAtaque(this.player, this.enemy);
    } else {
      this.jogadorHP = Math.max(this.jogadorHP - Phaser.Math.Between(10, 20), 0);
      this.perguntaText.setText("❌ Errou! O inimigo atacou!");
      this.animaAtaque(this.enemy, this.player);
    }

    this.updateHPBars();

    if (this.jogadorHP <= 0 || this.inimigoHP <= 0) {
      this.time.delayedCall(1000, () => {
        this.mostrarTelaFinal(this.jogadorHP <= 0 ? "derrota" : "vitoria");
      });
    } else {
      this.time.delayedCall(1200, () => this.loadPergunta());
    }
  }

  animaAtaque(atacante: Phaser.GameObjects.Sprite, alvo: Phaser.GameObjects.Sprite) {
    this.tweens.add({
      targets: atacante,
      x: alvo.x - 50,
      y: atacante.y - 20,
      duration: 300,
      yoyo: true,
      ease: "Power1",
      onComplete: () => this.updateHPBars(),
    });
  }

  // ----------------------
// Tela final
// ----------------------
mostrarTelaFinal(tipo: "vitoria" | "derrota") {
  const overlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.7)
    .setOrigin(0, 0)
    .setAlpha(0);

  this.tweens.add({ targets: overlay, alpha: 1, duration: 500 });

  const texto = tipo === "vitoria" ? "🎉 Você venceu!" : "💀 Você perdeu!";
  const cor = tipo === "vitoria" ? "#00ff00" : "#ff0000";

  const endText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, texto, {
    fontSize: "36px",
    color: cor,
    fontStyle: "bold",
  }).setOrigin(0.5, 0.5).setAlpha(0);

  this.tweens.add({ targets: endText, alpha: 1, duration: 600, delay: 300 });

  // Botão principal (continuar ou tentar novamente)
  const textoBtnPrincipal = tipo === "vitoria" ? "🔄 Continuar" : "🔄 Tentar novamente";
  const btnPrincipal = this.add.text(this.scale.width / 2, this.scale.height / 2 + 20, textoBtnPrincipal, {
    fontSize: "24px",
    color: "#fff",
    backgroundColor: "#333",
    padding: { x: 12, y: 6 },
  })
  .setOrigin(0.5, 0.5)
  .setAlpha(0)
  .setInteractive({ useHandCursor: true })
  .on("pointerdown", () => {
    overlay.destroy();
    endText.destroy();
    btnPrincipal.destroy();
    btnSair.destroy?.();

    // Reset HP e carregar nova pergunta
    this.jogadorHP = 100;
    this.inimigoHP = 100;
    this.updateHPBars();
    this.loadPergunta();
  });

  // Botão sair (sempre igual)
  const btnSair = this.add.text(this.scale.width / 2, this.scale.height / 2 + 70, "🚪 Sair", {
    fontSize: "24px",
    color: "#fff",
    backgroundColor: "#333",
    padding: { x: 12, y: 6 },
  })
  .setOrigin(0.5, 0.5)
  .setAlpha(0)
  .setInteractive({ useHandCursor: true })
  .on("pointerdown", () => {
    if (typeof window !== "undefined") window.location.href = "/pages/trilha";
  });

  // Animações de fade
  this.tweens.add({ targets: btnPrincipal, alpha: 1, duration: 500, delay: 800 });
  this.tweens.add({ targets: btnSair, alpha: 1, duration: 500, delay: 900 });
}

}
