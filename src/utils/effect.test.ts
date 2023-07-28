import { createEffect } from "./effect";
import { call, flushPromises } from "./test-utils";

describe('Create effect', () => {
    it ('createEffect', async () => {
        const cb = vi.fn();
        const effect = createEffect(cb);

        effect();

        await flushPromises();

        expect(cb).toHaveBeenCalledTimes(1);

        call(effect, 10);

        await flushPromises();

        expect(cb).toHaveBeenCalledTimes(2);
    });
});
