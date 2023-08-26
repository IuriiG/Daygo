/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createStore, flushPromises, toDate, today } from "../utils";
import { SharedCommand, bindAction, createBaseController } from "./controller-base";
import type { Mock } from "vitest";
import type { ControllerCommand } from "../types/type";
import type { IBus } from "../utils";

describe('Core: controller base', () => {
    let customParser: Mock<[date: string], Date>;

    beforeEach(() => {
        customParser = vi.fn((date: string) => toDate(date));
    });

    it('bindAction', () => {
        const store = createStore([]);
        const reducer = vi.fn();

        const bind = bindAction(store, customParser);
        const action = bind(reducer);

        action();

        expect(reducer).toHaveBeenCalledTimes(1);
        expect(reducer).toHaveBeenCalledWith(store);

        // @ts-ignore
        action(null);

        expect(reducer).toHaveBeenCalledTimes(2);
        expect(reducer).toHaveBeenCalledWith(store, null);

        // @ts-ignore
        action(today());

        expect(reducer).toHaveBeenCalledTimes(3);
        expect(reducer).toHaveBeenCalledWith(store, today());
        expect(customParser).toHaveBeenCalledTimes(0);

        // @ts-ignore
        action('2023-01-01');

        expect(reducer).toHaveBeenCalledTimes(4);
        expect(reducer).toHaveBeenCalledWith(store, toDate('2023-01-01'));
        expect(customParser).toHaveBeenCalledTimes(1);
        expect(customParser).toHaveBeenCalledWith('2023-01-01');
    });

    it('createBaseController', async () => {
        const send = vi.fn();
        const bus = { send } as unknown as IBus<ControllerCommand>;

        const controller = createBaseController(bus, { initState: [], customParser });
        const updateCommand = { type: SharedCommand.UPDATE };

        controller.is(new Date());

        expect(send).toHaveBeenCalledTimes(0);

        controller.add(today());

        await flushPromises();

        expect(send).toHaveBeenCalledTimes(1);
        expect(send).toHaveBeenCalledWith(updateCommand);

        controller.add('2023-01-01');
        controller.add('2023-01-02');

        await flushPromises();

        expect(send).toHaveBeenCalledTimes(2);
        expect(send).toHaveBeenCalledWith(updateCommand);
        expect(customParser).toHaveBeenCalledTimes(2);
        expect(customParser).toHaveBeenCalledWith('2023-01-01');
        expect(customParser).toHaveBeenCalledWith('2023-01-02');

        controller.reset();

        await flushPromises();

        expect(send).toHaveBeenCalledTimes(3);
        expect(send).toHaveBeenCalledWith(updateCommand);
        expect(customParser).toHaveBeenCalledTimes(2);
    });
});
