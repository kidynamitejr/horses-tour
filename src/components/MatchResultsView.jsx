import { useState } from "react"
import { createPortal } from "react-dom"
import { Link } from "react-router-dom"
import { slugify } from "../utils/slugify"
import { ordinal } from "../utils/ordinal"

const COURSE_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"]

function formatOverPar(value) {
  if (value === "" || value === null || value === undefined) return value
  const num = Number(value)
  if (isNaN(num)) return value
  return num >= 0 ? `+${value}` : value
}

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

function MovementBadge({ movement }) {

  if (movement === null || movement === undefined || movement === 0) {
    return <span className="last-match-movement-badge movement-neutral">—</span>
  }

  if (movement > 0) {
    return <span className="last-match-movement-badge movement-up">▲{movement}</span>
  }

  return <span className="last-match-movement-badge movement-down">▼{Math.abs(movement)}</span>

}

// On the collapsed team card, the headshot is plain (clicking anywhere
// on the card opens the match recap modal instead). Inside that modal,
// the headshot + name become a link straight to the player's profile
// page - that's the only place the link is available.
function PlayerChip({ player, playerIds, large, linked }) {

  const id = playerIds[player.name]

  const content = (
    <>
      <div className="next-event-avatar-wrap">

        <img
          src={`${import.meta.env.BASE_URL}images/players/${id}.jpg`}
          alt={player.name}
          className="next-event-avatar"
          onError={(e) => {
            e.target.src = `${import.meta.env.BASE_URL}images/players/default.jpg`
          }}
        />

        {linked && (
          <span className="last-match-placement-badge">{player.individualPlacement}</span>
        )}

        {linked && <MovementBadge movement={player.movement} />}

      </div>

      <span>{player.name}</span>

      {linked && (
        <div className="last-match-player-stats">

          <div className="last-match-stat-row">
            <span className="last-match-stat-label">Individual Placement</span>
            <span className="last-match-stat-value">{ordinal(player.individualPlacement)}</span>
          </div>

          <div className="last-match-stat-row">
            <span className="last-match-stat-label">Match Points</span>
            <span className="last-match-stat-value">{player.matchPoints.toFixed(2)}</span>
          </div>

          <div className="last-match-stat-row">
            <span className="last-match-stat-label">Contributions</span>
            <span className="last-match-stat-value">
              {player.contributions} <em>({player.contributionPercent})</em>
            </span>
          </div>

        </div>
      )}
    </>
  )

  const className = `next-event-player${large ? " next-event-player-large" : ""}`

  if (!linked) {
    return <div className={className}>{content}</div>
  }

  return (
    <Link
      to={`/player-profile/${id}`}
      className={className}
      onClick={(e) => e.stopPropagation()}
    >
      {content}
    </Link>
  )

}

function TeamRecapModal({ modalTeam, playerIds, onClose }) {

  const isChampion = modalTeam.teamPlacement === 1

  return createPortal(

    <div className="next-event-modal-overlay" onClick={onClose}>

      <div className="next-event-modal" onClick={(e) => e.stopPropagation()}>

        <button
          type="button"
          className="next-event-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="next-event-modal-header">

          <p className="next-event-modal-eyebrow">Match Recap</p>

          <span className={`next-event-team-tag next-event-modal-team-tag${isChampion ? " last-match-champion-tag" : ""}`}>
            {isChampion ? "🏆 Champions" : `${ordinal(modalTeam.teamPlacement)} Place`}
          </span>

        </div>

        <div className="next-event-modal-players">

          <PlayerChip player={modalTeam.players[0]} playerIds={playerIds} large linked />

          {modalTeam.players.length > 1 && (
            <>
              <span className="next-event-teammate-divider next-event-modal-divider">&amp;</span>
              <PlayerChip player={modalTeam.players[1]} playerIds={playerIds} large linked />
            </>
          )}

        </div>

      </div>

    </div>,

    document.body

  )

}

