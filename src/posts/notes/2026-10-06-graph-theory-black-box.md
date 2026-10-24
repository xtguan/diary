# 图论算法：黑盒总览（中英对照）/ Graph Theory Algorithms: Black Box Overview

*An independent bilingual study guide to twelve standard graph algorithms, written for anyone learning the material. It summarizes standard algorithm ideas and does not reproduce course notes.*

*一份独立的双语图论算法学习笔记，写给任何想学这些算法的人；只整理标准算法思路，不复制任何课程讲义。*

<a id="contents"></a>

## 目录 Table of contents

- [一、总表 Overview table (12 black boxes)](#overview)
- [二、分类详解 Details by category](#details)
  - [1. 遍历与连通性 Traversal and connectivity (unweighted graphs)](#details-1)
  - [2. 有向图的结构 Directed graph structure](#details-2)
  - [3. 最短路径 Shortest paths](#details-3)
  - [4. 最小生成树 MST (Minimum Spanning Tree)](#details-4)
  - [5. 最大流 Max flow](#details-5)
  - [6. 逻辑约束 Logic constraints](#details-6)
- [三、做题时的选择流程 Decision flow when solving a problem](#decision)
- [四、常见细节 Details that often matter](#common-details)
- [五、实用解题建议 Practical problem-solving advice](#advice)
  - [读题时先看这些图属性 Graph properties to check in a problem statement](#advice-1)
  - [常用策略 Common strategies](#advice-2)
  - [答题目标 What a strong answer looks like](#advice-3)
- [六、算法对比 Algorithm comparisons](#compare)
  - [6.1 题目要什么 → 用哪个黑盒 What the problem asks → which black box](#compare-1)
  - [6.2 最容易混的一对：最短路径 vs MST The most confusable pair](#compare-2)
  - [6.3 四个最短路径算法 The four shortest-path algorithms](#compare-3)
  - [6.4 BFS vs DFS](#compare-4)
  - [6.5 Topological Sort vs SCC](#compare-5)
  - [6.6 Kruskal vs Prim](#compare-6)
  - [6.7 Ford-Fulkerson vs Edmonds-Karp](#compare-7)
  - [6.8 最大流 vs 最短路径 Max flow vs shortest path](#compare-8)
  - [6.9 2-SAT 特殊在哪 What makes 2-SAT special](#compare-9)
  - [6.10 一句话总结 One-line summary](#compare-10)
- [七、性质锚句 Property anchors - sentences you can use in a solution](#anchors)
  - [7.1 DFS](#anchors-1)
  - [7.2 BFS](#anchors-2)
  - [7.3 Topological Sort](#anchors-3)
  - [7.4 SCC](#anchors-4)
  - [7.5 Dijkstra](#anchors-5)
  - [7.6 Bellman-Ford](#anchors-6)
  - [7.7 Floyd-Warshall](#anchors-7)
  - [7.8 Kruskal](#anchors-8)
  - [7.9 Prim](#anchors-9)
  - [7.10 Ford-Fulkerson](#anchors-10)
  - [7.11 Edmonds-Karp](#anchors-11)
  - [7.12 2-SAT](#anchors-12)
  - [7.13 跨黑盒常引用的定理 Cross-cutting facts](#anchors-13)

---


**整理日期 Last updated:** 2026-10-06

**怎么用 How to use:** 先看[第三节](#decision)的选择流程，找到分类。再回来看那个黑盒的输入、输出、复杂度。
**背性质看[第七节](#anchors)。** 写解答时，第七节的句子就是骨架：从关键词扩写成完整的一两句。
First read the decision flow in Section 3 to find the category. Then look up that black box's input, output, and runtime.

---

<a id="overview"></a>
## 一、总表 Overview table (12 black boxes)

| 分类 Category（含图类型 graph type） | 黑盒 Black box | 前提 Requirements（权重 / 容量 / 起点 / 连通性） | 复杂度 Runtime | 一句话用途 One-line use |
|---|---|---|---|---|
| 遍历 / 连通性 Traversal（有向或无向 directed or undirected） | DFS | 无权 unweighted；图可非连通 disconnected is fine（会自动重启 restarts by itself） | O(n + m) | 连通块、找环、边分类 connected components, cycles, edge types |
| | BFS | 无权 unweighted；**必须给起点 must be given a source**；图可非连通，但不会重启，其他分量距离为 inf disconnected is fine but does not restart; other components keep distance inf | O(n + m) | 可达性、无权最短路 reachability, unweighted shortest path |
| 有向图结构 Directed structure（**仅有向 directed only**，且必须是 DAG） | Topological Sort | 无权 unweighted；仅有向且必须是 DAG directed and acyclic only | O(n + m) | 依赖顺序排序 dependency ordering |
| | SCC | 无权 unweighted；仅有向 directed only | O(n + m) | 互相可达的组 mutually reachable groups, source/sink groups |
| 最短路 Shortest path（有向或无向 directed or undirected） | BFS (unweighted) | 无权 unweighted；**必须给起点 must be given a source** | O(n + m) | 最少边数 fewest edges |
| | Dijkstra | 带权 weighted，**不能有负权边 no negative edges** | O((n + m) log n) | 非负权最短路 non-negative weighted shortest path |
| | Bellman-Ford | 带权 weighted，可含负权 negatives allowed，**不能有可达的负环 no reachable negative cycle** | O(nm) | 负权、检测负环 negative weights, negative cycle detection |
| | Floyd-Warshall | 带权 weighted，可含负权 negatives allowed，**不能有负环 no negative cycle**；不需要起点 takes no source（因此也能在非连通图上检测负环 so it can find negative cycles in disconnected graphs too） | O(n³) | 所有点对最短路 all-pairs shortest paths |
| 最小生成树 MST（**仅无向 undirected only**，且必须连通 connected） | Kruskal | 带权 weighted；仅无向 undirected only；图必须连通 connected required | O(m log n) | 最小生成树 minimum spanning tree |
| | Prim | 带权 weighted；仅无向 undirected only；图必须连通 connected required | O(m log n) | 最小生成树 minimum spanning tree |
| 最大流 Max flow（**仅有向 directed only**） | Ford-Fulkerson | 容量必须为**正整数 positive integers**（整数是 FF 特有的 integer is FF-specific） | O(mC) | 最大流 / 带容量的匹配 max flow, matching with capacities |
| | Edmonds-Karp | 容量为**正数 positive**（可为非整数 non-integer allowed） | O(nm²) | 同上，但不依赖 C same, but runtime does not depend on C |
| 逻辑约束 Logic（输入是公式不是图 input is a formula, not a graph；其蕴含图有向无权） | 2-SAT | - 不适用 n/a（输入是公式 input is a formula；蕴含图有向无权 its implication graph is directed and unweighted） | O(n + m) | 布尔约束能否同时满足 boolean constraints satisfiable |

**为什么图类型写在分类上 Why graph type sits on the category:** 同一分类里的黑盒对"有向 / 无向"的要求完全一致（遍历 = 两者皆可；有向图结构 = 仅有向；最短路 = 两者皆可；MST = 仅无向；最大流 = 仅有向），所以它是分类的性质，不是每个黑盒各自的性质。真正需要逐行看的是第三栏**"前提 Requirements"**：最短路分类里三行对负权的要求互不相同（非负 / 可负 / 可负），最大流分类里也有"整数容量 / 非整数容量"的差别，此外还有"是否必须给起点""图是否必须连通"这类逐行或逐分类的前提。
Within a category the directed/undirected requirement is always the same, so it belongs to the category. The column that genuinely varies row by row is the requirements column (weights, capacities, whether a source must be given, connectivity).

**前提一栏怎么用 How to use the requirements column.** 上表的第三栏已经把"权重、容量、起点、连通性"四类前提都收到了每一行里；复习时只要记住一句话：**Dijkstra 怕负权，Bellman-Ford 怕可达负环，MST 要无向且连通，Ford-Fulkerson 要整数容量，BFS 与 Dijkstra 必须给起点。**
The third column now collects every precondition (weights, capacities, source, connectivity) row by row. One sentence to remember: Dijkstra fears negative edges, Bellman-Ford fears reachable negative cycles, MST requires an undirected connected graph, Ford-Fulkerson requires integer capacities, and BFS and Dijkstra must be given a source.

[↑ Back to contents](#contents)

---

<a id="details"></a>
## 二、分类详解 Details by category

<a id="details-1"></a>
### 1. 遍历与连通性 Traversal and connectivity (unweighted graphs)

**DFS - Depth-First Search / 深度优先搜索 - O(n + m)**

- 输入 Input: 邻接表 adjacency list; 起点 starting vertex（可选 optional）
- 输出 Output: `ccnum[]` 连通块编号 component number; `prev[]` 父节点 parent; `pre[]` and `post[]` 进入 / 离开时间 visit and finish times
- 能做 Use for: 连通块 connected components; 找环 cycle detection; 两点是否连通 whether two vertices are connected; 边分类 edge classification (tree / forward / back / cross); 产生 post 序 post order, which topological sort and SCC both need
- 注意 Note: 有向、无向都行 directed or undirected. 这是唯一会自动重启、一次跑完所有连通块的遍历 This is the only traversal that restarts automatically and covers all components in one run.

**BFS - Breadth-First Search / 广度优先搜索 - O(n + m)**

- 输入 Input: 邻接表 adjacency list + **必须给起点** a starting vertex is required
- 输出 Output: `dist[]` 无权最短距离 unweighted shortest distance; `prev[]` 父节点 parent
- 能做 Use for: 可达性 reachability; 无权最短路 unweighted shortest path (fewest edges); 层数 / 距离 levels and distance; 网格最少步数 fewest moves in a grid
- 注意 Note: **单源** single-source, 不会自动重启 it does not restart. 断开图里其他分量的距离是 inf vertices in other components keep distance inf.

[↑ Back to contents](#contents)

<a id="details-2"></a>
### 2. 有向图的结构 Directed graph structure

**Topological Sort / 拓扑排序 - O(n + m)**

- 输入 Input: 有向无环图 a DAG (directed acyclic graph)
- 输出 Output: `order[]`（source → sink 的顺序 order from source to sink）, 另外 DFS 的所有输出也能用 plus all DFS outputs
- 能做 Use for: 先修关系 / 任务依赖顺序 prerequisite or task dependency order; 编译顺序 compilation order; 检测"依赖成环所以不可能" detect that a dependency cycle makes it impossible
- 注意 Note: 只对有向图 directed only, 而且必须是 DAG and the graph must be a DAG

**SCC - Strongly Connected Components / 强连通分量 - O(n + m)**

- 输入 Input: 有向图 a directed graph
- 输出 Output: metagraph（缩点后的 DAG the condensation, which is a DAG）, 按 sink → source 的逆拓扑序 in reverse topological order (sink to source); 以及 `ccnum[]` 等 plus component numbers
- 能做 Use for: 找"互相可达"的组 find mutually reachable groups; 找 source SCC / sink SCC find source and sink components; 网页链接图或模块依赖分析 web graph or module dependency analysis
- 典型题 Typical problems: 判断整个图是否强连通（只有一个 SCC）is the whole graph strongly connected (one SCC)?; 加最少几条边变强连通 minimum edges to make it strongly connected
- 注意 Note: 只对有向图 directed only, 不要求连通 connectivity is not required

[↑ Back to contents](#contents)

<a id="details-3"></a>
### 3. 最短路径 Shortest paths

| 黑盒 Black box | 复杂度 Runtime | 输入 Input | 输出 Output | 能做 Use for |
|---|---|---|---|---|
| BFS | O(n + m) | 邻接表 + 起点 adjacency list + start | dist[], prev[] | 最少边数 fewest edges |
| Dijkstra | O((n + m) log n) | 邻接表 + 起点 + **非负**权重 non-negative weights | dist[], prev[] | 带权最短路 weighted shortest path (cost or time) |
| Bellman-Ford | O(nm) | 邻接表 + 起点 + 权重（可负）weights may be negative | dist[], prev[], iter[][] | 负权最短路、检测**可达的**负环 negative weights, reachable negative cycles |
| Floyd-Warshall | O(n³) | 邻接表 + 权重 adjacency list + weights | dist[][] 二维矩阵 2-D matrix | **所有点对**最短路 all-pairs shortest paths |

注意 Note: Dijkstra **不能有负权** cannot handle negative weights. Bellman-Ford 可以 but can, 但更慢 but slower. 只有 Floyd-Warshall 给所有点对 Only Floyd-Warshall gives all pairs.

[↑ Back to contents](#contents)

<a id="details-4"></a>
### 4. 最小生成树 MST (Minimum Spanning Tree)

**Kruskal - O(m log n)**: 输出选中的边列表 returns the selected edge list
**Prim - O(m log n)**: 输出 `prev[]`（树的结构）returns prev[] giving the tree shape

- 输入 Input: **连通、无向、带权**的图 + 权重 a connected, undirected, weighted graph plus weights
- 能做 Use for: 最小生成树 minimum spanning tree; 最便宜地把所有点连起来 cheapest way to connect all vertices (fiber, power grid, roads)
- 注意 Note: 只对无向图 undirected only, 而且要求连通 and the graph must be connected
- 两者区别 Difference: Kruskal 按边排序 sorts edges (better for sparse graphs), Prim 从一个点往外长 grows from one vertex (better for dense graphs)

[↑ Back to contents](#contents)

<a id="details-5"></a>
### 5. 最大流 Max flow

**Ford-Fulkerson - O(mC)** and **Edmonds-Karp - O(nm²)**

- 输入 Input: **有向图** a directed graph + 正容量 positive capacities + source + sink
- 输出 Output: `flow[]` 每条边的流量 flow per edge; **C 最大流的值 the max flow value**
- 能做 Use for: 最大流 max flow; 网络吞吐瓶颈 network throughput bottlenecks; 带容量的分配 / 匹配 assignment or matching with capacities
- 注意 Note: 只对有向图 directed only. 不要求整图连通 the whole graph need not be connected, 只要 source 能到 sink it is enough that the source reaches the sink. 到不了时 C = 0 If not, C = 0.
- 两者区别 Difference: FF 的复杂度依赖最大流值 C depends on the max flow value C; EK 用 BFS 找最短增广路 uses BFS to find a shortest augmenting path, 复杂度与 C 无关 so its runtime does not depend on C. **容量数字很大时 EK 更稳 When capacities are huge, EK is safer.**

[↑ Back to contents](#contents)

<a id="details-6"></a>
### 6. 逻辑约束 Logic constraints

**2-SAT - O(n + m)**

- 输入 Input: 每个子句最多 2 个字面量的 CNF 公式 a CNF formula with at most 2 literals per clause
- 输出 Output: `assignments[]` 满足赋值 a satisfying assignment; 不可满足返回 "NO" returns "NO" if unsatisfiable; SCC 的输出也能用 SCC outputs are also available
- 能做 Use for: 一堆"必须同时满足"的布尔约束 boolean constraints that must all hold; XOR 类关系 XOR relations（例如二分图判定 for example bipartite testing）; 排课 / 分配约束 scheduling or assignment constraints
- 原理 Idea: 建 implication graph builds an implication graph, 跑 SCC then runs SCC, 所以还是 O(n + m) so it stays O(n + m)

[↑ Back to contents](#contents)

---

<a id="decision"></a>
## 三、做题时的选择流程 Decision flow when solving a problem

**1. 图有权重吗？Is the graph weighted?**

- 没有 No → BFS（可达 / 无权最短路 reachability, unweighted shortest path）, DFS（连通块 / 环 connected components, cycles）, Topological Sort（有向无环的顺序 order of a DAG）, SCC（互相可达 mutual reachability）
- 有 Yes → 下一步 next step

**2. 带权的图 Weighted graph**

- 连接所有点、总代价最小 connect all vertices with minimum total cost → **Kruskal / Prim**
- 最短路径 shortest path:
  - 非负权 non-negative weights → **Dijkstra**
  - 有负权或要检测负环 negative weights, or detect a negative cycle → **Bellman-Ford**
  - 所有点对 all pairs → **Floyd-Warshall**

**3. 题目说"分配 / 配对 / 每个东西有上限"，问最多能安排多少**
The problem says assign, pair up, or each item has a limit, and asks for the maximum number.
→ **最大流 Max flow（FF 或 EK）**

**4. 题目说"一堆布尔条件要同时满足"**
The problem says a set of boolean conditions must all hold at the same time.
→ **2-SAT**

[↑ Back to contents](#contents)

---

<a id="common-details"></a>
## 四、常见细节 Details that often matter

- 只有 DFS 能一次跑完断开图。BFS 要给起点，其他分量是 inf。
  Only DFS covers a disconnected graph in one run. BFS needs a start vertex, and other components stay inf.
- 图是树或森林时 m ≤ n − 1，所以 O(n + m) 可以简化成 O(n)。
  When the graph is a tree or forest, m ≤ n − 1, so O(n + m) simplifies to O(n).
- 拓扑排序和 SCC 都建在 DFS 之上。
  Topological sort and SCC are both built on DFS.
- Dijkstra 不能负权。Bellman-Ford 可以，但只能检测"从起点可达"的负环。
  Dijkstra cannot take negative weights. Bellman-Ford can, but it only detects a negative cycle reachable from the start vertex.
- 只有 Floyd-Warshall 给所有点对。
  Only Floyd-Warshall gives all pairs.
- MST 的两个黑盒都只对无向图，而且要求连通。
  Both MST black boxes work only on undirected graphs, and the graph must be connected.
- 最大流：FF 依赖 C，EK 不依赖 C。
  Max flow: FF depends on C, EK does not.
- SCC 和 source/sink 是**有向图**概念。桥（bridge）和叶子（leaf）是**无向图**概念。
  SCC, source, and sink are directed-graph concepts. Bridge and leaf are undirected-graph concepts.

[↑ Back to contents](#contents)

---

<a id="advice"></a>
## 五、实用解题建议 Practical problem-solving advice

<a id="advice-1"></a>
### 读题时先看这些图属性 Graph properties to check in a problem statement

- **有向还是无向 Directed or undirected**: SCC、source / sink 是有向概念 SCC, source, and sink are directed concepts; bridge、leaf 是无向概念 bridge and leaf are undirected concepts
- **带权还是无权 Weighted or unweighted**: 区分"边的条数"和"路径的总权重" distinguish the number of edges from the total weight of a path
- **连通分量还是强连通分量 Connected components or SCC**: SCC 是互相可达，比单向可达更强 SCC means mutual reachability, which is stronger than one-way reachability
- **source / sink**: source 没有入边 a source has no incoming edges; sink 没有出边 a sink has no outgoing edges
- **环 Cycles**: 有没有环、意味着什么、环有几条边、环上的权重是否互不相同 does one exist, what does it imply, how many edges, are the weights distinct
- **桥 Bridge (undirected)**: 删掉它会让连通块变多 removing it creates more components. 树上每条边都是桥 Every edge of a tree is a bridge, 因为树里两点之间只有一条路 because a tree has exactly one path between any two vertices
- **叶子 Leaf (undirected)**: 只连一条边的点 a vertex with exactly one incident edge
- **DAG**: 是 Topological Sort 的输入，也是 SCC metagraph 的形态，常常能简化有向问题 it is the input to topological sort and the shape of an SCC metagraph, and it often simplifies a directed problem

[↑ Back to contents](#contents)

<a id="advice-2"></a>
### 常用策略 Common strategies

- 先明确题目到底要什么信息（连通性？一条路？最少边数？最小权重？所有点对？有没有环？改一条边之后的性质？），再挑输出正好提供这个信息的黑盒。
  First identify the exact information requested (connectivity, one path, fewest edges, minimum weight, all pairs, cycles, a property after a change), then pick the black box whose outputs provide it.
- 连通性可以用 BFS（`dist`）、DFS（`ccnum`）、或 SCC。没有唯一答案，但问"某个 s 到某个 t"时 BFS 最直接。
  Connectivity can be checked with BFS (dist), DFS (ccnum), or SCC. There is no single required choice, but BFS is the most direct for a specific s-to-t question.
- 加超级源（super-source）或超级汇，把"每个点跑一次"变成"跑一次"，最后记得减掉加进去的边。
  Add a super-source or super-sink to replace one search per vertex with a single search, then subtract the added edges when you read the distances.
- 反向图：想求"所有点到某个目标点"的距离，就把图反向，从目标点跑一次单源最短路。
  Reverse the graph to get distances from every vertex to one target: reverse the edges and run one single-source shortest path from the target.
- 先取子图（例如只保留某种颜色的点之间的边），再跑黑盒。
  Take a subgraph first (for example only edges between vertices of one color), then run the black box.
- 删掉一条边 / 一个点 / 一组点之后再跑黑盒，用来隔离需要的东西。
  Remove an edge, a vertex, or a set of vertices before running the black box, to isolate what you need.
- 只有在丢掉的信息不影响答案时，才把有向图转无向（或反过来），并且要说明保留了什么、丢了什么。
  Convert directed to undirected (or the reverse) only when the dropped information is irrelevant, and state what is preserved and what is lost.

[↑ Back to contents](#contents)

<a id="advice-3"></a>
### 答题目标 What a strong answer looks like

- 很多题目只给算法名单，**不给**每个算法的输入输出，所以必须自己记住。
  Many problems give a list of available algorithms but not their inputs and outputs, so you must know them.
- 通常不告诉你目标复杂度，尽量给最优解。
  A target runtime is usually not given. Aim for the optimal solution.
- 有些题目要的是"增量更新"，不是重跑整个算法（例如改一条边后线性时间更新 MST）。
  Some problems want a direct update rather than a rerun (for example, update an MST after one edge changes, in linear time).
- 真正的难点通常是**预处理 / 后处理**：把图整理成黑盒刚好能回答的形式，而不是简单地调用黑盒。
  The hard part is usually the preprocessing or postprocessing: shape the graph so the black box returns exactly what you need, rather than simply calling the black box.

[↑ Back to contents](#contents)

---

<a id="compare"></a>
## 六、算法对比 Algorithm comparisons

这里按"它回答的是哪一类问题"来对比，比一个个背更清楚。
This section compares the algorithms by the **type of question** each one answers. That is easier than memorising them one by one.

<a id="compare-1"></a>
### 6.1 题目要什么 → 用哪个黑盒 What the problem asks → which black box

| What the problem asks / 题目要什么 | Black box / 黑盒 |
|---|---|
| Can I get from A to B? 能不能从 A 走到 B？ | BFS |
| Fewest steps or edges? 最少几步 / 最少几条边？ | BFS |
| Cheapest route, non-negative weights? 最便宜的路（权重非负）？ | Dijkstra |
| Cheapest route, weights may be negative? 最便宜的路（有负权）？ | Bellman-Ford |
| Cheapest between every pair? 任意两点之间都最便宜？ | Floyd-Warshall |
| In what order should the tasks be done? 任务 / 先修关系的先后顺序？ | Topological Sort |
| Who is mutually reachable, and how do they group? 谁和谁互相可达、怎么分组？ | SCC |
| Components, cycles, edge types? 连通块、找环、边的分类？ | DFS |
| Cheapest way to connect all vertices? 最便宜地把所有点连起来？ | Kruskal / Prim |
| How many can be assigned or pushed through, with limits? 有上限时最多能安排 / 通过多少？ | Max flow (FF / EK) |
| Can all the boolean conditions hold at once? 一堆布尔条件能不能同时满足？ | 2-SAT |

[↑ Back to contents](#contents)

<a id="compare-2"></a>
### 6.2 最容易混的一对：最短路径 vs MST The most confusable pair

Both sound like "cheapest", but they ask different questions.
两个听起来都是"最便宜"，但问的是不同的事。

| | Shortest path / 最短路径 | MST / 最小生成树 |
|---|---|---|
| Who it cares about / 关心谁 | two vertices, s to t 两个点（s 到 t） | **all vertices** 所有点 |
| What the answer is / 答案是什么 | **one** path 一条路 | **one set** of edges 一组边 |
| What is minimised / 优化什么 | the weight of that one path 那条路的权重和 | the total weight of the tree 整棵树的总权重 |
| How many edges / 用几条边 | as many as the path needs 路上有几条用几条 | always n − 1 一定是 n − 1 条 |

Example / 例子: s-a = 10, s-b = 10, a-b = 1, a-c = 1, b-c = 1.

- Shortest-path tree from s / 从 s 出发的最短路径树: s-a(10), s-b(10), a-c(1) → total 21
- MST / 最小生成树: a-b(1), a-c(1), s-a(10) → total 12

So the tree that Dijkstra builds is **not** the MST.
所以 Dijkstra 建出来的树**不等于** MST。这是常见陷阱。

[↑ Back to contents](#contents)

<a id="compare-3"></a>
### 6.3 四个最短路径算法 The four shortest-path algorithms

They differ in two things: the numbers on the edges, and how many pairs you need.
区别只在两件事：边上的数字，和你要几对点。

| Algorithm / 算法 | Numbers on edges / 边上的数字 | Pairs / 点对 | Runtime / 复杂度 | Extra / 额外能力 |
|---|---|---|---|---|
| BFS | unweighted 无权 | single source 单源 | O(n + m) | fewest **edges** 最少边数 |
| Dijkstra | non-negative 非负 | single source 单源 | O((n + m) log n) | |
| Bellman-Ford | may be negative 可负 | single source 单源 | O(nm) | detects a **reachable** negative cycle 检测可达负环 |
| Floyd-Warshall | may be negative 可负 | **all pairs** 所有点对 | O(n³) | detects negative cycles 检测负环 |

Memory rule / 记忆法: weighted → Dijkstra; negative weights → Bellman-Ford; all pairs → Floyd-Warshall.
有权用 Dijkstra，有负权换 Bellman-Ford，要所有点对用 Floyd-Warshall。

[↑ Back to contents](#contents)

<a id="compare-4"></a>
### 6.4 BFS vs DFS

Both are O(n + m), and both work on unweighted graphs.
两个都是 O(n + m)，都在无权图上。

| | BFS | DFS |
|---|---|---|
| How it moves / 怎么走 | level by level 一层一层扩 | one path to the end, then back 一条路走到底再回头 |
| Main outputs / 主要输出 | dist[] | ccnum[], pre[], post[] |
| What it answers / 回答什么 | reachability, fewest steps 可达性、最少步数 | components, cycles, edge types 连通块、找环、边分类 |
| Role / 角色 | a standalone algorithm 独立算法 | the **base** of topological sort and SCC 拓扑排序和 SCC 的地基 |

Memory rule / 记忆法: BFS gives distance; DFS gives structure.
BFS 给距离，DFS 给结构。

[↑ Back to contents](#contents)

<a id="compare-5"></a>
### 6.5 Topological Sort vs SCC

| | Topological Sort | SCC |
|---|---|---|
| Cycles allowed? / 能有环吗 | **No**, must be a DAG 不能，必须是 DAG | Yes 可以有环 |
| What it answers / 回答什么 | an **order** 一个顺序 | a **grouping** 一个分组 |
| Output / 输出 | order[] | ccnum[] + metagraph |
| Output order / 输出顺序 | source → sink | sink → source, reverse topological 逆拓扑序 |

How to combine / 组合用法: run SCC first to shrink the graph into a DAG, then run topological sort.
先跑 SCC 缩点，得到 DAG，再拓扑排序。

[↑ Back to contents](#contents)

<a id="compare-6"></a>
### 6.6 Kruskal vs Prim

| | Kruskal | Prim |
|---|---|---|
| How it works / 做法 | sort all edges and try them in order 全局按边权从小到大试 | grow from one vertex 从一个点开始往外长 |
| Good for / 适合 | sparse graphs 稀疏图 | dense graphs 稠密图 |
| Runtime / 复杂度 | O(m log n) | O(m log n) |
| Output / 输出 | the chosen edge list 选中的边列表 | prev[], the tree shape 树的结构 |
| Same / 相同点 | undirected, connected, weighted 无向、连通、带权 | same 同 |

[↑ Back to contents](#contents)

<a id="compare-7"></a>
### 6.7 Ford-Fulkerson vs Edmonds-Karp

| | Ford-Fulkerson | Edmonds-Karp |
|---|---|---|
| How it finds a path / 每轮怎么找路 | any augmenting path 随便找一条 | BFS for the **shortest** path 用 BFS 找最短增广路 |
| Runtime / 复杂度 | O(mC), depends on C | O(nm²), **does not depend on C** 不依赖 C |
| Better when / 什么时候更好 | C is small C 小 | capacities are huge 容量数字很大 |

[↑ Back to contents](#contents)

<a id="compare-8"></a>
### 6.8 最大流 vs 最短路径 Max flow vs shortest path

| | Shortest path / 最短路径 | Max flow / 最大流 |
|---|---|---|
| How many paths / 找几条路 | **one** 一条 | **many at the same time** 同时很多条 |
| Goal / 目标 | smallest total weight 权重和最小 | largest **number** of paths 路的条数最多 |
| Number on the edge / 边上的数字 | weight 权重 | capacity 容量 |
| Between paths / 路之间 | only one, no conflict 只有一条，不冲突 | they share edges and compete 共用边，互相抢容量 |

[↑ Back to contents](#contents)

<a id="compare-9"></a>
### 6.9 2-SAT 特殊在哪 What makes 2-SAT special

It is the only algorithm whose input is **not a graph**.
它是唯一一个输入**不是图**的算法。

- Input / 输入: a boolean formula, at most 2 literals per clause 布尔公式，每句最多 2 个字面量
- Method / 做法: build an implication graph, which is a directed graph, then run SCC 先变成 implication graph（有向图），再跑 SCC
- So it is "using a graph algorithm on a non-graph problem"
  所以它是"用图算法解决非图问题"
- Typical uses / 典型用途: many constraints at once, XOR relations (bipartite testing, for example), scheduling conflicts
  一堆约束要同时满足、XOR 关系（例如二分图判定）、排课冲突

[↑ Back to contents](#contents)

<a id="compare-10"></a>
### 6.10 一句话总结 One-line summary

The order of choosing an algorithm / 选算法的顺序:

1. **What does the problem ask?** Reachability, one path, connect everything, how many can be assigned, an order, or a grouping?
   **题目要什么？** 可达？一条路？全部连接？最多安排多少？顺序？分组？
2. **What are the graph's properties?** Directed or undirected, weighted or unweighted, can weights be negative, single source or all pairs?
   **图的属性？** 有向还是无向？带权还是无权？权重可不可以负？单源还是所有点对？

Once these two are settled, the black box is usually unique.
这两问一确定，黑盒基本就唯一了。

[↑ Back to contents](#contents)

---

<a id="anchors"></a>
## 七、性质锚句 Property anchors - sentences you can use in a solution

**怎么用 How to use.** 每个黑盒下面 2–4 句，都是可以直接写进 (b) 的英文句子；括号里是中文解释和关键词。复习时只盯**关键词**，考场上从关键词扩写成一整句。标了 *derived* 的句子不是定义，需要你在 (b) 里补一句理由（通常就是"两个方向 + 排除绕路"）。

<a id="anchors-1"></a>
### 7.1 DFS

- **"DFS from a start vertex visits exactly the vertices reachable from it."**（从起点 DFS 正好访问所有可达点。关键词：**reachable**）
- **"Restarting DFS at every unvisited vertex labels the connected components in `ccnum[]`."**（自动重启 → `ccnum[]` 标出连通分量。关键词：**components**）
- **"In a directed graph, DFS finds a back edge exactly when the graph has a cycle; if the graph is a DAG, decreasing post order is a topological order."**（有向图：back edge ⟺ 有环；DAG 里按 post 递减就是拓扑序。关键词：**back edge / post order**）

[↑ Back to contents](#contents)

<a id="anchors-2"></a>
### 7.2 BFS

- **"BFS from s visits exactly the vertices reachable from s, and `dist[v]` is the minimum number of edges on any s→v path."**（BFS 从 s 正好访问可达点，且 `dist[v]` 是最少边数。关键词：**reachable + fewest edges**）
- **"BFS explores vertices in nondecreasing distance, so the first time a vertex is reached is at its shortest unweighted distance."**（按距离从小到大展开，所以第一次到达就是最短。关键词：**nondecreasing distance**）
- **"Run on a tree, BFS finds the unique path between two vertices through `prev[]`."**（在树上跑 BFS → 唯一路径。关键词：**unique path**）

[↑ Back to contents](#contents)

<a id="anchors-3"></a>
### 7.3 Topological Sort

- **"In a topological order every edge goes from an earlier position to a later one, so along any path positions strictly increase."**（拓扑序里每条边从前指向后，沿路径位置严格递增。关键词：**edges go forward**）
- **"A directed graph has a topological order if and only if it is acyclic."**（有拓扑序 ⟺ 无环。关键词：**acyclic**）
- **"If every consecutive pair in a topological order is joined by an edge, the order is a path through all vertices and the topological order is unique; conversely, a unique topological order forces consecutive adjacency."** *derived*（相邻都有边 ⟺ 经过所有点的路径 ⟺ 拓扑序唯一。关键词：**consecutive pairs joined**）

[↑ Back to contents](#contents)

<a id="anchors-4"></a>
### 7.4 SCC

- **"Vertices in the same component reach each other in both directions; vertices in different components cannot do that."**（同组两两互相可达；不同组做不到。关键词：**both directions**）
- **"Contracting components into the metagraph preserves reachability: u reaches v in G exactly when their components are the same or connected in the metagraph, which is a DAG."**（缩点保持可达性；metagraph 是 DAG。关键词：**preserves reachability / DAG**）
- **"A component is a source (a sink) of the metagraph exactly when no original edge enters it from (leaves it to) another component."**（源/汇分量的判定。关键词：**no edge in / out**）

[↑ Back to contents](#contents)

<a id="anchors-5"></a>
### 7.5 Dijkstra

- **"With non-negative weights, when Dijkstra removes a vertex from the queue its distance is final, because no later route can be cheaper."**（非负权下，出队即最终距离。关键词：**non-negative ⇒ finalized**）
- **"Dijkstra computes minimum total weight paths from s to every vertex, and the `prev[]` path to v has total weight `dist[v]`."**（输出的树是最短路树。关键词：**shortest-path tree**）
- **"Negative edge weights can break the greedy step, so a negative edge may offer a shorter route to an already-finalised vertex."**（负权会破坏贪心。关键词：**negative breaks it**）

[↑ Back to contents](#contents)

<a id="anchors-6"></a>
### 7.6 Bellman-Ford

- **"Bellman-Ford computes correct single-source distances even with negative edges, provided no negative cycle is reachable from s."**（可含负权，但不能有可达负环。关键词：**negatives ok / no reachable negative cycle**）
- **"After n − 1 rounds every simple-path distance is final; an improvement in one more round means a reachable negative cycle."**（n−1 轮后收敛；再改进 = 负环。关键词：**n − 1 rounds / extra round**）

[↑ Back to contents](#contents)

<a id="anchors-7"></a>
### 7.7 Floyd-Warshall

- **"Floyd-Warshall computes all-pairs distances correctly with negative edges, provided no negative cycle exists anywhere."**（全点对、可负权、不能有负环。关键词：**all pairs / no negative cycle**）
- **"After step k, `dist[i][j]` is the shortest path from i to j using only vertices 1..k as intermediate."**（第 k 步的含义。关键词：**intermediate vertices 1..k**）
- **"It takes no source, so it also works on disconnected graphs and can find negative cycles anywhere."**（无起点，所以非连通图也能用。关键词：**no source**）

[↑ Back to contents](#contents)

<a id="anchors-8"></a>
### 7.8 Kruskal

- **"Kruskal adds edges in increasing weight, keeping an edge exactly when it does not close a cycle, and returns a minimum spanning tree."**（按权重递增、不成环就加。关键词：**increasing weight / no cycle**）
- **"Cut property: the lightest edge across a cut can be included in some MST. Cycle property: the heaviest edge of a cycle can be excluded from every MST."**（割性质 / 环性质。关键词：**lightest across cut / heaviest on cycle**）
- **"Kruskal is a matroid greedy, so for any fixed order of the edges it returns the tree with the lexicographically smallest weight sequence; it also works with negative weights."** *derived*（按给定顺序贪心最优；负权不影响。关键词：**matroid greedy / negative ok**）

[↑ Back to contents](#contents)

<a id="anchors-9"></a>
### 7.9 Prim

- **"Prim repeatedly adds the lightest edge crossing the cut between the current tree and the rest; the cut property guarantees the result is an MST."**（每次加割上最轻边。关键词：**lightest across the cut**）
- **"Prim works correctly with negative weights, because the cut property does not depend on the sign of the weights (unlike Dijkstra)."**（负权没问题，这点和 Dijkstra 相反。关键词：**negative ok**）

[↑ Back to contents](#contents)

<a id="anchors-10"></a>
### 7.10 Ford-Fulkerson

- **"Ford-Fulkerson returns a maximum s–t flow, and with integer capacities the returned flow is integral."**（整数容量 → 整数流。关键词：**integral flow**）
- **"A flow is maximum if and only if its residual graph has no augmenting path."**（无增广路 ⟺ 最大流。关键词：**no augmenting path**）
- **"The maximum flow value equals the minimum cut capacity, and the vertices reachable from s in the residual graph form the source side of a minimum cut, with all L→R edges saturated and all R→L edges empty."**（最大流 = 最小割；残量可达集给出最小割。关键词：**flow = cut / saturated L→R / empty R→L**）
- **"Its runtime is O(mC) with C the flow value, so it is pseudo-polynomial, and the capacities must be positive integers."**（O(mC)、伪多项式、正整数容量。关键词：**O(mC) / integer capacities**）

[↑ Back to contents](#contents)

<a id="anchors-11"></a>
### 7.11 Edmonds-Karp

- **"Edmonds-Karp is Ford-Fulkerson with BFS shortest augmenting paths, so its runtime is O(nm²) and does not depend on the capacity values."**（BFS 增广 → O(nm²)，与容量无关。关键词：**O(nm²) / independent of C**）
- **"All max-flow properties hold for it as well: max flow = min cut, and integer capacities give an integral flow; unlike Ford-Fulkerson it also handles non-integer capacities."**（同样的最大流性质，且可处理非整数容量。关键词：**same properties / non-integer ok**）

[↑ Back to contents](#contents)

<a id="anchors-12"></a>
### 7.12 2-SAT

- **"2-SAT solves a 2-CNF formula in linear time: build the implication graph, run SCC, and the formula is satisfiable exactly when no variable shares a component with its negation."**（可满足 ⟺ 变量与其否定不同组。关键词：**x and ¬x in one SCC = unsatisfiable**）
- **"Why: if x and ¬x are in one SCC then x ⇒ ¬x ⇒ x, a contradiction that no assignment can avoid; if not, an assignment can be read off the component order."**（为什么：同组就自相矛盾；不同组就能从分量顺序读出赋值。关键词：**implication contradiction**）
- **"A satisfying assignment: a variable is true exactly when its component comes later than its negation's component in a topological order."**（赋值规则。关键词：**later component = true**）

[↑ Back to contents](#contents)

<a id="anchors-13"></a>
### 7.13 跨黑盒常引用的定理 Cross-cutting facts

- **"Maximum flow equals minimum cut."**（最大流 = 最小割。关键词：**flow = cut**）
- **"In an MST, the path between two vertices minimises the largest edge over all paths between them (minimax property)."**（MST 的 s–t 路径是最小化最大边。关键词：**smallest largest edge**）
- **"In a tree the path between two vertices is unique."**（树上路径唯一。关键词：**unique path**）
- **"A graph is bipartite if and only if it has no odd cycle."**（二部 ⟺ 无奇环。关键词：**no odd cycle**）
- **"A connected acyclic graph is a tree with n − 1 edges; every component of a forest is a tree."**（树 = 连通无环，n−1 条边。关键词：**n − 1 edges**）
- **"The condensation of any directed graph is a DAG, and a directed graph is strongly connected exactly when it has a single SCC."**（缩图一定是 DAG；强连通 ⟺ 只有一个 SCC。关键词：**condensation is a DAG**）
- **"Adding a constant to every edge weight adds (number of edges) × constant to a path, so paths with different edge counts shift differently."**（平移权重按边数累积，所以会改变相对顺序。关键词：**constant per edge**）
- **"Negative cycles make shortest-path distances undefined (arbitrarily negative), which is why Bellman-Ford and Floyd-Warshall forbid a reachable one."**（负环 → 距离无下界。关键词：**undefined / −∞**）
- **"A shortest-path tree and an MST are different objectives: Dijkstra's tree need not be an MST."**（最短路树 ≠ MST。关键词：**different objectives**）

[↑ Back to contents](#contents)
