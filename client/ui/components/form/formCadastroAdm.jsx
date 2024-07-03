import React, { useState } from 'react';
import { Formik } from 'formik';
import { Eye, EyeOff } from 'lucide-react';
import { FaCaretDown } from 'react-icons/fa';
import { IoMdInformationCircleOutline } from "react-icons/io";

import styles from '../css/formCadastroAdm.module.css';

export default function FormCadastro() {
    const initialValues = {
        nome: '',
        email: '',
        senha: '',
        senhaConfirmacao: '',
        role: '',
        username: '',
    };

    const [isShow, setIsShow] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [role, setRole] = useState('');
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [showGeneralError, setShowGeneralError] = useState(false);
    const [showModal, setShowModal] = useState(false); // Novo estado para controlar o modal
    const [errorMessage, setErrorMessage] = useState(''); // Novo estado para mensagens de erro

    const handlePassword = () => setIsShow(!isShow);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (value) => {
        setRole(value);
        setIsOpen(false);
    };

    const validaSenha = (senha) => {
        let hasUpperCase = false;
        let hasLowerCase = false;
        let hasNumber = false;
        let hasSymbol = false;

        for (const char of senha) {
            if (/[A-Z]/.test(char)) {
                hasUpperCase = true;
            } else if (/[a-z]/.test(char)) {
                hasLowerCase = true;
            } else if (/[0-9]/.test(char)) {
                hasNumber = true;
            } else {
                hasSymbol = true;
            }
        }

        const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSymbol;

        setInvalidPassword(!isValid);
        return isValid;
    };

    const validate = values => {
        const errors = {};
        const newInvalidFields = {};

        if (!values.nome) {
            newInvalidFields.nome = true;
        }
        if (!values.email) {
            newInvalidFields.email = true;
        }
        if (!values.senha) {
            newInvalidFields.senha = true;
        }
        if (!values.senhaConfirmacao) {
            newInvalidFields.senhaConfirmacao = true;
        }
        if (!role) {
            newInvalidFields.role = true;
        }
        if (values.senha !== values.senhaConfirmacao) {
            errors.senhaConfirmacao = 'As senhas não correspondem';
        }
        if (!validaSenha(values.senha)) {
            errors.senha = 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um símbolo.';
        }
        if (role === 'Cliente' && !values.username) {
            newInvalidFields.username = true;
        }

        setShowGeneralError(Object.keys(newInvalidFields).length > 0);
        return errors;
    };

    const onSubmit = async (values, actions) => {
        if (role === 'Administrador') {
            values.role = 'admin';
            delete values.username;
        } else if (role === 'Cliente') {
            values.role = 'user';
            if (!values.username) {
                actions.setFieldError('username', 'Username é obrigatório para clientes.');
                return;
            }
        } else {
            values.role = '';
            delete values.username;
        }

        console.log('Dados do formulário:', values);

        try {
            const response = await fetch('http://localhost:3333/Usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                console.log('Formulário enviado com sucesso!');
                setShowModal(true); // Exibir o modal em caso de sucesso
                setErrorMessage(''); // Limpar mensagem de erro em caso de sucesso
            } else {
                console.error('Erro ao enviar o formulário:', response.statusText);
                setErrorMessage('Erro ao enviar o formulário: ' + response.statusText);
            }
        } catch (error) {
            console.error('Erro ao enviar o formulário', error);
            setErrorMessage('Erro ao enviar o formulário. Por favor, tente novamente mais tarde.');
        }

        actions.setSubmitting(false);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validate={validate}
        >
            {formik => (
                <div className={styles.form}>
                    <form onSubmit={formik.handleSubmit}>
                        <div className={`${styles.formGroup} form-group`}>
                            <label htmlFor="nome" className={styles.label}>Nome Completo</label>
                            <input
                                type="text"
                                className={`${styles.formControl} ${styles.formLabel} ${formik.touched.nome && formik.errors.nome ? styles.invalidInput : ''}`}
                                id="nome"
                                name="nome"
                                placeholder="Nome completo"
                                {...formik.getFieldProps('nome')}
                            />
                        </div>
                        <div className={`${styles.formGroup} form-group`}>
                            <label htmlFor="email" className={styles.label}>E-mail</label>
                            <input
                                type="email"
                                className={`${styles.formControl} ${styles.formLabel} ${formik.touched.email && formik.errors.email ? styles.invalidInput : ''}`}
                                id="email"
                                name="email"
                                placeholder="E-mail"
                                {...formik.getFieldProps('email')}
                            />
                        </div>
                        <div className={`${styles.formGroup} form-group`}>
                            <label htmlFor="senha" className={styles.label}>Senha</label>
                            <div className={styles.passarea}>
                                <input
                                    type={isShow ? "text" : "password"}
                                    className={`${styles.formControl} ${styles.formLabel} ${invalidPassword || (formik.touched.senha && formik.errors.senha) ? styles.invalidInput : ''}`}
                                    id="senha"
                                    name="senha"
                                    placeholder="Senha"
                                    {...formik.getFieldProps('senha')}
                                    onChange={e => {
                                        formik.handleChange(e);
                                        validaSenha(e.target.value);
                                    }}
                                    onBlur={e => {
                                        formik.handleBlur(e);
                                        validaSenha(e.target.value);
                                    }}
                                />
                                <button className={`${styles.eyeButton} ${invalidPassword ? styles.invalidEyeButton : ''}`} onClick={handlePassword} type='button'>
                                    {isShow ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                                <div className={`${styles.infoIcon} ${invalidPassword ? styles.invalidInfoIcon : ''}`}>
                                    <IoMdInformationCircleOutline size={20} />
                                    <span className={styles.tooltip}>A senha deve conter 6 caracteres ou mais, letras maiusculas, minúsculas, números e símbolos.</span>
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.formGroup} form-group`}>
                            <label htmlFor="senhaConfirmacao" className={styles.label}>Confirme a Senha</label>
                            <div className={styles.passarea}>
                                <input
                                    type={isShow ? "text" : "password"}
                                    className={`${styles.formControl} ${styles.formLabel} ${formik.touched.senhaConfirmacao && formik.errors.senhaConfirmacao ? styles.invalidInput : ''}`}
                                    id="senhaConfirmacao"
                                    name="senhaConfirmacao"
                                    placeholder="Confirme a Senha"
                                    {...formik.getFieldProps('senhaConfirmacao')}
                                />
                                <button className={styles.eyeButton} onClick={handlePassword} type='button'>
                                    {isShow ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                                <div className={`${styles.infoIcon} ${invalidPassword ? styles.invalidInfoIcon : ''}`}>
                                    <IoMdInformationCircleOutline size={20} />
                                    <span className={styles.tooltip}>A senha deve conter 6 caracteres ou mais, letras maiusculas, minúsculas, números e símbolos..</span>
                                </div>
                            </div>
                            {formik.errors.senhaConfirmacao && (
                                <div className={styles.errorBox}>
                                    <span className={`${styles.formError} form-error`}>{formik.errors.senhaConfirmacao}</span>
                                </div>
                            )}
                        </div>

                        <div className={`${styles.formGroup} form-group`}>
                            <div className={styles.usuario}>
                            <label htmlFor="userRole" className={styles.label}>Usuário:</label>
                            <div className={styles.dropdown}>
                                <div className={`${styles.dropdown_input} ${formik.touched.role && formik.errors.role ? styles.invalidInput : ''}`} onClick={toggleDropdown}>
                                    <span>{role || 'Selecione o papel'}</span>
                                    <FaCaretDown className={styles.dropdown_icon} />
                                </div>
                                {isOpen && (
                                    <div className={styles.dropdown_menu}>
                                        <div className={styles.dropdown_item} onClick={() => handleSelect('Administrador')}>Administrador</div>
                                        <div className={styles.dropdown_item} onClick={() => handleSelect('Cliente')}>Cliente</div>
                                    </div>
                                )}
                            </div>
                            </div>
                        </div>

                        {role === 'Cliente' && (
                            <div className={`${styles.formGroup} form-group`}>
                                <label htmlFor="username" className={styles.label}>Username</label>
                                <input
                                    type="text"
                                    className={`${styles.formControl} ${styles.formLabel} ${formik.touched.username && formik.errors.username ? styles.invalidInput : ''}`}
                                    id="username"
                                    name="username"
                                    placeholder="Usuário do instagram"
                                    {...formik.getFieldProps('username')}
                                />
                            </div>
                        )}

                        {showGeneralError && (
                            <div className={styles.errorBox}>
                                <span className={`${styles.formError} form-error`}>Todos os itens são obrigatórios</span>
                            </div>
                        )}

                        {errorMessage && (
                            <div className={styles.errorBox}>
                                <span className={`${styles.formError} form-error`}>{errorMessage}</span>
                            </div>
                        )}

                        <button type="submit" className={`${styles.btn} btn`}><strong>Cadastrar</strong></button>
                    </form>

                    {/* Modal de confirmação */}
                    {showModal && (
                        <div className={styles.modal} style={{ display: 'flex' }}>
                            <div className={styles.modalContent}>
                                <span className={styles.closeButton} onClick={closeModal}>&times;</span>
                                <p className={styles.modalText}>Cadastro concluído com sucesso!</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Formik>
    );
}
