import { Heart, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { IMAGE_PATH } from "@/config";
import { Badge } from "./ui/badge";

const MAX_RATING = 5;
const STAR_VALUES = Array.from({ length: MAX_RATING }, (_, index) => index + 1);

export default function WatchlistMovieCard({ movie, toggle, type = "movie" }) {
  console.log(movie);
  return (
    <Card className="overflow-hidden p-0" key={movie.id}>
      <CardContent className="flex flex-row p-0">
        <div
          className="h-96 w-52 rounded-l-xl bg-center bg-cover"
          role="img"
          style={{
            backgroundImage: `url(${IMAGE_PATH}${movie.poster_path})`,
          }}
        />
        <div className="flex-1 p-3">
          <div className="flex items-start justify-between">
            <p className="font-bold text-2xl">
              {movie.name || movie.title || "Untitled"}
            </p>

            <button
              className="mt-1"
              onClick={() => toggle(movie)}
              type="button"
            >
              <Heart className="size-7 fill-yellow-400 text-yellow-400" />
            </button>
          </div>
          <Badge className={"my-2"}>{type}</Badge>
          <p className="text-muted-foreground text-xs">{movie.date}</p>
          <div className="mt-2 inline-flex items-center gap-1">
            {(() => {
              const threshold = Math.max(
                0,
                Math.min(
                  MAX_RATING,
                  Math.round(
                    typeof movie.rating === "number"
                      ? movie.rating
                      : (typeof movie.score === "number" ? movie.score : 0) / 2
                  )
                )
              );
              return (
                <>
                  <span className="sr-only">
                    Rating: {threshold} out of {MAX_RATING}
                  </span>
                  {STAR_VALUES.map((value) => {
                    const active = threshold >= value;
                    return (
                      <span className="p-1" key={value}>
                        <Star
                          className={
                            active
                              ? "size-5 text-yellow-500"
                              : "size-5 text-muted-foreground"
                          }
                        />
                      </span>
                    );
                  })}
                </>
              );
            })()}
          </div>
          {movie.overview ? (
            <p className="line-clamp-4 text-muted-foreground text-sm">
              {movie.overview}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
