import React, { useEffect, useState } from 'react';
import styles from '../../css/projetos.module.css';
import Menu from '../../../ui/components/surfaces/menu';
import ModalGeneric from '../../../ui/components/surfaces/ModalGeneric';
import { useRouter } from 'next/router';
import { IoMdRemoveCircle } from "react-icons/io";
import { IoIosAddCircle } from "react-icons/io";

export default function Projetos() {
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [publicacoes, setPublicacoes] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedProjectPublications, setSelectedProjectPublications] = useState([]);
    const [newProject, setNewProject] = useState({
        empresa: '',
        description: '',
        projectDateInitial: '',
        projectDataFinal: '',
        userId: '',
        adminId: ''
    });

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('https://junadeploy-production.up.railway.app/projetos');
                const data = await response.json();
                setProjects(data);
                setFilteredProjects(data);
            } catch (error) {
                console.error('Erro ao buscar projetos:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await fetch('https://junadeploy-production.up.railway.app/allUsers');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            }
        };

        const fetchPublicacoes = async () => {
            try {
                const response = await fetch('https://junadeploy-production.up.railway.app/publicacoes');
                const data = await response.json();
                setPublicacoes(data);
            } catch (error) {
                console.error('Erro ao buscar publicações:', error);
            }
        };

        fetchProjects();
        fetchUsers();
        fetchPublicacoes();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateProject = async () => {
        if (!newProject.empresa || !newProject.description || !newProject.projectDateInitial || !newProject.projectDataFinal || !newProject.userId) {
            alert('Preencha todos os campos obrigatórios!');
            return;
        }

        try {
            const response = await fetch('https://junadeploy-production.up.railway.app/projetos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProject)
            });

            if (!response.ok) throw new Error('Erro ao criar projeto');

            const project = await response.json();
            setProjects([...projects, project]);
            setFilteredProjects([...filteredProjects, project]);
            setShowCreateModal(false);
        } catch (error) {
            console.error('Erro ao criar projeto:', error);
        }
    };

    const handleDeleteProject = async (id) => {
        try {
            await fetch(`https://junadeploy-production.up.railway.app/projetos/${id}`, { method: 'DELETE' });
            setProjects(projects.filter(project => project.id !== id));
            setFilteredProjects(filteredProjects.filter(project => project.id !== id));
        } catch (error) {
            console.error('Erro ao excluir projeto:', error);
        }
    };

    const handleOpenProjectDetail = async (project) => {
        try {
            const response = await fetch(`https://junadeploy-production.up.railway.app/projetos/${project.id}`);
            const projectDetails = await response.json();
            setSelectedProject(projectDetails);
            setSelectedProjectPublications(projectDetails.publicacoes || []);
            setShowDetailModal(true);
        } catch (error) {
            console.error('Erro ao carregar detalhes do projeto:', error);
        }
    };

    const handleShowCreateModal = () => setShowCreateModal(true);
    const handleCloseCreateModal = () => setShowCreateModal(false);
    const handleCloseDetailModal = () => setShowDetailModal(false);

    return (
        <div className={`${styles.projects} ${isMenuOpen ? styles.menuOpen : styles.menuClosed}`}>
            <Menu isOpen={isMenuOpen} />

            <div className={styles.content}>
                <h1>Projetos</h1>

                <div className={styles.head}>
                    <div className={styles.filter}>
                        <label>Filtrar por usuário:</label>
                        <select className={styles.select} onChange={(e) => setFilteredProjects(projects.filter(project => project.userId === Number(e.target.value) || !e.target.value))}>
                            <option value="">Todos</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.username}</option>
                            ))}
                        </select>
                        <button className={styles.plus} onClick={handleShowCreateModal}><IoIosAddCircle /> </button>
                    </div>
                </div>

                <div className={styles.projectList}>
                    {filteredProjects.map(project => (
                        <div key={project.id} className={styles.project}>
                            <h3 onClick={() => handleOpenProjectDetail(project)}>{project.empresa}</h3>
                            <p>{project.description}</p>
                            <p>{new Date(project.projectDateInitial).toLocaleDateString()} - {new Date(project.projectDataFinal).toLocaleDateString()}</p>
                            <button onClick={() => handleDeleteProject(project.id)}><IoMdRemoveCircle /></button>
                        </div>
                    ))}
                </div>
            </div>

            <ModalGeneric show={showCreateModal} onClose={handleCloseCreateModal} onConfirm={handleCreateProject} title="Novo Projeto">
                <div className={styles.modalForm}>
                    <label>Empresa</label>
                    <input name="empresa" onChange={handleInputChange} placeholder="Empresa" />

                    <label>Descrição</label>
                    <textarea name="description" onChange={handleInputChange} placeholder="Descrição"></textarea>

                    <label>Data Inicial</label>
                    <input name="projectDateInitial" type="date" onChange={handleInputChange} />

                    <label>Data Final</label>
                    <input name="projectDataFinal" type="date" onChange={handleInputChange} />

                    <label>Selecionar Usuário</label>
                    <select name="userId" onChange={handleInputChange}>
                        <option value="">Selecionar usuário</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                </div>
            </ModalGeneric>

            <ModalGeneric
                show={showDetailModal}
                onClose={handleCloseDetailModal}
                title="Detalhes do Projeto"
                cancelText="FECHAR"
            >
                {selectedProject ? (
                    <div className={styles.modalPost}>
                        <p><strong>Empresa:</strong> {selectedProject.empresa}</p>
                        <p><strong>Descrição:</strong> {selectedProject.description}</p>
                        <p><strong>Data Inicial:</strong> {new Date(selectedProject.projectDateInitial).toLocaleDateString()}</p>
                        <p><strong>Data Final:</strong> {new Date(selectedProject.projectDataFinal).toLocaleDateString()}</p>

                        <div className={styles.publicationsSection}>
                            <h3>Publicações Vinculadas:</h3>
                            {selectedProjectPublications.length > 0 ? (
                                selectedProjectPublications.map(pub => (
                                    <div key={pub.id} className={styles.publicationCard}>
                                        <p><strong>Título:</strong> {pub.titulo}</p>
                                        <p><strong>Descrição:</strong> {pub.descricao}</p>
                                        <p><strong>Data:</strong> {new Date(pub.data).toLocaleDateString()}</p>
                                    </div>
                                ))
                            ) : (
                                <p>Nenhuma publicação vinculada.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <p>Detalhes não disponíveis.</p>
                )}
            </ModalGeneric>
        </div>
    );
}
