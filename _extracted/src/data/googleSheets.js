import axios from "axios"

// ==============================
// SHEET URLS
// ==============================

const PLAYERS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSaRzObvMpmjQNGdhCQZUoiwazKtbfL2t5tnf7n7nr34NvQQYrL9_dvNEJ_U1s0W5FMA_6V9N9S0GdY/pub?gid=0&single=true&output=csv"

const RANKINGS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSaRzObvMpmjQNGdhCQZUoiwazKtbfL2t5tnf7n7nr34NvQQYrL9_dvNEJ_U1s0W5FMA_6V9N9S0GdY/pub?gid=1178466577&single=true&output=csv"

const SCHEDULE_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSaRzObvMpmjQNGdhCQZUoiwazKtbfL2t5tnf7n7nr34NvQQYrL9_dvNEJ_U1s0W5FMA_6V9N9S0GdY/pub?gid=102645129&single=true&output=csv"

const EVENTS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSaRzObvMpmjQNGdhCQZUoiwazKtbfL2t5tnf7n7nr34NvQQYrL9_dvNEJ_U1s0W5FMA_6V9N9S0GdY/pub?gid=898289286&single=true&output=csv"

const PLAYER_STATS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSaRzObvMpmjQNGdhCQZUoiwazKtbfL2t5tnf7n7nr34NvQQYrL9_dvNEJ_U1s0W5FMA_6V9N9S0GdY/pub?gid=1392756262&single=true&output=csv"

const NEWS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSaRzObvMpmjQNGdhCQZUoiwazKtbfL2t5tnf7n7nr34NvQQYrL9_dvNEJ_U1s0W5FMA_6V9N9S0GdY/pub?gid=1649176247&single=true&output=csv"

// ==============================
// CSV PARSER
// ==============================

function parseCSVLine(line) {

  const result = []
  let current = ""
  let insideQuotes = false

  for (let i = 0; i < line.length; i++) {

    const char = line[i]

    if (char === '"') {

      if (insideQuotes && line[i + 1] === '"') {

        current += '"'
        i++

      } else {

        insideQuotes = !insideQuotes

      }

    } else if (char === "," && !insideQuotes) {

      result.push(current.trim())
      current = ""

    } else {

      current += char

    }

  }

  result.push(current.trim())

  return result

}

// ==============================
// GENERIC CSV READER
// ==============================

async function readCSV(url) {

  const response = await axios.get(url)

  const rows = response.data
    .replace(/\r/g, "")
    .trim()
    .split("\n")

  if (rows.length === 0) return []

  const headers = parseCSVLine(rows[0])

  return rows.slice(1).map(row => {

    const values = parseCSVLine(row)

    const obj = {}

    headers.forEach((header, index) => {

      obj[header.trim()] = (values[index] || "").trim()

    })

    return obj

  })

}

// ==============================
// EXPORTS
// ==============================

export async function getPlayers() {
  return await readCSV(PLAYERS_URL)
}

export async function getPlayerStats() {
  return await readCSV(PLAYER_STATS_URL)
}

export async function getRankings() {
  return await readCSV(RANKINGS_URL)
}

export async function getSchedule() {
  return await readCSV(SCHEDULE_URL)
}

export async function getEvents() {
  return await readCSV(EVENTS_URL)
}

export async function getNews() {
  return await readCSV(NEWS_URL)
}