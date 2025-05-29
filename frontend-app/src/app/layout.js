import './globals.css';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
        {children} {/* This will render your wrapper layout */}
        </body>
        </html>
    );
}