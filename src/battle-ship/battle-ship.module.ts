import { Module } from '@nestjs/common';
import { BattleShipService } from './battle-ship.service';
import { BattleShipController } from './battle-ship.controller';

@Module({
  controllers: [BattleShipController],
  providers: [BattleShipService],
})
export class BattleShipModule {}
