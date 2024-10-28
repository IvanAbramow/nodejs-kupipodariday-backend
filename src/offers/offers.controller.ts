import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/createOffer.dto';
import { raw } from 'express';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post('/offers')
  createOffer(@Body() createOfferDto: CreateOfferDto) {
    return this.offersService.createOffer(createOfferDto);
  }

  @Get('/offers')
  getAllOffers() {
    return this.offersService.getAllOffers();
  }

  @Get('/offers/:id')
  async getOfferById(@Param('id') id: number) {
    const offer = await this.offersService.getOfferById(id);

    if (!offer) {
      throw new NotFoundException(`Offer with ID ${id} not found`);
    }

    return offer;
  }
}
