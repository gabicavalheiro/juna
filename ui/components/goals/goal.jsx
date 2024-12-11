import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './metas.module.css'; // Importa o CSS como um módulo
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // Ícone para premiação
import StarIcon from '@mui/icons-material/Star'; // Ícone para destaque

export default function Metas() {
    const [metas, setMetas] = useState([]); // Estado para armazenar as metas
    const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
    const [error, setError] = useState(null); // Estado para controlar erros

    // Função para buscar as metas
    const fetchMetas = async () => {
        try {
            const response = await axios.get('https://junadeploy-production.up.railway.app/metas'); // Altere para a rota da sua API
            setMetas(response.data); // Define as metas retornadas pela API
        } catch (err) {
            console.error('Erro ao buscar metas:', err);
            setError('Não foi possível carregar as metas.');
        } finally {
            setLoading(false); // Finaliza o estado de carregamento
        }
    };

    // useEffect para carregar as metas ao montar o componente
    useEffect(() => {
        fetchMetas();
    }, []);

    if (loading) {
        return <div className={styles.loading}>Carregando...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}> <strong>METAS</strong></h2>
            <div className={styles.metasList}>
                {metas.map((meta, index) => (
                    <div key={meta.id} className={styles.card}>
                        {/* Ícone representando a premiação */}
                        <div className={styles.icon}>
                            {index === 0 ? (
                                <EmojiEventsIcon className={styles.iconGold} />
                            ) : (
                                <StarIcon className={styles.iconSilver} />
                            )}
                        </div>
                        {/* Conteúdo da meta */}
                        <div className={styles.cardContent}>
                            <p className={styles.user}>{meta.usuario.nome}</p>
                            <p className={styles.description}>{meta.descricao}</p>
                            <p className={styles.followers}>+{meta.followers} followers</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
