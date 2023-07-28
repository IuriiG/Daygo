import { call, flushPromises } from "./test-utils";

describe('Test utils', () => {
    it('Call: should call a function the specified number of times', () => {
        const cb1 = vi.fn();
        const cb2 = vi.fn();

        call(cb1);
        call(cb2, 10);

        expect(cb1).toHaveBeenCalledTimes(1);
        expect(cb2).toHaveBeenCalledTimes(10);
    });

    it('Flush promises: should flush promises', async () => {
        let a = 0;
        let b = 0;

        Promise.resolve()
            .then(() => {
                a = 1;
            })
            .then(() => {
                b = 2;
            });

        await flushPromises();

        expect(a).toBe(1);
        expect(b).toBe(2);
    })
})