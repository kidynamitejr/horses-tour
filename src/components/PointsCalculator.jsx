import { useEffect, useState } from "react"
import { getPlayers, getRankings } from "../data/googleSheets"
import { getTeamPoints, getRankMultiplier } from "../utils/pointsCalculator"

let nextId = 1

function makeTeam() {
  return {
    id: nextId++,
    placement: "",
    players: [
      { name: "", contribution: "" },
      { name: "", contribution: "" },
    ],
  }
}

function PointsCalculator() {

  const [teams, setTeams] = useState([makeTeam(), makeTeam()])
  const [rankMap, setRankMap] = useState({})
  const [totalRanked, setTotalRanked] = useState(0)
  const [playerNames, setPlayerNames] = useState([])

  useEffect(() => {

    async function loadData() {

      const [players, rankings] = await Promise.all([
        getPlayers(),
        getRankings(),
      ])

      setPlayerNames(players.map((p) => p.Name))

      const map = {}

      rankings.forEach((r) => {
        map[r.Player.trim().toLowerCase()] = Number(r.Rank)
      })

      setRankMap(map)
      setTotalRanked(rankings.length)

    }

    loadData()

  }, [])

  function updateTeam(id, field, value) {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === id ? { ...team, [field]: value } : team
      )
    )
  }

  function updatePlayer(teamId, playerIndex, field, value) {
    setTeams((prev) =>
      prev.map((team) => {
        if (team.id !== teamId) return team

        const players = team.players.map((player, index) =>
          index === playerIndex ? { ...player, [field]: value } : player
        )

        return { ...team, players }
      })
    )
  }

  function addTeam() {
    setTeams((prev) => [...prev, makeTeam()])
  }

  function removeTeam(id) {
    setTeams((prev) => prev.filter((team) => team.id !== id))
  }

  function resetAll() {
    setTeams([makeTeam(), makeTeam()])
  }

  const totalTeams = teams.length

  const placements = teams
    .map((t) => Number(t.placement))
    .filter((p) => p > 0)

  const placementsValid =
    placements.length === teams.length &&
    new Set(placements).size === teams.length &&
    placements.every((p) => p >= 1 && p <= totalTeams)

  const results = []

  teams.forEach((team) => {

    const placement = Number(team.placement)
    const teamPoints = getTeamPoints(placement, totalTeams)

    team.players.forEach((player) => {

      if (!player.name.trim()) return

      const contribution = Number(player.contribution) || 0
      const basePoints = teamPoints * (contribution / 100)

      const rank = rankMap[player.name.trim().toLowerCase()] || null
      const multiplier = rank ? getRankMultiplier(rank, totalRanked) : 1

      const finalPoints = basePoints * multiplier

      results.push({
        team: team.id,
        placement: team.placement,
        teamPoints,
        name: player.name,
        contribution,
        rank,
        multiplier,
        finalPoints,
      })

    })

  })

  return (

    <section className="card">

      <h2>Points Calculator</h2>

      <p>
        Enter each team's finishing placement and how much each player
        contributed to the round. Points are calculated automatically and
        can be copied into your Player History sheet.
      </p>

      {!placementsValid && placements.length > 0 && (
        <p className="calc-warning">
          Placements should be unique numbers from 1 to {totalTeams} (one per team).
        </p>
      )}

      <div className="table-scroll">

        <table className="calc-table">

          <thead>
            <tr>
              <th>Placement</th>
              <th>Player 1</th>
              <th>Contribution %</th>
              <th>Player 2</th>
              <th>Contribution %</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

            {teams.map((team) => {

              const contributionTotal =
                (Number(team.players[0].contribution) || 0) +
                (Number(team.players[1].contribution) || 0)

              const contributionOff =
                (team.players[0].contribution || team.players[1].contribution) &&
                contributionTotal !== 100

              return (

                <tr key={team.id}>

                  <td>
                    <input
                      type="number"
                      min="1"
                      className="calc-input calc-input-small"
                      value={team.placement}
                      onChange={(e) =>
                        updateTeam(team.id, "placement", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      list="calc-player-names"
                      className="calc-input"
                      value={team.players[0].name}
                      onChange={(e) =>
                        updatePlayer(team.id, 0, "name", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="calc-input calc-input-small"
                      value={team.players[0].contribution}
                      onChange={(e) =>
                        updatePlayer(team.id, 0, "contribution", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      list="calc-player-names"
                      className="calc-input"
                      value={team.players[1].name}
                      onChange={(e) =>
                        updatePlayer(team.id, 1, "name", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="calc-input calc-input-small"
                      value={team.players[1].contribution}
                      onChange={(e) =>
                        updatePlayer(team.id, 1, "contribution", e.target.value)
                      }
                    />

                    {contributionOff && (
                      <div className="calc-warning-inline">
                        ≠ 100%
                      </div>
                    )}

                  </td>

                  <td>
                    <button
                      type="button"
                      className="calc-remove-button"
                      onClick={() => removeTeam(team.id)}
                    >
                      Remove
                    </button>
                  </td>

                </tr>

              )

            })}

          </tbody>

        </table>

      </div>

      <datalist id="calc-player-names">
        {playerNames.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>

      <div className="calc-actions">

        <button type="button" className="button" onClick={addTeam}>
          + Add Team
        </button>

        <button type="button" className="calc-reset-button" onClick={resetAll}>
          Reset
        </button>

      </div>

      {results.length > 0 && (

        <>
          <h3>Results</h3>

          <div className="table-scroll">

            <table className="calc-table">

              <thead>
                <tr>
                  <th>Player</th>
                  <th>Placement</th>
                  <th>Team Points</th>
                  <th>Contribution</th>
                  <th>Previous Rank</th>
                  <th>Multiplier</th>
                  <th>Points Earned</th>
                </tr>
              </thead>

              <tbody>

                {results.map((r, index) => (

                  <tr key={index}>
                    <td>{r.name}</td>
                    <td>{r.placement || "-"}</td>
                    <td>{r.teamPoints.toFixed(2)}</td>
                    <td>{r.contribution}%</td>
                    <td>{r.rank ? `#${r.rank}` : "New"}</td>
                    <td>{r.multiplier.toFixed(2)}x</td>
                    <td>
                      <strong>{r.finalPoints.toFixed(2)}</strong>
                    </td>
                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </>

      )}

    </section>

  )

}

export default PointsCalculator
