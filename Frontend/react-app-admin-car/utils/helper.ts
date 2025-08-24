export const validateEmail = (email : string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const addThousandSeparator = (num) => {
    if (num === null || num === undefined || isNaN(num)) {
        return '0';
    }

    const [integerPart, fractionalPart] = num.toString().split('.');
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return fractionalPart
        ? `${formattedIntegerPart}.${fractionalPart}`
        : formattedIntegerPart;
}

export const prepareCommandeBarChartData = (data) => {
    return data.map(item => ({
        client: item.client?.nomComplet || 'Inconnu',
        amount: item.montant || 0,
        month: new Date(item.dateCommande).toLocaleString('default', { month: 'long' }),
    }));
};

