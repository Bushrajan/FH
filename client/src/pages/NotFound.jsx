

const NotFound = () => {
    return (
        <div>
            <div className="min-h-screen flex flex-col items-center justify-center text-2xl gap-4">
                <img src="/notfound-404.gif" alt="404 Not Found" className="w-72 h-72 object-contain" />
                <div>404 - Page Not Found</div>
                <a href="/dashboard" className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Go to dashboard</a>
            </div>
        </div>
    )
}

export default NotFound