"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { User } from "@/types";

let cachedUser: User | null = null;
let pending: Promise<User> | null = null;

function loadUser(): Promise<User> {
  pending ??= api.getCurrentUser().then(
    (user) => (cachedUser = user),
    (error: unknown) => {
      pending = null;
      throw error;
    },
  );
  return pending;
}

export function useCurrentUser(): User | null {
  const [user, setUser] = useState<User | null>(cachedUser);

  useEffect(() => {
    if (cachedUser) return;
    let active = true;
    loadUser().then(
      (result) => active && setUser(result),
      () => {},
    );
    return () => {
      active = false;
    };
  }, []);

  return user;
}
