import {
  Controller,
  Body,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { TransformNumberPipe } from 'src/common/transfom-number.pipe';
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}
  @Get()
  async findAll(
    @Query('limit', TransformNumberPipe) limit: number,
    @Query('offset', TransformNumberPipe) offset: number,
  ) {
    return await this.pokemonService.findAll({ limit, offset });
  }

  @Get(':term')
  async findOne(@Param('term') term: string) {
    return await this.pokemonService.findOne(term);
  }

  @Post()
  async create(@Body() newPokemon: CreatePokemonDto) {
    return await this.pokemonService.create(newPokemon);
  }
  @Patch(':term')
  async updatePokemon(
    @Param('term') term: string,
    @Body() updatePokemonDto: UpdatePokemonDto,
  ) {
    return await this.pokemonService.update(term, updatePokemonDto);
  }

  @Delete(':term')
  async deletePokemon(@Param('term') term: string): Promise<string> {
    return await this.pokemonService.remove(term);
  }
}
