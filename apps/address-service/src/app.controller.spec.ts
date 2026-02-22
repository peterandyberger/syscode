import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;

  const mockService = {
    getRandomAddress: jest.fn().mockReturnValue({
      id: '123',
      address: 'HU, 1000 Budapest, Fo utca 1.',
    }),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: mockService }],
    }).compile();

    controller = moduleRef.get(AppController);
  });

  it('should return address dto', () => {
    const result = controller.getAddress();
    expect(result).toEqual({
      id: '123',
      address: 'HU, 1000 Budapest, Fo utca 1.',
    });
  });
});
