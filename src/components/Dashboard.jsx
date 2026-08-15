import { useEffect, useState } from "react"

import {
  getPlayers,
  getSchedule,
  getEvents,
  getMatchEntry,
} from "../data/googleSheets"
import { getPlayerSummaries } from "../utils/matchEntry"

function Dashboard() {
  const [players, setPlayers] = useState([])
  const [schedule, setSchedule] = useState([])
  const [events, setEvents] = useState([])
  const [matchEntry, setMatchEntry] = useState([])
  const [leader, setLeader] = useState(null)

  useEffect(() => {
    getPlayers().then(setPlayers)
    getSchedule().then(setSchedule)
    getEvents().then(setEvents)

    getMatchEntry().then((data) => {

      setMatchEntry(data)

      const summaries = getPlayerSummaries(data)

      // Find the player with the most Power Points - this is an
      // independent season-long tracker, unrelated to Rank/Ranking Points.
      const topPlayer = Object.entries(summaries).reduce((best, [name, s]) => {
        if (!best || s.totalPowerScore > best.totalPowerScore) return { name, ...s }
        return best
      }, null)

      setLeader(topPlayer)

    })
  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const nextEvent = schedule
    .filter((event) => {
      if (!event.Date) return false

      if (
        !event.Status ||
        event.Status.toLowerCase() !== "planned"
      ) {
        return false
      }

      const eventDate = new Date(event.Date)

      if (isNaN(eventDate)) return false

      eventDate.setHours(0, 0, 0, 0)

      return eventDate >= today
    })
    .sort((a, b) => new Date(a.Date) - new Date(b.Date))[0]

  const nextEventTeams = nextEvent
    ? Object.entries(
        matchEntry
          .filter((row) => row["Event ID"] === nextEvent["Event ID"])
          .reduce((teams, row) => {
            if (!row.Team || !row.Player) return teams

            if (!teams[row.Team]) teams[row.Team] = []

            teams[row.Team].push(row.Player)

            return teams
          }, {})
      ).sort(([a], [b]) => a.localeCompare(b))
    : []

  return (
    <section className="dashboard-grid">

      <div className="dashboard-card leader">

        <h2>Power Points Leader</h2>

        {leader ? (
          <>
            <h3>{leader.name}</h3>
            <p>{leader.totalPowerScore} Points</p>
          </>
        ) : (
          <>
            <h3>Loading...</h3>
            <p>Please wait...</p>
          </>
        )}

      </div>

      <div className="dashboard-card event">

        <h2>Next Event</h2>

        {nextEvent ? (
          <>
            <h3>{nextEvent["Event Name"]}</h3>
            <p>{nextEvent.Date}</p>
            <p>{nextEvent.Course}</p>

            {nextEventTeams.length > 0 && (
              <ul className="dashboard-team-list">

                {nextEventTeams.map(([team, teamPlayers]) => (
                  <li key={team}>
                    <strong>Team {team}:</strong> {teamPlayers.join(" / ")}
                  </li>
                ))}

              </ul>
            )}
          </>
        ) : (
          <>
            <h3>No Upcoming Event</h3>
            <p>Schedule Coming Soon</p>
          </>
        )}

      </div>

      <div className="dashboard-card players">

        <h2>Players</h2>

        <h3>{players.filter((p) => !/\(sub\)/i.test(p.Name)).length}</h3>

        <p>Registered Players</p>

      </div>

      <div className="dashboard-card events">

        <h2>Events</h2>

        <h3>{events.length}</h3>

        <p>Season Events</p>

      </div>

    </section>
  )
}

export default Dashboard