import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Post-it",
  description: "Comparte tus pensamientos en post-it",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="pt-14">{children}</main>
      </body>
    </html>
  );
}
