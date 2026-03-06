import React, { Component } from 'react';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import SideBar from './SideBar';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openSideMenu: false,
        };
    }

    render() {
        const { openSideMenu } = this.state;

        return (
            <>
                <div className="sticky top-0 z-50 flex items-center gap-5 px-7 py-4 h-16"  style={{ background: 'var(--glass-bg)', color: 'var(--text-primary)' }}>

                    <button
                        className="lg:hidden flex items-center justify-center w-12 h-12 
                                 rounded-xl bg-slate-100/10 border border-slate-100/20
                                 text-slate-100 hover:bg-violet-600/20 hover:border-violet-400/30
                                 hover:scale-105 active:scale-95 transition-all duration-200
                                 backdrop-blur-sm shadow-lg"
                        onClick={() =>
                            this.setState({
                                openSideMenu: !openSideMenu
                            })
                        }
                    >
                        {openSideMenu ? (
                            <HiOutlineX className="text-2xl" />
                        ) : (
                            <HiOutlineMenu className="text-2xl" />
                        )}
                    </button>
                    
                    <div className="relative">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-slate-100 via-violet-200 to-violet-400 
                                     bg-clip-text text-transparent drop-shadow-lg">
                            CarsHub
                        </h2>
                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-violet-400 
                                      rounded-lg blur opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                    </div>

                    <div className="flex-1"></div>

                    <div className="hidden lg:flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-violet-600 
                                      flex items-center justify-center shadow-lg shadow-violet-500/25
                                      hover:shadow-violet-500/40 transition-shadow duration-200">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-[#010B18]/5 via-transparent to-violet-600/5 pointer-events-none"></div>
                </div>

                {openSideMenu && (
                    <>

                        <div
                            className="fixed inset-0 bg-[#010B18]/60 backdrop-blur-sm z-40 
                                     animate-in fade-in duration-200 lg:hidden"
                            onClick={() => this.setState({ openSideMenu: false })}
                        />

                        <div className="fixed top-16 left-0 w-80 max-w-[90vw] h-[calc(100vh-4rem)] z-50 
                                      bg-[#010B18]/80 backdrop-blur-xl border-r border-slate-100/10
                                      shadow-2xl shadow-black/40 animate-in slide-in-from-left duration-300 lg:hidden
                                      rounded-r-2xl overflow-hidden">

                            <div className="absolute inset-0 bg-gradient-to-br from-[#010B18]/70 via-[#010B18]/60 to-violet-900/20"></div>

                            <div className="relative z-10 h-full">
                                <SideBar activeMenu={this.props.activeMenu} />
                            </div>

                            <div className="absolute inset-0 rounded-r-2xl border border-slate-100/10 pointer-events-none"></div>
                        </div>
                    </>
                )}
            </>
        );
    }
}

export default Navbar;