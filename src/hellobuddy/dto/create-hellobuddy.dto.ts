import { IsInt, IsString, IsBoolean, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHelloDto {
  @ApiProperty({
    description: 'Integer value for parameter a',
    example: 42,
    type: 'integer'
  })
  @Type(() => Number)
  @IsInt()
  a!: number;

  @ApiProperty({
    description: 'String value for parameter b',
    example: 'hello world'
  })
  @IsString()
  b!: string;

  @ApiProperty({
    description: 'Boolean value for parameter c',
    example: true
  })
  @Type(() => Boolean)
  @IsBoolean()
  c!: boolean;

  @ApiProperty({
    description: 'JSON object for parameter d',
    example: { key1: 'value1', key2: 'value2' }
  })
  @IsObject()
  d!: Record<string, any>;
}
