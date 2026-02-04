import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ReservationStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    guestName: string;

    @ApiProperty({ example: '2026-02-10T14:00:00Z' })
    @IsDateString()
    checkInDate: string;

    @ApiProperty({ example: '2026-02-15T10:00:00Z' })
    @IsDateString()
    checkOutDate: string;

    @ApiProperty({ example: 'Suite' })
    @IsString()
    @IsNotEmpty()
    roomType: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    roomId?: string;

    @ApiProperty({ enum: ReservationStatus, required: false })
    @IsEnum(ReservationStatus)
    @IsOptional()
    status?: ReservationStatus;

    @ApiProperty({ example: 500.50 })
    @IsNumber()
    totalPrice: number;
}
