import bananaAlmondMuffins from './banana-almond-muffins'
import miniFruitCrumbleTarts from './mini-fruit-crumble-tarts'

// To add a recipe: create a file next to this one, export a default object with
// the same shape (see mini-fruit-crumble-tarts.js), then add it to this array.
const recipes = [miniFruitCrumbleTarts, bananaAlmondMuffins]

// Newest first; recipes with the same date keep the order above.
export default recipes
  .map((recipe, index) => ({ recipe, index }))
  .sort((a, b) => {
    if (a.recipe.date === b.recipe.date) return a.index - b.index
    return a.recipe.date < b.recipe.date ? 1 : -1
  })
  .map(({ recipe }) => recipe)
