import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import { ThemeProvider } from "./context/ThemeContext";

export const metadata = {
  title: "Post-it",
  description: "Comparte tus pensamientos en post-it",
  icons: [
    {
      rel: "icon",
      type: "image/svg+xml",
      media: "(prefers-color-scheme: light)",
      url: "/images/logo-light.svg",
      href: "/images/logo-light.svg",
    },
    {
      rel: "icon",
      type: "image/svg+xml",
      media: "(prefers-color-scheme: dark)",
      url: "/images/logo-dark.svg",
      href: "/images/logo-dark.svg",
    },
    {
      rel: "shortcut icon",
      url: "/favicon.svg",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="transition-colors duration-200">
        <ThemeProvider>
          <Navbar />
          <main className="pt-14">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
