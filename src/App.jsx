import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Header from "./components/Header"

import Home from "./pages/Home"
import LeaderboardPage from "./pages/LeaderboardPage"
import SchedulePage from "./pages/SchedulePage"
import PlayersPage from "./pages/PlayersPage"
import StatsPage from "./pages/StatsPage"
import GalleryPage from "./pages/GalleryPage"
import NewsPage from "./pages/NewsPage"
import PastMatchesPage from "./pages/PastMatchesPage"
import RulesPage from "./pages/RulesPage"
import PlayerProfile from "./pages/PlayerProfile"


function App() {

  return (

    <BrowserRouter>

      <div className="website">

        <Header />

        <main className="main">

          <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/leaderboard" element={<LeaderboardPage />} />

            <Route path="/schedule" element={<SchedulePage />} />

            <Route path="/players" element={<PlayersPage />} />

            <Route path="/stats" element={<StatsPage />} />

            <Route path="/gallery" element={<GalleryPage />} />

            <Route path="/news" element={<NewsPage />} />

            <Route path="/past-matches" element={<PastMatchesPage />} />

            <Route path="/rules" element={<RulesPage />} />

            <Route path="/player-profile/:name" element={<PlayerProfile />} />

          </Routes>

        </main>


        <footer className="footer">

          <p>
            © 2026 Horses Tour
          </p>

        </footer>


      </div>

    </BrowserRouter>

  )

}


export default App