import React, { createContext, useContext, useState, useEffect } from 'react';

interface EditModeContextType {
  isEditMode: boolean;
}

const EditModeContext = createContext<EditModeContextType>({ isEditMode: false });

export const useEditMode = () => useContext(EditModeContext);

const UNLOCK_CODE = import.meta.env.VITE_UNLOCK_CODE;
const LOCK_CODE = import.meta.env.VITE_LOCK_CODE;

export const EditModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [_, setInputBuffer] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const char = e.key.toLowerCase();
      setInputBuffer(prev => {
        const newBuffer = (prev + char).slice(-Math.max(UNLOCK_CODE.length, LOCK_CODE.length));

        if (newBuffer.endsWith(UNLOCK_CODE)) {
          setIsEditMode(true);
        } else if (newBuffer.endsWith(LOCK_CODE)) {
          setIsEditMode(false);
        }

        return newBuffer;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <EditModeContext.Provider value={{ isEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
};
