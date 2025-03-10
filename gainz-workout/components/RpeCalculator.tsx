import React, { useState } from 'react';
import { BaseCalculator, InputField } from './BaseCalculator';

export function RpeCalculator(): JSX.Element {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('');
  const [estimated1RM, setEstimated1RM] = useState(0);

  const calculate1RM = () => {
    const weightNum = parseFloat(weight);
    const repsNum = parseFloat(reps);
    const rpeNum = parseFloat(rpe);
    if (
      !isNaN(weightNum) &&
      !isNaN(repsNum) &&
      !isNaN(rpeNum) &&
      repsNum > 0 &&
      rpeNum >= 6 &&
      rpeNum <= 10
    ) {
      // Adjust reps for RPE using a correction factor
      const adjustedReps = repsNum + (10 - rpeNum);
      // The formula: 1RM = weight / (1.0278 - 0.0278 * adjustedReps)
      const oneRepMax = weightNum / (1.0278 - 0.0278 * adjustedReps);
      setEstimated1RM(oneRepMax);
    } else {
      setEstimated1RM(0);
    }
  };

  const inputFields: InputField[] = [
    {
      label: 'Weight',
      value: weight,
      placeholder: 'Enter weight',
      keyboardType: 'numeric',
      onChangeText: setWeight,
    },
    {
      label: 'Reps',
      value: reps,
      placeholder: 'Enter reps',
      keyboardType: 'numeric',
      onChangeText: setReps,
    },
    {
      label: 'RPE',
      value: rpe,
      placeholder: 'Enter RPE (6-10)',
      keyboardType: 'numeric',
      onChangeText: setRpe,
    },
  ];

  return (
    <BaseCalculator
      title="1RM Calculator (Weight, Reps & RPE)"
      inputFields={inputFields}
      onCalculate={calculate1RM}
      result={estimated1RM}
      outputText="Estimated RPE"
    />
  );
}
