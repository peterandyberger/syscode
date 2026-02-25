import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

function extractCredentials(authHeader?: string) {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2) return null;

  const [scheme, token] = parts;
  if (scheme !== 'Basic') return null;

  const decoded = Buffer.from(token, 'base64').toString();
  const separatorIndex = decoded.indexOf(':');
  if (separatorIndex === -1) return null;

  const username = decoded.substring(0, separatorIndex);
  const password = decoded.substring(separatorIndex + 1);

  return { username, password };
}

@Injectable()
export class BasicAuthGuard implements CanActivate {
  private readonly logger = new Logger(BasicAuthGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const credentials = extractCredentials(request.headers?.authorization);

    const expectedUser = process.env.BASIC_USER || 'syscode';
    const expectedPass = process.env.BASIC_PASS || 'syscode';

    if (
      !credentials ||
      credentials.username !== expectedUser ||
      credentials.password !== expectedPass
    ) {
      this.logger.warn(`Unauthorized request from ${request.ip}`);
      throw new UnauthorizedException();
    }

    return true;
  }
}
