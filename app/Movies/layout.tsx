//Components
import Nav from "@/app/components/Movie-components/Nav";
import SessionWrapper from "../components/SessionWrapper";
import { ThemeProvider } from "../DarkTheme/ThemeContext";
//layout
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./movieStyles.css";

const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Movies",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <ThemeProvider>
        <html lang="en" className={`${roboto.className}`}>
          <body className={` bg-[#EEE3CB] `}>
            <Nav />
            {children}
          </body>
        </html>
      </ThemeProvider>
    </SessionWrapper>
  );
}
