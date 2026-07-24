import "./App.css"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"

import Header from "./components/Header"
import Hero from "./components/Hero"

import Home from "./pages/Home"
import LeaderboardPage from "./pages/LeaderboardPage"
import SchedulePage from "./pages/SchedulePage"
import EventsPage from "./pages/EventsPage"
import PlayersPage from "./pages/PlayersPage"
import StatsPage from "./pages/StatsPage"
import GalleryPage from "./pages/GalleryPage"
import NewsPage from "./pages/NewsPage"
import PastMatchesPage from "./pages/PastMatchesPage"
import RulesPage from "./pages/RulesPage"
import PlayerProfile from "./pages/PlayerProfile"

function Layout() {
  const location = useLocation()

  const heroData = {
    "/": {
      title: "HORSES TOUR",
      subtitle: "Competitive golf, rankings, and championship events.",
    },
    "/leaderboard": {
      title: "LEADERBOARD",
      subtitle: "Track standings, points, and the championship race.",
    },
    "/schedule": {
      title: "SCHEDULE",
      subtitle: "Upcoming events, tee times, and tournament information.",
    },
    "/events": {
      title: "EVENTS",
      subtitle: "View every Horses Tour event throughout the season.",
    },
    "/players": {
      title: "PLAYERS",
      subtitle: "Meet the competitors of the Horses Tour.",
    },
    "/stats": {
      title: "STATISTICS",
      subtitle:
        "Performance data, player insights and team stats from across the season.",
    },
    "/gallery": {
      title: "GALLERY",
      subtitle: "Photos and memories from Horses Tour events.",
    },
    "/news": {
      title: "NEWS",
      subtitle: "Latest updates and announcements from the tour.",
    },
    "/past-matches": {
      title: "PAST MATCHES",
      subtitle: "Review previous competitions and results.",
    },
    "/rules": {
      title: "RULES",
      subtitle: "Everything you need to know about Horses Tour competition.",
    },
  }

  const currentHero = heroData[location.pathname] || heroData["/"]

  return (
    <div className="website">
      <Header />

      <Hero
        title={currentHero.title}
        subtitle={currentHero.subtitle}
      />

      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/leaderboard" element={<LeaderboardPage />} />

          <Route path="/schedule" element={<SchedulePage />} />

          <Route path="/events" element={<EventsPage />} />

          <Route path="/players" element={<PlayersPage />} />

          <Route path="/stats" element={<StatsPage />} />

          <Route path="/gallery" element={<GalleryPage />} />

          <Route path="/news" element={<NewsPage />} />

          <Route path="/past-matches" element={<PastMatchesPage />} />

          <Route path="/rules" element={<RulesPage />} />

          <Route
            path="/player-profile/:name"
            element={<PlayerProfile />}
          />
        </Routes>
      </main>

      <footer className="footer">
        <p>© 2026 Horses Tour</p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App