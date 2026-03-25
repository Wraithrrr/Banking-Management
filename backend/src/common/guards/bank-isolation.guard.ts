import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'

/**
 * Ensures that the bankId in the request params or body matches the JWT's bankId.
 * Attach after JwtAuthGuard on routes that take a :bankId param.
 */
@Injectable()
export class BankIsolationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const jwtBankId = request.user?.bankId
    const paramBankId = Number(request.params?.bankId)

    if (paramBankId && jwtBankId !== paramBankId) {
      throw new ForbiddenException('You do not have access to this bank\'s data.')
    }

    return true
  }
}
