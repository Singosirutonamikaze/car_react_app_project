import React, { Children, Component } from 'react'
import { VscChromeClose } from "react-icons/vsc";

class Model extends Component {
    render() {
        const { isOpen, onClose, title, children } = this.props;
        if (!isOpen) {
            return null;
        }
        return (
            <div className='fixed top-0 right-0 left-0 z-50 flex items-center justify-center h-screen w-full bg-[#5c565693] overflow-y-auto'>
                <div className='relative p-4 w-full max-w-2xl max-h-full'>
                    <div className='relative bg-[#010B18]/70 backdrop-blur-xl rounded-lg shadow-sm'>
                        <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-200 border-gray-200'>
                            <h3 className='text-lg font-medium text-gray-100'>
                                {title}
                            </h3>
                            <button
                                type='button'
                                onClick={onClose}
                                className='text-gray-900 bg-transparent h-14 w-14 hover:bg-[#8329f13d] rounded-lg text-sm p-1.5 ml-auto inline-flex justify-center items-center dark:hover:bg-[#8329f13d] dark:hover:text-white font-bold'
                            >
                                <VscChromeClose className='text-gray-700' />
                            </button>
                        </div>
                        <div className='p-4 md:p-5 space-y-4'>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Model;
