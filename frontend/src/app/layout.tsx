import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: "Pyramid — Task Management",
  description: "A task and project management workspace.",
};

const themeInitScript = `
(function () {
  try {
    var mode = localStorage.getItem('pyramid.themeMode') || 'LIGHT';
    var accent = (localStorage.getItem('pyramid.accentColor') || 'BLUE').toLowerCase();
    var root = document.documentElement;
    if (mode === 'DARK') root.classList.add('dark');
    root.setAttribute('data-accent', accent);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}