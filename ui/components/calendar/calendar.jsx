import React, { useState, useEffect } from 'react';
import styles from './calendar.module.css';
import { FaArrowCircleRight, FaArrowCircleLeft, FaCalendarAlt } from "react-icons/fa";
import ModalGeneric from '../surfaces/ModalGeneric';

const tags = {
    "REUNIÃO": { color: "rgb(11, 86, 151)", backgroundColor: "rgb(186, 223, 255)" },
    "PUBLICAÇÃO": { color: "rgb(199, 184, 23)", backgroundColor: "rgb(255, 245, 131)" },
    "PARCERIA": { color: "rgb(255, 0, 136)", backgroundColor: "rgb(255, 209, 234)" }
};

export const Calendar = ({ events }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [description, setDescription] = useState('');
    const [tag, setTag] = useState('');
    const [time, setTime] = useState('');
    const [userId, setUserId] = useState('');
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://junadeploy-production.up.railway.app/allUsers');
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

    const formatEvents = (day) => {
        const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(event => event.eventDate === dateKey);
    };

    const toggleModal = () => {
        setShowModal(!showModal);
        setError('');
    };

    const openModalForDay = (day) => {
        setSelectedDay(day);
        setDescription('');
        setTag('');
        setTime('');
        setUserId('');
        toggleModal();
    };

    const handleSave = async () => {
        if (!description || !tag || !time || !selectedDay || !userId) {
            setError('Todos os campos são obrigatórios!');
            return;
        }

        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;

        try {
            setSaving(true);
            const response = await fetch('https://junadeploy-production.up.railway.app/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description,
                    tag,
                    time,
                    eventDate: formattedDate,
                    userId: Number(userId),
                })
            });

            if (response.ok) {
                const newEvent = await response.json();
                setEvents(prev => ({
                    ...prev,
                    [formattedDate]: [...(prev[formattedDate] || []), newEvent],
                }));
                setDescription('');
                setTag('');
                setTime('');
                setUserId('');
                toggleModal();
            } else {
                setError('Erro ao salvar evento. Por favor, tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao salvar evento:', error);
            setError('Erro ao salvar evento. Por favor, tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.calendar}>
            <div className={styles.header}>
                <button className={styles.pass} onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
                    <FaArrowCircleLeft size={30} />
                </button>
                <h2 className={styles.h2}>
                    {currentDate.toLocaleString('default', { month: 'long' })} <FaCalendarAlt /> {currentDate.getFullYear()}
                </h2>
                <button className={styles.pass} onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
                    <FaArrowCircleRight size={30} />
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
                                {formatEvents(day).map((event, idx) => {
                                    const tagStyle = tags[event.tag] || { backgroundColor: '#fff', color: '#000' };
                                    return (
                                        <div key={idx} className={styles.event} style={{ backgroundColor: tagStyle.backgroundColor, color: tagStyle.color }}>
                                            {event.description}
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
                title="Adicionar Evento"
                onConfirm={handleSave}
                confirmText={saving ? "SALVANDO..." : "SALVAR"}
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
                            {user.username}
                        </option>
                    ))}
                </select>

                {error && <p className={styles.error}>{error}</p>}
            </ModalGeneric>
        </div>
    );
};

export default Calendar;
