import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

const Input = ({ value, onChange, label, placeholder, type, name, required }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div className='mt-3 mb-3'>
            <label className="text-[13px] text-gray-300">{label}</label>
            <div className="input-box flex items-center bg-gray-800 rounded px-2 py-1 mt-2">
                <input
                    type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    required={required}
                    className='w-full bg-transparent outline-none text-gray-100 placeholder-gray-500 p-1'
                />
                {type === 'password' && (
                    <>
                        {
                            showPassword
                                ? <FaRegEyeSlash
                                    size={22}
                                    className='text-violet-400 cursor-pointer ml-2'
                                    onClick={toggleShowPassword}
                                />
                                : <FaRegEye
                                    size={22}
                                    className='text-gray-400 cursor-pointer ml-2'
                                    onClick={toggleShowPassword}
                                />
                        }
                    </>
                )}
            </div>
        </div>
    )
}

export default Input;