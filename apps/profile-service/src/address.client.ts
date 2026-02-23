import { Injectable } from '@nestjs/common';

type Address = {
  country: string;
  city: string;
  street: string;
  zip: string;
};

@Injectable()
export class AddressClient {
  async get(): Promise<Address> {
    const url = process.env.ADDRESS_SERVICE_URL;
    const user = process.env.ADDRESS_SERVICE_USERNAME;
    const pass = process.env.ADDRESS_SERVICE_PASSWORD;

    if (!url || !user || !pass) {
      throw new Error('Missing address service env');
    }

    const token = Buffer.from(`${user}:${pass}`).toString('base64');

    const res = await fetch(`${url}/address`, {
      headers: { Authorization: `Basic ${token}` },
    });

    if (!res.ok) {
      throw new Error(`Address service returned ${res.status}`);
    }

    return (await res.json()) as Address;
  }
}
