import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Workout } from '../../../models/Workout';
import WorkoutListItem from '../WorkoutListItem';

describe('WorkoutListItem', () => {
  let mockIsAndroid21 = true;
  let workoutItem: Workout;

  beforeEach(() => {
    jest.mock('../../../hooks/usePlatformInfo', () => {
      return jest.fn(() => ({ isAndroid21: mockIsAndroid21 }));
    });
    workoutItem = {
      title: 'Test workout',
      description: 'Description is here',
    } as Workout;
  });

  test('render workout title and description', () => {
    const mockClickStart = jest.fn();
    const mockClickDetails = jest.fn();
    const mockDelete = jest.fn();

    const { getByText } = render(
      <WorkoutListItem
        item={workoutItem}
        clickStart={mockClickStart}
        clickDetails={mockClickDetails}
        delete={mockDelete}
      />
    );

    expect(getByText('Test workout')).toBeTruthy();
    expect(getByText('Description is here')).toBeTruthy();
  });

  test('render start and delete buttons', () => {
    const mockClickStart = jest.fn();
    const mockClickDetails = jest.fn();
    const mockDelete = jest.fn();

    const { getAllByA11yLabel } = render(
      <WorkoutListItem
        item={workoutItem}
        clickStart={mockClickStart}
        clickDetails={mockClickDetails}
        delete={mockDelete}
      />
    );

    expect(getAllByA11yLabel('workout item')).toBeTruthy();
    expect(getAllByA11yLabel('play button')).toBeTruthy();
    expect(getAllByA11yLabel('delete button')).toBeTruthy();
  });
});
