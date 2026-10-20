import "./globals.css";

export const metadata = {
  title: "مَدار | MADAR - المنصة الإسلامية وصانع الريلز",
  description: "منصة تفاعلية شاملة للقرآن الكريم، التفاسير، الأحاديث، والأدوات الإسلامية مع صانع ريلز سينمائي",
  manifest: "/manifest.json",
  themeColor: "#10b981",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "مَدار",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body className="bg-[#05080b] text-gray-100 antialiased selection:bg-emerald-500/30">
        {children}
      </body>
    </html>
  );
}