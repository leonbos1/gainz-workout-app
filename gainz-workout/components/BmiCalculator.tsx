import React, { useState } from 'react';
import { BaseCalculator, InputField } from './BaseCalculator';

export function BMICalculator(): JSX.Element {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBmi] = useState(0);

    const calculateBMI = () => {
        const weightNum = parseFloat(weight);
        const heightNum = parseFloat(height);
        if (!isNaN(weightNum) && !isNaN(heightNum) && heightNum > 0) {
            const heightInMeters = heightNum / 100;
            const bmiVal = weightNum / (heightInMeters * heightInMeters);
            setBmi(bmiVal);
        } else {
            setBmi(0);
        }
    };

    const inputFields: InputField[] = [
        {
            label: 'Weight (kg)',
            value: weight,
            placeholder: 'Enter weight in kg',
            keyboardType: 'numeric',
            onChangeText: setWeight,
        },
        {
            label: 'Height (cm)',
            value: height,
            placeholder: 'Enter height in cm',
            keyboardType: 'numeric',
            onChangeText: setHeight,
        },
    ];

    return (
        <BaseCalculator
            title="BMI Calculator"
            inputFields={inputFields}
            onCalculate={calculateBMI}
            result={bmi}
            buttonText="Calculate BMI"
            outputText="Estimated BMI"
        />
    );
}
