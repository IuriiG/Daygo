import { renderHook } from '@testing-library/react';
import { createController } from '@daygo/core';
import { useCreateController } from './use-create-controller';

describe('useCreateController', () => {
	it('Should return instance of controller', async () => {
		const controller = createController();
		const { result, rerender } = renderHook(() => useCreateController());
		expect(JSON.stringify(result.current)).toEqual(JSON.stringify(controller));
		const prevRenderResult = result.current;

		rerender();

		expect(result.current).toBe(prevRenderResult);
		expect(JSON.stringify(result.current)).toEqual(JSON.stringify(controller));
	});

	it('Should pass initial state', async () => {
		const initConfig = { selectedDates: ['2023-01-01'], disabledDates: ['2023-01-02'] };
		const { result } = renderHook(() => useCreateController(initConfig));

		const controller = result.current;
		expect(controller.getConfig()).toEqual(initConfig);
	});
});
