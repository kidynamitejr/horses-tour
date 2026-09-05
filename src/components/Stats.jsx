import { useEffect, useState } from "react"
import { getPlayerStats, getContributions, getMatchEntry } from "../data/googleSheets"
import { getMatchmakingPointsByPlayer } from "../utils/matchmakingPoints"
import { getPlayerSummaries } from "../utils/matchEntry"

// Finds the single lowest Team Score in Match Entry (ignoring
// future/unplayed rows, which have a blank score) and returns everyone
// who was on that team.
function getLowestTeamScore(matchEntry) {

  const valid = matchEntry
    .filter((row) => row["Team Score"] && !isNaN(parseFloat(row["Team Score"])))
    .map((row) => ({
      team: row.Team,
      player: row.Player,
      score: parseFloat(row["Team Score"]),
    }))

  if (valid.length === 0) {
    return { score: null, players: [] }
  }

  const min = Math.min(...valid.map((r) => r.score))

  const players = valid
    .filter((r) => r.score === min)
    .map((r) => r.player)

  return { score: min, players }

}

function getLeadersFromEntries(entries) {

  const valid = entries.filter((e) => !isNaN(e.value))

  if (valid.length === 0) {
    return { value: null, names: [] }
  }

  const max = Math.max(...valid.map((e) => e.value))

  if (max === 0) {
    return { value: 0, names: [] }
  }

  const names = valid
    .filter((e) => e.value === max)
    .map((e) => e.name)

  return { value: max, names }

}

function getLeaders(players, field) {
  return getLeadersFromEntries(
    players.map((p) => ({ name: p.Player, value: parseFloat(p[field]) }))
  )
}

function formatScore(value) {
  if (value === null) return "-"
  return Number.isInteger(value) ? String(value) : value.toFixed(2)
}

function formatOverPar(value) {
  if (value === null) return "-"
  const formatted = formatScore(value)
  return value >= 0 ? `+${formatted}` : formatted
}

function Stats() {

  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function loadRecords() {

      try {

        const [playerStats, contributions, matchEntry] = await Promise.all([
          getPlayerStats(),
          getContributions(),
          getMatchEntry(),
        ])

        const lowestTeamScore = getLowestTeamScore(matchEntry)

        const highestSingleEvent = getLeaders(playerStats, "Highest Round Points")

        const summaries = getPlayerSummaries(matchEntry)

        // Computed from Contributions (only rows where Contributions is
        // filled in) rather than the sheet's own Average Points column,
        // since that column divides by Events Played even when a future
        // event's blank row is included in the count.
        const matchmakingPointsByPlayer = getMatchmakingPointsByPlayer(contributions)
        const averagePoints = getLeadersFromEntries(
          Object.entries(matchmakingPointsByPlayer).map(([name, value]) => ({ name, value }))
        )

        // Wins/Runner Ups/Top 3 come from Match Entry (like the rest of
        // the site) instead of the old Match Results tab, which stopped
        // being updated after the first two events.
        const rankableEntries = Object.entries(summaries)
          .filter(([name]) => !/\(sub\)/i.test(name))

        const wins = getLeadersFromEntries(
          rankableEntries.map(([name, s]) => ({ name, value: s.wins }))
        )

        const runnerUps = getLeadersFromEntries(
          rankableEntries.map(([name, s]) => ({ name, value: s.runnerUps }))
        )

        const topThree = getLeadersFromEntries(
          rankableEntries.map(([name, s]) => ({ name, value: s.topThree }))
        )

        const combined = []

        combined.push({
          Record: "Best Team Score",
          Score: formatOverPar(lowestTeamScore.score),
          Team: lowestTeamScore.players.join(", "),
        })

        combined.push(
          {
            Record: "Highest Single Event Points",
            Score: formatScore(highestSingleEvent.value),
            Team: highestSingleEvent.names.join(", "),
          },
          {
            Record: "Highest Average Points",
            Score: formatScore(averagePoints.value),
            Team: averagePoints.names.join(", "),
          },
          {
            Record: "Most Wins",
            Score: formatScore(wins.value),
            Team: wins.names.join(", "),
          },
          {
            Record: "Most Runner Ups",
            Score: formatScore(runnerUps.value),
            Team: runnerUps.names.join(", "),
          },
          {
            Record: "Most Top 3 Finishes",
            Score: formatScore(topThree.value),
            Team: topThree.names.join(", "),
          }
        )

        setRecords(combined)

      } catch (error) {

        console.error("Stats Error:", error)

      } finally {

        setLoading(false)

      }

    }

    loadRecords()

  }, [])

  return (

    <section className="card">


      <h2>
        Tour Statistics
      </h2>


      {loading && (
        <p>Loading stats...</p>
      )}


      <div className="stats-grid">


        {!loading && records.map((record) => (


          <div
            className="stat-card"
            key={record.Record}
          >


            <h3>
              {record.Record}
            </h3>

            <p className="stat-value">
              {record.Score}
            </p>

            <p className="stat-team">
              {record.Team}
            </p>


          </div>


        ))}


      </div>


    </section>

  )

}


export default Stats
