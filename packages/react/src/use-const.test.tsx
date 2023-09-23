import { renderHook } from '@testing-library/react';
import { useConst } from './use-const';

describe('useConst', () => {
	it('Should return the same value', async () => {
		const object = {};

		const { result } = renderHook(() => useConst(object));
		expect(result.current).toBe(object);

		const { result: result2 } = renderHook(() => useConst(() => object));
		expect(result2.current).toBe(object);
	});

	it('Should retutn the same instance', async () => {
		const { result, rerender } = renderHook(() => useConst(() => new Date('2023-01-01')));
		const prevRenderResult = result.current;

		rerender();

		expect(result.current).toBe(prevRenderResult);
	});
});
