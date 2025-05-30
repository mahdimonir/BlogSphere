import { AuthProvider } from "@/context/AuthContext";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Footer from "./components/footer/footer";
import GoToTop from "./components/GoToTop";
import Header from "./components/header/header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BlogSphere",
  description: "A blog platform for sharing ideas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-100 dark:bg-gray-900 antialiased`}
        cz-shortcut-listen="true"
      >
        <AuthProvider>
          <Header />
          {children}
          <Footer />
          <GoToTop />
        </AuthProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
