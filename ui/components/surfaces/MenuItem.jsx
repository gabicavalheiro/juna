import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './css/menuI.module.css';
import { useEffect, useState } from 'react';

export default function MenuItem({ href, activeLink, onClick, children }) {
    const router = useRouter();
    const { userId, token } = router.query;

    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        setIsActive(activeLink === href);
    }, [activeLink, href]);

    const handleLinkClick = () => {
        onClick(); 
        setIsActive(true); 
    };

    return (
        <Link style={{textDecoration:'none'}} href={`${href}/${userId}/${token}`} passHref>
            <div
                className={`${styles.link} ${isActive ? styles.active : ''}`}
                onClick={handleLinkClick}
                style={{ textDecoration: 'none' }} 
            >
                {children}
            </div>
        </Link>
    );
}
