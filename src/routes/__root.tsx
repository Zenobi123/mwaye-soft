import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

interface RouterContext {
  queryClient: QueryClient;
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MWAYE HOUSE — Gestion Commerciale" },
      { name: "description", content: "Plateforme de gestion commerciale du complexe MWAYE HOUSE : sport, événementiel et location" },
      { name: "author", content: "MWAYE HOUSE" },
      { property: "og:title", content: "MWAYE HOUSE — Gestion Commerciale" },
      { property: "og:description", content: "Plateforme de gestion commerciale du complexe MWAYE HOUSE : sport, événementiel et location" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "MWAYE HOUSE — Gestion Commerciale" },
      { name: "twitter:description", content: "Plateforme de gestion commerciale du complexe MWAYE HOUSE : sport, événementiel et location" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6a64e1c0-5910-4bdf-a20f-3f448cc90d3c/id-preview-49ab0041--4d930a60-60cd-4077-b580-e29e3a8f9031.lovable.app-1776842636588.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6a64e1c0-5910-4bdf-a20f-3f448cc90d3c/id-preview-49ab0041--4d930a60-60cd-4077-b580-e29e3a8f9031.lovable.app-1776842636588.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
