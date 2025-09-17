import { Heart, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import MovieCard from "@/components/movie-card";
import { API_KEY, BASE_URL, IMAGE_PATH, LOGO_PATH } from "@/config";
import { useWatchlist } from "@/hooks/use-watchlist";

export default function DetailsPage() {
  const { id } = useParams();
  const movieId = useMemo(() => Number.parseInt(String(id), 10), [id]);
  const [details, setDetails] = useState(null);
  const [recs, setRecs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const { isSaved, toggle } = useWatchlist();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  console.log(details);

  useEffect(() => {
    if (!movieId) {
      return;
    }

    const controller = new AbortController();
    const fetchDetails = fetch(
      `${BASE_URL}/${type}/${movieId}?api_key=${API_KEY}&append_to_response=release_dates`
    )
      .then((r) => r.json())
      .catch(() => null);

    const fetchRecs = fetch(
      `${BASE_URL}/${type}/${movieId}/recommendations?api_key=${API_KEY}`,
      { signal: controller.signal }
    )
      .then((r) => r.json())
      .then((d) => d.results ?? [])
      .catch(() => []);

    const fetchReviews = fetch(
      `${BASE_URL}/${type}/${movieId}/reviews?api_key=${API_KEY}`,
      { signal: controller.signal }
    )
      .then((r) => r.json())
      .then((d) => d.results ?? [])
      .catch(() => []);

    Promise.all([fetchDetails, fetchRecs, fetchReviews]).then(
      ([d, recList, reviewsList]) => {
        setDetails(d);
        const mapped = (recList ?? []).map((r) => ({
          id: r.id,
          title: r.title ?? r.name ?? "Untitled",
          type: r.media_type ?? "movie",
          poster_path: r.poster_path ?? r.profile_path,
          score: Math.round((r.vote_average ?? 0) * 10),
          date: r.release_date ?? r.first_air_date ?? "",
          overview: r.overview ?? "",
        }));
        setRecs(mapped);
        const mappedReviews = (reviewsList ?? []).map((rv) => ({
          id: rv.id,
          author: rv.author ?? "Anonymous",
          authorDetails: rv.author_details ?? {},
          content: rv.content ?? "",
          createdAt: rv.created_at ?? "",
        }));
        setReviews(mappedReviews);
      }
    );

    return () => controller.abort();
  }, [movieId]);

  if (!details) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  const saved = isSaved(details.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Link className="text-sm underline" to="/">
        ← Back
      </Link>

      <section className="mt-4 flex flex-col gap-6 md:flex-row">
        <div className="shrink-0">
          <div
            className="h-96 w-64 rounded-xl bg-center bg-cover"
            role="img"
            style={{
              backgroundImage: `url(${IMAGE_PATH}${details.poster_path})`,
            }}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h1 className="font-bold text-3xl">
              {details.name || details.title || "Untitled"}
            </h1>
            <button
              className="rounded-full p-2"
              onClick={() =>
                toggle({
                  id: details.id,
                  title: details.title,
                  type: details.type,
                  poster_path: details.poster_path,
                  score: Math.round((details.vote_average ?? 0) * 10),
                  date: details.release_date ?? "",
                  overview: details.overview ?? "",
                })
              }
              type="button"
            >
              <Heart
                className={
                  saved ? "size-6 fill-yellow-400 text-yellow-400" : "size-6"
                }
              />
            </button>
          </div>
          <div className="mt-2 inline-flex items-center gap-1">
            <span className="sr-only">Score</span>
            <Star className="size-4 text-yellow-500" />
            <span className="text-sm">
              {Math.round((details.vote_average ?? 0) * 10)}
            </span>
          </div>
          {details.genres?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {details.genres.map((g) => (
                <span
                  className="rounded-full bg-yellow-300 px-3 py-1 text-xs"
                  key={g.id}
                >
                  {g.name}
                </span>
              ))}
            </div>
          ) : null}

          {details.overview ? (
            <p className="mt-4 text-muted-foreground">{details.overview}</p>
          ) : null}

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p>{details.runtime ? `${details.runtime} min` : "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Languages</p>
              <p>{details.original_language?.toUpperCase() ?? "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Release Date</p>
              <p>{details.release_date ?? "—"}</p>
            </div>
          </div>

          {details.homepage ? (
            <div className="mt-4">
              <a
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm underline-offset-4 hover:underline"
                href={details.homepage}
                rel="noopener noreferrer"
                target="_blank"
                title="Official website"
              >
                Website
              </a>
            </div>
          ) : null}
        </div>
      </section>

      {details.production_companies?.length ? (
        <section className="mt-6">
          <div className="flex flex-wrap items-center gap-4">
            {details.production_companies
              .filter((c) => Boolean(c.logo_path))
              .map((c) => (
                <div className="rounded bg-white p-2" key={c.id}>
                  <div
                    className="h-8 w-28 bg-center bg-contain bg-no-repeat"
                    role="img"
                    style={{
                      backgroundImage: `url(${LOGO_PATH}${c.logo_path})`,
                    }}
                    title={c.name}
                  />
                </div>
              ))}
          </div>
        </section>
      ) : null}

      <section className="mt-8">
        <h2 className="mb-4 font-semibold text-xl">Recommendations</h2>
        {recs.length === 0 ? (
          <p className="text-muted-foreground text-sm">No recommendations.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {recs.map((m) => (
              <MovieCard key={m.id} movie={m} type={m.type} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-4 font-semibold text-xl">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground text-sm">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rv) => {
              const rating =
                typeof rv.authorDetails?.rating === "number"
                  ? rv.authorDetails.rating
                  : null;
              return (
                <article className="rounded-lg border p-4" key={rv.id}>
                  <header className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{rv.author}</span>
                      {rating !== null ? (
                        <span className="inline-flex items-center gap-1 text-xs">
                          <Star className="size-3 text-yellow-500" /> {rating}
                        </span>
                      ) : null}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {rv.createdAt?.slice(0, 10)}
                    </div>
                  </header>
                  <p className="whitespace-pre-line text-muted-foreground text-sm">
                    {rv.content}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
