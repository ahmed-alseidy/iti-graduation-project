import { useEffect, useState } from "react";
import MovieCard from "@/components/movie-card";
import Pagination from "@/components/pagination";
import SearchCard from "@/components/search";
import { Button } from "@/components/ui/button";
import { API_KEY, BASE_URL } from "@/config";
import { MIN_PAGE, usePagination } from "@/hooks/use-pagination";

const moviesUrl = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`;
const tvShowsUrl = `${BASE_URL}/tv/on_the_air?api_key=${API_KEY}`;

export default function Home() {
  const [activeTab, setActiveTab] = useState("movies");

  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);

  const [moviePage, setMoviePage] = useState(MIN_PAGE);
  const [tvPage, setTvPage] = useState(MIN_PAGE);

  const [movieTotalPages, setMovieTotalPages] = useState(MIN_PAGE);
  const [tvTotalPages, setTvTotalPages] = useState(MIN_PAGE);

  useEffect(() => {
    if (activeTab !== "movies" && movies.length > 0) {
      return;
    }
    fetch(`${moviesUrl}&page=${moviePage}`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = (data.results ?? [])
          .filter((r) => r.title || r.name)
          .map((r) => ({
            id: r.id,
            title: r.title ?? r.name ?? "Untitled",
            poster_path: r.poster_path,
            score: Math.round((r.vote_average ?? 0) * 10),
            type: "movie",
            date: r.release_date ?? r.first_air_date ?? "",
            overview: r.overview ?? "",
          }));
        setMovies(mapped);
        setMovieTotalPages(data.total_pages ?? MIN_PAGE);
      })
      .catch(() => {
        setMovies([]);
        setMovieTotalPages(MIN_PAGE);
      });
  }, [activeTab, moviePage, movies.length]);

  useEffect(() => {
    if (activeTab !== "tv" && tvShows.length > 0) {
      return;
    }
    fetch(`${tvShowsUrl}&page=${tvPage}`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = (data.results ?? [])
          .filter((r) => r.name || r.title)
          .map((r) => ({
            id: r.id,
            title: r.name ?? r.title ?? "Untitled",
            poster_path: r.poster_path,
            type: "tv",
            score: Math.round((r.vote_average ?? 0) * 10),
            date: r.first_air_date ?? r.release_date ?? "",
            overview: r.overview ?? "",
          }));
        setTvShows(mapped);
        setTvTotalPages(data.total_pages ?? MIN_PAGE);
      })
      .catch(() => {
        setTvShows([]);
        setTvTotalPages(MIN_PAGE);
      });
  }, [activeTab, tvPage, tvShows.length]);

  const page = activeTab === "movies" ? moviePage : tvPage;
  const totalPages = activeTab === "movies" ? movieTotalPages : tvTotalPages;
  const setPage = activeTab === "movies" ? setMoviePage : setTvPage;
  const { pages, leftDots, rightDots, last } = usePagination(page, totalPages);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <SearchCard />

      <div className="mt-6">
        <Button
          onClick={() => setActiveTab("movies")}
          size="sm"
          type="button"
          variant={activeTab === "movies" ? "default" : "outline"}
        >
          Movies
        </Button>
        <Button
          className="ml-2"
          onClick={() => setActiveTab("tv")}
          size="sm"
          type="button"
          variant={activeTab === "tv" ? "default" : "outline"}
        >
          TV Shows
        </Button>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-xl">Now Playing</h2>
          <Button size="sm" type="button" variant="ghost">
            View all
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {activeTab === "movies"
            ? movies.map((m) => <MovieCard key={m.id} movie={m} />)
            : tvShows.map((m) => <MovieCard key={m.id} movie={m} type="tv" />)}
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
