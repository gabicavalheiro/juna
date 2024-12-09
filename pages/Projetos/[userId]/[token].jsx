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
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
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
                const response = await fetch('http://localhost:3333/projetos');
                const data = await response.json();
                setProjects(data);
                setFilteredProjects(data);
            } catch (error) {
                console.error('Erro ao buscar projetos:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3333/allUsers');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            }
        };

        fetchProjects();
        fetchUsers();
    }, []);

    const handleUserFilterChange = (e) => {
        const userId = e.target.value;
        setSelectedUserId(userId);

        if (userId) {
            setFilteredProjects(projects.filter(project => project.userId === Number(userId)));
        } else {
            setFilteredProjects(projects);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateProject = async () => {
        try {
            const response = await fetch('http://localhost:3333/projetos', {
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
            await fetch(`http://localhost:3333/projetos/${pojectId}`, { method: 'DELETE' });
            setProjects(projects.filter(project => project.id !== id));
            setFilteredProjects(filteredProjects.filter(project => project.id !== id));
        } catch (error) {
            console.error('Erro ao excluir projeto:', error);
        }
    };

    const handleOpenProjectDetail = async (projectId) => {
        try {
            const response = await fetch(`http://localhost:3333/projetos`);
            const projectDetails = await response.json();
            setSelectedProject(projectDetails);
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
                        <select className={styles.select} onChange={handleUserFilterChange}>
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
                <input name="empresa" onChange={handleInputChange} placeholder="Empresa" />
                <textarea name="description" onChange={handleInputChange} placeholder="Descrição"></textarea>
                <input name="projectDateInitial" type="date" onChange={handleInputChange} />
                <input name="projectDataFinal" type="date" onChange={handleInputChange} />
                <select name="userId" onChange={handleInputChange}>
                    <option value="">Selecionar usuário</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.username}</option>
                    ))}
                </select>
            </ModalGeneric>

            {selectedProject && (
                <ModalGeneric show={showDetailModal} onClose={handleCloseDetailModal} title="Detalhes do Projeto">
                    <p><strong>Empresa:</strong> {selectedProject.empresa}</p>
                    <p><strong>Descrição:</strong> {selectedProject.description}</p>
                    <p><strong>Data Inicial:</strong> {new Date(selectedProject.projectDateInitial).toLocaleDateString()}</p>
                    <p><strong>Data Final:</strong> {new Date(selectedProject.projectDataFinal).toLocaleDateString()}</p>

                    <div className={styles.publicationsSection}>
                        <h3>Publicações Vinculadas:</h3>
                        {selectedProject.publications && selectedProject.publications.length > 0 ? (
                            selectedProject.publications.map((pub) => (
                                <div key={pub.id} className={styles.publicationCard}>
                                    <p><strong>Título:</strong> {pub.title}</p>
                                    <p><strong>Data:</strong> {new Date(pub.date).toLocaleDateString()}</p>
                                    <p>{pub.description}</p>
                                </div>
                            ))
                        ) : (
                            <p>Nenhuma publicação vinculada.</p>
                        )}
                    </div>
                </ModalGeneric>
            )}
        </div>
    );
}
