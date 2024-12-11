import React, { useState, useEffect } from 'react';
import styles from '../../css/influenciadores.module.css';
import Menu from '../../../ui/components/surfaces/menu';
import { IoMdAdd } from "react-icons/io";
import ModalGeneric from '../../../ui/components/surfaces/ModalGeneric';
export default function Influenciadores() {
    const [isMenuOpen, setIsMenuOpen] = useState(true); // Estado para o menu
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // Estado para armazenar o usuário selecionado para exibir informações
    const [formData, setFormData] = useState({
        descricao: "",
        username: "",
        nome: "",
        email: "",
        senha: "",
        imagemPerfil: ""
    });
    const [showModal, setShowModal] = useState(false); // Estado para controlar a exibição do modal

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('https://junadeploy-production.up.railway.app/allUsers/user'); // Substitua pela sua rota real
            if (response.ok) {
                const data = await response.json();
                setUsers(data); // Define os usuários obtidos na resposta
            } else {
                console.error('Erro ao buscar usuários:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const handleInfoClick = (userId) => {
        const user = users.find(user => user.id === userId);
        setSelectedUser(user);
        setFormData({
            descricao: user.descricao || "",
            username: user.username || "",
            nome: user.nome || "",
            email: user.email || "",
            senha: "",
            imagemPerfil: user.imagemPerfil || ""
        });
        setShowModal(true); // Mostra o modal quando um usuário é selecionado
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        setShowModal(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita o comportamento padrão de submit do formulário

        try {
            const response = await fetch(`https://junadeploy-production.up.railway.app/updateUserDetails/${selectedUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData) // Use formData diretamente
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Informações atualizadas com sucesso:', data);
                fetchUsers(); // Atualiza a lista de usuários após a atualização
                handleCloseModal(); // Fecha o modal após o sucesso da atualização
            } else {
                console.error('Erro ao atualizar informações:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao atualizar informações:', error);
        }
    };

    const generateMonthlyReport = async (userId) => {
        try {
            const response = await fetch(`https://junadeploy-production.up.railway.app/${userId}/relatorioMensal`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/pdf'
                }
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Relatorio_Mensal_${userId}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                console.error('Erro ao gerar o relatório:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao gerar o relatório:', error);
        }
    };


    return (
        <div className={styles.influenciadores}>
            <div className={styles.menu}>
                <Menu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
            </div>

            <div className={styles.influ}>
                {users.map(user => (
                    <div key={user.id} className={styles.card}>
                        <img src={user.imagemPerfil} alt={user.nome} className={styles.userPhoto} />

                        <div className={styles.userInfo}>
                            <p className={styles.userName}>{user.nome.toUpperCase()}</p>
                            <p className={styles.userUsername}>@{user.username}</p>

                            <button className={styles.infoButton} onClick={() => handleInfoClick(user.id)}>
                                Informações adicionais <IoMdAdd style={{ marginLeft: '5%' }} />
                            </button>

                            <div className={styles.descr}>
                                <li>{user.descricao}</li>
                            </div>

                            {/* Botão de geração de relatório */}
                            <button
                                className={styles.generateReportButton}
                                onClick={() => generateMonthlyReport(user.id)}
                            >
                            Relatório Mensal 
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal para adicionar informações adicionais */}
            {selectedUser && (
                <ModalGeneric
                    show={showModal}
                    onClose={handleCloseModal}
                    title={`Editar Informações de ${selectedUser.nome}`}
                    onSubmit={handleSubmit}
                    formData={formData}
                    onChange={handleChange}

                >

                    <div className={styles.modal}>
                        <label>
                            <textarea name="descricao" value={formData.descricao} onChange={handleChange} className={styles.input} placeholder='Descrição' />
                        </label>
                        <label>
                            <input type="text" name="username" value={formData.username} onChange={handleChange} className={styles.input} placeholder='Username' />
                        </label>
                        <label>
                            <input type="text" name="nome" value={formData.nome} onChange={handleChange} className={styles.input} placeholder='Nome' />
                        </label>
                        <label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className={styles.input} placeholder='E-mail' />
                        </label>

                        <label>
                            <input type="text" name="imagemPerfil" value={formData.imagemPerfil} className={styles.input} onChange={handleChange} placeholder='URL da imagem de perfil' />
                        </label>
                    </div>
                </ModalGeneric>
            )}
        </div>
    );
}
