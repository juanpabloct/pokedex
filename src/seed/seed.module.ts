import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { Pokemon, pokemonShema } from 'src/pokemon/entities/pokemon.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: pokemonShema,
      },
    ]),
  ],
})
export class SeedModule {}
