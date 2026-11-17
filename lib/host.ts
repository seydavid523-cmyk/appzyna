import { headers } from 'next/headers';

export function getRequestHost() {
  const requestHeaders = headers();
  return (requestHeaders.get('x-forwarded-host') || requestHeaders.get('host') || '').split(':')[0].toLowerCase();
}

export function isStoreHost(host = getRequestHost()) {
  return host === 'appzyna.shop' || host === 'www.appzyna.shop';
}
