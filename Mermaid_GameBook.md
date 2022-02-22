```Mermaid
flowchart LR
    id1(View) -- User action --> id2(Controller) -- Update -->  id1
    id2(Controller) -- Update --> id3(Model) -- Notify --> id2
```
