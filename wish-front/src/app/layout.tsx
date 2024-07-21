import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/index.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wishlinx",
  description: "Helping the wish fairy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader />
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
