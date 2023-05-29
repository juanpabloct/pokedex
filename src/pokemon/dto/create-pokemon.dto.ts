import { IsString, IsNumber } from 'class-validator';
export class CreatePokemonDto {
  @IsString()
  name: string;
  @IsNumber()
  number: number;
}
