import React, { useEffect, useState } from 'react';
import styles from './pub.module.css'


const ProximaPublicacao = () => {
    const [proximaPublicacao, setProximaPublicacao] = useState(null);

    useEffect(() => {
        const fetchProximaPublicacao = async () => {
            try {
                const response = await fetch('http://localhost:3333/publicacoes');
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
                <div className={styles.publicacao}>
                    <div className={styles.esq}>
                    <div className={styles.titulo}>{proximaPublicacao.titulo}</div>
                    <div className={styles.data}>{new Date(proximaPublicacao.data).toLocaleDateString()}</div>
                    </div>
                    

                    <div className={styles.lateral}>
                        <div className={styles.descricao}> <strong>DESCRIÇÃO</strong><ul><li>{proximaPublicacao.descricao}</li></ul></div>

                        <div className={styles.empresa}> <strong>EMPRESA</strong> <ul><li>{proximaPublicacao.empresa}</li></ul></div>
                    </div>

                </div>
            ) : (
                <p>Nenhuma publicação encontrada.</p>
            )}
        </div>

    );
};

export default ProximaPublicacao;
