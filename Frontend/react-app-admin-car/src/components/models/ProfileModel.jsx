import React, { useRef, useState } from 'react'
import { LuTrash, LuUpload, LuUser } from 'react-icons/lu';

const ProfileModel = (props) => {
    const inputRef = useRef(null);
    const [image, setImage] = useState("");
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);

            //Générer un url 
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);

            if (props.onChange) {
                props.onChange(file);
            }
        }
    };

    const handleRemoveImage = () => {
        setImage("");
        setPreviewUrl(null);
        if (inputRef.current) {
            inputRef.current.value = null;
        }
    };

    const onChooseFile = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    return (
        <div className='flex justify-center mb-6'>
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleFileChange}
                className='hidden'
            />

            {!image ? (
                <div className='w-20 h-20 flex items-center justify-center bg-purple-200 rounded-full cursor-pointer relative'>
                    <LuUser size={30} className='text-violet-500' />
                    <button className='w-8 h-8 flex items-center justify-center bg-violet-800 text-white rounded-full absolute -bottom-1 -right-1' onClick={onChooseFile} type="button">
                        <LuUpload />
                    </button>
                </div>
            ) : (
                <div className='relative'>
                    <img
                        src={previewUrl || URL.createObjectURL(image)}
                        alt="Profile"
                        className='w-20 h-20 rounded-full object-cover'
                    />
                    <button
                        onClick={handleRemoveImage}
                        className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1'
                    >
                        <LuTrash size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProfileModel;
