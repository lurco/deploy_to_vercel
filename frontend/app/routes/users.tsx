import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/users";
import type { User } from "../types/user";
import { useMemo, useState } from "react";

export const meta = () => [{ title: "Users" }];

export default function UsersIndex() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const [q, setQ] = useState("");
  const users = data ?? [];
  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim();
    if (!query) return users;
    return users.filter((u) =>
      [u.firstName, u.lastName, String(u.id)]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(query))
    );
  }, [q, users]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Users</h1>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            Refresh
          </button>
          <Link
            to="/users/new"
            className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            New User
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by id, first name, or last name"
          className="w-full max-w-md px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
        />
      </div>

      {isLoading && <p>Loading users...</p>}
      {isError && (
        <div className="p-3 rounded-md bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">
          Failed to load users: {(error as Error).message}
        </div>
      )}

      {!isLoading && !isError && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-800">
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">First Name</th>
                <th className="py-2 pr-4">Last Name</th>
                <th className="py-2 pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u: User) => (
                <tr key={u.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 pr-4 font-mono">{u.id}</td>
                  <td className="py-2 pr-4">{u.firstName || "-"}</td>
                  <td className="py-2 pr-4">{u.lastName || "-"}</td>
                  <td className="py-2 pr-4">
                    <Link
                      to={`/users/${u.id}`}
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
