import { Heart, Star } from "lucide-react";
import { IMAGE_PATH } from "@/config";

export default function DetailsHero({ details, saved, onToggle }) {
  return (
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
            aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
            className="rounded-full p-2"
            onClick={onToggle}
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
  );
}
