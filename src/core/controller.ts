/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IBus, createCommandBus } from "../utils/command-bus";
import { SelectController, createSelectController } from "./controller-select";
import { FocusController, createFocusController } from "./controller-focus";
import { ControllerCommand } from "../types/type";
import { DisableController, createDisableController } from "./controller-disable";
import { DateRange, excludeState } from "../utils/event-store";

export type ControllerConfig = {
    selectedDates?: Array<Date | DateRange | string>;
    disabledDates?: Array<Date | DateRange | string>;
    customParser?: (date: string) => Date;
}

export const createController = (config?: ControllerConfig): Controller => {
    const {selectedDates, disabledDates, customParser} = config || {};
    const getConfig = () => config;

    const $$bus = createCommandBus<ControllerCommand>();
    const focusController = createFocusController($$bus, customParser);
    const {onSelectChange, ...selectController} = createSelectController($$bus, {selectedDates, customParser});
    const {onDisableChange, ...disableController} = createDisableController($$bus, {disabledDates, customParser});

    // month begin from monday or sunday
    // isFocused

    const controller = {
        // @ts-ignore
        $$bus,
        getConfig,
        ...focusController,
        ...selectController,
        ...disableController,
        getState: () => excludeState(controller.getSelected(), controller.getDisabled()),
        onFocusChange: (subscriber: (controller: Controller) => void) => $$bus.subscribe(() => subscriber(controller)),
        onSelectChange: (subscriber: (controller: Controller) => void) => onSelectChange(() => subscriber(controller)),
        onDisableChange: (subscriber: (controller: Controller) => void) => onDisableChange(() => subscriber(controller))
    }

    return controller;
}

type ControllerType = FocusController & SelectController & DisableController & {
    getState: () => DateRange[];
    getConfig: () => ControllerConfig | undefined;
    onFocusChange: (subscriber: (controller: Controller) => void) => () => void;
    onSelectChange: (subscriber: (controller: Controller) => void) => () => void;
    onDisableChange: (subscriber: (controller: Controller) => void) => () => void;
};

export type Controller = {
    [P in keyof ControllerType]: ControllerType[P];
};

export type ControllerWithBus = Controller & {
    $$bus: IBus<ControllerCommand>;
}