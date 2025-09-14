import { Injectable } from '@nestjs/common';
import { InitGameDto, AddShipDto } from './dto/battleship.dto';

@Injectable()
export class BattleShipService {
  private gridSize: number;
  private battleField: string[][];
  private playerA: string;
  private playerB: string;
  private shipCountA: number = 0;
  private shipCountB: number = 0;
  private alreadyFiredAt: number[][] = [];
  private currentPlayer: string;
  private shipLeftA: Set<string> = new Set();
  private shipLeftB: Set<string> = new Set();
  private isHit: boolean;

  initGame(initParams: InitGameDto) {
    const { n, playerA = 'A', playerB = 'B' } = initParams;
    if (!n) throw new Error('Grid size is required');
    this.gridSize = n;
    this.playerA = playerA;
    this.playerB = playerB;
    // Initialize n×n grid safely
    this.battleField = Array.from({ length: n }, () =>
      Array<string>(n).fill('.'),
    );
    this.alreadyFiredAt = [];
    this.currentPlayer = playerA;
    this.viewBattleField();
    console.log('Game initilized');
    return 'Game initilized';
  }

  addShip(shipParameters: AddShipDto) {
    try {
      //step1: generate Ids for SHip A, Ship B
      // {id, size, xPositionPlayerA, yPositionPlayerA, xPositionPlayerB, yPositionPlayerB}
      const {
        id,
        size,
        xPositionPlayerA,
        yPositionPlayerA,
        xPositionPlayerB,
        yPositionPlayerB,
      } = shipParameters;
      if (!id) {
        throw new Error('Ship id is required');
      }

      if (!size) {
        throw new Error('Ship size is required');
      }
      if (xPositionPlayerA === undefined || yPositionPlayerA === undefined) {
        throw new Error('Ship position PlayerA is required');
      }
      if (xPositionPlayerB === undefined || yPositionPlayerB === undefined) {
        throw new Error('Ship position PlayerB is required');
      }

      //step1: generate Ids for SHip A, Ship B
      this.shipCountA++;
      this.shipCountB++;
      const shipAId = `A-${id}`;
      const shipBId = `B-${id}`; //A-SH-1, B-SH-1

      //Adding ship A
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const x = xPositionPlayerA + i;
          const y = yPositionPlayerA + j;
          this.battleField[x][y] = shipAId;
        }
      }

      //Adding ship B
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const x = xPositionPlayerB + i;
          const y = yPositionPlayerB + j;
          this.battleField[x][y] = shipBId;
        }
      }

      this.viewBattleField();
      console.log('Ship added');

      return `Ship added`;
    } catch (error) {
      console.error(error);
      return `Failed to add ship`;
    }
  }

  startGame() {
    try {
      this.currentPlayer = this.playerA;
      // player A will start the game
      let isGameOver = false;
      console.log('\n\n===== Game started =====\n\n');
      while (!isGameOver) {
        const { x, y } = this.fireStrategy(this.currentPlayer === this.playerA);
        if (this.alreadyFiredAt.some(([fx, fy]) => fx === x && fy === y)) {
          continue;
        }
        this.alreadyFiredAt.push([x, y]);
        this.isHit = this.battleField[x][y].includes(`SH`);
        this.battleField[x][y] = 'X';
        this.printGameStatement(x, y);

        // Check if game is over for the current player
        isGameOver = this.isGameOver(this.currentPlayer === this.playerA);

        // Switch player only if game is not over
        if (!isGameOver) {
          this.currentPlayer =
            this.currentPlayer === this.playerA ? this.playerB : this.playerA;
        }
      }
      this.viewBattleField();
      console.log('\n\n===== Game over =====\n\n');
      const winString = `Game over ${this.currentPlayer} is the winner`;
      console.log(winString);
      return winString;
    } catch (error) {
      console.error(error);
      return `Failed to start game`;
    }
  }

  printGameStatement(x: number, y: number) {
    // PlayerA’s turn: Missile fired at (3, 0) : “Miss” : Ships
    const statment = `Player's ${this.currentPlayer} turn: Missile fired at (${x}, ${y}) : ${this.isHit ? 'Hit' : 'Miss'} : Ships`;
    // Remaining - PlayerA:1, PlayerB:1
    const statment2 = `Remaining - PlayerA:${this.shipLeftA.size}, PlayerB:${this.shipLeftB.size}`;
    console.log(statment);
    console.log(statment2);
  }
  viewBattleField() {
    for (let i = 0; i < this.gridSize; i++) {
      const row: string[] = [];
      for (let j = 0; j < this.gridSize; j++) {
        const char = this.battleField[i][j];
        let charToPrint = '.';
        if (char === '.') {
          charToPrint = '  .  ';
        } else if (char === 'X') {
          charToPrint = '  X  ';
        } else {
          charToPrint = char;
        }
        row.push(charToPrint + '|');
      }
      console.log('\n|' + row.join(' '));
    }
    return 'Battle field viewed';
  }

  fireStrategy(isPlayerA: boolean): { x: number; y: number } {
    const n = this.gridSize;
    const startX = isPlayerA ? n / 2 : 0;
    const randomX = startX + Math.floor(Math.random() * (n / 2));
    const randomY = Math.floor(Math.random() * this.gridSize);
    return { x: randomX, y: randomY };
  }

  isGameOver(isPlayerA: boolean) {
    // check if opponent has any ships left
    if (isPlayerA) {
      // Current player is A, check if B has ships left (right half)
      for (let i = 0; i < this.gridSize; i++) {
        for (let j = this.gridSize / 2; j < this.gridSize; j++) {
          const char = this.battleField[i][j];
          if (char.includes(`B-SH`)) {
            return false; // B still has ships, game continues
          }
        }
      }
    } else {
      // Current player is B, check if A has ships left (left half)
      for (let i = 0; i < this.gridSize; i++) {
        for (let j = 0; j < this.gridSize / 2; j++) {
          const char = this.battleField[i][j];
          if (char.includes(`A-SH`)) {
            return false; // A still has ships, game continues
          }
        }
      }
    }
    return true; // Opponent has no ships left, game over
  }
}
