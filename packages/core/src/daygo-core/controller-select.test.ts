import { today } from "../utils/date";
import { flushPromises } from "../utils/test-utils";
import { SharedCommand } from "./controller-base";
import { createSelectController } from "./controller-select";
import type { IBus } from "../utils/command-bus";
import type { ControllerCommand } from "../types/type";

describe('Core: controller select', () => {
	it('createSelectController', async () => {
		const send = vi.fn();
		const bus = { send } as unknown as IBus<ControllerCommand>;
		const updateCommand = { type: SharedCommand.UPDATE };

		const selectController = createSelectController(bus, {});

		selectController.selectDate(today());

		await flushPromises();

		expect(send).toHaveBeenCalledTimes(1);
		expect(send).toHaveBeenCalledWith(updateCommand);

		selectController.selectDate('2023-01-01');

		await flushPromises();

		expect(send).toHaveBeenCalledTimes(2);
		expect(send).toHaveBeenCalledWith(updateCommand);
	});
});
