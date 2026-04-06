import { createAdminHandler } from "@vibers/admin-kit/handler";
import pool from "@/lib/db";

export const { GET, POST } = createAdminHandler({
  projectId: "whymove",
  projectName: "WhyMove",

  async getStats() {
    const [users, content, recentSignups] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM whymove.users"),
      pool.query("SELECT COUNT(*) FROM whymove.social_posts"),
      pool.query(`SELECT COUNT(*) FROM whymove.users WHERE created_at > NOW() - INTERVAL '7 days'`),
    ]);
    return {
      totalUsers: Number(users.rows[0].count),
      contentCount: Number(content.rows[0].count),
      mau: 0,
      recentSignups: Number(recentSignups.rows[0].count),
    };
  },

  async getRecentActivity() {
    const { rows } = await pool.query(`
      SELECT id::text, email as label, created_at as timestamp
      FROM whymove.users
      ORDER BY created_at DESC
      LIMIT 5
    `);
    return rows.map((r) => ({
      id: r.id,
      type: "signup" as const,
      label: r.label,
      timestamp: r.timestamp,
    }));
  },

  async getResource(resource) {
    if (resource === "users") {
      const { rows } = await pool.query(`
        SELECT id::text, email, name, nickname, created_at, provider
        FROM whymove.users
        ORDER BY created_at DESC
        LIMIT 100
      `);
      return rows;
    }
    if (resource === "posts") {
      const { rows } = await pool.query(`
        SELECT id::text, content, created_at, user_id::text
        FROM whymove.social_posts
        ORDER BY created_at DESC
        LIMIT 50
      `);
      return rows;
    }
    return null;
  },
});
