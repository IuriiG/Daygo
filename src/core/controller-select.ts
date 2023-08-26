import { IBus, DateRange, createRangeSelector } from "../utils";
import { createBaseController } from "./controller-base";
import { ControllerCommand, CustomParser } from "../types/type";

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
        unselectAll: basicController.reset,
        getSelected: basicController.getState,
        toggleSelectDate: basicController.toggle,
        selectDateMultiple: basicController.add,
        onSelectChange: basicController.subscribe,
        selectAll: basicController.addAll,
        startStopRangeAuto: bind(activateSelector),
        updateRangeAuto: bind(updateSelector)
    }
}

export type SelectController = ReturnType<typeof createSelectController>;