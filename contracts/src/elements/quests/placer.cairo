use quest::types::task::{Task as QuestTask, TaskTrait as QuestTaskTrait};
use starknet::ContractAddress;
use crate::elements::tasks::filler;
use super::index::{ONE_DAY, QuestMetadataTrait, QuestProps, QuestTrait, THREE_DAYS, TWO_DAYS};

pub impl DailyPlacerOne of QuestTrait {
    fn identifier() -> felt252 {
        'DAILY_PLACER_ONE'
    }

    fn props(registry: ContractAddress) -> QuestProps {
        let total = 20;
        let metadata = QuestMetadataTrait::new(
            name: "Orientation",
            description: "The work is mysterious and important.",
            icon: "fa-table-cells",
            registry: registry,
            rewards: [].span(),
        );
        let tasks: Array<QuestTask> = array![
            QuestTaskTrait::new(
                filler::Filler::identifier(), total.into(), filler::Filler::description(total),
            ),
        ];
        QuestProps {
            id: Self::identifier(),
            start: 0,
            end: 0,
            duration: ONE_DAY,
            interval: THREE_DAYS,
            tasks: tasks,
            conditions: array![],
            metadata: metadata,
        }
    }
}

pub impl DailyPlacerTwo of QuestTrait {
    fn identifier() -> felt252 {
        'DAILY_PLACER_TWO'
    }

    fn props(registry: ContractAddress) -> QuestProps {
        let total = 30;
        let metadata = QuestMetadataTrait::new(
            name: "Deep Focus",
            description: "Try to enjoy each number equally.",
            icon: "fa-table-cells-large",
            registry: registry,
            rewards: [].span(),
        );
        let tasks: Array<QuestTask> = array![
            QuestTaskTrait::new(
                filler::Filler::identifier(), total.into(), filler::Filler::description(total),
            ),
        ];
        QuestProps {
            id: Self::identifier(),
            start: ONE_DAY,
            end: 0,
            duration: ONE_DAY,
            interval: THREE_DAYS,
            tasks: tasks,
            conditions: array![],
            metadata: metadata,
        }
    }
}

pub impl DailyPlacerThree of QuestTrait {
    fn identifier() -> felt252 {
        'DAILY_PLACER_THREE'
    }

    fn props(registry: ContractAddress) -> QuestProps {
        let total = 40;
        let metadata = QuestMetadataTrait::new(
            name: "Clean Sweep",
            description: "Not a single number out of place.",
            icon: "fa-grip",
            registry: registry,
            rewards: [].span(),
        );
        let tasks: Array<QuestTask> = array![
            QuestTaskTrait::new(
                filler::Filler::identifier(), total.into(), filler::Filler::description(total),
            ),
        ];
        QuestProps {
            id: Self::identifier(),
            start: TWO_DAYS,
            end: 0,
            duration: ONE_DAY,
            interval: THREE_DAYS,
            tasks: tasks,
            conditions: array![],
            metadata: metadata,
        }
    }
}
