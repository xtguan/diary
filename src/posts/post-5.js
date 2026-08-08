export default {
  slug: 'current-learning-notes-dfs-and-topological-sorting',
  title: 'Current learning notes: DFS and topological sorting',
  date: '2026-08-08',
  category: 'learning',
  tags: ['learning', 'algorithms', 'dfs', 'topological-sorting'],
  thumbnail: null,
  content: `# Current learning notes: DFS and topological sorting

These notes are focused on the graph concepts I am actively working through in my algorithm study.

## DFS behavior and ordering

**DFS is depth-first by nature**, so it:
1. Goes as deep as possible along one path before backtracking
2. Explores neighbors in the order they are given or in alphabetical order when that is part of the problem
3. Temporarily leaves other branches alone until it has fully explored the current path

This means DFS does not always move across the graph in a broad, level-by-level way. Instead, it commits to one branch first and only comes back when it has reached a dead end.

## Same-level vertices vs neighbors

This distinction matters in graph traversal:
- **Neighbors** are vertices directly connected to the current vertex by an edge
- **Same-level vertices** are not necessarily neighbors, even if they appear related in the structure of the graph

A vertex can be "ignored" temporarily not because it is unimportant, but because DFS is still busy exploring the current path.

## Example from the problem

Starting at **A**:
- Suppose **C** is the first neighbor of **A**
- DFS goes from **A → C** and keeps going deeper first
- It may continue through a chain such as **A → C → D → F → G**
- Once it reaches the end of that path, it backtracks and explores the next available branch
- After that, it returns to earlier vertices and continues from there

This is why DFS can feel like it is postponing some vertices at the same level until later.

## Why this matters for topological sorting

In topological sorting, DFS is often used as a way to reason about the order of dependencies. The traversal order helps reveal which nodes are reached first and which must come later. The main idea is:

- A node is fully processed only after all of its descendants have been explored
- That processing order can be used to build a valid topological order

## Key takeaway

The important lesson is that DFS is not about exploring everything evenly at once. It is about following one path thoroughly, then backtracking and continuing elsewhere. That behavior is exactly what makes it useful for problems involving reachability, recursion, and dependency ordering.
`
}
