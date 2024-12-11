import React, { useEffect, useState } from 'react';
import Menu from "../../../ui/components/surfaces/menu";
import styles from '../../css/metas.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FaCheckCircle, FaPlusCircle } from "react-icons/fa";
import { ImBin } from "react-icons/im";
import Confetti from 'react-confetti';
import { PiKeyReturnFill } from "react-icons/pi";
import ModalGeneric from '../../../ui/components/surfaces/ModalGeneric';

export default function PaginaMetas() {
    const router = useRouter();
    const { userId, token } = router.query; // Captura userId e token
    const [metasExistentes, setMetasExistentes] = useState([]);
    const [metasConcluidas, setMetasConcluidas] = useState([]);
    const [metasSemana, setMetasSemana] = useState([]);
    const [menuAberto, setMenuAberto] = useState(true);
    const [showCreateMetaModal, setShowCreateMetaModal] = useState(false);
    const [metaData, setMetaData] = useState({ titulo: '', descricao: '', prazo: '', plataforma: '', userId: '' });
    const [users, setUsers] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (userId && token) {
            buscarMetas();
            buscarConcluidas();
            buscarMetasSemana();
            fetchUsers();
        }
    }, [userId, token]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://junadeploy-production.up.railway.app/allUsers', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        }
    };

    const buscarMetas = async () => {
        try {
            const response = await axios.get(`https://junadeploy-production.up.railway.app/metas/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMetasExistentes(response.data.filter(meta => meta.status !== 'concluida'));
        } catch (error) {
            console.error('Erro ao buscar metas:', error);
        }
    };

    const buscarConcluidas = async () => {
        try {
            const response = await axios.get(`https://junadeploy-production.up.railway.app/metas/${userId}/concluidas`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMetasConcluidas(response.data);
        } catch (error) {
            console.error('Erro ao buscar metas concluídas:', error);
        }
    };

    const buscarMetasSemana = async () => {
        try {
            const response = await axios.get(`https://junadeploy-production.up.railway.app/metas/${userId}/semana`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMetasSemana(response.data);
        } catch (error) {
            console.error('Erro ao buscar metas da semana:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMetaData({ ...metaData, [name]: value });
    };

    const handleCreateMeta = async () => {
        try {
            const response = await axios.post(`https://junadeploy-production.up.railway.app/metas/${userId}`, {
                ...metaData,
                adminId: userId,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 201) {
                setShowCreateMetaModal(false);
                buscarMetas();
            }
        } catch (error) {
            console.error("Erro ao criar meta:", error);
        }
    };

    return (
        <div className={`${styles.metas} ${menuAberto ? styles.menuOpen : styles.menuClosed}`}>
            <Menu isOpen={menuAberto} />
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1>Metas</h1>
                    <FaPlusCircle
                        style={{ color: '#abdb51', fontSize: '1.5rem', cursor: 'pointer', marginLeft: '10px' }}
                        onClick={() => setShowCreateMetaModal(true)}
                        title="Adicionar Meta"
                    />
                </div>
                <ModalGeneric
                    show={showCreateMetaModal}
                    onClose={() => setShowCreateMetaModal(false)}
                    onConfirm={handleCreateMeta}
                    title="Nova Meta"
                >
                    <input className={styles.input} name="titulo" onChange={handleInputChange} placeholder="Título da Meta" />
                    <textarea className={styles.textarea} name="descricao" onChange={handleInputChange} placeholder="Descrição da Meta"></textarea>
                    <input className={styles.input} name="prazo" type="date" onChange={handleInputChange} />
                    <select className={styles.select} name="userId" onChange={handleInputChange}>
                        <option value="">Selecionar usuário</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                </ModalGeneric>

                <div className={styles.goalsContainer}>
                    <div className={styles.column}>
                        <h2>Metas Pendentes</h2>
                        {metasExistentes.map(meta => (
                            <div key={meta.id} className={styles.goalCard}>
                                <p><strong>{meta.titulo}</strong></p>
                                <p>Prazo: {new Date(meta.prazo).toLocaleDateString('pt-BR')}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
