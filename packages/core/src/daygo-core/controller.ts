/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { createCommandBus, createEffect, excludeState } from "../utils";
import { createSelectController } from "./controller-select";
import { createDisableController } from "./controller-disable";
import { createFocusController, focusCommandHandlers } from "./controller-focus";
import type { Simplify } from "../types";
import type { DateRange, IBus, InitStateDates } from "../utils";
import type { ControllerCommand, CustomParser, EventSubscriber } from "../types/type";
import type { SelectController } from "./controller-select";
import type { DisableController } from "./controller-disable";
import type { FocusCommand, FocusController } from "./controller-focus";

export type ControllerConfig = {
    readonly selectedDates?: InitStateDates;
    readonly disabledDates?: InitStateDates;
    readonly customParser?: CustomParser;
}

type ControllerType = FocusController & SelectController & DisableController & {
    clear: () => void;
	resetDefaults: () => void;
    getState: () => DateRange[];
    getConfig: () => ControllerConfig | undefined;
    onFocusChange: (subscriber: EventSubscriber) => () => void;
    onSelectChange: (subscriber: EventSubscriber) => () => void;
    onDisableChange: (subscriber: EventSubscriber) => () => void;
};

export type Controller = Simplify<Readonly<{
    readonly [P in keyof ControllerType]: ControllerType[P];
}>>;

export type ControllerWithBus = Controller & {
    readonly $$bus: IBus<ControllerCommand>;
}

export const createController = (config?: ControllerConfig): Controller => {
	const { selectedDates, disabledDates, customParser } = config || {};

	const $$bus = createCommandBus<ControllerCommand>();
	const focusController = createFocusController($$bus, customParser);
	const { onSelectChange, ...selectController } = createSelectController($$bus, { selectedDates, customParser });
	const { onDisableChange, ...disableController } = createDisableController($$bus, { disabledDates, customParser });

	const controller = {
		// @ts-ignore
		$$bus,
		...focusController,
		...selectController,
		...disableController,
		getConfig: () => config,
		clear: () => {
			disableController.enableAll();
			selectController.unselectAll();
		},
		resetDefaults: () => {
			focusController.resetDefaultsFocus();
			selectController.resetDefaultsSelected();
			disableController.resetDefaultsDisabled();
		},
		getState: () => excludeState(controller.getSelected(), controller.getDisabled()),
		onFocusChange: (subscriber: EventSubscriber) => {
			const subscribeEffect = createEffect(() => subscriber(controller));
			return $$bus.subscribe(({ type }) => focusCommandHandlers[type as FocusCommand] && subscribeEffect());
		},
		onSelectChange: (subscriber: EventSubscriber) => onSelectChange(() => subscriber(controller)),
		onDisableChange: (subscriber: EventSubscriber) => onDisableChange(() => subscriber(controller))
	};

	return controller;
};
