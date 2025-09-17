import { ArrowDownIcon, Heart } from "lucide-react";
import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import DetailsPage from "@/pages/details.jsx";
import Home from "@/pages/home.jsx";
import SearchPage from "@/pages/search.jsx";
import Watchlist from "@/pages/watchlist.jsx";
import { Badge } from "./components/ui/badge";
import { useWatchlist } from "./hooks/use-watchlist";

function Layout() {
  const { items } = useWatchlist();

  return (
    <div className="flex min-h-screen flex-col">
      <nav className="flex items-center justify-between bg-yellow-400 p-4">
        <h1>Movie App</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-sm">EN</span> <ArrowDownIcon />
          </div>
          <Link className="flex items-center gap-1" to="/watchlist">
            <Heart className="size-4" />
            <span>Watchlist</span>
            <Badge className={"ml-2"}>{items.length}</Badge>
          </Link>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "search", element: <SearchPage /> },
      { path: "watchlist", element: <Watchlist /> },
      { path: "details/:id", element: <DetailsPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
