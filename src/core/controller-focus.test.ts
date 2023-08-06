/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mock } from "vitest";
import { ControllerCommand } from "../types/type";
import { IBus } from "../utils/command-bus";
import { toDate, today } from "../utils/date";
import { flushPromises } from "../utils/test-utils";
import { createFocusAction, createFocusController } from "./controller-focus";

describe('Core: controller focus', () => {
    let bus: IBus<ControllerCommand>;
    let send: Mock<any, any>;
    let customParser: Mock<[date: string], Date>;

    beforeEach(() => {
        send = vi.fn();
        customParser = vi.fn((date: string) => toDate(date));
        bus = { send } as unknown as IBus<ControllerCommand>;
    });

    it('createFocusAction', async () => {
        const bindCommand = createFocusAction(bus, customParser);
        const focusDate = bindCommand('FOCUS_DATE');

        focusDate('2023-01-01');

        await flushPromises();

        expect(send).toHaveBeenCalledTimes(1);
        expect(send).toHaveBeenCalledWith({
            type: 'FOCUS_DATE',
            payload: toDate('2023-01-01')
        });

        focusDate(today());

        await flushPromises();

        expect(send).toHaveBeenCalledTimes(2);
        expect(send).toHaveBeenCalledWith({
            type: 'FOCUS_DATE',
            payload: today()
        });

        const focusToday = bindCommand('FOCUS_TODAY');

        focusToday();

        await flushPromises();

        expect(send).toHaveBeenCalledTimes(3);
        expect(send).toHaveBeenCalledWith({
            type: 'FOCUS_TODAY',
            payload: undefined
        });

        const focusNextMonth = bindCommand('FOCUS_NEXT_MONTH');

        focusNextMonth(2);

        await flushPromises();

        expect(send).toHaveBeenCalledTimes(4);
        expect(send).toHaveBeenCalledWith({
            type: 'FOCUS_NEXT_MONTH',
            payload: 2
        });

        focusNextMonth();

        await flushPromises();

        expect(send).toHaveBeenCalledTimes(5);
        expect(send).toHaveBeenCalledWith({
            type: 'FOCUS_NEXT_MONTH',
            payload: undefined
        });
    });

    it('createFocusController', async () => {
        const focusController = createFocusController(bus, customParser);

        focusController.focusDate(today());

        await flushPromises();

        expect(send).toHaveBeenCalledTimes(1);
        expect(send).toHaveBeenCalledWith({
            type: 'FOCUS_DATE',
            payload: today()
        });

        focusController.focusDate('2023-01-01');

        await flushPromises();

        expect(send).toHaveBeenCalledTimes(2);
        expect(send).toHaveBeenCalledWith({
            type: 'FOCUS_DATE',
            payload: toDate('2023-01-01')
        });

        focusController.focusMonth(today());

        await flushPromises();

        expect(send).toHaveBeenCalledTimes(3);
        expect(send).toHaveBeenCalledWith({
            type: 'FOCUS_MONTH',
            payload: today()
        });

        focusController.focusMonth(4);

        await flushPromises();

        expect(send).toHaveBeenCalledTimes(4);
        expect(send).toHaveBeenCalledWith({
            type: 'FOCUS_MONTH',
            payload: 4
        });

        focusController.focusNextMonth();

        await flushPromises();

        expect(send).toHaveBeenCalledTimes(5);
        expect(send).toHaveBeenCalledWith({
            type: 'FOCUS_NEXT_MONTH',
            payload: undefined
        });

        focusController.focusNextMonth(2);

        await flushPromises();

        expect(send).toHaveBeenCalledTimes(6);
        expect(send).toHaveBeenCalledWith({
            type: 'FOCUS_NEXT_MONTH',
            payload: 2
        });

        focusController.focusNextYear();

        await flushPromises();

        expect(send).toHaveBeenCalledTimes(7);
        expect(send).toHaveBeenCalledWith({
            type: 'FOCUS_NEXT_YEAR',
            payload: undefined
        });

        focusController.focusNextYear(2);

        await flushPromises();

        expect(send).toHaveBeenCalledTimes(8);
        expect(send).toHaveBeenCalledWith({
            type: 'FOCUS_NEXT_YEAR',
            payload: 2
        });

        focusController.focusPrevMonth();

        await flushPromises();

        expect(send).toHaveBeenCalledTimes(9);
        expect(send).toHaveBeenCalledWith({
            type: 'FOCUS_PREV_MONTH',
            payload: undefined
        });

        focusController.focusPrevMonth(2);

        await flushPromises();

        expect(send).toHaveBeenCalledTimes(10);
        expect(send).toHaveBeenCalledWith({
            type: 'FOCUS_PREV_MONTH',
            payload: 2
        });

        focusController.focusPrewYear();

        await flushPromises();

        expect(send).toHaveBeenCalledTimes(11);
        expect(send).toHaveBeenCalledWith({
            type: 'FOCUS_PREW_YEAR',
            payload: undefined
        });

        focusController.focusPrewYear(2);

        await flushPromises();

        expect(send).toHaveBeenCalledTimes(12);
        expect(send).toHaveBeenCalledWith({
            type: 'FOCUS_PREW_YEAR',
            payload: 2
        });

        focusController.focusToday();

        await flushPromises();

        expect(send).toHaveBeenCalledTimes(13);
        expect(send).toHaveBeenCalledWith({
            type: 'FOCUS_TODAY',
            payload: undefined
        });

        focusController.focusYear(today());

        await flushPromises();

        expect(send).toHaveBeenCalledTimes(14);
        expect(send).toHaveBeenCalledWith({
            type: 'FOCUS_YEAR',
            payload: today()
        });

        focusController.focusYear(2023);

        await flushPromises();

        expect(send).toHaveBeenCalledTimes(15);
        expect(send).toHaveBeenCalledWith({
            type: 'FOCUS_YEAR',
            payload: 2023
        });
    });
});
