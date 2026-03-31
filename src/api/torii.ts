import { type GameState, parseRawGame } from "../models/game";

const TORII_URL = "https://api.cartridge.gg/x/nums-mainnet/torii";
const NAMESPACE = "NUMS";

export async function fetchGame(gameId: number): Promise<GameState | null> {
	const idHex = `0x${gameId.toString(16).padStart(16, "0")}`;
	const query = `
		query {
			NUMSGameModels(where: { id: "${idHex}" }, limit: 1) {
				edges {
					node {
						id
						claimed
						multiplier
						level
						slot_count
						slot_min
						slot_max
						number
						next_number
						selectable_powers
						selected_powers
						enabled_powers
						disabled_traps
						reward
						over
						expiration
						traps
						slots
						supply
						price
					}
				}
			}
		}
	`;

	try {
		const res = await fetch(`${TORII_URL}/graphql`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ query }),
		});
		if (!res.ok) return null;

		const json = await res.json();
		const edges = json?.data?.NUMSGameModels?.edges;
		if (!edges || edges.length === 0) return null;

		const node = edges[0].node as Record<string, unknown>;
		const fields = Object.fromEntries(Object.entries(node).map(([k, v]) => [k, { value: v }])) as unknown as Parameters<
			typeof parseRawGame
		>[0];
		return parseRawGame(fields);
	} catch {
		return null;
	}
}

export async function fetchGameSQL(gameId: number): Promise<GameState | null> {
	const idHex = `0x${gameId.toString(16).padStart(64, "0")}`;
	const sql = `SELECT * FROM "${NAMESPACE}-Game" WHERE id = '${idHex}' LIMIT 1`;

	try {
		const res = await fetch(`${TORII_URL}/sql?query=${encodeURIComponent(sql)}`);
		if (!res.ok) return null;

		const rows = await res.json();
		if (!Array.isArray(rows) || rows.length === 0) return null;

		const row = rows[0] as Record<string, unknown>;
		const fields = Object.fromEntries(Object.entries(row).map(([k, v]) => [k, { value: v }])) as unknown as Parameters<
			typeof parseRawGame
		>[0];
		return parseRawGame(fields);
	} catch {
		return null;
	}
}
