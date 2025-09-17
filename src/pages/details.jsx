import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ProductionCompanies from "@/components/companies";
import DetailsHero from "@/components/hero";
import Recommendations from "@/components/recommendations";
import Reviews from "@/components/reviews";
import { API_KEY, BASE_URL } from "@/config";
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
  }, [movieId, type]);

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

      <DetailsHero
        details={details}
        onToggle={() =>
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
        saved={saved}
      />

      <ProductionCompanies companies={details.production_companies} />

      <Recommendations items={recs} />

      <Reviews items={reviews} />
    </div>
  );
}
