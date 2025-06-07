import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const linkClass = (path: string) =>
    `px-4 py-2 rounded ${
      location.pathname === path ? "bg-accent text-black" : "hover:bg-bgLight"
    }`;

  return (
    <header className="bg-bgDark p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">CryptoPortfólio</h1>
      <nav className="space-x-2">
        <Link to="/" className={linkClass("/")}>Portolio</Link>
        <Link to="/historico" className={linkClass("/historico")}>History</Link>
      </nav>
    </header>
  );
}
