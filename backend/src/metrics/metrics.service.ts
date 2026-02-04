import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry = new client.Registry();
  private readonly httpRequestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'path', 'status'],
  });
  private readonly httpRequestDurationMs = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'HTTP request duration in milliseconds',
    labelNames: ['method', 'path', 'status'],
    buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
  });
  private readonly businessEventsTotal = new client.Counter({
    name: 'business_events_total',
    help: 'Business domain events',
    labelNames: ['event'],
  });

  constructor() {
    this.registry.setDefaultLabels({ service: 'hotel-backend' });
    client.collectDefaultMetrics({ register: this.registry });
    this.registry.registerMetric(this.httpRequestsTotal);
    this.registry.registerMetric(this.httpRequestDurationMs);
    this.registry.registerMetric(this.businessEventsTotal);
  }

  recordHttpRequest(method: string, path: string, status: number, durationMs: number) {
    const labels = { method, path, status: String(status) };
    this.httpRequestsTotal.inc(labels);
    this.httpRequestDurationMs.observe(labels, durationMs);
  }

  recordBusinessEvent(event: string) {
    this.businessEventsTotal.inc({ event });
  }

  getContentType() {
    return this.registry.contentType;
  }

  getMetrics() {
    return this.registry.metrics();
  }
}
