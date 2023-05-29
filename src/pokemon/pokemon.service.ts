import { Model, isValidObjectId } from 'mongoose';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly PokemonModel: Model<Pokemon>,
  ) {}
  async create(createPokemon: CreatePokemonDto) {
    //return createPokemon;
    createPokemon.name = createPokemon.name.toLowerCase();
    try {
      return await this.PokemonModel.create(createPokemon);
    } catch (error) {
      this.ThrowPokemonExist(error);
    }
  }

  async findAll(info: PaginationDto): Promise<Pokemon[]> {
    const { offset, limit } = info;
    return this.PokemonModel.find()
      .limit(limit ?? 10)
      .skip(offset);
  }

  async findOne(term: string) {
    let searchPokemon: Pokemon | null = null;
    await this.structureFilter<void>({
      actionName: async () => {
        searchPokemon = await this.findPokemonName(term);
        return searchPokemon;
      },
      actionNumber: async () => {
        searchPokemon = await this.findPokemonNumber(term);
        return searchPokemon;
      },
      actionUuid: async () => {
        searchPokemon = await this.findPokemonID(term);
        return searchPokemon;
      },
      term,
    });
    if (!searchPokemon) throw new NotFoundException('No encontrado');
    return searchPokemon;
  }
  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const response = (data) => ({ ...data.toJSON(), ...updatePokemonDto });
    try {
      return await this.structureFilter<void>({
        actionUuid: async () => {
          const pokemon = await this.findPokemonID(term);
          if (pokemon) {
            await pokemon?.updateOne(updatePokemonDto, { new: true });
            return response(pokemon);
          } else {
            throw new NotFoundException('No se ha encontrado pokemon');
          }
        },
        actionNumber: async () => {
          const pokemon = await this.findPokemonNumber(term);
          await pokemon?.updateOne(updatePokemonDto, { new: true });
          return response(pokemon);
        },
        actionName: async () => {
          const pokemon = await this.findPokemonName(term);
          if (pokemon) {
            await pokemon.updateOne(updatePokemonDto, {
              new: true,
            });
            return response(pokemon);
          } else {
            throw new NotFoundException(
              'No se ha encontrado el dato a actualizar',
            );
          }
        },
        term,
      });
    } catch (error) {
      this.ThrowPokemonExist(error);
    }
  }
  async remove(term: string): Promise<string> {
    try {
      const remove = await this.structureFilter<boolean>({
        actionName: async () => {
          const pokemon = await this.findPokemonName(term);
          return await (await pokemon?.deleteOne())?.$isDeleted();
        },
        actionNumber: async () => {
          const pokemon = await this.findPokemonNumber(term);
          return (await pokemon?.deleteOne())?.$isDeleted;
        },
        actionUuid: async () => {
          const pokemon = await this.findPokemonID(term);
          return await (await pokemon?.deleteOne())?.$isDeleted();
        },
        term,
      });
      if (!remove) {
        return `Pokemon Eliminado correctamente`;
      } else {
        throw new NotFoundException('Pokemon no encontrado');
      }
    } catch (error) {
      return error;
    }
  }

  //Error Pokemon existente
  private ThrowPokemonExist(error: any) {
    if (error.code === 11000)
      throw new NotFoundException(
        `Pokemon ya existe: ${JSON.stringify(error.keyValue)}`,
      );
    else {
      console.log(error);

      throw new InternalServerErrorException(`${error}`);
    }
  }

  //Actions for search pokemon
  private async findPokemonNumber(number: string) {
    return this.PokemonModel.findOne({ number });
  }
  private async findPokemonName(name: string) {
    return this.PokemonModel.findOne({ name });
  }
  private async findPokemonID(id: string) {
    return this.PokemonModel.findById(id);
  }

  //Structure of search
  private structureFilter<T>({
    actionNumber,
    actionUuid,
    actionName,
    term,
  }): T {
    if (!isNaN(+term)) {
      return actionNumber();
    } else if (isValidObjectId(term)) {
      return actionUuid();
    } else {
      return actionName();
    }
  }
}
