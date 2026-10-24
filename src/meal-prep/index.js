import weekOne from './week-2026-10-12'

// To add a new week: create a file next to this one with the same shape,
// import it here, and add it to the array. Newest weeks are listed first.
const weeks = [weekOne]

export default [...weeks].sort((a, b) => (a.date < b.date ? 1 : -1))
