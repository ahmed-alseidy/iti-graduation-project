import { Star } from "lucide-react";

export default function Reviews({ items = [] }) {
  return (
    <section className="mt-8">
      <h2 className="mb-4 font-semibold text-xl">Reviews</h2>
      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {items.map((rv) => {
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
  );
}
