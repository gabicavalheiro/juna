'use client'

import React, { useEffect, useState } from 'react';
import styles from './css/menu.module.css';
import { BsPencil, BsPersonCircle } from 'react-icons/bs';
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import MenuItem from './MenuItem';
import { useRouter } from 'next/router';

export default function Menu({ isOpen, toggleMenu }) {
    const router = useRouter();
    const { userId, token } = router.query;
    const [activeLink, setActiveLink] = useState('');
    const [imageSrc, setImageSrc] = useState('');


    console.log("idd" + userId)
    const handleLinkClick = (link) => {
        setActiveLink(link);
        
        // Navegar apenas se userId e token estiverem definidos
        if (userId && token) {
            router.push(link);
        }
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`https://junadeploy-production.up.railway.app/usuarios/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Falha ao buscar perfil do usuário');
                }

                const data = await response.json();
                if (data.imagemPerfil) {
                    setImageSrc(data.imagemPerfil);
                } else {
                    setImageSrc('default-image-url'); // Defina uma URL padrão para a imagem de perfil
                }
            } catch (error) {
                console.error('Erro ao buscar perfil do usuário:', error);
                // Tratar o erro conforme necessário
            }
        };

        if (userId && token) {
            fetchUserProfile();
        }
    }, [userId, token]);

    const handleImageChange = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
                // Salvar imagem no localStorage se necessário
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <div className={`${styles.menu} ${isOpen ? styles.open : styles.closed}`}>
                <div className={styles.imagem}>
                    <div className={styles.imageContainer}>
                        {imageSrc ? (
                            <img src={imageSrc} alt="Imagem de perfil" className={styles.image} />
                        ) : (
                            <BsPersonCircle className={styles.defaultIcon} />
                        )},
                    </div>
                   
                </div>


                <div className={styles.edit}>
                        <label htmlFor="imageUpload" className={styles.editButton}>
                            <BsPencil size={15} />
                            <input
                                id="imageUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>



                <nav className={styles.nav}>
                    <MenuItem
                        href={'/dashboard-administrador'}
                        className={styles.link}
                        activeLink={activeLink}
                        onClick={() => handleLinkClick(`/dashboard-administrador/${userId}/${token}`)}
                    >
                        DASHBOARD
                    </MenuItem>
                    <MenuItem
                        href={"/Agenda"}
                        className={styles.link}
                        activeLink={activeLink}
                        onClick={() => handleLinkClick(`/Agenda/${userId}/${token}`)}
                    >
                        AGENDA
                    </MenuItem>
                   
                    <MenuItem  href={"/Publicacoes"}
                        className={styles.link}
                        activeLink={activeLink}
                        onClick={() => handleLinkClick(`/Publicacoes/${userId}/${token}`)}>
                        PUBLICAÇÕES
                    </MenuItem>
                    <MenuItem href={"/Influenciadores"}
                        className={styles.link}
                        activeLink={activeLink}
                        onClick={() => handleLinkClick(`/Influenciadores/${userId}/${token}`)}>
                        INFLUENCIADORES
                    </MenuItem>
                    <MenuItem  href={"/Projetos"}
                        className={styles.link}
                        activeLink={activeLink}
                        onClick={() => handleLinkClick(`/Projetos/${userId}/${token}`)}>
                        PROJETOS
                    </MenuItem>
                    <MenuItem  href={"/Metas"}
                        className={styles.link}
                        activeLink={activeLink}
                        onClick={() => handleLinkClick(`/Metas/${userId}/${token}`)}>
                        METAS
                    </MenuItem>
                    <MenuItem  href={"/Cadastro"}
                        className={styles.link}
                        activeLink={activeLink}
                        onClick={() => handleLinkClick(`/Cadastro/${userId}/${token}`)}>
                        CADASTRAR
                    </MenuItem>
                </nav>

                <button className={styles.menuToggle} onClick={toggleMenu}>
                    {isOpen ? <MdArrowBackIos size={24} /> : <MdArrowForwardIos size={24} />}
                </button>
            </div>
        </>
    );
}
