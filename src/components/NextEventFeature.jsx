import { useEffect, useState } from "react"
import {
  getPlayers,
  getSchedule,
  getTeamPairingGrid,
} from "../data/googleSheets"
import { slugify } from "../utils/slugify"

const COURSE_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"]

function CourseBackground({ course }) {

  const [extIndex, setExtIndex] = useState(0)

  if (!course || extIndex >= COURSE_IMAGE_EXTENSIONS.length) {
    return <div className="next-event-fallback-bg" />
  }

  const src = `${import.meta.env.BASE_URL}images/courses/${slugify(course)}.${COURSE_IMAGE_EXTENSIONS[extIndex]}`

  return (
    <img
      src={src}
      alt=""
      className="next-event-bg-img"
      onError={() => setExtIndex((i) => i + 1)}
    />
  )

}

function PlayerChip({ name, playerIds }) {

  const id = playerIds[name]

  return (
    <div className="next-event-player">
      <img
        src={`${import.meta.env.BASE_URL}images/players/${id}.jpg`}
        alt={name}
        className="next-event-avatar"
        onError={(e) => {
          e.target.src = `${import.meta.env.BASE_URL}images/players/default.jpg`
        }}
      />
      <span>{name}</span>
    </div>
  )

}

function NextEventFeature() {

  const [playerIds, setPlayerIds] = useState({})
  const [schedule, setSchedule] = useState([])
  const [teamPairingGrid, setTeamPairingGrid] = useState([])

  useEffect(() => {

    getPlayers().then((data) => {

      const idsByName = {}

      data.forEach((player) => {
        idsByName[player.Name] = player["Player ID"]
      })

      setPlayerIds(idsByName)

    })

    getSchedule().then(setSchedule)
    getTeamPairingGrid().then(setTeamPairingGrid)

  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const nextEvent = schedule
    .filter((event) => {
      if (!event.Date) return false

      if (!event.Status || event.Status.toLowerCase() !== "planned") {
        return false
      }

      const eventDate = new Date(event.Date)

      if (isNaN(eventDate)) return false

      eventDate.setHours(0, 0, 0, 0)

      return eventDate >= today
    })
    .sort((a, b) => new Date(a.Date) - new Date(b.Date))[0]

  // Teams read from the Hard Key Matchmaking table (starting row 14,
  // column C for the Team label) on the Team Pairing sheet tab, rather
  // than being computed from Match Entry - that table is the
  // hand-editable source of truth for who's actually playing next,
  // including sub alternation. Keeps reading as long as the Team column
  // keeps having a value, so more teams are picked up automatically.
  const nextEventTeams = []

  for (let i = 13; i < teamPairingGrid.length; i++) {
    const row = teamPairingGrid[i]

    if (!row || !row[2]) break

    nextEventTeams.push([row[2], [row[3], row[4]].filter(Boolean)])
  }

  if (!nextEvent) {
    return (
      <section className="next-event-feature next-event-empty">
        <h2>No Upcoming Event</h2>
        <p>Schedule Coming Soon</p>
      </section>
    )
  }

  return (

    <section className="next-event-feature">

      <CourseBackground course={nextEvent.Course} />

      <div className="next-event-overlay" />

      <div className="next-event-content">

        <p className="next-event-eyebrow">Up Next</p>

        <h2 className="next-event-title">{nextEvent["Event Name"]}</h2>

        <p className="next-event-meta">
          {nextEvent.Date}
          {nextEvent.Course && <span className="next-event-dot">•</span>}
          {nextEvent.Course}
          {nextEvent["Tee Times"] && nextEvent["Tee Times"] !== "TBD" && (
            <>
              <span className="next-event-dot">•</span>
              {nextEvent["Tee Times"]}
            </>
          )}
        </p>

        {nextEventTeams.length > 0 && (

          <div className="next-event-matchups">

            {nextEventTeams.map(([team, teamPlayers]) => (

              <div className="next-event-matchup-card" key={team}>

                <span className="next-event-team-tag">{team}</span>

                <div className="next-event-matchup-players">

                  <PlayerChip name={teamPlayers[0]} playerIds={playerIds} />

                  {teamPlayers.length > 1 && (
                    <>
                      <span className="next-event-teammate-divider">&amp;</span>
                      <PlayerChip name={teamPlayers[1]} playerIds={playerIds} />
                    </>
                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </section>

  )

}

export default NextEventFeature
