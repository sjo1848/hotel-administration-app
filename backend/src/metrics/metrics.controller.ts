import { Controller, Get, Res, ForbiddenException } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import type { Response } from 'express';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Get()
  async getMetrics(@Res() res: Response) {
    const requiredToken = process.env.METRICS_TOKEN?.trim();
    if (requiredToken) {
      const authHeader = res.req?.headers?.authorization ?? '';
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice('Bearer '.length).trim()
        : '';
      if (token !== requiredToken) {
        throw new ForbiddenException('Metrics access denied');
      }
    }
    res.setHeader('Content-Type', this.metrics.getContentType());
    res.send(await this.metrics.getMetrics());
  }
}
