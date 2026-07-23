import axios from "axios"

// ----------------------
// PLAYERS
// ----------------------

const PLAYERS_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vSaRzObvMpmjQNGdhCQZUoiwazKtbfL2t5tnf7n7nr34NvQQYrL9_dvNEJ_U1s0W5FMA_6V9N9S0GdY/pub?gid=0&single=true&output=csv"


// ----------------------
// RANKINGS
// ----------------------

const RANKINGS_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vSaRzObvMpmjQNGdhCQZUoiwazKtbfL2t5tnf7n7nr34NvQQYrL9_dvNEJ_U1s0W5FMA_6V9N9S0GdY/pub?gid=1178466577&single=true&output=csv"


// ----------------------
// Generic CSV Reader
// ----------------------

async function readCSV(url) {

  const response = await axios.get(url)

  const rows = response.data
    .trim()
    .split("\n")

  const headers = rows[0]
    .split(",")
    .map(header => header.trim())

  return rows.slice(1).map(row => {

    const values = row.split(",")

    let object = {}

    headers.forEach((header, index) => {

      object[header] = values[index]?.trim() || ""

    })

    return object

  })

}


// ----------------------
// PLAYERS
// ----------------------

export async function getPlayers() {

  return await readCSV(PLAYERS_URL)

}


// ----------------------
// RANKINGS
// ----------------------

export async function getRankings() {

  return await readCSV(RANKINGS_URL)

}