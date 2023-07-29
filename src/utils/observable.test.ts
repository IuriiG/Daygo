import { createObservable } from "./observable"
import { call, flushPromises } from "./test-utils";

describe('Utils: observable', () => {
    it('Create observable', async () => {
        const observable = createObservable();

        expect(observable).toBeDefined();

        const subscriber1 = vi.fn();
        const subscriber2 = vi.fn();

        const disposer1 = observable.subscribe(subscriber1);

        expect(disposer1).toBeDefined();
        expect(disposer1).toBeInstanceOf(Function);

        observable.notify();

        await flushPromises();

        expect(subscriber1).toHaveBeenCalledTimes(1);

        call(observable.notify, 10);

        await flushPromises();

        expect(subscriber1).toHaveBeenCalledTimes(2);

        const disposer2 = observable.subscribe(subscriber2);
        
        expect(disposer1).toBeDefined();
        expect(disposer1).toBeInstanceOf(Function);

        call(observable.notify, 10);

        await flushPromises();

        expect(subscriber1).toHaveBeenCalledTimes(3);
        expect(subscriber2).toHaveBeenCalledTimes(1);

        disposer1();

        call(observable.notify, 10);

        await flushPromises();

        expect(subscriber1).toHaveBeenCalledTimes(3);
        expect(subscriber2).toHaveBeenCalledTimes(2);

        disposer2();

        call(observable.notify, 10);

        await flushPromises();

        expect(subscriber1).toHaveBeenCalledTimes(3);
        expect(subscriber2).toHaveBeenCalledTimes(2);
    })
})