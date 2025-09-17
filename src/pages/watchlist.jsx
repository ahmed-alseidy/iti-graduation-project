import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import WatchlistMovieCard from "@/components/watchlist-movie-card";
import { useWatchlist } from "@/hooks/use-watchlist";
import { cn } from "@/lib/utils";

export default function Watchlist() {
  const { items, toggle } = useWatchlist();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-xl">Your Watchlist</h2>
        </div>
        {items.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-6">
            <Heart className="size-30 fill-gray-400 text-gray-400" />
            <p>No movies in your watchlist</p>
            <Link
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full bg-yellow-400 text-black hover:bg-yellow-300"
              )}
              to="/"
            >
              Back to home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map((movie) => (
              <WatchlistMovieCard
                key={movie.id}
                movie={movie}
                toggle={toggle}
                type={movie.type}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
