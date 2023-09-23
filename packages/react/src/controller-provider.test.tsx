import React from 'react';
import { createController } from "@daygo/core";
import { renderHook } from '@testing-library/react';
import { ControllerProvider, useController } from './controller-provider';

describe('Controller provider', () => {
	it('Should provide the controller instance by react context', async () => {
		const selectedDate = '2023-01-02';
		const disabledDate = '2023-01-03';

		const initConfig = {
			selectedDates: [selectedDate],
			disabledDates: [disabledDate]
		};
		const globalController = createController(initConfig);

		// @ts-ignore
		const wrapper = ({ children }) => (
			<ControllerProvider controller={globalController}>
				{children}
			</ControllerProvider>
		);

		const { result } = renderHook(() => useController(), { wrapper });

		expect(result.current).toBe(globalController);
		expect(result.current.getConfig()).toEqual(initConfig);
		expect(result.current.getSelected()).toEqual(globalController.getSelected());
		expect(result.current.getSelected()).toEqual(globalController.getSelected());
	});
});
