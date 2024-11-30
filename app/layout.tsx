import type { Metadata } from "next";
import { Inter } from "next/font/google"; /
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const currentLanguage = "en"; 

export const metadata: Metadata = {
  title: "Gestión de Notas",
  description: "Plataforma de gestión de notas para Estudiantes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={currentLanguage}>
      <head>
        {
          Object.entries(metadata).map(([key, value]) => (
            <meta key={key} name={key} content={value} />
          ))
        }
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
      </head>
      <body className={`${inter.className} antialiased bg-gray_secondary`}>
        {children}
      </body>
    </html>
  );
}
