import { Controller, Get, Post, Body } from '@nestjs/common';
import { BattleShipService } from './battle-ship.service';
import { AddShipDto, InitGameDto } from './dto/battleship.dto';

@Controller('battle-ship')
export class BattleShipController {
  constructor(private readonly battleShipService: BattleShipService) {}

  @Post('init-game')
  initGame(@Body() initParams: InitGameDto) {
    return this.battleShipService.initGame(initParams);
  }

  @Post('add-ship')
  addShip(@Body() shipParameters: AddShipDto) {
    return this.battleShipService.addShip(shipParameters);
  }

  @Get('start-game')
  startGame() {}

  @Get('view-battle-field')
  viewBattleField() {
    return this.battleShipService.viewBattleField();
  }
}
