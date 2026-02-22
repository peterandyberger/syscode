import { AppService } from './app.service';

describe('AppService', () => {
  it('should return a random address dto', () => {
    const service = new AppService();
    const result = service.getRandomAddress();

    expect(result.id).toBeTruthy();
    expect(result.address).toContain('HU,');
  });
});
