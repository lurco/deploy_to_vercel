import { Link, NavLink } from "react-router";

export default function Nav() {
  const linkBase = "px-3 py-2 rounded-md text-sm font-medium";
  return (
    <header className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold">
          MyApp
        </Link>
        <nav className="flex gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "bg-blue-600 text-white" : "text-gray-800 dark:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-800/50"}`
            }
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "bg-blue-600 text-white" : "text-gray-800 dark:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-800/50"}`
            }
          >
            Users
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
