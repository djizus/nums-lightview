import { PowerUps } from "@/components/containers/power-ups";
import { Slots } from "@/components/containers/slots";
import { Stages } from "@/components/containers/stages";
import { Multiplier } from "@/components/elements/multiplier";
import { Num } from "@/components/elements/number";
import type { PowerUpProps } from "@/components/elements/power-up";
import { Reward } from "@/components/elements/reward";
import type { SlotProps } from "@/components/elements/slot";
import type { StageState } from "@/components/elements/stage";
import { Verifier } from "@/helpers/verifier";
import { cn } from "@/lib/utils";
import type { Game as GameModel } from "@/models";
import { type VariantProps, cva } from "class-variance-authority";
import { useMemo } from "react";

export interface GameSceneProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof gameSceneVariants> {
	game: GameModel;
	multiplier: number;
	powers: PowerUpProps[];
	slots: Array<SlotProps>;
	stages: Array<StageState>;
}

const gameSceneVariants = cva("select-none relative flex flex-col justify-around items-center gap-2 md:gap-8", {
	variants: {
		variant: {
			default: "",
		},
		size: {
			md: "w-full h-full md:w-[720px] md:mx-auto",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

export const GameScene = ({
	game,
	multiplier,
	powers,
	slots,
	stages,
	variant,
	size,
	className,
	style,
	...props
}: GameSceneProps) => {
	const isOver = useMemo(() => {
		return Verifier.isOver(game.number, game.level, game.slot_count, game.slots);
	}, [game]);

	const isRescuable = useMemo(() => {
		return game.enabled_powers.some((enabled) => enabled);
	}, [game]);

	const isSelectable = useMemo(() => {
		return game.selectable_powers.length > 0;
	}, [game]);

	return (
		<div
			className={cn(gameSceneVariants({ variant, size, className }))}
			style={{ scrollbarWidth: "none", ...style }}
			{...props}
		>
			<div className="flex-[1] w-full flex items-center">
				<div className="flex justify-between items-stretch gap-3 md:gap-8 w-full">
					<div className="flex justify-between items-center h-full gap-3 md:gap-6">
						<Num id="tutorial-num" value={game.number} invalid={isOver} sound />
						<div className="flex flex-col justify-between items-start h-full gap-2">
							<p className="text-primary-100 text-base xs:text-lg leading-4 xs:leading-5 md:leading-6 uppercase tracking-wider">
								Up next
							</p>
							<Num id="tutorial-next-num" variant="secondary" value={game.next_number} />
						</div>
					</div>
					<PowerUps powers={powers} className="hidden md:flex" />
					<Reward id="tutorial-reward" reward={game.reward} className="md:hidden" />
				</div>
			</div>
			<div className="flex-[1] w-full flex items-center">
				<div className="flex justify-between items-center gap-2 md:gap-4 w-full">
					<Multiplier id="tutorial-multiplier" multiplier={multiplier} className="md:hidden" />
					<div
						className={cn(
							"h-10 md:h-12 w-full rounded-lg flex items-center justify-center text-[22px] md:text-[28px] tracking-wider bg-black-800",
							isOver && !isRescuable ? "text-red-100" : "text-white-100",
						)}
					>
						{isSelectable
							? "Power Up Available"
							: isOver && isRescuable
								? "Rescuable"
								: isOver
									? "Game Over"
									: "Spectating"}
					</div>
				</div>
			</div>
			<div className="flex-[1] w-full flex items-center md:hidden">
				<Stages id="tutorial-stages" states={stages} className="w-full" />
			</div>
			<div className="grow w-full p-1 md:p-3 flex items-center">
				<Slots
					id="tutorial-slots"
					className="h-full max-h-[350px] md:max-h-auto"
					number={game.number}
					min={game.slot_min}
					max={game.slot_max}
					slots={slots}
				/>
			</div>
			<div className="hidden md:flex items-stretch justify-center gap-6 w-full">
				<Multiplier id="tutorial-multiplier" multiplier={multiplier} />
				<Stages id="tutorial-stages" states={stages} className="flex-1" />
				<Reward id="tutorial-reward" reward={game.reward} />
			</div>
			<div className="flex-[1] w-full flex items-center">
				<PowerUps powers={powers} className="w-full md:hidden" />
			</div>
		</div>
	);
};
