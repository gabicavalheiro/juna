import React, { useEffect, useState } from 'react';
import styles from '../../css/publicacoes.module.css';
import Menu from '../../../ui/components/surfaces/menu';
import ModalGeneric from '../../../ui/components/surfaces/ModalGeneric';
import { useRouter } from 'next/router';
import { IoMdRemoveCircle } from "react-icons/io";
import { IoIosAddCircle } from "react-icons/io";

export default function Publicacoes() {
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [publicacoes, setPublicacoes] = useState([]);
    const [filteredPublicacoes, setFilteredPublicacoes] = useState([]);
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedPublicacao, setSelectedPublicacao] = useState(null);
    const router = useRouter();
    const { userId: adminId } = router.query;
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [novaPublicacao, setNovaPublicacao] = useState({
        empresa: '',
        descricao: '',
        plataforma: '',
        userId: '',
        data: '',
        imagens: '',
        titulo: '',
        adminId: adminId
    });

    useEffect(() => {
        if (adminId) {
            setUserId(adminId);
        }
    }, [adminId]);

    useEffect(() => {
        const fetchPublicacoes = async () => {
            try {
                const response = await fetch('https://junadeploy-production.up.railway.app/publicacoes');
                const data = await response.json();
                setPublicacoes(Array.isArray(data) ? data : []);
                setFilteredPublicacoes(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Erro ao buscar publicações:', error);
                setPublicacoes([]);
                setFilteredPublicacoes([]);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await fetch('https://junadeploy-production.up.railway.app/allUsers');
                const data = await response.json();
                setUsers(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
                setUsers([]);
            }
        };

        fetchPublicacoes();
        fetchUsers();
    }, []);

    const handleUserFilterChange = (e) => {
        const userId = e.target.value;
        setSelectedUserId(userId);

        if (userId) {
            setFilteredPublicacoes(publicacoes.filter(pub => pub.userId == userId));
        } else {
            setFilteredPublicacoes(publicacoes);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNovaPublicacao(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCreatePublicacao = async () => {
        if (
            !novaPublicacao.titulo ||
            !novaPublicacao.descricao ||
            !novaPublicacao.empresa ||
            !novaPublicacao.plataforma ||
            !novaPublicacao.data ||
            !novaPublicacao.userId
        ) {
            alert('Preencha todos os campos obrigatórios!');
            return;
        }

        try {
            const formattedDate = novaPublicacao.data ? new Date(novaPublicacao.data).toISOString().split('T')[0] : '';

            const requestBody = {
                empresa: novaPublicacao.empresa,
                descricao: novaPublicacao.descricao,
                plataforma: novaPublicacao.plataforma,
                userId: Number(novaPublicacao.userId),
                data: formattedDate,
                imagens: novaPublicacao.imagens,
                titulo: novaPublicacao.titulo,
                adminId: adminId
            };

            const response = await fetch(`https://junadeploy-production.up.railway.app/publicacoes/${adminId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error('Erro ao cadastrar publicação');
            }

            const publicacaoCriada = await response.json();
            setPublicacoes([...publicacoes, publicacaoCriada]);
            setFilteredPublicacoes([...filteredPublicacoes, publicacaoCriada]);
            setShowCreateModal(false);

            setNovaPublicacao({
                empresa: '',
                descricao: '',
                plataforma: '',
                userId: '',
                data: '',
                imagens: '',
                titulo: '',
            });


        } catch (error) {

            console.error('Erro ao cadastrar publicação:', error);
        }
    };

    const handleShowCreateModal = () => {
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    const handleOpenModalPublicacao = (publicacao) => {
        setSelectedPublicacao(publicacao);
        setShowDetailModal(true);
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
    };

    const handleDeletePublicacao = async (postId) => {
        try {
            const response = await fetch(`https://junadeploy-production.up.railway.app/publicacoes/${postId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Erro ao excluir publicação');

            const updatedPublicacoes = publicacoes.filter(pub => pub.id !== postId);
            const updatedFilteredPublicacoes = filteredPublicacoes.filter(pub => pub.id !== postId);
            setPublicacoes(updatedPublicacoes);
            setFilteredPublicacoes(updatedFilteredPublicacoes);
        } catch (error) {
            console.error('Erro ao excluir publicação:', error);
        }
    };

    return (
        <div className={`${styles.publicacoes} ${isMenuOpen ? styles.menuOpen : styles.menuClosed}`}>
            <div className={styles.menu}>
                <Menu isOpen={isMenuOpen} />
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <h1>Próximas publicações</h1>
                    </div>

                    <div className={styles.filter}>
                        <label htmlFor="userFilter">Filtrar por Usuário:</label>
                        <select id="userFilter" className={styles.select} value={selectedUserId} onChange={handleUserFilterChange}>
                            <option value="">Todos</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.username}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.addButton}>
                        <button onClick={handleShowCreateModal}>
                            <IoIosAddCircle />
                        </button>
                    </div>
                </div>

                <div className={styles.publi}>
                    <div className={styles.posts}>
                        {filteredPublicacoes.map((pub) => (
                            <div key={pub.id} className={styles.post}>
                                <div className={styles.content1}>
                                    <p className={styles.data}>{new Date(pub.data).toLocaleDateString()}</p>
                                    <h3 onClick={() => handleOpenModalPublicacao(pub)} className={styles.title}>{pub.empresa}</h3>
                                </div>

                                <div className={styles.content2}>
                                    <p className={styles.descricao}>{pub.descricao}</p>
                                    <div className={styles.icons}>
                                        <div className={styles.userInfo}>
                                            <p><strong>{pub.plataforma}</strong></p>
                                            <img
                                                src={
                                                    (pub.usuario && pub.usuario.imagemPerfil) ||
                                                    (pub.administrador && pub.administrador.imagemPerfil) ||
                                                    'https://via.placeholder.com/150' // Caminho para uma imagem padrão
                                                }
                                                alt="Imagem de perfil"
                                                className={styles.userImage}
                                            />
                                        </div>
                                        <button className={styles.deleteButton} onClick={() => handleDeletePublicacao(pub.id)}>
                                            <IoMdRemoveCircle />
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal de Criação */}
            <ModalGeneric
                show={showCreateModal}
                onClose={handleCloseCreateModal}
                onSubmit={handleCreatePublicacao} // Passa onSubmit aqui
                title="Criar Nova Publicação"
            >
                <div className={styles.modalPost}>
                    <label>TÍTULO</label>
                    <input type="text" name="titulo" onChange={handleInputChange} value={novaPublicacao.titulo} />

                    <label>DESCRIÇÃO</label>
                    <textarea name="descricao" onChange={handleInputChange} value={novaPublicacao.descricao}></textarea>

                    <label>EMPRESA</label>
                    <input type="text" name="empresa" onChange={handleInputChange} value={novaPublicacao.empresa} />

                    <label>PLATAFORMA</label>
                    <input type="text" name="plataforma" onChange={handleInputChange} value={novaPublicacao.plataforma} />

                    <label>DATA</label>
                    <input type="date" name="data" onChange={handleInputChange} value={novaPublicacao.data} />

                    <label>IMAGENS</label>
                    <input type="text" name="imagens" onChange={handleInputChange} value={novaPublicacao.imagens} />

                    <label>USUÁRIO</label>
                    <select className={styles.selectM} name="userId" onChange={handleInputChange} value={novaPublicacao.userId}>
                        <option value=""></option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                </div>
            </ModalGeneric>


            {/* Modal de Detalhes */}
            <ModalGeneric
                show={showDetailModal}
                onClose={handleCloseDetailModal}
                title="Detalhes da Publicação"
                cancelText='FECHAR'
            >
                {selectedPublicacao && (
                    <div className={styles.modalPost}>
                        <p><strong>TÍTULO</strong> {selectedPublicacao.titulo}</p>
                        <p><strong>EMPRESA</strong> {selectedPublicacao.empresa}</p>
                        <p><strong>DESCRIÇÃO</strong> {selectedPublicacao.descricao}</p>
                        <p><strong>DATA</strong> {new Date(selectedPublicacao.data).toLocaleDateString()}</p>
                        <p><strong>PLATAFORMA</strong> {selectedPublicacao.plataforma}</p>
                        <p><strong>REF</strong> <img src={selectedPublicacao.imagens} alt="Imagens da publicação" /></p>
                    </div>
                )}
            </ModalGeneric>
        </div>
    );
}
