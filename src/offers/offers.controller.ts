import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/createOffer.dto';
import { AuthUser } from '../auth/decorators/auth.decorator';
import { User } from '../users/entities/user.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('offers')
@UseGuards(JwtGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  createOffer(@AuthUser() user: User, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService.createOffer(user, createOfferDto);
  }

  @Get()
  getAllOffers() {
    return this.offersService.getAllOffers();
  }

  @Get('/:id')
  async getOfferById(@Param('id') id: number) {
    return this.offersService.getOfferById(id);
  }
}
