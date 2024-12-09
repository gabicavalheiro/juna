import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import { Eye, EyeOff } from 'lucide-react';
import styles from '../css/formLogin.module.css';
import { useRouter } from 'next/router';

export default function FormLogin() {
  const router = useRouter();
  const [isShow, setIsShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [initialValues, setInitialValues] = useState({ email: '', senha: '', rememberMe: false });

  // Carregar dados de localStorage e configurar os valores iniciais
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail') || '';
    const savedSenha = localStorage.getItem('savedSenha') || '';
    setInitialValues({
      email: savedEmail,
      senha: savedSenha,
      rememberMe: !!savedSenha
    });
  }, []); // Esse effect é executado uma vez na montagem do componente

  const handlePassword = () => setIsShow(prev => !prev);

  // Função de login com axios
  const autoLogin = async (email, senha) => {
    try {
      const response = await axios.post('http://localhost:3333/login', { email, senha });
      const { userId, role, token } = response.data;
      const route = role === 'admin' ? '/dashboard-administrador/[usuarioId]/[token]' : '/dashboard-cliente/[usuarioId]/[token]';
      router.push({ pathname: route, query: { usuarioId: userId, token } });
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || 'Erro ao fazer login');
    }
  };

  const onSubmit = async (values, actions) => {
    const { email, senha, rememberMe } = values;

    // Armazenar email e senha no localStorage se "Lembrar de mim" estiver marcado
    localStorage.setItem('savedEmail', email);
    rememberMe ? localStorage.setItem('savedSenha', senha) : localStorage.removeItem('savedSenha');

    try {
      await autoLogin(email, senha);
    } catch (error) {
      setErrorMessage('Erro ao fazer login. Verifique suas credenciais.');
    }

    actions.setSubmitting(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.title}>
        <h1>LOGIN</h1>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize // Garante que os valores sejam atualizados após o primeiro carregamento
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
                   autoComplete="current-email"
                  {...formik.getFieldProps('email')}
                />
              </div>
              <div className={`${styles.formGroup} form-group`}>
                <label htmlFor="senha" className={styles.label}>Senha</label>
                <div className={styles.passarea}>
                  <input
                    type={isShow ? 'text' : 'password'}
                    className={styles.formControl}
                    id="senha"
                    name="senha"
                    placeholder="Senha"
                    autoComplete="current-password" 
                    {...formik.getFieldProps('senha')}
                  />
                  <button className={styles.eyeButton} onClick={handlePassword} type="button">
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
                <label className="form-check-label" htmlFor="rememberMe"> Lembrar de mim</label>
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
  );
}

