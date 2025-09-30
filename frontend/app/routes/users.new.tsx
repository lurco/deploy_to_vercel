import { Link, useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../api/users";
import type { NewUser, User } from "../types/user";
import { type FormEvent, useState } from "react";

export const meta = () => [{ title: "Create User" }];

export default function NewUserPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState<NewUser>({
    firstName: "",
    lastName: "",
  });

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (payload: NewUser) => createUser(payload),
    onSuccess: async (user: User) => {
      await qc.invalidateQueries({ queryKey: ["users"] });
      navigate(`/users/${user.id}`);
    },
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await mutateAsync(form);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Create User</h1>
        <Link
          to="/users"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Back to Users
        </Link>
      </div>

      <form onSubmit={onSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">First Name</label>
          <input
            value={form.firstName}
            onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
            placeholder="Ada"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Last Name</label>
          <input
            value={form.lastName}
            onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
            placeholder="Lovelace"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "Creating..." : "Create"}
          </button>
          <Link
            to="/users"
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            Cancel
          </Link>
        </div>
        {error && (
          <div className="p-3 rounded-md bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">
            Failed to create user: {(error as Error).message}
          </div>
        )}
      </form>
    </div>
  );
}
