import { IBus } from "../utils/command-bus";
import { createRangeSelector } from "../utils/select-range";
import { createBasicController } from "./controller-basic";
import { ControllerCommand } from "../types/type";
import { DateRange } from "../utils/event-store";

export type SelectControllerInit = {
    selectedDates?: Array<Date | DateRange | string>;
    customParser?: (date: string) => Date;
}

export const createSelectController = (bus: IBus<ControllerCommand>, init: SelectControllerInit) => {
    const {selectedDates, customParser} = init;
    const {
        updateSelector,
        updateSelectorBegin,
        updateSelectorEnd,
        updateSelectorFull,
        activateSelector,
        resetSelector
    } = createRangeSelector();

    const {bind, ...basicController} = createBasicController(bus, {
        initState: selectedDates,
        customParser
    });

    return {
        isSelected: basicController.is,
        selectDate: basicController.add, // equivalent to updateRange
        unselectDate: basicController.remove,
        resetSelected: basicController.reset, // reset also range (resetRange)
        getSelected: basicController.getState,
        toggleSelectDate: basicController.toggle, // maybe need to add not only 'from', also 'to'
        selectDateMultiple: basicController.replace,
        removeSelectEvent: basicController.removeEvent,
        publishSelectEvent: basicController.publishEvent,
        onSelectChange: basicController.subscribe,
        startStopRangeAuto: bind(activateSelector),
        updateRangeAuto: bind(updateSelector),
        updateRangeBegin: bind(updateSelectorBegin), // maybe it is not necessery, cause selectDate can create static range
        updateRangeEnd: bind(updateSelectorEnd), // maybe it is not necessery, cause selectDate can create static range
        updateRange: bind(updateSelectorFull), // maybe it is not necessery, cause selectDate can create static range
        resetRange: bind(resetSelector) // maybe it is not necessery, cause selectDate can create static range
    }
}

export type SelectController = ReturnType<typeof createSelectController>;