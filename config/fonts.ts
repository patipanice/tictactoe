import { Fira_Code as FontMono, Inter as FontSans, Kanit } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});


export const fontKanit = Kanit({
    subsets: ['latin','thai','latin-ext'],
    // display: 'swap',
    weight: "300",
    variable: '--font-kanit'
})
