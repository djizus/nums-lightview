import { Game } from "@/api/torii/game";
import { NAMESPACE } from "@/constants";
import { useEntities } from "@/context/entities";
import type { RawGame } from "@/models";
import { Game as GameModel } from "@/models/game";
import type { SubscriptionCallbackArgs } from "@dojoengine/sdk";
import type * as torii from "@dojoengine/torii-wasm";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef } from "react";

export function useGame(gameId: number | null | undefined) {
	const { client } = useEntities();
	const queryClient = useQueryClient();
	const queryKey = useMemo(() => Game.keys.byId(gameId ?? 0), [gameId]);
	const subscriptionRef = useRef<torii.Subscription | null>(null);

	const { data: game } = useQuery<GameModel | undefined>({
		queryKey,
		queryFn: async () => {
			if (!client || !gameId || gameId <= 0) return undefined;
			const result = await client.getEntities(Game.byIdQuery(gameId).build());
			return Game.parseOne(result.items, gameId);
		},
		enabled: !!client && !!gameId && gameId > 0,
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		refetchOnWindowFocus: false,
	});

	const onSubscriptionUpdate = useCallback(
		(data: SubscriptionCallbackArgs<torii.Entity[], Error>) => {
			if (!data || data.error || !gameId) return;
			(data.data || [data] || []).forEach((entity) => {
				const key = `${NAMESPACE}-${GameModel.getModelName()}`;
				if (entity.models[key]) {
					const parsed = GameModel.parse(entity.models[key] as unknown as RawGame);
					if (parsed && parsed.id === gameId) {
						queryClient.setQueryData<GameModel | undefined>(queryKey, parsed);
					}
				}
			});
		},
		[queryClient, queryKey, gameId],
	);

	useEffect(() => {
		if (!client || !gameId || gameId <= 0) return;

		const query = Game.byIdQuery(gameId);
		client.onEntityUpdated(query.build().clause, [], onSubscriptionUpdate).then((sub) => {
			if (subscriptionRef.current) {
				subscriptionRef.current.cancel();
			}
			subscriptionRef.current = sub;
		});

		return () => {
			if (subscriptionRef.current) {
				subscriptionRef.current.cancel();
				subscriptionRef.current = null;
			}
		};
	}, [client, gameId, onSubscriptionUpdate]);

	return game;
}
