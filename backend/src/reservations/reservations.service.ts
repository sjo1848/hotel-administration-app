import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createReservationDto: CreateReservationDto) {
        return this.prisma.reservation.create({
            data: {
                guestName: createReservationDto.guestName,
                checkInDate: createReservationDto.checkInDate,
                checkOutDate: createReservationDto.checkOutDate,
                roomType: createReservationDto.roomType,
                totalPrice: createReservationDto.totalPrice,
                status: createReservationDto.status,
                roomId: createReservationDto.roomId,
                // TODO: Crear Folio automáticamente al confirmar reserva?
            },
        });
    }

    async findAll() {
        return this.prisma.reservation.findMany({
            include: {
                room: true,
            },
            orderBy: {
                checkInDate: 'asc',
            },
        });
    }

    async findOne(id: string) {
        const reservation = await this.prisma.reservation.findUnique({
            where: { id },
            include: {
                room: true,
                folio: {
                    include: {
                        charges: true,
                    }
                }
            },
        });

        if (!reservation) {
            throw new NotFoundException(`Reservation #${id} not found`);
        }

        return reservation;
    }
}
