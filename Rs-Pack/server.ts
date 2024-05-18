import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

const MIME_TYPES: Record<string, string> = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml"
};

function getContentType(filePath: string): string {
    const ext = filePath.substring(filePath.lastIndexOf('.'));
    return MIME_TYPES[ext] || "application/octet-stream";
}

async function handleRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const filePath = url.pathname === "/" ? "/index.html" : url.pathname;
    try {
        const data = await Deno.readFile(`./dist${filePath}`);
        const contentType = getContentType(filePath);
        return new Response(data, {
            headers: { "content-type": contentType }
        });
    } catch (error) {
        console.error(`Failed to serve ${filePath}: ${error}`);
        return new Response("File not found", { status: 404 });
    }
}

const PORT = parseInt(Deno.env.get("PORT") || "3000");
console.log(`Server running on http://localhost:${PORT}/`);
await serve(handleRequest, { port: PORT });
