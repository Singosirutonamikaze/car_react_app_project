export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const addThousandSeparator = (num) => {
    if (num === null || num === undefined || Number.isNaN(num)) {
        return '0';
    }

    const [integerPart, fractionalPart] = num.toString().split('.');
    const formattedIntegerPart = integerPart.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');

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
