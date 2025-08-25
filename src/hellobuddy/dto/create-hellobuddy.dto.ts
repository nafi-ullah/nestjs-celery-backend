import { IsInt, IsString, IsBoolean, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHelloDto {
  @Type(() => Number)
  @IsInt()
  a!: number;

  @IsString()
  b!: string;

  @Type(() => Boolean)
  @IsBoolean()
  c!: boolean;

  // "d" must be a JSON object
  @IsObject()
  d!: Record<string, any>;
}
