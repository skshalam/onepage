// MyContextProvider.js
import React, { useState } from 'react';
import TestContext from '../Contexts/TestContext';

const TestProvider = ({ children }) => {
    const [value, setValue] = useState('');
    console.log(value);
    return (
        <TestContext.Provider value={{ value, setValue }}>
            {children}
        </TestContext.Provider>
    );
};

export { TestProvider };
