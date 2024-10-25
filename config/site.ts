export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "TicTacToe",
  description: "tictactoe game",
  navItems: [
    {
      label: "Home",
      href: "/tictactoe",
    },
    {
      label: "Leaderboard",
      href: "/leaderboard",
    },
  ],
  navMenuItems: [
    {
      label: "Leaderboard",
      href: "/leaderboard",
    },
  ],
  links: {
    github: "https://github.com/patipanice",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
