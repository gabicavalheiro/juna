import React, { useState, useEffect } from 'react';
import styles from './calendardash.module.css';
import { useRouter } from 'next/router';

export default function CalendarDash() {
    const [userId, setUserId] = useState(''); // Estado para armazenar o ID do usuário selecionado

    const router = useRouter();
    const { userId: adminId } = router.query; // Extrai userId da rota

    useEffect(() => {
        if (adminId) {
            setUserId(adminId); // Define userId como adminId da rota
        }
    }, [adminId]);

    const [events, setEvents] = useState({});

    useEffect(() => {

        if (adminId) {
            const fetchEvents = async () => {
                try {
                    // Extrai userId da rota, considerando que pode haver parâmetros adicionais
                    if (!adminId) {
                        throw new Error('User ID não encontrado na query');
                    }

                    const response = await fetch(`http://localhost:3333/admin/${adminId}/events/day`);
                    if (!response.ok) {
                        throw new Error('Erro ao buscar eventos');
                    }
                    const data = await response.json();
                    console.log("Eventos recebidos:", data);

                    const formattedEvents = formatEvents(data);
                    setEvents(formattedEvents);
                    console.log("Eventos formatados:", formattedEvents);
                } catch (error) {
                    console.error('Erro ao buscar eventos:', error.message);
                }
            };

            fetchEvents();
        }
    }, [adminId]);



    const formatEvents = (data) => {
        return data.reduce((acc, event) => {
            const eventDateKey = event.eventDate;
            if (!acc[eventDateKey]) {
                acc[eventDateKey] = [];
            }
            acc[eventDateKey].push(event);
            return acc;
        }, {});
    };

    return (
        <div className={styles.hoje}>
            <h2>HOJE</h2>
            {Object.keys(events).map((date) => (
                <div key={date}>
                    <ul>
                        {events[date].map((event) => (
                            <li key={event.id}>
                                <div className={styles.lin}>                                
                                    <strong>{event.description}</strong> <div className={styles.border}></div> {event.time} <div className={styles.border}></div>  {event.tag} <div className={styles.border}></div>
                                    <strong> {event.usuario?.nome.toUpperCase()} </strong>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