// Renders the full "hero card" results view (course photo background,
// teams ranked by finish, click a team for an individual stat recap) for
// one specific event - used both for the home page's Last Match feature
// and for any match opened from the Past Matches page.
function MatchResultsView({ eventId, matchEntry, schedule, playerIds, eyebrow, onCollapse }) {

  const [modalTeam, setModalTeam] = useState(null)
  const [view, setView] = useState("teams")

  const playedRows = matchEntry.filter((row) => row.Player && row.Contributions)

  const eventIds = [...new Set(playedRows.map((row) => Number(row["Event ID"])))]
    .sort((a, b) => a - b)

  const eventIndex = eventIds.indexOf(Number(eventId))
  const previousEventId = eventIndex > 0 ? eventIds[eventIndex - 1] : undefined

  // Ranks every player in a given event by Match Points (ties broken by
  // Contributions) - this is each player's individual placement "out of
  // everybody," independent of which team they were on.
  function rankByPoints(id) {

    return playedRows
      .filter((row) => Number(row["Event ID"]) === id)
      .map((row) => ({
        player: row.Player.trim(),
        matchPoints: parseFloat(row["Match Ranking Points"]) || 0,
        contributions: parseFloat(row.Contributions) || 0,
      }))
      .sort((a, b) => b.matchPoints - a.matchPoints || b.contributions - a.contributions)

  }

  const individualPlacementByPlayer = {}

  rankByPoints(Number(eventId)).forEach((r, i) => {
    individualPlacementByPlayer[r.player] = i + 1
  })

  const previousIndividualPlacementByPlayer = {}

  if (previousEventId !== undefined) {
    rankByPoints(previousEventId).forEach((r, i) => {
      previousIndividualPlacementByPlayer[r.player] = i + 1
    })
  }

  const teamsByLetter = {}

  playedRows
    .filter((row) => Number(row["Event ID"]) === Number(eventId))
    .forEach((row) => {

      const name = row.Player.trim()

      if (!teamsByLetter[row.Team]) {
        teamsByLetter[row.Team] = {
          team: row.Team,
          teamPlacement: Number(row.Placement),
          teamScore: row["Team Score"],
          players: [],
        }
      }

      const currentPlacement = individualPlacementByPlayer[name]
      const prevPlacement = previousIndividualPlacementByPlayer[name]

      const movement =
        currentPlacement !== undefined && prevPlacement !== undefined
          ? prevPlacement - currentPlacement
          : null

      teamsByLetter[row.Team].players.push({
        name,
        matchPoints: parseFloat(row["Match Ranking Points"]) || 0,
        // The team's flat placement-based points (same for both
        // teammates) - the "pool" that Contribution % splits between
        // them to produce their individual Match Points.
        teamPointsAvailable: parseFloat(row["Power Score Earned"]) || 0,
        teamPlacement: Number(row.Placement),
        contributions: row.Contributions,
        contributionPercent: row["Contribution %"],
        individualPlacement: currentPlacement,
        movement,
      })

    })

  const teams = Object.values(teamsByLetter).sort((a, b) => a.teamPlacement - b.teamPlacement)

  // Every player from every team, ranked 1st to last by how they
  // individually did that match (Match Ranking Points) - independent of
  // who their teammate was or how the team as a whole finished.
  const allPlayersRanked = teams
    .flatMap((t) => t.players)
    .sort((a, b) => a.individualPlacement - b.individualPlacement)

  const event = schedule.find((e) => e["Event ID"] === String(eventId))
  const eventName = event ? event["Event Name"] : `Event ${eventId}`

  return (

    <section className="next-event-feature last-match-feature">

      <CourseBackground course={event?.Course} />

      <div className="next-event-overlay" />

      {onCollapse && (
        <button
          type="button"
          className="match-collapse-button"
          onClick={onCollapse}
          aria-label="Collapse"
        >
          ▲ Collapse
        </button>
      )}

      <div className="next-event-content">

        <p className="next-event-eyebrow">{eyebrow}</p>

        <h2 className="next-event-title">{eventName} Results</h2>

        <p className="next-event-meta">
          {event?.Date}
          {event?.Course && <span className="next-event-dot">•</span>}
          {event?.Course}
        </p>

        {teams.length > 0 && (

          <>

            <div className="match-view-toggle">

              <button
                type="button"
                className={`match-view-tab${view === "teams" ? " active" : ""}`}
                onClick={() => setView("teams")}
              >
                Team Results
              </button>

              <button
                type="button"
                className={`match-view-tab${view === "individual" ? " active" : ""}`}
                onClick={() => setView("individual")}
              >
                Individual Placements
              </button>

            </div>

            {view === "teams" ? (

              <div className="next-event-matchups last-match-matchups-stacked">

                {teams.map((t) => {

                  const isChampion = t.teamPlacement === 1

                  return (

                    <div
                      className={`next-event-matchup-card${isChampion ? " last-match-champion-card" : ""}`}
                      key={t.team}
                      onClick={() => setModalTeam(t)}
                    >

                      <span className="next-event-team-tag">
                        {isChampion ? "🏆 Champions" : ordinal(t.teamPlacement)}
                      </span>

                      <div className="next-event-matchup-players">

                        <PlayerChip player={t.players[0]} playerIds={playerIds} />

                        {t.players.length > 1 && (
                          <>
                            <span className="next-event-teammate-divider">&amp;</span>
                            <PlayerChip player={t.players[1]} playerIds={playerIds} />
                          </>
                        )}

                      </div>

                      <p className="last-match-team-score">
                        Team Score: {formatOverPar(t.teamScore)}
                      </p>

                    </div>

                  )

                })}

              </div>

            ) : (

              <div className="individual-placements-panel">

                <div className="table-scroll">

                  <table className="leaderboard-table">

                    <thead>

                      <tr>
                        <th>Place</th>
                        <th>Player</th>
                        <th>Team Placement</th>
                        <th>Team Points</th>
                        <th>Contribution</th>
                        <th>Points Earned</th>
                      </tr>

                    </thead>

                    <tbody>

                      {allPlayersRanked.map((player) => (

                        <tr key={player.name}>

                          <td>
                            {player.individualPlacement}
                          </td>

                          <td>

                            <div className="leaderboard-player">

                              <div className="next-event-avatar-wrap individual-placements-avatar-wrap">

                                <img
                                  src={`${import.meta.env.BASE_URL}images/players/${playerIds[player.name]}.jpg`}
                                  alt={player.name}
                                  className="leaderboard-avatar"
                                  onError={(e) => {
                                    e.target.src = `${import.meta.env.BASE_URL}images/players/default.jpg`
                                  }}
                                />

                                <MovementBadge movement={player.movement} />

                              </div>

                              {player.name}

                            </div>

                          </td>

                          <td>
                            {ordinal(player.teamPlacement)}
                          </td>

                          <td>
                            {player.teamPointsAvailable.toFixed(1)}
                          </td>

                          <td>
                            {player.contributionPercent}
                          </td>

                          <td>
                            {player.matchPoints.toFixed(2)}
                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

            )}

          </>

        )}

      </div>

      {modalTeam && (
        <TeamRecapModal
          modalTeam={modalTeam}
          playerIds={playerIds}
          onClose={() => setModalTeam(null)}
        />
      )}

    </section>

  )

}

export default MatchResultsView
