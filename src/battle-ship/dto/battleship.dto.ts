export class CreateBattleShipDto {}

export class InitGameDto {
  n: number; //grid size
  playerA?: string; //player A name
  playerB?: string; //player B name
}

// addShip(id, size, x position PlayerA, y position PlayerA, x position PlayerB, y position PlayerB)
export class AddShipDto {
  id: string;
  size: number;
  xPositionPlayerA: number;
  yPositionPlayerA: number;
  xPositionPlayerB: number;
  yPositionPlayerB: number;
}
