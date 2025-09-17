import { useMemo } from "react";

export const TMDB_MAX_PAGES = 500;
export const MIN_PAGE = 1;
export const DEFAULT_SIBLINGS = 1;
export const EXTRA_BUTTONS_COUNT = 5;

export function usePagination(
  currentPage,
  totalPages,
  siblingCount = DEFAULT_SIBLINGS
) {
  return useMemo(() => {
    const cappedTotal = Math.min(totalPages, TMDB_MAX_PAGES);
    const totalNumbers = siblingCount * 2 + EXTRA_BUTTONS_COUNT;
    if (cappedTotal <= totalNumbers) {
      return {
        pages: Array.from({ length: cappedTotal }, (_, i) => i + 1),
        leftDots: false,
        rightDots: false,
        last: cappedTotal,
      };
    }

    const leftSibling = Math.max(currentPage - siblingCount, MIN_PAGE);
    const rightSibling = Math.min(currentPage + siblingCount, cappedTotal);

    const showLeftDots = leftSibling > MIN_PAGE + 1;
    const showRightDots = rightSibling < cappedTotal - 1;

    const middlePages = [];
    const middleStart = Math.max(leftSibling, MIN_PAGE + 1);
    const middleEnd = Math.min(rightSibling, cappedTotal - 1);
    for (let i = middleStart; i <= middleEnd; i += 1) {
      middlePages.push(i);
    }

    return {
      pages: [MIN_PAGE, ...middlePages, cappedTotal],
      leftDots: showLeftDots,
      rightDots: showRightDots,
      last: cappedTotal,
    };
  }, [currentPage, totalPages, siblingCount]);
}
