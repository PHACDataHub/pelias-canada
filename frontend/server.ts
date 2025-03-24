import { serve } from 'https://deno.land/std/http/server.ts';

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

// Array of routes to redirect to index.html
const ROUTES_TO_REDIRECT = [
  '/reverse-geocoding-bulk',
  '/bulk-address-geocoding',
  '/r-api',
  '/python-api',
  '/frequently-asked-questions',
  '/geocoding-results-explanation',
  '/home',
  '/contact-us',
  '/test',
  '/',
];

function getContentType(filePath: string): string {
  const ext = filePath.substring(filePath.lastIndexOf('.'));
  return MIME_TYPES[ext] || 'application/octet-stream';
}

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  let filePath = url.pathname === '/' ? '/index.html' : url.pathname;

  // Redirect specific paths to index.html
  if (ROUTES_TO_REDIRECT.includes(filePath)) {
    filePath = '/index.html';
  }

  // Ensure the path does not contain `..` or go outside the `dist` directory
  if (filePath.includes('..')) {
    return new Response('Forbidden', { status: 403 });
  }

  try {
    const fullPath = `/app/dist${filePath}`;
    console.log(`Attempting to read file: ${fullPath}`); // Log the full path for debugging
    const data = await Deno.readFile(fullPath);
    const contentType = getContentType(filePath);
    return new Response(data, {
      headers: { 'content-type': contentType },
    });
  } catch (error) {
    console.error(`Failed to serve ${filePath}: ${error}`);

    // Handle 404 error
    if (error instanceof Deno.errors.NotFound) {
      console.log(`404 Error for file: ${filePath}`);
      return new Response('Not Found', { status: 404 });
    } else {
      // Handle other errors
      return new Response('Internal Server Error', { status: 500 });
    }
  }
}

const PORT = parseInt(Deno.env.get('PORT') || '3000');
console.log(`Server running on http://localhost:${PORT}/`);
await serve(handleRequest, { port: PORT });
