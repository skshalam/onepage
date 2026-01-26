// MyContextProvider.js
import React, { useState } from 'react';
import ThemeContext from '../Contexts/ThemeContext';

const ThemeProvider = ({ children}) => {
    const [useThemeStyles, setUseThemeStyles] = useState({})

    return (
        <ThemeContext.Provider value={{ useThemeStyles, setUseThemeStyles }}>
            <div
                className="theme-provider"
                style={{
                    '--primary-color': useThemeStyles?.primary_color,
                    '--secondary-color': useThemeStyles?.secondary_color,
                    '--primary-font-color': useThemeStyles?.font_primary_color,
                    '--secondary-font-color': useThemeStyles?.font_secondary_color,
                }}
            >
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

export { ThemeProvider };
