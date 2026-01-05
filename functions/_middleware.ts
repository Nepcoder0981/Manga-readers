import { Context } from "@cloudflare/workers-types";

export const onRequest = async (context: Context) => {
  const url = new URL(context.request.url);
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    const targetUrl = new URL(url.pathname.replace('/api/', ''), 'https://manga-api.techzone.workers.dev');
    targetUrl.search = url.search;
    
    return fetch(targetUrl.toString(), {
      method: context.request.method,
      headers: {
        'Origin': url.origin,
        'User-Agent': context.request.headers.get('User-Agent') || '',
        'Accept': context.request.headers.get('Accept') || '*/*',
        'Content-Type': context.request.headers.get('Content-Type') || 'application/json',
        'Authorization': context.request.headers.get('Authorization') || '',
      },
      body: ['GET', 'HEAD'].includes(context.request.method) ? undefined : await context.request.arrayBuffer(),
    });
  }
  
  // Handle image proxy requests
  if (url.pathname.startsWith('/image-proxy/')) {
    const targetUrl = new URL(url.pathname.replace('/image-proxy/', ''), 'https://mangaimageproxy.techzone.workers.dev');
    targetUrl.search = url.search;
    
    return fetch(targetUrl.toString(), {
      method: context.request.method,
      headers: {
        'Origin': url.origin,
        'User-Agent': context.request.headers.get('User-Agent') || '',
        'Accept': 'image/*',
      },
    });
  }
  
  // For all other requests, continue to the next middleware
  return context.next();
};