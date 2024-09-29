const NavBar = () => {
    return (
        <div className="flex justify-between bg-red-400 p-4">
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Cursive' }}>ビデオジェネレーター</h1>

            <div className="flex space-x-4">
                <a href="/login" className="text-white">ログイン</a>
                <a href="/signup" className="text-white">サインアップ</a>
            </div>
        </div>
    );
}

export default NavBar;