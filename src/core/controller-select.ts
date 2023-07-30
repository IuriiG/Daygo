import { IBus } from "../utils/command-bus";
import { createRangeSelector } from "../utils/select-range";
import { createBaseController } from "./controller-base";
import { ControllerCommand, CustomParser } from "../types/type";
import { DateRange } from "../utils/event-store";

export type SelectControllerInit = {
    selectedDates?: Array<Date | DateRange | string>;
    customParser?: CustomParser;
}

export const createSelectController = (bus: IBus<ControllerCommand>, init: SelectControllerInit) => {
    const { selectedDates, customParser } = init;
    const { updateSelector, activateSelector } = createRangeSelector();

    const {bind, ...basicController} = createBaseController(bus, {
        initState: selectedDates,
        customParser
    });

    return {
        isSelected: basicController.is,
        selectDate: basicController.replace,
        unselectDate: basicController.remove,
        resetSelected: basicController.reset,
        getSelected: basicController.getState,
        toggleSelectDate: basicController.toggle,
        selectDateMultiple: basicController.add,
        removeSelectEvent: basicController.removeEvent,
        publishSelectEvent: basicController.publishEvent,
        onSelectChange: basicController.subscribe,
        startStopRangeAuto: bind(activateSelector),
        updateRangeAuto: bind(updateSelector)
    }
}

export type SelectController = ReturnType<typeof createSelectController>;