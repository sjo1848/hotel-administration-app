import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { MetricsService } from '../../metrics/metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const response = http.getResponse();

    const method = request.method;
    const routePath = request.route?.path;
    const path = routePath ? `${request.baseUrl}${routePath}` : request.path;

    if (path === '/metrics') {
      return next.handle();
    }

    const start = process.hrtime.bigint();
    return next.handle().pipe(
      finalize(() => {
        const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
        const status = response.statusCode ?? 0;
        this.metrics.recordHttpRequest(method, path, status, durationMs);
      }),
    );
  }
}
