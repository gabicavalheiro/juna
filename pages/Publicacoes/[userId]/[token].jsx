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
    const [userId, setUserId] = useState(''); // Estado para o ID do usuário
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedPublicacao, setSelectedPublicacao] = useState(null);
    const router = useRouter();
    const { userId: adminId } = router.query; // Extrai userId da rota
    const [showModal, setShowModal] = useState(false); // Estado para controlar a exibição do modal
    const [novaPublicacao, setNovaPublicacao] = useState({
        empresa: '',
        descricao: '',
        plataforma: '',
        userId: '', // Estado para armazenar o ID do usuário selecionado
        data: '',
        imagens: '',
        titulo: '',
        adminId: adminId // adminId da rota
    });

    useEffect(() => {
        if (adminId) {
            setUserId(adminId); // Define userId como adminId da rota
        }
    }, [adminId]);

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

    useEffect(() => {
        const fetchPublicacoes = async () => {
            try {
                const response = await fetch('http://localhost:3333/publicacoes');
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
                const response = await fetch('http://localhost:3333/allUsers'); // Ajuste o endpoint conforme necessário
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

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNovaPublicacao(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCreatePublicacao = async () => {
        try {
            // Formata a data para o formato yyyy-mm-dd
            const formattedDate = novaPublicacao.data ? new Date(novaPublicacao.data).toISOString().split('T')[0] : '';

            const requestBody = {
                empresa: novaPublicacao.empresa,
                descricao: novaPublicacao.descricao,
                plataforma: novaPublicacao.plataforma,
                userId: Number(novaPublicacao.userId), // Utiliza userId do formulário
                data: formattedDate,
                imagens: novaPublicacao.imagens,
                titulo: novaPublicacao.titulo,
                adminId: novaPublicacao.adminId // adminId da rota
            };

            const response = await fetch(`http://localhost:3333/publicacoes/${adminId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            console.log('JSON enviado:', requestBody);

            if (!response.ok) {
                throw new Error('Erro ao cadastrar publicação');
            }

            const publicacaoCriada = await response.json();
            setPublicacoes([...publicacoes, publicacaoCriada]);
            setFilteredPublicacoes([...filteredPublicacoes, publicacaoCriada]);

            handleCloseModal(); // Fecha o modal após criar a publicação
            window.location.reload();

        } catch (error) {
            console.error('Erro ao cadastrar publicação:', error);
        }
    };

    const handleDeletePublicacao = async (postId) => {
        try {
            const response = await fetch(`http://localhost:3333/publicacoes/${postId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir publicação');
            }

            // Remove o post excluído da lista de publicações exibidas
            const updatedPublicacoes = publicacoes.filter(pub => pub.id !== postId);
            const updatedFilteredPublicacoes = filteredPublicacoes.filter(pub => pub.id !== postId);
            setPublicacoes(updatedPublicacoes);
            setFilteredPublicacoes(updatedFilteredPublicacoes);
        } catch (error) {
            console.error('Erro ao excluir publicação:', error);
        }
    };

    const handleOpenModalPublicacao = (publicacao) => {
        setSelectedPublicacao(publicacao);
        setShowModal(true); // Abre o modal
    };

    return (
        <div className={`${styles.publicacoes} ${isMenuOpen ? styles.menuOpen : styles.menuClosed}`}>
            <div className={styles.menu}>
                <Menu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
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
                                <option key={user.id} value={user.id}>{user.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.addButton}>
                        <button onClick={handleOpenModal}><IoIosAddCircle />
                        </button>
                    </div>
                </div>

                <div className={styles.publi}>
                    <div className={styles.posts}>
                        {Array.isArray(filteredPublicacoes) && filteredPublicacoes.map((pub) => (
                            <div key={pub.id} className={styles.post}>
                                <div className={styles.content1}>
                                    <p className={styles.data}>{new Date(pub.data).toLocaleDateString()}</p>
                                    <h3 onClick={() => handleOpenModalPublicacao(pub)} className={styles.title}>{pub.empresa}</h3> {/* Adiciona evento de clique no título */}
                                </div>

                                <div className={styles.content2}>
                                    <p className={styles.descricao}>{pub.descricao}</p>
                                    <div className={styles.icons}>
                                        <div className={styles.userInfo}>
                                            <p><strong>{pub.plataforma}</strong></p>
                                            <img src={pub.usuario ? pub.usuario?.imagemPerfil : pub.administrador?.imagemPerfil} alt="Imagem de perfil" className={styles.userImage} />
                                        </div>
                                        <button className={styles.deleteButton} onClick={() => handleDeletePublicacao(pub.id)}><IoMdRemoveCircle />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal para exibir detalhes da publicação */}
            <ModalGeneric
                show={showModal}
                onClose={handleCloseModal}
                onConfirm={handleCreatePublicacao}
                title="Detalhes da Publicação"
                className={styles.modalDesc}
            >
                {selectedPublicacao && (
                    <div className={styles.modalPost}>
                        <p className={styles.tituloM}> <h3>Titulo</h3> <li>{selectedPublicacao.titulo} </li></p>
                        <p className={styles.imagensM}> <h3>Referências</h3><img src={selectedPublicacao.imagens} alt="Imagens da publicação" /></p>
                        <p className={styles.empresaM}> <h3>Empresa</h3> <li>{selectedPublicacao.empresa}</li></p>
                        <p className={styles.descricaoM}> <h3>Descrição</h3><li>{selectedPublicacao.descricao}</li></p>
                        <p className={styles.dataM}> <h3>Data</h3> <li>{new Date(selectedPublicacao.data).toLocaleDateString()}</li></p>
                        <p className={styles.plataformaM}> <h3>Plataforma</h3><li>{selectedPublicacao.plataforma}</li></p>

                        {/* Adicione mais campos conforme necessário */}
                    </div>
                )}
            </ModalGeneric>
        </div>
    );
}


