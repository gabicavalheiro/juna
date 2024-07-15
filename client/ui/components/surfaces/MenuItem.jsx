import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './css/menuI.module.css';
import { useEffect, useState } from 'react';

export default function MenuItem({ href, activeLink, onClick, children }) {
    const router = useRouter();
    const { usuarioId, token } = router.query;

    // State para controlar o link ativo
    const [isActive, setIsActive] = useState(false);

    // Atualiza isActive baseado no activeLink ao montar o componente
    useEffect(() => {
        setIsActive(activeLink === href);
    }, [activeLink, href]);

    // Função para lidar com o clique no link
    const handleLinkClick = () => {
        onClick(); // Chama a função de onClick passada como prop
        setIsActive(true); // Ativa o link ao ser clicado
    };

    return (
        <Link style={{textDecoration:'none'}} href={`${href}/[usuarioId]/[token]`} as={`${href}/${usuarioId}/${token}`} passHref>
            <div
                className={`${styles.link} ${isActive ? styles.active : ''}`}
                onClick={handleLinkClick}
                style={{ textDecoration: 'none' }} // Remove o sublinhado do link
            >
                {children}
            </div>
        </Link>
    );
}
