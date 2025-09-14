# Battleship Game API

A NestJS-based REST API for playing a battleship game with two players.

## Features

- Initialize game with custom grid size and player names
- Add ships to the battlefield for both players
- Start automated gameplay with random firing strategy
- View current battlefield state
- Track hits, misses, and remaining ships

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3002`

## API Endpoints

### 1. Initialize Game
**POST** `/battle-ship/init-game`
- Sets up the game with grid size and player names
- Required: `n` (grid size)
- Optional: `playerA`, `playerB` (defaults to 'A' and 'B')

### 2. Add Ship
**POST** `/battle-ship/add-ship`
- Places ships on the battlefield for both players
- Required: `id`, `size`, `xPositionPlayerA`, `yPositionPlayerA`, `xPositionPlayerB`, `yPositionPlayerB`

### 3. Start Game
**GET** `/battle-ship/start-game`
- Begins automated gameplay with random firing strategy
- Players take turns firing missiles until all ships are destroyed

### 4. View Battlefield
**GET** `/battle-ship/view-battle-field`
- Returns current state of the battlefield grid

## Example Usage

### 4 Essential Curl Commands

1. **Initialize Game** (10x10 grid):
```bash
curl --location 'http://localhost:3002/battle-ship/init-game' \
--header 'Content-Type: application/json' \
--data '{
    "n": 10,
    "playerA": "Satish",
    "playerB": "Abhishek"
}'
```

2. **Add Ship** (ID: SH-1, Size: 2):
```bash
curl --location 'http://localhost:3002/battle-ship/add-ship' \
--header 'Content-Type: application/json' \
--data '{
    "id": "SH1",
    "size": 4,
    "xPositionPlayerA": 0,
    "yPositionPlayerA": 0,
    "xPositionPlayerB": 5,
    "yPositionPlayerB": 6
}'
```

3. **View Battlefield**:
```bash
curl --location 'http://localhost:3002/battle-ship/view-battle-field'
```

4. **Start Game**:
```bash
curl --location 'http://localhost:3002/battle-ship/start-game'
```

## Game Rules

- Players take turns firing missiles at random coordinates
- Player A fires in the right half of the grid
- Player B fires in the left half of the grid
- Game continues until all ships of one player are destroyed
- Winner is announced when the game ends

## Console Output
![BattleShip Console output](./assets/battleShip-output-1.png)
![BattleShip Console output](./assets/battleShip-output-2.png)
