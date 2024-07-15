'use client';

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

    const handleLinkClick = (link) => {
        setActiveLink(link);
        
        // Navegar apenas se userId e token estiverem definidos
        if (userId && token) {
            router.push(link);
        }
    };

    useEffect(() => {
        const savedImageUrl = localStorage.getItem('savedImageUrl');
        if (savedImageUrl) {
            setImageSrc(savedImageUrl);
        }
    }, []);

    const handleImageChange = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
                localStorage.setItem('savedImageUrl', reader.result);
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
                        )}
                    </div>
                    <div className={styles.edit}>
                        <label htmlFor="imageUpload" className={styles.editButton}>
                            <BsPencil size={20} />
                            <input
                                id="imageUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
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
                    <MenuItem  href={"/metas"}
                        className={styles.link}
                        activeLink={activeLink}
                        onClick={() => handleLinkClick(`/metas/${userId}/${token}`)}>
                        METAS
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
