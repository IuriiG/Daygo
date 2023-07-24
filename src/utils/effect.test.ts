import { createEffect } from "./effect";
import { flushPromises } from "./test-utils";

describe('Create effect', () => {
    it ('createEffect', async () => {
        const cb = vi.fn();
        const effect = createEffect(cb);

        effect();

        await flushPromises();

        expect(cb).toHaveBeenCalledTimes(1);

        Array.from({length: 10}, effect);

        await flushPromises();

        expect(cb).toHaveBeenCalledTimes(2);
    });
});
