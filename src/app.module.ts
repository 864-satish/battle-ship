import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BattleShipModule } from './battle-ship/battle-ship.module';

@Module({
  imports: [BattleShipModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
