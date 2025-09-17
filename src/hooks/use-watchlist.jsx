import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "watchlist:v1";

function readWatchlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeWatchlist(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    console.error("Error writing watchlist to localStorage");
  }
}

export function useWatchlist() {
  const [items, setItems] = useState(() => readWatchlist());

  useEffect(() => {
    writeWatchlist(items);
  }, [items]);

  const ids = useMemo(() => new Set(items.map((m) => m.id)), [items]);

  const isSaved = (id) => ids.has(id);

  const add = (movie) => {
    if (!movie?.id || isSaved(movie.id)) {
      return;
    }
    setItems((prev) => [...prev, movie]);
  };

  const remove = (id) => {
    setItems((prev) => prev.filter((m) => m.id !== id));
  };

  const toggle = (movie) => {
    if (!movie?.id) {
      return;
    }
    setItems((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      return exists ? prev.filter((m) => m.id !== movie.id) : [...prev, movie];
    });
  };

  return { items, isSaved, add, remove, toggle };
}
