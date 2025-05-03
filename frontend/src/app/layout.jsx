import { AuthProvider } from "@/context/AuthContext";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
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
        <html lang="en" >
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased `}>  
                   <AuthProvider>
                    {children}
                    </AuthProvider>
                <Toaster position="top-center" /> {/* 🛑 ADD THIS */}
            </body>
        </html>
    );
}
