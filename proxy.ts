import { NextRequest, NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="TechSports Admin", charset="UTF-8"',
    },
  });
}

export function proxy(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";
  const expectedUsername =
    process.env.ADMIN_USERNAME ?? (!isProduction ? "admin" : undefined);
  const expectedPassword =
    process.env.ADMIN_PASSWORD ?? (!isProduction ? "change-me" : undefined);

  if (!expectedUsername || !expectedPassword) {
    return new NextResponse("Admin credentials are not configured.", {
      status: 500,
    });
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) {
    return unauthorized();
  }

  let decoded = "";
  try {
    decoded = atob(authHeader.slice(6));
  } catch {
    return unauthorized();
  }

  const separator = decoded.indexOf(":");
  if (separator === -1) {
    return unauthorized();
  }

  const username = decoded.slice(0, separator);
  const password = decoded.slice(separator + 1);

  if (username !== expectedUsername || password !== expectedPassword) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
