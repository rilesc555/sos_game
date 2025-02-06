'use client'

import { useState } from 'react';
import LikeButton from './like-button';

function Radio_box() {

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const [selectedOption, setSelectedOption] = useState<string>('');
  return (
      <div className="text-black">
        <div>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="option"
              value="option1"
              checked={selectedOption === 'option1'}
              onChange={handleRadioChange}
            />
            <span className="ml-2">Easy</span>
          </label>
        </div>
        <div>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="option"
              value="option2"
              checked={selectedOption === 'option2'}
              onChange={handleRadioChange}
            />
            <span className="ml-2">Medium</span>
          </label>
        </div>
        <div>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="option"
              value="option3"
              checked={selectedOption === 'option3'}
              onChange={handleRadioChange}
            />
            <span className="ml-2">Hard</span>
          </label>
        </div>
      </div>
  );
}

function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <h1 className="text-2xl">SOS Game</h1>
    </header>
  );
}

function Game_grid() {
  return (
    <div className="grid grid-cols-3">
      <div className="p-4 border-2 border-black"></div>
      <div className="p-4 border-2 border-black"></div>
      <div className="p-4 border-2 border-black"></div>
      <div className="p-4 border-2 border-black"></div>
      <div className="p-4 border-2 border-black"></div>
      <div className="p-4 border-2 border-black"></div>
      <div className="p-4 border-2 border-black"></div>
      <div className="p-4 border-2 border-black"></div>
      <div className="p-4 border-2 border-black"></div>
    </div>
  );
}
 
export default function App() {

  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="grid items-center justify-center">
      <Header />
      <Game_grid />
      <div className="grid grid-cols-1 gap-4 p-6 bg-white rounded shadow-md">
        <Radio_box />
        <div>
          <label className="inline-flex items-center text-black">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <span className="ml-2">Save Game</span>
          </label>
        </div>
      </div>
      </div>
    </div>
  );
}