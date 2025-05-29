import Link from 'next/link';

export default function Navbar() {
    return (

        <nav className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <Link href="/">
                        <span className="text-xl font-bold">Remuneration App</span>
                    </Link>
                    <div className="flex space-x-4">
                        <Link href="/employees">
                            <span className="hover:bg-blue-700 px-3 py-2 rounded">Employees</span>
                        </Link>
                        <Link href="/work-logs">
                            <span className="hover:bg-blue-700 px-3 py-2 rounded">Work Logs</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}