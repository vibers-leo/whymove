import pool from "@/lib/db";

function verifyAdminSecret(request: Request): boolean {
  const secret = process.env.VIBERS_ADMIN_SECRET;
  if (!secret) return false;
  return request.headers.get("x-vibers-admin-secret") === secret;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const resource = url.searchParams.get("resource");

  if (!verifyAdminSecret(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (resource) {
    try {
      let data = null;

      if (resource === "users") {
        const { rows } = await pool.query(`
          SELECT id::text, email, name, nickname, created_at, provider
          FROM whymove.users
          ORDER BY created_at DESC
          LIMIT 100
        `);
        data = rows;
      } else if (resource === "posts") {
        const { rows } = await pool.query(`
          SELECT id::text, content, created_at, user_id::text
          FROM whymove.social_posts
          ORDER BY created_at DESC
          LIMIT 50
        `);
        data = rows;
      }

      return Response.json({ resource, data });
    } catch (err) {
      console.error(`[vibers-admin:whymove:${resource}]`, err);
      return Response.json({ error: "Resource fetch failed" }, { status: 500 });
    }
  }

  try {
    const [users, content, recentSignups] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM whymove.users"),
      pool.query("SELECT COUNT(*) FROM whymove.social_posts"),
      pool.query(`SELECT COUNT(*) FROM whymove.users WHERE created_at > NOW() - INTERVAL '7 days'`),
    ]);

    const { rows } = await pool.query(`
      SELECT id::text, email as label, created_at as timestamp
      FROM whymove.users
      ORDER BY created_at DESC
      LIMIT 5
    `);

    const recentActivity = rows.map((r) => ({
      id: r.id,
      type: "signup" as const,
      label: r.label,
      timestamp: r.timestamp,
    }));

    return Response.json({
      projectId: "whymove",
      projectName: "WhyMove",
      stats: {
        totalUsers: Number(users.rows[0].count),
        contentCount: Number(content.rows[0].count),
        mau: 0,
        recentSignups: Number(recentSignups.rows[0].count),
      },
      recentActivity,
      health: "healthy",
    });
  } catch (err) {
    console.error("[vibers-admin:whymove]", err);
    return Response.json({
      projectId: "whymove",
      projectName: "WhyMove",
      stats: { mau: 0, totalUsers: 0, contentCount: 0, recentSignups: 0 },
      recentActivity: [],
      health: "error",
    });
  }
}

export async function POST(request: Request) {
  if (!verifyAdminSecret(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json({ error: "Not implemented" }, { status: 501 });
}
