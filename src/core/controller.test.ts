import { CustomParser } from "../types/type";
import { toDate } from "../utils/date";
import { flushPromises } from "../utils/test-utils";
import { Controller, ControllerConfig, ControllerWithBus, createController } from "./controller";

describe('Core: controller', () => {
    let controller: Controller;
    let config: ControllerConfig;
    let customParser: CustomParser;

    beforeEach(() => {
        customParser = vi.fn((date: string) => toDate(date));

        config = {
            selectedDates: ['2023-01-02'],
            disabledDates: ['2023-01-03'],
            customParser
        }

        controller = createController(config);
    });

    it ('createController: methods to be defined', () => {
        expect(controller.getState).toBeDefined();
        expect(controller.disableDate).toBeDefined();
        expect(controller.disableDateToggle).toBeDefined();
        expect(controller.enableDate).toBeDefined();
        expect(controller.focusDate).toBeDefined();
        expect(controller.focusMonth).toBeDefined();
        expect(controller.focusNextMonth).toBeDefined();
        expect(controller.focusNextYear).toBeDefined();
        expect(controller.focusPrevMonth).toBeDefined();
        expect(controller.focusPrewYear).toBeDefined();
        expect(controller.focusToday).toBeDefined();
        expect(controller.focusYear).toBeDefined();
        expect(controller.getConfig).toBeDefined();
        expect(controller.getDisabled).toBeDefined();
        expect(controller.getSelected).toBeDefined();
        expect(controller.isDisabled).toBeDefined();
        expect(controller.isSelected).toBeDefined();
        expect(controller.onDisableChange).toBeDefined();
        expect(controller.onFocusChange).toBeDefined();
        expect(controller.onSelectChange).toBeDefined();
        expect(controller.enableAll).toBeDefined();
        expect(controller.unselectAll).toBeDefined();
        expect(controller.selectDate).toBeDefined();
        expect(controller.selectDateMultiple).toBeDefined();
        expect(controller.startStopRangeAuto).toBeDefined();
        expect(controller.toggleSelectDate).toBeDefined();
        expect(controller.unselectDate).toBeDefined();
        expect(controller.updateRangeAuto).toBeDefined();
        expect((controller as ControllerWithBus).$$bus).toBeDefined();
    });

    it ('createController', async () => {
        const focusSubscriber = vi.fn();
        const selectSubscriber = vi.fn();
        const disableSubscriber = vi.fn();

        controller.onFocusChange(focusSubscriber);
        controller.onSelectChange(selectSubscriber);
        controller.onDisableChange(disableSubscriber);

        controller.focusNextYear();

        await flushPromises();

        expect(focusSubscriber).toHaveBeenCalledTimes(1);
        expect(selectSubscriber).toHaveBeenCalledTimes(0);
        expect(disableSubscriber).toHaveBeenCalledTimes(0);

        expect(focusSubscriber).toHaveBeenCalledWith(controller);

        controller.selectDateMultiple('2023-01-01');

        await flushPromises();

        expect(focusSubscriber).toHaveBeenCalledTimes(1);
        expect(selectSubscriber).toHaveBeenCalledTimes(1);
        expect(disableSubscriber).toHaveBeenCalledTimes(0);

        expect(selectSubscriber).toHaveBeenCalledWith(controller);

        controller.disableDate('2023-01-01');

        await flushPromises();

        expect(focusSubscriber).toHaveBeenCalledTimes(1);
        expect(selectSubscriber).toHaveBeenCalledTimes(1);
        expect(disableSubscriber).toHaveBeenCalledTimes(1);

        expect(disableSubscriber).toHaveBeenCalledWith(controller);

        expect(controller.getSelected()).toEqual([
            { from: toDate('2023-01-01'), to: toDate('2023-01-01') },
            { from: toDate('2023-01-02'), to: toDate('2023-01-02') }
        ]);

        expect(controller.getDisabled()).toEqual([
            { from: toDate('2023-01-01'), to: toDate('2023-01-01') },
            { from: toDate('2023-01-03'), to: toDate('2023-01-03') }
        ]);

        expect(controller.getState()).toEqual([
            { from: toDate('2023-01-02'), to: toDate('2023-01-02') }
        ]);

        expect(customParser).toHaveBeenCalledTimes(4);
        expect(customParser).toHaveBeenCalledWith('2023-01-01');
        expect(customParser).toHaveBeenCalledWith('2023-01-02');
        expect(customParser).toHaveBeenCalledWith('2023-01-03');
    });
});
