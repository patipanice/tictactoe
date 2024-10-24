export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "TicTacToe",
  description: "tictactoe game",
  navItems: [
    {
      label: "TicTacToe",
      href: "/tictactoe",
    },
  ],
  navMenuItems: [
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
