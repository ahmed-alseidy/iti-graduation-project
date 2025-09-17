import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchCard() {
  const [params] = useSearchParams();
  const initial = params.get("q") ?? "";
  const [searchQuery, setSearchQuery] = useState(initial);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) {
      return;
    }
    navigate(`/search?q=${encodeURIComponent(q)}&page=1`);
  };
  return (
    <section className="rounded-xl border p-6">
      <h1 className="font-semibold text-2xl">Welcome to our movie app</h1>
      <p className="mt-1 text-muted-foreground text-sm">
        Millions of movies, TV shows and people to discover. Explore now.
      </p>
      <form className="mt-4 flex items-center gap-2" onSubmit={onSubmit}>
        <div className="relative w-full">
          <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search and explore..."
            value={searchQuery}
          />
        </div>
        <Button type="submit">Search</Button>
      </form>
    </section>
  );
}
