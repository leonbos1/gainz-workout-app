import React, { useState } from 'react';
import { BaseCalculator, InputField } from './BaseCalculator';

export function RmCalculator(): JSX.Element {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [estimated1RM, setEstimated1RM] = useState(0);

  const calculate1RM = () => {
    const weightNum = parseFloat(weight);
    const repsNum = parseFloat(reps);
    if (!isNaN(weightNum) && !isNaN(repsNum) && repsNum > 0) {
      const oneRepMax = weightNum * (1 + repsNum / 30);
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
  ];

  return (
    <BaseCalculator
      title="RM Calculator"
      inputFields={inputFields}
      onCalculate={calculate1RM}
      result={estimated1RM}
      outputText="Estimated RPE"
    />
  );
}
