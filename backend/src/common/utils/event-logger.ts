export function logEvent(event: string, payload: Record<string, unknown>) {
  console.log(
    JSON.stringify({
      level: 'info',
      msg: 'domain_event',
      event,
      ...payload,
      timestamp: new Date().toISOString(),
    }),
  );
}
