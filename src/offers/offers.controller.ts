import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/createOffer.dto';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  createOffer(@Body() createOfferDto: CreateOfferDto) {
    return this.offersService.createOffer(createOfferDto);
  }

  @Get()
  getAllOffers() {
    return this.offersService.getAllOffers();
  }

  @Get('/:id')
  async getOfferById(@Param('id') id: number) {
    const offer = await this.offersService.getOfferById(id);

    if (!offer) {
      throw new NotFoundException(`Offer with id ${id} not found`);
    }

    return offer;
  }
}
