import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export type AddressDto = {
  id: string;
  address: string;
};

@Injectable()
export class AppService {
  getRandomAddress(): AddressDto {
    return {
      id: randomUUID(),
      address: this.buildAddress(),
    };
  }

  private buildAddress(): string {
    const cities = ['Budapest', 'Debrecen', 'Szeged', 'Pecs', 'Gyor'];
    const streets = ['Fo utca', 'Kossuth utca', 'Petofi utca', 'Beke utca', 'Arany Janos utca'];

    const city = cities[Math.floor(Math.random() * cities.length)];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const houseNo = 1 + Math.floor(Math.random() * 120);
    const zip = 1000 + Math.floor(Math.random() * 9000);

    return `HU, ${zip} ${city}, ${street} ${houseNo}.`;
  }
}