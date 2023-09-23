import { renderHook } from '@testing-library/react';
import { useDatePicker } from './use-date-picker';

describe('useDatePicker', () => {
	it('Should return instance of date picker', () => {
		const { result } = renderHook(() => useDatePicker());

		expect(result.current).toBeDefined();
		expect(result.current.subscribe).toBeDefined();
		expect(result.current.controller).toBeDefined();
		expect(result.current.focusedDate).toBeDefined();
		expect(result.current.getSnapshot).toBeDefined();
		expect(result.current.useController).toBeDefined();
		expect(result.current.useController).toBeDefined();
	});
});
