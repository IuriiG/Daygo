import { createCommandBus } from "./command-bus";
import { flushPromises } from "./test-utils";

describe('Utils: command-bus', () => {
    it ('createCommandBus', async () => {
        const bus = createCommandBus();

        const subscriber1 = vi.fn();
        const subscriber2 = vi.fn();
        const subscriber3 = vi.fn();

        bus.subscribe(subscriber1);
        bus.subscribe(subscriber2);
        bus.subscribe(subscriber3);

        const command1 = 'command1';
        const command2 = 'command2';
        const command3 = 'command3';

        bus.send(command1);

        await flushPromises();

        expect(subscriber1).toHaveBeenCalledTimes(1);
        expect(subscriber2).toHaveBeenCalledTimes(1);
        expect(subscriber3).toHaveBeenCalledTimes(1);

        expect(subscriber1).toHaveBeenCalledWith(command1);
        expect(subscriber2).toHaveBeenCalledWith(command1);
        expect(subscriber3).toHaveBeenCalledWith(command1);

        bus.send(command2);
        bus.send(command3);

        await flushPromises();

        expect(subscriber1).toHaveBeenCalledTimes(3);
        expect(subscriber2).toHaveBeenCalledTimes(3);
        expect(subscriber3).toHaveBeenCalledTimes(3);

        expect(subscriber1).toHaveBeenCalledWith(command2);
        expect(subscriber1).toHaveBeenCalledWith(command3);
        expect(subscriber2).toHaveBeenCalledWith(command2);
        expect(subscriber2).toHaveBeenCalledWith(command3);
        expect(subscriber3).toHaveBeenCalledWith(command2);
        expect(subscriber3).toHaveBeenCalledWith(command3);
    })
})