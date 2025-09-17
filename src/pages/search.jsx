import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "@/components/movie-card";
import Pagination from "@/components/pagination";
import SearchCard from "@/components/search";
import { API_KEY, BASE_URL } from "@/config";
import { MIN_PAGE, usePagination } from "@/hooks/use-pagination";

const buildSearchUrl = (query, page) =>
  `${BASE_URL}/search/multi?api_key=${API_KEY}&include_adult=false&query=${encodeURIComponent(
    query
  )}&page=${page}`;

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo(
    () => (searchParams.get("q") ?? "").trim(),
    [searchParams]
  );
  const [page, setPage] = useState(
    Number.parseInt(searchParams.get("page") ?? String(MIN_PAGE), 10) ||
      MIN_PAGE
  );

  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(MIN_PAGE);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setTotalPages(MIN_PAGE);
      return;
    }

    const url = buildSearchUrl(query, page);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const mapped = (data.results ?? [])
          .filter(
            (r) => r.media_type === "movie" || r.media_type === "tv" || r.title
          )
          .map((r) => ({
            id: r.id,
            title: r.title ?? r.name ?? "Untitled",
            poster_path: r.poster_path,
            score: Math.round((r.vote_average ?? 0) * 10),
            date: r.release_date ?? r.first_air_date ?? "",
            overview: r.overview ?? "",
          }));
        setResults(mapped);
        setTotalPages(data.total_pages ?? MIN_PAGE);
      })
      .catch(() => {
        setResults([]);
        setTotalPages(MIN_PAGE);
      });
  }, [query, page]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    if (query) {
      next.set("q", query);
    }
    setSearchParams(next, { replace: true });
  }, [page, query, searchParams, setSearchParams]);

  const { pages, leftDots, rightDots, last } = usePagination(page, totalPages);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <SearchCard />

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-xl">
            Search Results for: {query || "—"}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {results.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>

        <Pagination
          last={last}
          leftDots={leftDots}
          page={page}
          pages={pages}
          rightDots={rightDots}
          setPage={setPage}
          totalPages={totalPages}
        />
      </section>
    </div>
  );
}
