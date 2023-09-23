import { createShare } from "./share";

describe('Utils: share', () => {
	it ('createShare', () => {
		const share = createShare();

		const subscriber1 = vi.fn();
		const subscriber2 = vi.fn();

		share.subscribe(subscriber1);

		const data1 = 'data1';
		const data2 = 'data2';
		const data3 = 'data3';

		share.next(data1);

		expect(subscriber1).toHaveBeenCalledTimes(1);
		expect(subscriber1).toHaveBeenCalledWith(data1);

		const disposer = share.subscribe(subscriber2);
		share.next(data2);

		expect(subscriber1).toHaveBeenCalledTimes(1);
		expect(subscriber1).not.toHaveBeenCalledWith(data2);
		expect(subscriber2).toHaveBeenCalledTimes(1);
		expect(subscriber2).toHaveBeenCalledWith(data2);

		disposer();

		share.next(data3);

		expect(subscriber1).not.toHaveBeenCalledWith(data3);
		expect(subscriber2).not.toHaveBeenCalledWith(data3);
	});
});
