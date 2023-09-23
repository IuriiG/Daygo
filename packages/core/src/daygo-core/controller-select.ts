import { createRangeSelector } from "../utils";
import { createBaseController } from "./controller-base";
import type { ControllerCommand, CustomParser } from "../types/type";
import type { IBus, InitStateDates } from "../utils";

export type SelectControllerInit = {
    readonly selectedDates?: InitStateDates;
    readonly customParser?: CustomParser;
}

export const createSelectController = (bus: IBus<ControllerCommand>, init: SelectControllerInit) => {
	const { selectedDates, customParser } = init;
	const { updateSelector, activateSelector } = createRangeSelector();

	const { bind, ...basicController } = createBaseController(bus, {
		initState: selectedDates,
		customParser
	});

	return {
		isSelected: basicController.is,
		selectDate: basicController.replace,
		unselectDate: basicController.remove,
		unselectAll: basicController.clear,
		getSelected: basicController.getState,
		toggleSelectDate: basicController.toggle,
		selectDateMultiple: basicController.add,
		onSelectChange: basicController.subscribe,
		selectAll: basicController.addAll,
		resetDefaultsSelected: basicController.reset,
		startStopRangeAuto: bind(activateSelector),
		updateRangeAuto: bind(updateSelector)
	};
};

export type SelectController = ReturnType<typeof createSelectController>;
