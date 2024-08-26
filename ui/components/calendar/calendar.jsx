import React, { useState, useEffect } from 'react';
import styles from './calendar.module.css';
import { FaArrowCircleRight, FaArrowCircleLeft, FaCalendarAlt } from "react-icons/fa";
import ModalGeneric from '../surfaces/ModalGeneric';
import { useRouter } from 'next/router';

const tags = {
    "REUNIÃO": { color: "rgb(11, 86, 151)", backgroundColor: "rgb(186, 223, 255)" },
    "PUBLICAÇÃO": { color: "rgb(199, 184, 23)", backgroundColor: "rgb(255, 245, 131)" },
    "PARCERIA": { color: "rgb(255, 0, 136)", backgroundColor: "rgb(255, 209, 234)" }
};

export const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedEventIndex, setSelectedEventIndex] = useState(null);
    const [description, setDescription] = useState('');
    const [tag, setTag] = useState('');
    const [time, setTime] = useState('');
    const [userId, setUserId] = useState(''); // Novo estado para o ID do usuário
    const [users, setUsers] = useState([]); // Estado para armazenar os usuários
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const router = useRouter();
    const { userId: adminId } = router.query; // Extrai userId da rota
    const [selectedUserName, setSelectedUserName] = useState('');



    useEffect(() => {
        if (adminId) {
            setUserId(adminId); // Define userId como adminId da rota
        }
    }, [adminId]);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3333/allUsers');
                if (!response.ok) {
                    throw new Error('Erro ao buscar usuários');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error.message);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (adminId) {
            const fetchEvents = async () => {
                try {
                    const response = await fetch(`http://localhost:3333/administradores/${adminId}/eventos`);
                    if (!response.ok) {
                        throw new Error('Erro ao buscar eventos');
                    }
                    const data = await response.json();
                    const formattedEvents = formatEvents(data);
                    setEvents(formattedEvents);
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

    const toggleModal = () => {
        setShowModal(!showModal);
        setError('');
    };

    const openModalForDay = (day) => {
        setSelectedDay(day);
        setSelectedEventIndex(null);
        setDescription('');
        setTag('');
        setTime('');
        setUserId(''); // Limpar ID do usuário ao abrir o modal
        toggleModal();
    };

    const openModalForEvent = (day, index, event) => {
        setSelectedDay(day);
        setSelectedEventIndex(index);
        setDescription(event.description);
        setTag(event.tag);
        setTime(event.time || '');
        setUserId(event.userId || ''); // Definir ID do usuário do evento
        toggleModal();
    };

    const handleSave = async () => {
        if (!description || !tag || !time || !selectedDay || !userId) {
            setError('Todos os campos são obrigatórios!');
            return;
        }
    
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    
        try {
            const response = await fetch(`http://localhost:3333/administradores/${adminId}/eventos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description,
                    tag,
                    time,
                    eventDate: formattedDate,
                    userId: Number(userId), // Converta para número aqui, se necessário
                })
            });
    
           
    
            const newEvent = await response.json();
            setEvents(prev => ({
                ...prev,
                [formattedDate]: [...(prev[formattedDate] || []), newEvent],
            }));
    
            // Resetando os campos após salvar
            setDescription('');
            setTag('');
            setTime('');
            setUserId('');
            toggleModal();

            window.location.reload();

        } catch (error) {
            console.error('Erro ao salvar evento:', error);
            setError('Erro ao salvar evento. Por favor, tente novamente.');
        }
    };
    


    const handleRemove = async () => {
        if (selectedEventIndex === null || !selectedDay) {
            return;
        }
    
        const eventDateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
        const eventId = events[eventDateKey][selectedEventIndex].id;
    
        try {
            const response = await fetch(`http://localhost:3333/events/${eventId}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                throw new Error('Erro ao remover evento. Por favor, tente novamente.');
            }
    
            // Remover o evento do estado local
            setEvents(prevEvents => {
                const updatedEvents = { ...prevEvents };
                updatedEvents[eventDateKey].splice(selectedEventIndex, 1);
                if (updatedEvents[eventDateKey].length === 0) {
                    delete updatedEvents[eventDateKey];
                }
                return updatedEvents;
            });
    
            toggleModal();
        } catch (error) {
            console.error('Erro ao remover evento:', error);
            setError('Erro ao remover evento. Por favor, tente novamente.');
        }
    };
    

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

    const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const getDaysArray = (month, year) => {
        const numDays = daysInMonth(month, year);
        const startDay = firstDayOfMonth(month, year);
        let daysArray = new Array(startDay).fill(null).concat([...Array(numDays).keys()].map(i => i + 1));
        while (daysArray.length % 7 !== 0) {
            daysArray.push(null);
        }
        return daysArray;
    };

    const daysArray = getDaysArray(currentDate.getMonth(), currentDate.getFullYear());

    return (
        <div className={styles.calendar}>
            <div className={styles.component}></div>
            <div className={styles.header}>
                <button className={styles.pass} style={{ border: 'none', backgroundColor: '#ffff' }} onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
                    <FaArrowCircleLeft style={{ color: '#ad60a6', cursor: "pointer" }} size={25} />
                </button>
                <h2 className={styles.h2}>
                    {currentDate.toLocaleString('default', { month: 'long' })} <FaCalendarAlt style={{ marginRight: '20px' }} />
                    {currentDate.getFullYear()}
                </h2>
                <button className={styles.pass} style={{ border: 'none', backgroundColor: '#ffff' }} onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
                    <FaArrowCircleRight style={{ color: '#ad60a6', cursor: "pointer" }} size={25} />
                </button>
            </div>
            <div className={styles.grid}>
                {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map(day => (
                    <div key={day} className={styles.dayLabel}>{day}</div>
                ))}
                {daysArray.map((day, index) => (
                    <div key={index} className={styles.day}>
                        {day !== null && (
                            <div>
                                <span onClick={() => openModalForDay(day)}>{day}</span>
                                {events[`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`]?.map((event, idx) => {
                                   

                                    const tags = {
                                        "REUNIÃO": { color: "rgb(11, 86, 151)", backgroundColor: "rgb(186, 223, 255)" },
                                        "PUBLICAÇÃO": { color: "rgb(199, 184, 23)", backgroundColor: "rgb(255, 245, 131)" },
                                        "PARCERIA": { color: "rgb(255, 0, 136)", backgroundColor: "rgb(255, 209, 234)" }
                                    };
                                
                                    const tagStyle = tags[event.tag] || { backgroundColor: '#fff', color: '#000' };
                                
                                    return (
                                        <div key={idx} className={styles.event} onClick={() => openModalForEvent(day, idx, event)}>
                                            <div className={styles.eventDescription} style={{ backgroundColor: tagStyle.backgroundColor, color: tagStyle.color, fontSize:'50%' }}>
                                                <strong>{event.time}</strong> - {event.description} - <strong> {event.usuario?.nome.toUpperCase()} </strong>
                                            </div>
                                        </div>
                                    );
                                })}

                            </div>
                        )}
                    </div>
                ))}
            </div>
            <ModalGeneric
                show={showModal}
                onClose={toggleModal}
                title={selectedEventIndex !== null ? "Editar Evento" : "Adicionar Evento"}
                onConfirm={handleSave}
                onRemove={selectedEventIndex !== null ? handleRemove : null}
                confirmText={saving ? "SALVANDO..." : "SALVAR"}
                removeText="REMOVER"
            >
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição do evento"
                    className={styles.input}
                />
                <select value={tag} onChange={(e) => setTag(e.target.value)} className={styles.select}>
                    <option value="">Selecione uma tag</option>
                    {Object.keys(tags).map((tag, idx) => (
                        <option key={idx} value={tag} style={{ color: tags[tag].color }}>{tag}</option>
                    ))}
                </select>
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={styles.inputTime}
                />



                <select value={userId} onChange={(e) => setUserId(e.target.value)} className={styles.select}>
                    <option value="">Selecione um usuário</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.nome}
                        </option>
                    ))}
                </select>


                {error && <p className={styles.error}>{error}</p>}
            </ModalGeneric>
        </div>
    );
};

export default Calendar;
