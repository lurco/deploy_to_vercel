import axiosInstance from "./axiosInstance";
import type { NewUser, User } from "../types/user";

// Backend may return _id or id; normalize to `id`
function toUser(u: any): User {
  return {
    id: String(u.id ?? u._id ?? ""),
    firstName: String(u.firstName ?? ""),
    lastName: String(u.lastName ?? ""),
  };
}

export async function getUsers(): Promise<User[]> {
  const { data } = await axiosInstance.get("/users");
  // data may already be array of users
  return Array.isArray(data) ? data.map(toUser) : [];
}

export async function getUser(id: string | number): Promise<User> {
  const { data } = await axiosInstance.get(`/users/${id}`);
  return toUser(data);
}

export async function createUser(payload: NewUser): Promise<User> {
  const { data } = await axiosInstance.post("/users", payload);
  return toUser(data);
}
