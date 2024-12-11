import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../../css/dashAdmin.module.css';
import Menu from '../../../ui/components/surfaces/menu';
import CalendarDash from '../../../ui/components/calendar/calendarDash';
import ProximaPublicacao from '../../../ui/components/proxPub';
import { Riple } from 'react-loading-indicators';
import Metas from '../../../ui/components/goals/goal';

export default function AdminDashboard() {
    const router = useRouter();
    const { userId, token } = router.query;
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(true); // Estado para o menu

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    useEffect(() => {
        console.log(userId);
        if (userId && token) {
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`https://junadeploy-production.up.railway.app/usuarios/${userId}`);
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.msg || 'Erro ao buscar dados do usuário');
                    }

                    const data = await response.json();
                    data.nome = data.nome.toUpperCase();
                    setUserData(data);
                } catch (error) {
                    console.error('Erro ao buscar dados do usuário:', error);
                    setError('Erro ao buscar dados do usuário. Por favor, tente novamente.');
                }
            };

            fetchUserData();
        }
    }, [userId, token]);

    useEffect(() => {
        const formattedDateTime = new Date().toLocaleString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
        setCurrentDateTime(formattedDateTime);
    }, []);

    if (!userData && !error) {
        return (
            <div className={styles.fullPage}>
                <div className={styles.ripple}>
                    <Riple color="#000000" size="large" text="" textColor="#000000" />
                </div>
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (

        <div className={`${styles.content} ${isMenuOpen ? styles.open : styles.closed}`}>
            {/* Menu lateral */}
            <div className={styles.menu}>
                <Menu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
            </div>

            {/* Conteúdo principal */}
            <div className={styles.dashboard_admin}>
                <div className={styles.imagem}>
                    <div className={styles.cub}></div>
                </div>

                <div className={styles.saudacoes}>
                    Seja muito bem-vindo, <strong className={styles.nome}>{userData.nome}</strong>!
                    <p>{currentDateTime}</p>
                </div>

                <div className={styles.agenda}>
                    <CalendarDash />
                </div>

                <div className={styles.line}>
                    <div className={styles.publicacao}>
                        <ProximaPublicacao />
                    </div>
                    <div className={styles.meta}>
                        <Metas />
                    </div>
                </div>
            </div>
        </div>


    );

}
