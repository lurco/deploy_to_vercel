import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/users";
import type { User } from "../types/user";

export const meta = () => [{ title: "User Details" }];

export default function UserDetails() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError, error } = useQuery<User>({
    queryKey: ["users", id],
    queryFn: () => getUser(id),
    enabled: !!id,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">User Details</h1>
        <Link to="/users" className="text-blue-600 hover:underline dark:text-blue-400">
          Back to Users
        </Link>
      </div>

      {isLoading && <p>Loading user...</p>}
      {isError && (
        <div className="p-3 rounded-md bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">
          Failed to load user: {(error as Error).message}
        </div>
      )}

      {data && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-gray-500">ID</dt>
              <dd className="font-mono">{data.id}</dd>
            </div>
            <div>
              <dt className="text-gray-500">First Name</dt>
              <dd>{data.firstName || "-"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Last Name</dt>
              <dd>{data.lastName || "-"}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
