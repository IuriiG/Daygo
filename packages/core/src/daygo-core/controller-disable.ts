import { createBaseController } from "./controller-base";
import type { ControllerCommand, CustomParser } from "../types/type";
import type { IBus, InitStateDates } from "../utils";

export type DisableControllerInit = {
    disabledDates?: InitStateDates;
    customParser?: CustomParser;
}

export const createDisableController = (bus: IBus<ControllerCommand>, init: DisableControllerInit) => {
	const { disabledDates, customParser } = init;
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
	};
};

export type DisableController = ReturnType<typeof createDisableController>;
