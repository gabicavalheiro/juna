import React, { useState, useEffect } from 'react';
import Menu from "../../../ui/components/surfaces/menu";
import Calendar from "../../../ui/components/calendar/calendar";
import styles from '../../css/agenda.module.css';

export default function Agenda() {
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1300) {
                setIsMenuOpen(false);
            } else {
                setIsMenuOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Chama a função inicialmente

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div
            className={`${styles.agenda} ${isMenuOpen ? styles.menuOpen : styles.menuClosed}`}
        >
            <Menu isOpen={isMenuOpen} toggleMenu={toggleMenu} />

            <div className={styles.calendar}>
                <div className={styles.tags}>
                   <h2> SUAS TAGS</h2>
                   <ul>
                    <li style={{color:'rgb(11, 86, 151)', backgroundColor:'rgb(186, 223, 255)', padding:'5px',width:'29%', borderRadius:'5px', fontWeight:'bold'}}>REUNIÃO</li>
                    <li style={{color:'rgb(199, 184, 23)', backgroundColor:'rgb(255, 245, 131)', padding:'5px',width:'41%', borderRadius:'5px', fontWeight:'bold'}}>PUBLICAÇÃO</li>
                    <li style={{color:'rgb(255, 0, 136)', backgroundColor:'rgb(255, 209, 234)', padding:'5px',width:'32%', borderRadius:'5px', fontWeight:'bold'}}>PARCERIA</li>
                   </ul>
                </div>
                <div className={styles.calendario}>
                    <Calendar />
                </div>
            </div>
        </div>
    );
}
