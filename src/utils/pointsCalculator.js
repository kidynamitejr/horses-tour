const MIN_TEAM_POINTS = 10
const MAX_TEAM_POINTS = 50

const MIN_MULTIPLIER = 0.6
const MAX_MULTIPLIER = 1.4

// Interpolates linearly between MIN_TEAM_POINTS (last place) and
// MAX_TEAM_POINTS (1st place) so the point spread stays fixed no matter
// how many teams enter - it stretches evenly across however many
// placements there are instead of growing with the field size.
export function getTeamPoints(placement, totalTeams) {
  if (!placement || !totalTeams || totalTeams <= 1) {
    return MAX_TEAM_POINTS
  }

  const clampedPlacement = Math.min(Math.max(placement, 1), totalTeams)
  const ratio = (clampedPlacement - 1) / (totalTeams - 1)

  return MAX_TEAM_POINTS - ratio * (MAX_TEAM_POINTS - MIN_TEAM_POINTS)
}

// Interpolates linearly between MIN_MULTIPLIER (current #1 ranked player)
// and MAX_MULTIPLIER (current last-ranked player) so the scale stretches
// or compresses automatically as the tour roster grows or shrinks.
// Players with no prior rank (brand new) get a neutral 1x.
export function getRankMultiplier(rank, totalRankedPlayers) {
  if (!rank || !totalRankedPlayers || totalRankedPlayers <= 1) {
    return 1
  }

  const clampedRank = Math.min(Math.max(rank, 1), totalRankedPlayers)
  const ratio = (clampedRank - 1) / (totalRankedPlayers - 1)

  return MIN_MULTIPLIER + ratio * (MAX_MULTIPLIER - MIN_MULTIPLIER)
}
