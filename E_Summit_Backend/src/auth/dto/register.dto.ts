import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'A valid email address is required' })
  @MaxLength(255)
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(128)
  password!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9+\-\s()]{7,20}$/, { message: 'Phone number format is invalid' })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  college?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  gradYear?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  /** Campus Ambassador referral code, if the delegate was referred. */
  @IsOptional()
  @IsString()
  @MaxLength(32)
  referralCode?: string;
}
