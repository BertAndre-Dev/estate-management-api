import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class VerifyInvitationDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address associated with the invited account.',
  })
  @IsEmail({}, { message: 'A valid email address is required.' })
  email: string;

  @ApiProperty({
    example: 'Temp@123',
    description: 'The temporary password that was sent to the user during invitation.',
  })
  @IsNotEmpty({ message: 'Temporary password is required.' })
  tempPassword: string;

  @ApiProperty({
    example: 'StrongPassword@2025',
    description:
      'The new password the user wants to set. Must contain uppercase, lowercase, number, and special character.',
  })
  @IsNotEmpty({ message: 'New password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]).{8,}$/, {
    message:
      'Password must contain uppercase, lowercase, number, and special character.',
  })
  newPassword: string;
}
