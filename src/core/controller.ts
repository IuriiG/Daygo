/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IBus, createCommandBus } from "../utils/command-bus";
import { SelectController, createSelectController } from "./controller-select";
import { FocusCommand, FocusController, createFocusController, focusCommandHandlers } from "./controller-focus";
import { ControllerCommand, CustomParser, EventSubscriber } from "../types/type";
import { DisableController, createDisableController } from "./controller-disable";
import { DateRange, excludeState } from "../utils/event-store";
import { createEffect } from "../utils/effect";

export type ControllerConfig = {
    selectedDates?: Array<Date | DateRange | string>;
    disabledDates?: Array<Date | DateRange | string>;
    customParser?: CustomParser;
}

type ControllerType = FocusController & SelectController & DisableController & {
    clear: () => void;
    getState: () => DateRange[];
    getConfig: () => ControllerConfig | undefined;
    onFocusChange: (subscriber: EventSubscriber) => () => void;
    onSelectChange: (subscriber: EventSubscriber) => () => void;
    onDisableChange: (subscriber: EventSubscriber) => () => void;
};

export type Controller = {
    [P in keyof ControllerType]: ControllerType[P];
};

export type ControllerWithBus = Controller & {
    $$bus: IBus<ControllerCommand>;
}

export const createController = (config?: ControllerConfig): Controller => {
    const {selectedDates, disabledDates, customParser} = config || {};
    const getConfig = () => config;

    const $$bus = createCommandBus<ControllerCommand>();
    const focusController = createFocusController($$bus, customParser);
    const {onSelectChange, ...selectController} = createSelectController($$bus, {selectedDates, customParser});
    const {onDisableChange, ...disableController} = createDisableController($$bus, {disabledDates, customParser});

    const controller = {
        // @ts-ignore
        $$bus,
        getConfig,
        ...focusController,
        ...selectController,
        ...disableController,
        clear: () => {
            disableController.enableAll();
            selectController.unselectAll();
        },
        getState: () => excludeState(controller.getSelected(), controller.getDisabled()),
        onFocusChange: (subscriber: EventSubscriber) => {
            const subscribeEffect = createEffect(() => subscriber(controller));
            return $$bus.subscribe(({type}) => focusCommandHandlers[type as FocusCommand] && subscribeEffect());
        },
        onSelectChange: (subscriber: EventSubscriber) => onSelectChange(() => subscriber(controller)),
        onDisableChange: (subscriber: EventSubscriber) => onDisableChange(() => subscriber(controller))
    }

    return controller;
}
