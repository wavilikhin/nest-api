import { HttpModule, Module } from '@nestjs/common';
import { HhService } from './hh.service';
import { HhController } from './hh.controller';
import { TopPageModule } from 'src/top-page/top-page.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    providers: [HhService],
    controllers: [HhController],
    imports: [ConfigModule, HttpModule],
    exports: [HhService],
})
export class HhModule {}
