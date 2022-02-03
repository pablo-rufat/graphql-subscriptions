## Setup Project

- `mkdir graphql`
- `cd graphql`
- `npm init -y`
- `npm install typescript --save-dev`
- `npm install @types/node --save-dev`
- 
    ```
    npx tsc --init --rootDir src --outDir build \
    --esModuleInterop --resolveJsonModule --lib es6 \
    --module commonjs --allowJs true --noImplicitAny true
    ```
- `mkdir src`
- `touch src/server.ts`
- `npm install --save-dev ts-node nodemon`
- Criar arquivo `nodemon.json` e adicionar o seguinte:
    
        {
            "watch": ["src"],
            "ext": ".ts,.js",
            "ignore": [],
            "exec": "ts-node ./src/server.ts"
        }
- Adicionar o script `"start:dev": "nodemon"` no `package.json`
- `npm install --save-dev rimraf`
- Adicionar o script `"build": "rimraf ./build && tsc"` no `package.json`
- Adicionar o script `"start": "npm run build && node build/server.js"` no `package.json`
- `npm install -D jest @types/jest ts-jest`
- Adicionar arquivo `jest.config.ts`
    ```
    import type {Config} from '@jest/types';

    const config: Config.InitialOptions = {
        verbose: true,
        transform: {
            '^.+\\.ts?$': 'ts-jest',
        },
    };

    export default config;
    ```
- `mkdir __tests__`
- `touch __tests__/example.test.ts`
    ```
    describe('Example test', () => {
        test('Test 1', () => {
            expect('Paul'.concat(' ', 'McCartney')).toBe('Paul McCartney');
        });
    });

    ```
- Adicionar o script `"test": "jest"` no `package.json`

## Production

- Run `docker-compose up`

## Development

- Crie um container mongodb com a seguinte configuração no seu docker-compose:
```
version: "3.8"

services:
  mongodb:
    image : mongo
    container_name: mongodb-local
    volumes:
      - ./database:/data/db
    ports:
      - 27017:27017
    restart: unless-stopped
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=123456
```
- run `npm run start:dev`

## Tests

- Crie o mesmo container que para Dev.
- Run `npm run start:test`
- Em outra terminal run `npm test`