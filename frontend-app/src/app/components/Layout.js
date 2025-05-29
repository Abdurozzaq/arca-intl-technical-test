import Navbar from './Navbar';
import '../../app/globals.css';

export default function Layout({children}) {
    return (
        <html>
        <body>
        <div className="min-h-screen bg-gray-50">
            <Navbar/>
            <main className="container mx-auto px-4 py-8">{children}</main>
        </div>

        </body>
        </html>
    );
}