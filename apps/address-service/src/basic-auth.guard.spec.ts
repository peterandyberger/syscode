import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { BasicAuthGuard } from './basic-auth.guard';

describe('BasicAuthGuard', () => {
  const ctx = (auth?: string): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: auth ? { authorization: auth } : {},
        }),
      }),
    } as unknown as ExecutionContext);

  beforeEach(() => {
    process.env.BASIC_AUTH_USERNAME = 'syscode';
    process.env.BASIC_AUTH_PASSWORD = 'syscode';
  });

  it('rejects request without auth header', () => {
    const guard = new BasicAuthGuard();
    expect(() => guard.canActivate(ctx())).toThrow(UnauthorizedException);
  });

  it('rejects non-basic auth header', () => {
    const guard = new BasicAuthGuard();
    expect(() => guard.canActivate(ctx('Bearer token'))).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects wrong credentials', () => {
    const bad = Buffer.from('bad:creds').toString('base64');
    const guard = new BasicAuthGuard();
    expect(() => guard.canActivate(ctx(`Basic ${bad}`))).toThrow(
      UnauthorizedException,
    );
  });

  it('accepts correct credentials', () => {
    const ok = Buffer.from('syscode:syscode').toString('base64');
    const guard = new BasicAuthGuard();
    expect(guard.canActivate(ctx(`Basic ${ok}`))).toBe(true);
  });
});