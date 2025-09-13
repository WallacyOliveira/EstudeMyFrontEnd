//Teste sem API
import * as Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  jogadorHP = 100;
  inimigoHP = 100;

  jogadorHPBar!: Phaser.GameObjects.Graphics;
  inimigoHPBar!: Phaser.GameObjects.Graphics;

  balao!: Phaser.GameObjects.Graphics;
  perguntaText!: Phaser.GameObjects.Text;
  opcoes: Phaser.GameObjects.Text[] = [];
  perguntaAtual: any;

  player!: Phaser.GameObjects.Sprite;
  enemy!: Phaser.GameObjects.Sprite;

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

  constructor() {
    super("MainScene");
  }

  preload() {
    this.load.image("background", "/img/background-image-login-register.png");
    this.load.image("player", "/img/pixel_art_small (1).png");
    this.load.image("enemy", "/img/enemy.png");
  }

  create() {
    // Background
    const bg = this.add.image(0, 0, "background").setOrigin(0, 0);
    bg.setDisplaySize(this.scale.width, this.scale.height);
    this.scale.on("resize", (gameSize: Phaser.Structs.Size) => {
      bg.setDisplaySize(gameSize.width, gameSize.height);
    });

    // 🏇 Cavaleiro (player)
    this.player = this.add.sprite(150, this.scale.height - 100, "player")
      .setOrigin(0.5, 1)
      .setScale(0.5);

    // 👹 Inimigo
    this.enemy = this.add.sprite(this.scale.width - 150, this.scale.height - 100, "enemy")
      .setOrigin(0.5, 1)
      .setScale(2);

    // HP textos
    this.add.text(20, 10, "Jogador", { fontSize: "14px", color: "#fff" });
    this.add.text(220, 10, "Inimigo", { fontSize: "14px", color: "#fff" });

    // HP bars
    this.jogadorHPBar = this.add.graphics();
    this.inimigoHPBar = this.add.graphics();
    this.updateHPBars();

    // Balão de pergunta no topo
    const balaoX = 50;
    const balaoY = 50; 
    const balaoWidth = this.scale.width - 100;
    const balaoHeight = 250;
    const padding = 20;

    this.balao = this.add.graphics();
    this.balao.fillStyle(0x222222, 0.8);
    this.balao.fillRoundedRect(balaoX, balaoY, balaoWidth, balaoHeight, 16);

    // Texto da pergunta
    this.perguntaText = this.add.text(
      balaoX + padding,
      balaoY + padding,
      "Carregando pergunta...",
      {
        fontSize: "18px",
        color: "#fff",
        wordWrap: { width: balaoWidth - padding * 2 },
      }
    );

    // Carrega primeira pergunta
    this.loadPergunta();
  }

  updateHPBars() {
    this.jogadorHPBar.clear();
    this.inimigoHPBar.clear();

    this.jogadorHPBar.fillStyle(0x00ff00, 1);
    this.jogadorHPBar.fillRect(20, 30, (this.jogadorHP / 100) * 150, 15);

    this.inimigoHPBar.fillStyle(0xff0000, 1);
    this.inimigoHPBar.fillRect(220, 30, (this.inimigoHP / 100) * 150, 15);
  }

  loadPergunta() {
    const pergunta = this.perguntas[Math.floor(Math.random() * this.perguntas.length)];
    this.perguntaAtual = pergunta;
    this.perguntaText.setText(pergunta.pergunta);
    this.renderOpcoes(pergunta.opcoes);
  }

  renderOpcoes(opcoesArray: string[]) {
    this.opcoes.forEach((btn) => btn.destroy());
    this.opcoes = [];

    const balaoX = 50;
    const balaoY = 50;
    const balaoWidth = this.scale.width - 100;
    const padding = 20;

    const startX = balaoX + padding;
    let startY = balaoY + 60; 
    const gap = 35;
    const letras = ["A", "B", "C", "D", "E"];

    opcoesArray.forEach((opcao, index) => {
      const btn = this.add.text(
        startX,
        startY + index * gap,
        `${letras[index]}: ${opcao}`,
        {
          fontSize: "16px",
          color: "#fff",
          backgroundColor: "#333",
          padding: { x: 10, y: 6 },
          fixedWidth: balaoWidth - padding * 2,
        }
      )
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => this.verificarResposta(opcao));

      this.opcoes.push(btn);
    });
  }

  verificarResposta(resposta: string) {
    this.opcoes.forEach((btn) => btn.disableInteractive());

    if (resposta === this.perguntaAtual.resposta) {
      this.inimigoHP = Math.max(this.inimigoHP - Phaser.Math.Between(15, 25), 0);
      this.perguntaText.setText("✅ Acertou! Você atacou!");

      // Animação do ataque do cavaleiro
      this.tweens.add({
        targets: this.player,
        x: this.enemy.x - 50,
        duration: 300,
        yoyo: true,
        onComplete: () => this.updateHPBars(),
      });

    } else {
      this.jogadorHP = Math.max(this.jogadorHP - Phaser.Math.Between(10, 20), 0);
      this.perguntaText.setText("❌ Errou! O inimigo atacou!");

      // Animação do inimigo atacando
      this.tweens.add({
        targets: this.enemy,
        x: this.enemy.x - 30,
        duration: 200,
        yoyo: true,
        onComplete: () => this.updateHPBars(),
      });
    }

    this.updateHPBars();

    if (this.jogadorHP <= 0 || this.inimigoHP <= 0) {
      this.time.delayedCall(1000, () => {
        this.perguntaText.setText(
          this.jogadorHP > 0 ? "🎉 Você venceu!" : "💀 Você perdeu..."
        );
      });
    } else {
      this.time.delayedCall(1200, () => this.loadPergunta());
    }
  }
}

