import { IBus, DateRange } from "../utils";
import { createBaseController } from "./controller-base";
import { ControllerCommand, CustomParser } from "../types/type";

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
        enableAll: basicController.reset,
        getDisabled: basicController.getState,
        disableDateToggle: basicController.toggle,
        onDisableChange: basicController.subscribe,
        disableAll: basicController.addAll
    }
}

export type DisableController = ReturnType<typeof createDisableController>;
