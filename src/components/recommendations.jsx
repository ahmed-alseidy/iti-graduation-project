import MovieCard from "@/components/movie-card";

export default function Recommendations({ items = [] }) {
  return (
    <section className="mt-8">
      <h2 className="mb-4 font-semibold text-xl">Recommendations</h2>
      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">No recommendations.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((m) => (
            <MovieCard key={m.id} movie={m} type={m.type} />
          ))}
        </div>
      )}
    </section>
  );
}
