import { today } from "../utils/date";
import { flushPromises } from "../utils/test-utils";
import { type IBus, SharedCommand } from "../utils/command-bus";
import { createDisableController } from "./controller-disable";
import type { ControllerCommand } from "../types/type";

describe('Core: controller disable', () => {
	it('createDisableController', async () => {
		const send = vi.fn();
		const bus = { send } as unknown as IBus<ControllerCommand>;
		const updateCommand = { type: SharedCommand.UPDATE };

		const disableController = createDisableController(bus, {});

		disableController.disableDate(today());

		await flushPromises();

		expect(send).toHaveBeenCalledTimes(1);
		expect(send).toHaveBeenCalledWith(updateCommand);

		disableController.disableDate('2023-01-01');

		await flushPromises();

		expect(send).toHaveBeenCalledTimes(2);
		expect(send).toHaveBeenCalledWith(updateCommand);
	});
});
