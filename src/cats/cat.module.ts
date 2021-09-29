import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CatsController } from './cat.controller'
import { Cat } from './cat.entity'
import { CatService } from './cat.service'
import { MinioClientModule } from '../minio-client/minio-client.module'

@Module({
  imports: [TypeOrmModule.forFeature([Cat]), MinioClientModule],
  providers: [CatService],
  controllers: [CatsController],
})
export class CatModule {}
