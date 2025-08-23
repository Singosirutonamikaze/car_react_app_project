import React, { Component } from 'react';

class CardAvatar extends Component {
    render() {
        const { fullName = '', width = 'w-20', height = 'h-20', style = 'text-xl' } = this.props;
        
        // Calculez les initiales directement dans le composant
        let initials = '';
        if (fullName) {
            const names = fullName.trim().split(' ').filter(n => n.length > 0);
            for (let i = 0; i < names.length; i++) {
                if (names[i] && names[i][0]) {
                    initials += names[i][0].toUpperCase();
                }
            }
        }
        
        // Utilisez console.log pour déboguer
        console.log("ChartAvatar fullName:", fullName);
        console.log("ChartAvatar initials:", initials);
        
        return (
            <div className={`${width} ${height} ${style} rounded-full text-gray-900 font-medium bg-purple-200 flex items-center justify-center border border-violet-500`}>
                {initials}
            </div>
        );
    }
}

export default CardAvatar;
