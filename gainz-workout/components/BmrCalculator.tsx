import React, { useState } from 'react';
import { BaseCalculator, InputField } from './BaseCalculator';

export function BMRCalculator(): JSX.Element {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [bmr, setBmr] = useState(0);

    const calculateBMR = () => {
        const weightNum = parseFloat(weight);
        const heightNum = parseFloat(height);
        const ageNum = parseFloat(age);
        const genderStr = gender.trim().toUpperCase();
        if (!isNaN(weightNum) && !isNaN(heightNum) && !isNaN(ageNum) && (genderStr === 'M' || genderStr === 'F')) {
            let bmrVal = 0;
            if (genderStr === 'M') {
                bmrVal = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
            } else {
                bmrVal = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
            }
            setBmr(bmrVal);
        } else {
            setBmr(0);
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
        {
            label: 'Age',
            value: age,
            placeholder: 'Enter age',
            keyboardType: 'numeric',
            onChangeText: setAge,
        },
        {
            label: 'Gender (M/F)',
            value: gender,
            placeholder: 'Enter M or F',
            keyboardType: 'default',
            onChangeText: setGender,
        },
    ];

    return (
        <BaseCalculator
            title="BMR Calculator"
            inputFields={inputFields}
            onCalculate={calculateBMR}
            result={bmr}
            buttonText="Calculate BMR"
            outputText="Estimated BMR"
        />
    );
}
