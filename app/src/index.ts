// filepath: src/index.ts
import postgres from "postgres";

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;

		// APIエンドポイントの処理
		if (path === "/api") {
			// Create a database client that connects to your database via Hyperdrive
			// using the Hyperdrive credentials
			const sql = postgres(env.HYPERDRIVE.connectionString, {
				// Limit the connections for the Worker request to 5 due to Workers' limits on concurrent external connections
				max: 5,
				// If you are not using array types in your Postgres schema, disable `fetch_types` to avoid an additional round-trip (unnecessary latency)
				fetch_types: false,
			});

			try {
				// A very simple test query
				const result = await sql`select * from pg_tables`;

				// Clean up the client, ensuring we don't kill the worker before that is
				// completed.
				ctx.waitUntil(sql.end());

				// Return result rows as JSON
				return Response.json({ success: true, result: result });
			} catch (e: any) {
				console.error("Database error:", e.message);

				return Response.json({ success: false, error: e.message }, { status: 500 });
			}
		}

		// その他のパスは静的ファイルとして処理
		// デフォルトでindex.htmlを返す
		return env.ASSETS.fetch(request);
	},
} satisfies ExportedHandler<Env>;
