import { Injectable } from '@nestjs/common';
import { InitGameDto, AddShipDto } from './dto/battleship.dto';

@Injectable()
export class BattleShipService {
  private gridSize: number;
  private battleField: string[][] = [[]];
  private playerA: string;
  private playerB: string;
  private shipCount: number = 0;
  private alreadyFiredAt: number[][] = [];
  private currentPlayer: string;
  private leftA: number;
  private rightA: number;
  private leftB: number;
  private rightB: number;
  private shipLeftA: Set<string>;
  private shipLeftB: Set<string>;
  private isHit: boolean;

  initGame(initParams: InitGameDto) {
    //step1: start grid
    //step2: initialize players
    const { n, playerA = 'A', playerB = 'B' } = initParams;
    if (!n) throw new Error('Grid size is required');
    this.gridSize = n;
    this.playerA = playerA;
    this.playerB = playerB;
    this.battleField = Array.from({ length: n }, () => Array(n).fill('.'));
    this.alreadyFiredAt = [];
    this.currentPlayer = playerA;

    for (let i = 0; i < n; i++) {
      console.log(this.battleField[i].join(' '));
    }
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
        // throw new Error('Ship position PlayerA is required');
      }
      if (xPositionPlayerB === undefined || yPositionPlayerB === undefined) {
        // throw new Error('Ship position PlayerB is required');
      }

      //step1: generate Ids for SHip A, Ship B
      this.shipCount++;
      const shipAId = `A-${id}`;
      const shipBId = `B-${id}`; //A-SH-1, B-SH-1

      //  size = 2,
      // 1, 5, 4, 4
      // xPositionPlayerA = 0 , 2
      // positionPlayerA = 4, 6
      //1 -> 4
      //2 ->

      //setup ship for A

      for (
        let left = xPositionPlayerA;
        left <= xPositionPlayerA + size;
        left++
      ) {
        for (
          let bottom = yPositionPlayerA;
          bottom <= yPositionPlayerA + size;
          bottom++
        ) {
          console.log('setting shipAId at', left, bottom);
          this.battleField[left][bottom] = shipAId;
        }
      }

      //Ship B
      for (
        let left = xPositionPlayerB;
        left <= xPositionPlayerB + size;
        left++
      ) {
        for (
          let bottom = yPositionPlayerB;
          bottom <= yPositionPlayerB + size;
          bottom++
        ) {
          this.battleField[left][bottom] = shipBId;
        }
      }

      console.log(JSON.stringify(this.battleField), null, 2);

      return `addShip returns a list of battleShip`;
    } catch (error) {
      console.error(error);
      return `Failed to add ship`;
    }
  }

  startGame() {
    this.viewBattleField();
    const currentPlayer = this.playerA;
    // player A will start the game
    let isGameOver = false;
    while (!isGameOver) {
      const fireStrategy =
        currentPlayer === this.playerA
          ? this.fireStrategy(true)
          : this.fireStrategy(false);

      const { x, y } = fireStrategy;
      const isHit = this.battleField[x][y] !== '.';
      this.battleField[x][y] = 'X';
      this.alreadyFiredAt.push([x, y]);
      this.currentPlayer =
        currentPlayer === this.playerA ? this.playerB : this.playerA;

      isGameOver = this.isGameOver(this.currentPlayer === this.playerA);
      this.printGameStatement(x, y);
    }
    this.viewBattleField();
    return `Game over ${this.currentPlayer} is the winner`;
  }

  printGameStatement(x: number, y: number) {
    // PlayerA’s turn: Missile fired at (3, 0) : “Miss” : Ships
    const statment = `${this.currentPlayer} turn: Missile fired at (${x}, ${y}) : ${this.isHit ? 'Hit' : 'Miss'} : Ships`;
    // Remaining - PlayerA:1, PlayerB:1
    const statment2 = `Remaining - PlayerA:${this.shipLeftA.size}, PlayerB:${this.shipLeftB.size}`;
    console.log(statment);
    console.log(statment2);
  }
  viewBattleField() {
    for (let i = 0; i < this.gridSize; i++) {
      console.log(this.battleField[i].join(' '));
    }
  }

  fireStrategy(isPlayerA: boolean) {
    let left: number;
    let right: number;
    if (isPlayerA) {
      //fire a shot at a random coordinate
      left = this.gridSize / 2;
      right = this.gridSize - 1;
    } else {
      //fire a shot at a random coordinate
      left = 0;
      right = this.gridSize / 2;
    }
    const randomX = Math.floor(Math.random() * (right - left + 1)) + left;
    const randomY = Math.floor(Math.random() * this.gridSize);
    if (this.alreadyFiredAt.includes([randomX, randomY])) {
      //skip
      return this.fireStrategy(isPlayerA);
    }
    this.alreadyFiredAt.push([randomX, randomY]);
    this.leftA = left;
    this.rightA = right;
    this.leftB = left;
    this.rightB = right;
    return { x: randomX, y: randomY };
  }

  isGameOver(isPlayerA: boolean) {
    // check if any ship is left
    this.isHit = false;
    const shipIdPrefix = isPlayerA ? `B-SH` : `A-SH`;
    for (let i = this.leftA; i <= this.rightA; i++) {
      for (let j = this.leftB; j <= this.rightB; j++) {
        if (this.battleField[i][j].includes(shipIdPrefix)) {
          this.isHit = true;
          const shipIdSuffix: string =
            this.battleField[i][j].split(shipIdPrefix)[1];

          if (isPlayerA) {
            this.shipLeftA.add(shipIdSuffix);
          } else {
            this.shipLeftB.add(shipIdSuffix);
          }
          return false;
        }
      }
    }
    return true;
  }
}
