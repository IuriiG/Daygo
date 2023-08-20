import { IBus } from "../utils/command-bus";
import { createBaseController } from "./controller-base";
import { ControllerCommand, CustomParser } from "../types/type";
import { DateRange } from "../utils/event-store";

export type DisableControllerInit = {
    disabledDates?: Array<Date | DateRange | string>;
    customParser?: CustomParser;
}

export const createDisableController = (bus: IBus<ControllerCommand>, init: DisableControllerInit) => {
    const {disabledDates, customParser} = init;
    const basicController = createBaseController(bus, {
        initState: disabledDates,
        customParser
    });

    return {
        isDisabled: basicController.is,
        enableDate: basicController.remove,
        disableDate: basicController.add,
        resetDisabled: basicController.reset,
        getDisabled: basicController.getState,
        disableDateToggle: basicController.toggle,
        onDisableChange: basicController.subscribe
    }
}

export type DisableController = ReturnType<typeof createDisableController>;
