// Major wins come from the Events tab: an "Event Type" column marks each
// event "Regular" or "Major", and the existing "Winner" column holds the
// winning team's two names separated by "/". A player's major win count
// is how many Major-type events they appear in as a winner.
export function getMajorWins(events) {

  const majorWins = {}

  if (!events || events.length === 0) return majorWins

  events.forEach((event) => {

    const type = (event["Event Type"] || "").trim().toLowerCase()

    if (type !== "major" || !event.Winner) return

    event.Winner
      .split("/")
      .map((name) => name.trim())
      .filter(Boolean)
      .forEach((name) => {
        majorWins[name] = (majorWins[name] || 0) + 1
      })

  })

  return majorWins

}
