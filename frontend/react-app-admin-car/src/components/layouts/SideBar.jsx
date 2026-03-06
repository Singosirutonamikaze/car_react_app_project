import React, { useContext, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { SIDE_MENU_DATA } from '../../../utils/data';
import CardAvatar from '../cards/CardAvatar';
import Admin from '../../assets/admin.avif';
import { UserAuthentication } from '../../../hooks/UserAuthentification';
import UserContext from '../../../context/userContext';

const Sidebar = ({ activeMenu: initialActiveMenu }) => {

    const navigate = useNavigate();
    const { user, clearUser } = useContext(UserContext);
    const [activeMenu, setActiveMenu] = useState(initialActiveMenu || 'Dashboard');

    useEffect(() => {
        setActiveMenu(initialActiveMenu || 'Dashboard');
    }, [initialActiveMenu]);

    const handleClick = (route, label) => {
        if (route === 'logout') {
            handleLogout();
        } else {
            setActiveMenu(label);
            navigate(`${route}`);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        if (clearUser) {
            clearUser();
        }
        navigate('/login');
    };

    useEffect(() => {
        gsap.fromTo('.sidebar-container', { x: -300 }, { x: 0, duration: 0.5 });
    }, []);

    const userData = user?.user || user || {};
    const userFullName = userData.name || userData.email || 'Administrateur';
    const userProfileImage = userData.profileImageUrl || Admin;

    return (
        <UserAuthentication>
            <div className={`sidebar-container`} style={{ background: 'var(--glass-bg)', color: 'var(--text-primary)' }}>
                <div className="sidebar-content">
                    <div className="user-section">
                        <div className="user-profile">
                            {userProfileImage ? (
                                <img
                                    src={userProfileImage}
                                    alt='Profile utilisateur'
                                    className="user-avatar-image"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        const fallbackAvatar = document.getElementById('fallbackAvatar');
                                        if (fallbackAvatar) {
                                            fallbackAvatar.style.display = 'flex';
                                        }
                                    }}
                                />
                            ) : (
                                <CardAvatar
                                    id="fallbackAvatar"
                                    fullName={userFullName}
                                    width="w-20"
                                    height="h-20"
                                    style='text-xl'
                                />
                            )}
                            <p className="user-name" style={{ color: 'var(--text-primary)' }}>{userFullName}</p>
                        </div>
                    </div>

                    <nav className="menu-nav">
                        {SIDE_MENU_DATA.map((item, index) => (
                            <button
                                key={`menu-${index}`}
                                className={`menu-item ${activeMenu === item.label ? 'active' : ''}`}
                                onClick={() => handleClick(item.path, item.label)}
                                style={{
                                    background: activeMenu === item.label ? 'var(--accent-violet)' : 'transparent',
                                    color: activeMenu === item.label ? 'white' : 'var(--text-secondary)',
                                }}
                            >
                                <item.icon className="menu-icon" />
                                <span className="menu-label">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="sidebar-overlay" style={{ background: 'var(--glass-bg)' }}></div>
            </div>
        </UserAuthentication>
    );
};

export default Sidebar;