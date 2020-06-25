# `Don't Die Together Server`


## Structure

- `index.ts`: main entry point, register an empty room handler and attach [`@colyseus/monitor`](https://github.com/colyseus/colyseus-monitor)
- `MyRoom.ts`: an empty room handler for you to implement your logic
- `package.json`:
    - `scripts`:
        - `npm start`: runs `ts-node index.ts`
    - `dependencies`:
        - `colyseus`
        - `@colyseus/monitor`
        - `express`
    - `devDependencies`
        - `ts-node`
        - `typescript`
        - `@colyseus/loadtest`
- `tsconfig.json`: TypeScript configuration file

