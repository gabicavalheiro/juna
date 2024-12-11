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
    const { userId } = router.query;
    const [metasExistentes, setMetasExistentes] = useState([]);
    const [metasConcluidas, setMetasConcluidas] = useState([]);
    const [metasSemana, setMetasSemana] = useState([]);
    const [menuAberto, setMenuAberto] = useState(true);
    const [mostrarTodos, setMostrarTodos] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [plataformaSelecionada, setPlataformaSelecionada] = useState("");
    const [showCreateMetaModal, setShowCreateMetaModal] = useState(false);
    const [metaData, setMetaData] = useState({ titulo: '', descricao: '', prazo: '', plataforma: '', userId: '' });
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (userId) {
            buscarMetas();
            buscarConcluidas();
            buscarMetasSemana();
            fetchUsers();
        }
    }, [userId]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://junadeploy-production.up.railway.app/allUsers');
            setUsers(response.data);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        }
    };

    const buscarMetas = async () => {
        try {
            const response = await axios.get(`https://junadeploy-production.up.railway.app/meta/admin/${userId}`);
            setMetasExistentes(response.data.filter(meta => meta.status !== 'concluida'));
        } catch (error) {
            console.error('Erro ao buscar metas:', error);
        }
    };

    const buscarConcluidas = async () => {
        try {
            const response = await axios.get(`https://junadeploy-production.up.railway.app/metas/admin/${userId}/concluidas`);
            setMetasConcluidas(response.data);
        } catch (error) {
            console.error('Erro ao buscar metas concluídas:', error);
        }
    };

    const buscarMetasSemana = async () => {
        try {
            const response = await axios.get(`https://junadeploy-production.up.railway.app/metas/admin/${userId}/semana`);
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
                adminId: userId
            });
            if (response.status === 201) {
                setShowCreateMetaModal(false);
                buscarMetas();
            }
        } catch (error) {
            console.error("Erro ao criar meta:", error);
        }
    };

    const marcarComoConcluida = async (metaId) => {
        try {
            const response = await axios.put(`https://junadeploy-production.up.railway.app/metas/${metaId}/concluir`);
            if (response.status === 200) {
                setShowConfetti(true);
                setTimeout(() => {
                    setShowConfetti(false);
                    buscarMetas();
                    buscarConcluidas();
                }, 2000);
            }
        } catch (error) {
            console.error('Erro ao marcar como concluída:', error);
        }
    };

    const voltarParaPendente = async (metaId) => {
        try {
            const response = await axios.put(`https://junadeploy-production.up.railway.app/metas/${metaId}/pendente`);
            if (response.status === 200) {
                buscarMetas();
                buscarConcluidas();
            }
        } catch (error) {
            console.error('Erro ao voltar meta para pendente:', error);
        }
    };

    const excluirMeta = async (metaId) => {
        try {
            const response = await axios.delete(`https://junadeploy-production.up.railway.app/metas/${metaId}`);
            if (response.status === 200) {
                buscarMetas();
            }
        } catch (error) {
            console.error('Erro ao excluir meta:', error);
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
                    <input  className={styles.input} name="titulo" onChange={handleInputChange} placeholder="Título da Meta" />
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
                                <div className={styles.goalInfo}>
                                    <p><strong>{meta.titulo}</strong></p>
                                    <p>Prazo: {new Date(meta.prazo).toLocaleDateString('pt-BR')}</p>
                                    <p>Usuário: {meta.usuario?.nome || 'Desconhecido'}</p>
                                </div>
                                <div className={styles.actions}>
                                    <span className={styles.checkIcon} onClick={() => marcarComoConcluida(meta.id)}>
                                        <FaCheckCircle style={{ color: '#abdb51', fontSize: '1.2rem' }} />
                                    </span>
                                    <span className={styles.deleteIcon} onClick={() => excluirMeta(meta.id)}>
                                        <ImBin style={{ color: '#db3c3c', fontSize: '1.2rem' }} />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.column}>
                        <h2>Metas Concluídas</h2>
                        {metasConcluidas.map(meta => (
                            <div key={meta.id} className={styles.goalCard}>
                                <div className={styles.goalInfo}>
                                    <strong>{meta.titulo}</strong>
                                    <p>{meta.descricao}</p>
                                    <p>Concluída em: {new Date(meta.updatedAt).toLocaleDateString('pt-BR')}</p>
                                </div>
                                <div className={styles.actions}>
                                    <button onClick={() => voltarParaPendente(meta.id)}>
                                        <PiKeyReturnFill style={{ color: '#252525', fontSize: '1.2rem' }} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.column}>
                        <h2>Metas da Semana</h2>
                        {metasSemana.map(meta => (
                            <div key={meta.id} className={styles.goalCard}>
                                <div className={styles.goalInfo}>
                                    <strong>{meta.titulo}</strong>
                                    <p>{meta.descricao}</p>
                                    <p>Prazo: {new Date(meta.prazo).toLocaleDateString('pt-BR')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    numberOfPieces={300}
                    gravity={0.2}
                    recycle={false}
                />
            )}
        </div>
    );
}
