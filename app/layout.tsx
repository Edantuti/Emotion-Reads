import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CopilotKit } from "@copilotkit/react-core";
import { BookOpen } from "lucide-react";
import "@copilotkit/react-ui/styles.css";
import "./globals.css";
import { CopilotPopup } from "@copilotkit/react-ui";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Emotion Reads",
  description: "Book Recommendation based on emotional state of human",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <header className="py-6 bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-center text-blue-600">
              Emotional Reads
            </h1>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8 min-h-screen">
          <div className="max-w-2xl mx-auto">
            <p className="text-center mb-6 text-gray-600">
              Describe how you{"'"}re feeling, and we{"'"}ll recommend a book
              that matches your emotional state.
            </p>

            <CopilotKit runtimeUrl="/api/copilotkit">
              {children}
              <CopilotPopup />
            </CopilotKit>
          </div>
        </main>
        <footer className="py-6 bg-gray-100">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>Discover your next emotional journey through literature.</p>
            <div className="mt-2 flex justify-center items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              <span>Emotional Reads &copy; {new Date().getFullYear()}</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
