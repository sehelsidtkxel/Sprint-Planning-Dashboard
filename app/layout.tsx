import "./globals.css";

export const metadata = {
  title: "Sprint Planning Dashboard",
  description: "Google Sheets Powered Sprint Dashboard"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
