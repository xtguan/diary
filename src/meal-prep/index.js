import weekOne from './week-2026-10-12'
import weekTwo from './week-2026-10-26'
import weekThree from './week-2026-11-02'
import weekFour from './week-2026-11-09'

// To add a new week: create a file next to this one with the same shape,
// import it here, and add it to the array. Newest weeks are listed first.
const weeks = [weekOne, weekTwo, weekThree, weekFour]

export default [...weeks].sort((a, b) => (a.date < b.date ? 1 : -1))
