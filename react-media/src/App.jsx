import { filter, debounce } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
const Dashboard = React.lazy(() => import( "./components/Dashboard"));
const ImageGallery = React.lazy(() => import( "./components/ImageGallery"));
const MediaList = React.lazy(() => import( "./components/MediaList"));
const SearchBar = React.lazy(() => import( "./components/SearchBar"));
const AnimatedBanner = React.lazy(() => import( "./components/AnimatedBanner"));
const NotificationCenter = React.lazy(() => import( "./components/NotificationCenter"));
const UploadForm = React.lazy(() => import( "./components/UploadForm"));
import { mediaItems, allAssets } from "./data/mockData";

export default function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [user] = useState({
    name: "Alex Johnson",
    role: "admin",
    id: 1,
    email: "alex@company.com",
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme] = useState("light");
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    dateRange: null,
  });

  const handleNavClick = (view) => setCurrentView(view);
  const onSearchChange = useCallback(debounce((q) => setSearchQuery(q), 300), []);
  const itemClickHandler = useCallback((item) =>
    setSelectedItems((prev) => [...prev, item]), []);

  const filteredItems = useMemo(() => filter(mediaItems, (item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  ), [searchQuery]);

  return (
    <div className="app-container">
      <header className="app-header">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          viewBox="0 0 24 24"
          xml:space="preserve"
          width="28"
          height="28"
          fill="#a5b4fc"
          aria-hidden="true"
        >
          <g id="Group_1">
            <g id="Group_2">
              <path d="M4 4h16v12H4z" />
              <path d="M4 4h16v12H4z" opacity="0" />
              <path d="M2 18h20v2H2z" />
            </g>
          </g>
        </svg>

        <h1>MediaVault</h1>

        <nav>
          <button onClick={() => handleNavClick("dashboard")}>Dashboard</button>
          <button onClick={() => handleNavClick("gallery")}>Gallery</button>
          <button onClick={() => handleNavClick("list")}>All Assets</button>
          <button onClick={() => handleNavClick("upload")}>Upload</button>
        </nav>

        <NotificationCenter
          user={user}
          onNotificationRead={(id) => console.log("read", id)}
        />
      </header>

      <AnimatedBanner message="Welcome to MediaVault — Your Creative Asset Hub" />

      <main className="app-main">
        <SearchBar
          query={searchQuery}
          onChange={onSearchChange}
          user={user}
          theme={theme}
          filters={filters}
        />

        {currentView === "dashboard" && (
            <React.Suspense fallback={<div>Loading...</div>}>
                <Dashboard
                  user={user}
                  items={filteredItems}
                  selectedItems={selectedItems}
                  onSelectItem={itemClickHandler}
                  theme={theme}
                  filters={filters}
                  onFilterChange={setFilters}
                />
            </React.Suspense>
        )}

        {currentView === "gallery" && (
            <React.Suspense fallback={<div>Loading...</div>}>
                <ImageGallery
                  items={filteredItems}
                  user={user}
                  theme={theme}
                  onSelectItem={itemClickHandler}
                  selectedItems={selectedItems}
                />
            </React.Suspense>
        )}

        {currentView === "list" && (
            <React.Suspense fallback={<div>Loading...</div>}>
                <MediaList
                  items={allAssets}
                  user={user}
                  theme={theme}
                  onSelectItem={itemClickHandler}
                />
            </React.Suspense>
        )}

        {currentView === "upload" && (
            <React.Suspense fallback={<div>Loading...</div>}>
                <UploadForm
                  user={user}
                  theme={theme}
                  onUploadComplete={itemClickHandler}
                />
            </React.Suspense>
        )}
      </main>
    </div>
  );
}
