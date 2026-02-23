import { AddressClient } from './address.client';

describe('AddressClient', () => {
  beforeEach(() => {
    process.env.ADDRESS_SERVICE_URL = 'http://address-service:3001';
    process.env.ADDRESS_SERVICE_USERNAME = 'syscode';
    process.env.ADDRESS_SERVICE_PASSWORD = 'syscode';

    (global as any).fetch = jest.fn();
  });

  it('200 -> returns address', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        country: 'HU',
        city: 'Budapest',
        street: 'Main',
        zip: '1234',
      }),
    });

    const client = new AddressClient();
    const res = await client.get();

    expect(res.city).toBe('Budapest');
  });

  it('401 -> throws', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: async () => 'nope',
    });

    const client = new AddressClient();

    await expect(client.get()).rejects.toThrow();
  });

  it('no url -> throws immediately', async () => {
    delete process.env.ADDRESS_SERVICE_URL;

    const client = new AddressClient();

    await expect(client.get()).rejects.toThrow();
  });
});
