import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Medical Professional's Admin Dashboard",
  description: "Medical dashboard for Medical Professionals",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body  className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
