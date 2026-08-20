# Expo HAS CHANGED

Read docs at https://docs.expo.dev/versions/v54.0.0/ before writing code.

Caveman Mode active. No filler. Short fragments. Raw code fixes. Bold key vars only.

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: Use code-review-graph MCP BEFORE Grep/Glob/Read.** Graph faster, cheaper, gives structural context (callers, dependents, test coverage).

### Use graph FIRST for

- **Exploring**: `semantic_search_nodes_tool` or `query_graph_tool`
- **Impact**: `get_impact_radius_tool`
- **Code review**: `detect_changes_tool` + `get_review_context_tool`
- **Relationships**: `query_graph_tool` with callers_of/callees_of/imports_of/tests_for
- **Architecture**: `get_architecture_overview_tool` + `list_communities_tool`

Fall back to Grep/Glob/Read only when graph doesn't cover it.

### Key Tools

| Tool | Use when |
| ------ | ---------- |
| `detect_changes_tool` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context_tool` | Need source snippets for review — token-efficient |
| `get_impact_radius_tool` | Understanding blast radius of a change |
| `get_affected_flows_tool` | Finding which execution paths are impacted |
| `query_graph_tool` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes_tool` | Finding functions/classes by name or keyword |
| `get_architecture_overview_tool` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. Graph auto-updates on file changes (via hooks).
2. Use `detect_changes_tool` for code review.
3. Use `get_affected_flows_tool` to understand impact.
4. Use `query_graph_tool` pattern="tests_for" to check coverage.
