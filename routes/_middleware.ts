import { Context } from "fresh";
import type { State } from "../utils.ts";
import { minify } from "npm:terser@5";

declare global {
  var __AUTOLOAD: Set<string> | undefined;
}

async function isRouteBlocking(route: string): Promise<boolean> {
  try {
    const mod = await import(/* @vite-ignore */ `.${route}.tsx`);
    const fn = mod.handler?.GET;
    return fn?.constructor.name === "AsyncFunction" &&
      fn.toString().includes("await");
  } catch {
    return true;
  }
}

async function makeAutoLoadScript(blocking: string[], nonce?: string) {
  const readable = `(() => {
  if (window.__FRSH_AUTOLOAD_RAN__) return;
  window.__FRSH_AUTOLOAD_RAN__ = true;
  const routes = ${JSON.stringify(blocking)};
  function trigger(route) {
    const form = document.createElement("form");
    form.setAttribute("f-partial", route);
    form.method = "GET";
    form.style.display = "none";
    document.body.appendChild(form);
    try { form.requestSubmit(); }
    catch (e) { console.error("[PARTIAL] fetch failed", e); }
    finally { form.remove(); }
  }
  const start = () => routes.forEach(trigger);
  if (document.readyState !== "loading") start();
  else window.addEventListener("DOMContentLoaded", start, { once: true });
  window.addEventListener("frsh:load", start, { once: true });
})();`;

  const { code } = await minify(readable, {
    toplevel: true,
    compress: true,
    mangle: true,
  });
  return `<script type="module"${
    nonce ? ` nonce="${nonce}"` : ""
  }>${code}</script>`;
}

export async function handler(ctx: Context<State>) {
  const resp = await ctx.next();
  const type = resp.headers.get("content-type");
  if (
    !type?.includes("text/html") || ctx.req.method !== "GET" ||
    ctx.url.pathname.startsWith("/partials/")
  ) return resp;

  let html = await resp.text();
  const auto = Array.from(globalThis.__AUTOLOAD ?? new Set<string>());
  globalThis.__AUTOLOAD = new Set();
  if (!auto.length) {
    return new Response(html, { status: resp.status, headers: resp.headers });
  }

  const partials = auto.map((n) => `/partials/${n}`);
  const analysis = await Promise.all(
    partials.map(async (r) => ({
      route: r,
      blocking: await isRouteBlocking(r),
    })),
  );

  const blocking = analysis.filter((a) => a.blocking).map((a) => a.route);
  const asyncRoute = analysis.filter((a) => !a.blocking).map((a) => a.route);

  blocking.forEach((route) => console.log(`[PARTIAL] GET -> ${route}`));
  asyncRoute.forEach((route) => console.log(`[PARTIAL] ASYNC GET -> ${route}`));

  for (const route of asyncRoute) {
    const name = route.split("/").pop()!;
    try {
      const u = new URL(route, ctx.url.origin);
      u.searchParams.set("fresh-partial", "true");
      const res = await fetch(u, {
        headers: { Accept: "text/html; partial=true" },
      });
      const t = await res.text();
      const m = t.match(
        /<!--frsh:partial:[^:]+:0:-->([\s\S]*?)<!--\/frsh:partial-->/,
      );
      if (m) {
        html = html.replace(
          new RegExp(
            `(<!--frsh:partial:${name}:0:-->)[\\s\\S]*?(<!--\\/frsh:partial-->)`,
            "g",
          ),
          `$1${m[1]}$2`,
        );
      }
    } catch (e) {
      console.error("[PARTIAL] prefetch failed", route, e);
    }
  }

  if (blocking.length) {
    const nonce = html.match(/<script[^>]*nonce="([^"]+)"/i)?.[1];
    const script = await makeAutoLoadScript(blocking, nonce);
    html = html.replace("</body>", `${script}</body>`);
  }

  return new Response(html, { status: resp.status, headers: resp.headers });
}
