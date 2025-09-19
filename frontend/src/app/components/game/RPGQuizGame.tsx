import { useEffect, useRef } from "react";
import { config } from "@/app/game/config";
import MainScene from "@/app/game/scenes/MainScene";
import Phaser from "phaser";

export default function RPGQuizGame() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    let Phaser: typeof import("phaser").default;


    const loadPhaser = async () => {
      Phaser = (await import("phaser")).default;

      if (gameRef.current) return;

      const gameConfig = { ...config, scene: MainScene };
      gameRef.current = new Phaser.Game(gameConfig);
    };

    loadPhaser();

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div id="game-container" className="rounded-2xl shadow-lg"></div>
    </div>
  );
}
