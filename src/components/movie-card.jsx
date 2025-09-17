import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IMAGE_PATH } from "@/config";
import { useWatchlist } from "@/hooks/use-watchlist";

export default function MovieCard({ movie, type = "movie" }) {
  const { isSaved, toggle } = useWatchlist();
  const saved = isSaved(movie.id);

  const onToggle = () => {
    toggle(movie);
  };

  return (
    <Card className="overflow-hidden p-0" key={movie.id}>
      <CardContent className="p-0">
        <div className="relative">
          <div
            className="h-64 w-full bg-center bg-cover"
            role="img"
            style={{
              backgroundImage: `url(${IMAGE_PATH}${movie.poster_path})`,
            }}
          />
          <div className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-xs shadow">
            <Star className="size-3 text-yellow-500" />
            <span>{movie.score}</span>
          </div>
        </div>
        <div className="p-3">
          <p className="line-clamp-1 font-medium text-sm">{movie.title}</p>
          <p className="text-muted-foreground text-xs">{movie.release_date}</p>
          <p className="mt-0.5 text-muted-foreground text-xs">{movie.date}</p>
          <div className="mt-2 flex items-center justify-between">
            <button
              className="inline-flex items-center gap-1 text-muted-foreground text-xs"
              onClick={onToggle}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onToggle();
                }
              }}
              type="button"
            >
              <Heart className={saved ? "size-4 fill-current" : "size-4"} />
              <span>{saved ? "Saved" : "Save"}</span>
            </button>
            <Button asChild size="sm" type="button" variant="secondary">
              <Link to={`/details/${movie.id}?type=${type}`}>Details</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
