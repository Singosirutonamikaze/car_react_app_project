import React, { useEffect } from 'react'
import { LuTrendingUpDown } from "react-icons/lu";
import Vehicule from '../../assets/hero.png';
import gsap from 'gsap';

const AuthLayout = ({ children }) => {

    useEffect(() => {
        const img = document.querySelector('.animate-right-left');
        if (img) {
            gsap.fromTo(
                img,
                { x: -10, opacity: 0.7 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power2.out',
                    repeat: -1,
                    yoyo: true
                }
            );
        }
    }, []);

    return (
        <div className='flex bg-gray-900'>

            <div className='hidden md:block w-1/2 flex-1 h-screen bg-gray-800 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative shadow-none'>
                <div className='w-48 h-48 rounded-[40px] bg-blue-600 absolute -top-7 -right-5' />
                <div className='w-48 h-56 rounded-[40px] border-[20px] border-blue-600 absolute top-[25%] -left-10' />
                <div className='w-48 h-48 rounded-[40px] bg-blue-500 absolute -bottom-7 -right-5' />
                <div className='grid grid-cols-1 z-20 absolute top-16 left-8'>
                    <StatsInfoCard
                        icon={<LuTrendingUpDown />}
                        label="Vérifie et gère tes véhicules de manière simple et efficace."
                        value="430,000"
                        color="bg-blue-500"
                    />
                </div>
                <img
                    src={Vehicule}
                    alt="Card 2"
                    className='w-full lg:w-[90%] absolute bottom-16 left-1/2 transform -translate-x-1/2 shadow-lg shadow-blue-400/15 rounded-3xl border-4 border-blue-500 hover:scale-105 transition-transform duration-300 animate-right-left'
                    style={{
                        boxShadow: '0 8px 32px 0 rgba(0, 123, 255, 0.15)',
                        filter: 'brightness(0.95) contrast(1.05)'
                    }}
                />
            </div>

            <div className='w-screen h-screen md:w-1/2 flex-1 px-12 pt-8 pb-12 bg-gray-900 '>
                <div className='flex items-center justify-between mb-8'>
                    <h2 className='text-lg font-medium text-white'>CarsHub</h2>

                </div>
                {children}
            </div>
        </div>
    )
}

export default AuthLayout;

const StatsInfoCard = ({ icon, label, value, color }) => {
    return (
        <div className="flex gap-6 bg-gray-700 p-4 rounded-xl shadow-md shadow-purple-400/20 border border-gray-600/30 z-10">
            <div className={`w-12 h-12 text-white text-[26px] ${color} flex items-center justify-center rounded-full drop-shadow-xl`}>
                {icon}
            </div>
            <div>
                <h6 className='text-xs text-gray-400 mb-1'>
                    {label}
                </h6>
                <span className='text-[20px] text-white'>{value} frcfa</span>
            </div>
        </div>
    );
}