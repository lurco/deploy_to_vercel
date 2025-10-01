import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MyApp — Modern Web Starter" },
    {
      name: "description",
      content:
        "A clean, modern landing page built with React Router and Tailwind CSS.",
    },
  ];
}

export default function Home() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="text-center py-16 sm:py-24">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          Build faster with
          <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-teal-400 bg-clip-text text-transparent">
            {" "}
            MyApp
          </span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          A minimal React Router starter with sensible defaults, ready for your
          next idea.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/users"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Get Started
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 12h16m0 0-6-6m6 6-6 6"
              />
            </svg>
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-5 py-3 font-medium text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800/60"
          >
            Learn more
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 6h18M3 12h18M3 18h18"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">File-based routing</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Backend API: {import.meta.env.VITE_API_BASE_URL}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v12a2 2 0 0 0 2 2h12M8 16l4-4 4 4M12 12V4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Data fetching</h3>
            <p className="text-gray-600 dark:text-gray-300">
              @tanstack/react-query is pre-wired. Cache, refetch, and sync
              server state with ease.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="w-10 h-10 rounded-lg bg-violet-600/10 text-violet-700 dark:text-violet-400 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Modern styling</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Tailwind CSS utility classes give you speed and consistency out of
              the box.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Ready to ship your idea?
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Start from this template and focus on what matters: your product.
          </p>
          <Link
            to="/users"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Create your first user
          </Link>
        </div>
      </section>
    </main>
  );
}
