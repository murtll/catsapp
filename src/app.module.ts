import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CatModule } from './cats/cat.module'
import { MinioClientModule } from './minio-client/minio-client.module'

@Module({
  imports: [TypeOrmModule.forRoot(), MinioClientModule, CatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
