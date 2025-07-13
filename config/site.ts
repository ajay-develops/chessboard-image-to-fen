export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Chessboard Image to Fen",
  description:
    "Convert chessboard images to fen code using machine learning tools - MobileNet v3 and yolo. Remake by Ajay Develops",
  navItems: [
    {
      label: "Training 🏋 Model 🏃‍♀️",
      href: "/train-piece-recognition-model",
    },
  ],
  navMenuItems: [
    {
      label: "Train Piece Recognition Model",
      href: "/train-piece-recognition-model",
    },
  ],
  links: {
    github: "https://github.com/ajay-develops/chessboard-image-to-fen",
    twitter: "https://x.com/ajay_develops",
    docs: "https://github.com/ajay-develops/chessboard-image-to-fenhttps://github.com/ajay-develops/chessboard-image-to-fen/blob/main/README.md",
    discord: "https://discord.gg/BgrPcPc89M",
    sponsor: "https://www.patreon.com/c/AjayDevelops",
  },
};
