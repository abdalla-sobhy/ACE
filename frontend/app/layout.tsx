import type { Metadata } from "next";
import { Geist, Geist_Mono, Cairo, Alexandria } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import ClientBody from "../components/ClientBody";
import AuthExpirationChecker from '@/components/AuthExpirationChecker';
import { AuthProvider } from '@/context/AuthContext';
import { getTheme } from "@/app/actions/theme";
import Chatbot from "@/components/Chatbot/Chatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

const alexandria = Alexandria({
  variable: "--font-alexandria",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Edvance",
  description: "Educational platform bridging learning and career development",
  icons: {
    icon: '/images/favicont_transparent.png',
  },
};

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }

// // Theme export

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>
//         <ThemeProvider>{children}</ThemeProvider>
//       </body>
//     </html>
//   );
// }

//did that because next only allow one declaration per file
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getTheme();

  return (
    <html lang="en">
      <ClientBody
        className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} ${alexandria.variable} antialiased`}
      >
        <LanguageProvider>
          <AuthProvider>
            <AuthExpirationChecker>
              <ThemeProvider initialTheme={theme}>
                {children}
                <Chatbot />
              </ThemeProvider>
            </AuthExpirationChecker>
          </AuthProvider>
        </LanguageProvider>
      </ClientBody>
    </html>
  );
}