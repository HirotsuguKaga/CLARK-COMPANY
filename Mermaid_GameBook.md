## CLARK & COMPANY html
```Mermaid
flowchart LR
    subgraph Data Binding
    id1(View) -- Owns --> id2(ViewModel) -. Update .-> id1
    end
    id2 -- Owns -->  id3(Model) -. Update .-> id2
flowchart LR
    id1(View) -- User action --> id2(Controller) -- Update -->  id1
    id2(Controller) -- Update --> id3(Model) -- Notify --> id2
```
