import { IBus } from "../utils/command-bus";
import { createBasicController } from "./controller-basic";
import { ControllerCommand } from "../types/type";
import { DateRange } from "../utils/event-store";

export type DisableControllerInit = {
    disabledDates?: Array<Date | DateRange | string>;
    customParser?: (date: string) => Date;
}

export const createDisableController = (bus: IBus<ControllerCommand>, init: DisableControllerInit) => {
    const {disabledDates, customParser} = init;
    const basicController = createBasicController(bus, {
        initState: disabledDates,
        customParser
    });

    return {
        isDisabled: basicController.is,
        enableDate: basicController.add,
        disableDate: basicController.remove,
        resetDisabled: basicController.reset,
        getDisabled: basicController.getState,
        disableDateToggle: basicController.toggle,
        removeDisableEvent: basicController.removeEvent,
        publishDisableEvent: basicController.publishEvent,
        onDisableChange: basicController.subscribe
    }
}

export type DisableController = ReturnType<typeof createDisableController>;