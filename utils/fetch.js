const fetchData = async (url, token) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar dados');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        throw error;
    }
};

export { fetchData };
