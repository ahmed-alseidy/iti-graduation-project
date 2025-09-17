import { Button } from "@/components/ui/button";
import { usePagination } from "@/hooks/use-pagination";

export default function Pagination({
  page,
  setPage,
  leftDots,
  rightDots,
  pages,
  totalPages,
  last,
}) {
  const { MIN_PAGE, TMDB_MAX_PAGES } = usePagination(page, totalPages);
  return (
    <div className="mt-6 flex w-full items-center justify-center gap-1 overflow-x-hidden">
      <Button
        disabled={page <= MIN_PAGE}
        onClick={() => setPage((p) => Math.max(MIN_PAGE, p - 1))}
        size="sm"
        variant="outline"
      >
        Prev
      </Button>

      {leftDots && (
        <span className="px-2 text-muted-foreground" key={`dots-left-${page}`}>
          …
        </span>
      )}

      {pages.map((pNum) => (
        <Button
          key={`page-${pNum}`}
          onClick={() => setPage(pNum)}
          size="sm"
          variant={pNum === page ? "default" : "outline"}
        >
          {pNum}
        </Button>
      ))}

      {rightDots && (
        <span
          className="px-2 text-muted-foreground"
          key={`dots-right-${page}-${last}`}
        >
          …
        </span>
      )}

      <Button
        disabled={page >= Math.min(totalPages, TMDB_MAX_PAGES)}
        onClick={() =>
          setPage((p) => Math.min(Math.min(totalPages, TMDB_MAX_PAGES), p + 1))
        }
        size="sm"
        variant="outline"
      >
        Next
      </Button>
    </div>
  );
}
