import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

function parseUserAgent(ua: string) {
  let browser = "Unknown";
  let os = "Unknown";
  let device_type = "Desktop";

  if (/mobile/i.test(ua)) device_type = "Mobile";
  else if (/tablet|ipad/i.test(ua)) device_type = "Tablet";

  if (/chrome|crios/i.test(ua) && !/edg/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/edg/i.test(ua)) browser = "Edge";
  else if (/opera|opr/i.test(ua)) browser = "Opera";

  if (/windows/i.test(ua)) os = "Windows";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/mac os/i.test(ua)) os = "macOS";
  else if (/linux/i.test(ua)) os = "Linux";

  return { browser, os, device_type };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const page_path = body.path || "/";

    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    let ip_address = forwarded ? forwarded.split(",")[0].trim() : realIp || "127.0.0.1";

    // Handle local dev ip
    if (ip_address === "::1" || ip_address === "127.0.0.1") {
      ip_address = "Localhost (Dev)";
    }

    const user_agent = req.headers.get("user-agent") || "";
    const { browser, os, device_type } = parseUserAgent(user_agent);

    // City and country headers (Vercel / Cloudflare headers or default)
    const country = req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || "Indonesia";
    const city = req.headers.get("x-vercel-ip-city") || "Jawa Timur";

    const supabase = await createClient();
    const { error } = await supabase.from("visitor_logs").insert([
      {
        ip_address,
        user_agent,
        device_type,
        browser,
        os,
        page_path,
        city,
        country,
      },
    ]);

    if (error) {
      console.error("Error inserting visitor log:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Track API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
