import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../../css/dashAdmin.module.css';
import Menu from '../../../ui/components/surfaces/menu';
import CalendarDash from '../../../ui/components/calendar/calendarDash';
import ProximaPublicacao from '../../../ui/components/proxPub';

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
                    const response = await fetch(`http://localhost:3333/usuarios/${userId}`);
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
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={styles.dashboard_admin}>

            <div className={styles.imagem}>
                <img src="../../elipse 5.png" alt="" />
            </div>
            <div className={styles.menu}>
                <Menu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
            </div>
    
            <div className={`${styles.content} ${isMenuOpen ? styles.open : styles.closed}`}>
                <div className={styles.saudacoes}>
                    Seja muito bem-vindo, <strong className={styles.nome}>{userData.nome}</strong>!
                    <p>{currentDateTime}</p>
                </div>
    
                <div className={styles.agenda} >
                    <div>
                        <CalendarDash />
                    </div>
                </div>
    
                <div className={styles.line}>
                    <div >
                        <div>
                            <ProximaPublicacao />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
}
