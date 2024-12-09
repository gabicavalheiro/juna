import React, { useEffect, useState } from 'react';
import styles from './pub.module.css';

const ProximaPublicacao = () => {
    const [proximaPublicacao, setProximaPublicacao] = useState(null);

    useEffect(() => {
        const fetchProximaPublicacao = async () => {
            try {
                const response = await fetch('https://junadeploy-production.up.railway.app/publicacoes');
                const data = await response.json();
                const publicacaoMaisProxima = encontrarPublicacaoMaisProxima(data);
                setProximaPublicacao(publicacaoMaisProxima);
            } catch (error) {
                console.error('Erro ao buscar próxima publicação:', error);
            }
        };

        fetchProximaPublicacao();
    }, []);

    const encontrarPublicacaoMaisProxima = (publicacoes) => {
        const dataAtual = new Date().getTime();
        let publicacaoMaisProxima = null;
        let menorDiferenca = Infinity;

        publicacoes.forEach(publicacao => {
            const dataPublicacao = new Date(publicacao.data).getTime();
            const diferenca = Math.abs(dataPublicacao - dataAtual);
            if (diferenca < menorDiferenca) {
                menorDiferenca = diferenca;
                publicacaoMaisProxima = publicacao;
            }
        });

        return publicacaoMaisProxima;
    };

    return (
        <div className={styles.proximaPublicacao}>
            <h2>PRÓXIMA PUBLICAÇÃO</h2>
            {proximaPublicacao ? (
                <div className={styles.card}>
                    <div className={styles.header}>
                        <span className={styles.data}>{new Date(proximaPublicacao.data).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</span>
                        <span className={styles.empresa}>{proximaPublicacao.empresa}</span>
                    </div>
                    <div className={styles.body}>
                        <p className={styles.descricao}>{proximaPublicacao.descricao}</p>
                    </div>
                </div>
            ) : (
                <p>Nenhuma publicação encontrada.</p>
            )}
        </div>
    );
};

export default ProximaPublicacao;

