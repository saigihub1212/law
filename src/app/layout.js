import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIWidget from "@/components/AIWidget";
import SEOManager from "@/components/SEOManager";

export const metadata = {
  title: "SR4IPR Partners | Elite IP Rights Legal Counsel",
  description: "Premier international intellectual property law firm specializing in patents, trademarks, copyrights, design registration, and IP litigation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        <Providers>
          <SEOManager />
          <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#171717] text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
            {/* Header Navbar */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-grow">
              {children}
            </main>

            {/* Footer layout */}
            <Footer />

            {/* AI Assistant widget */}
            <AIWidget />
          </div>
        </Providers>
      </body>
    </html>
  );
}
