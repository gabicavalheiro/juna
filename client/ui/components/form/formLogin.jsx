import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { Eye, EyeOff } from 'lucide-react';
import styles from '../css/formLogin.module.css';
import { useRouter } from 'next/router';

export default function FormLogin() {
    const router = useRouter();
    const [isShow, setIsShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [initialValues, setInitialValues] = useState({ email: '', senha: '' });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedEmail = localStorage.getItem('savedEmail') || '';
            const savedSenha = localStorage.getItem('savedSenha') || '';
            setInitialValues({ email: savedEmail, senha: savedSenha });
        }
    }, []);

    const handlePassword = () => setIsShow(!isShow);

    const autoLogin = async (email, senha) => {
        try {
            const response = await fetch('http://localhost:3333/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Erro ao fazer login');
            }

            const usuarioData = await response.json();

            if (usuarioData.userId && usuarioData.role) {
                if (usuarioData.role === 'admin') {
                    router.push({
                        pathname: '/dashboard-administrador/[usuarioId]/[token]',
                        query: { usuarioId: usuarioData.userId, token: usuarioData.token },
                    });
                } else if (usuarioData.role === 'user') {
                    router.push({
                        pathname: '/dashboard-cliente/[usuarioId]/[token]',
                        query: { usuarioId: usuarioData.userId, token: usuarioData.token },
                    });
                }
            } else {
                throw new Error("Credenciais inválidas");
            }
        } catch (error) {
            throw new Error(error.message || 'Erro ao fazer login');
        }
    };

    const onSubmit = async (values, actions) => {
        try {
            localStorage.setItem('savedEmail', values.email);

            if (values.rememberMe) {
                localStorage.setItem('savedSenha', values.senha);
            } else {
                localStorage.removeItem('savedSenha');
            }

            await autoLogin(values.email, values.senha);
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            setErrorMessage('Erro ao fazer login. Verifique suas credenciais.');
        }
        actions.setSubmitting(false);
    };

    return (

        <>

        <div className={styles.page}>
            <div className={styles.title}>
                <h1>LOGIN</h1>
            </div>

            <Formik
                initialValues={{ ...initialValues, rememberMe: false }}
                onSubmit={onSubmit}
                enableReinitialize
            >
                {formik => (
                    <div className={styles.form}>
                        <form onSubmit={formik.handleSubmit}>
                            <div className={`${styles.formGroup} form-group`}>
                                <label htmlFor="email" className={styles.label}>E-mail</label>
                                <input
                                    type="email"
                                    className={`${styles.formControl} ${styles.formLabel}`}
                                    id="email"
                                    name="email"
                                    placeholder="E-mail"
                                    {...formik.getFieldProps('email')}
                                />
                            </div>
                            <div className={`${styles.formGroup} form-group`}>
                                <label htmlFor="senha" className={styles.label}>Senha</label>
                                <div className={`${styles.passarea} passarea`}>
                                    <input
                                        type={isShow ? "text" : "password"}
                                        className={`${styles.formControl}`}
                                        id="senha"
                                        name="senha"
                                        placeholder="Senha"
                                        {...formik.getFieldProps('senha')}
                                    />
                                    <button className={`${styles.eyeButton}`} onClick={handlePassword} type="button">
                                        {isShow ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className={`${styles.formCheck} form-check`}>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="rememberMe"
                                    {...formik.getFieldProps('rememberMe')}
                                />
                                <label className={`${styles.formCheck} form-check-label`} htmlFor="rememberMe"> Lembrar de mim</label>
                            </div>
                            <div className={styles.remind}>
                                Está interessado nos nossos serviços? <a href="./Cadastro">Fale conosco!</a>
                            </div>
                            <button type="submit" className={`${styles.btn} btn`} disabled={formik.isSubmitting}>
                                <strong>Entrar</strong>
                            </button>
                        </form>
                        {errorMessage && <div className={styles.errorBox}>{errorMessage}</div>}
                    </div>
                )}
            </Formik>
            </div>
        </>
    );
}
