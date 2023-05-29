import { Injectable } from '@nestjs/common';
import { Pokemons } from './interface/indesx';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { getRequest } from 'src/common/getRequest';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly getRequest: getRequest,
  ) {}
  async seedExecute(count: number) {
    const { results } = await this.getRequest.get<Pokemons>(
      `https://pokeapi.co/api/v2/pokemon/?limit=${count}`,
    );

    let insertado = 0;
    for (const pokemon of results) {
      const numberPokemon = +pokemon.url.split('/').slice(-2)[0];
      try {
        await this.pokemonModel.create({
          number: numberPokemon,
          name: pokemon.name,
        });
        insertado += 1;
      } catch (error) {
        continue;
      }
    }
    return `Se insertaron ${insertado} registros`;
  }
  async seedClear(): Promise<string> {
    await this.pokemonModel.deleteMany();
    return 'Eliminado correctamente';
  }
}
