import {
    LuCar,
    LuUsers,
    LuClipboard,
    LuLogOut,
    LuLayoutDashboard,
    LuOctagon,
    LuReceipt,
    LuMapPin,
    LuHeart,
} from 'react-icons/lu';

export const SIDE_MENU_DATA = [
    {
        id: '01',
        label: 'Dashboard',
        icon: LuLayoutDashboard,
        path: '/dashboard',
    },
    {
        id: '02',
        label: 'Clients',
        icon: LuUsers,
        path: '/clients',
    },
    {
        id: '03',
        label: 'Voitures',
        icon: LuCar,
        path: '/cars',
    },
    {
        id: '04',
        label: 'Ventes',
        icon: LuOctagon,
        path: '/sales',
    },
    {
        id: '05',
        label: 'Commandes',
        icon: LuClipboard,
        path: '/orders',
    },
    {
        id: '06',
        label: 'Achats',
        icon: LuReceipt,
        path: '/achats',
    },
    {
        id: '07',
        label: 'Locations',
        icon: LuMapPin,
        path: '/locations',
    },
    {
        id: '08',
        label: 'Favoris',
        icon: LuHeart,
        path: '/favorites',
    },
    {
        id: '09',
        label: 'Déconnexion',
        icon: LuLogOut,
        path: 'logout',
    }
];
