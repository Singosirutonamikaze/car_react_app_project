import React, { useEffect } from 'react';
import { LuUser, LuMail, LuCalendar, LuTrash2 } from 'react-icons/lu';
import gsap from 'gsap';
import { FaEdit } from 'react-icons/fa';

function ClientInfoCard({
    client,
    onEdit,
    onDelete,
    hideActions = false
}) {
    const {
        name = '',
        surname = '',
        email = '',
        profileImageUrl = null,
        createdAt = ''
    } = client || {};

    useEffect(() => {
        gsap.fromTo(
            '.client-card',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
        );
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'Date inconnue';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="group relative flex items-start justify-center gap-4 p-4 mt-3 rounded-lg border border-gray-200 bg-[linear-gradient(135deg, #010B18 0%, rgba(1,11,24,0.95) 50%, rgba(1,11,24,0.90) 100%)] hover:shadow-md transition-all duration-300 client-card">
            <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center text-xl text-white bg-blue-500 rounded-full overflow-hidden shadow-sm">
                {profileImageUrl ? (
                    <img
                        src={profileImageUrl}
                        alt={`${name} ${surname}`}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
                        <span className="text-lg font-semibold">
                            {name && surname ? `${name[0]}${surname[0]}` : <LuUser size={20} />}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                    <div className="pr-4 items-center h-full">
                        <h3 className="text-lg font-semibold text-gray-800 truncate text-center">
                            {name} {surname}
                        </h3>
                    </div>

                    <div className="mt-2 space-y-1.5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <LuMail size={16} className="text-blue-500 flex-shrink-0" />
                            <span className="truncate">{email}</span>
                        </div>

                        {createdAt && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <LuCalendar size={16} className="text-gray-400 flex-shrink-0" />
                                <span>Inscrit le {formatDate(createdAt)}</span>
                            </div>
                        )}
                    </div>

                    {!hideActions && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                            <button
                                onClick={() => onEdit(client)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                aria-label="Modifier"
                            >
                                <FaEdit size={18} />
                            </button>
                            <button
                                onClick={() => onDelete(client)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                aria-label="Supprimer"
                            >
                                <LuTrash2 size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ClientInfoCard;