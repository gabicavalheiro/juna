import styles from './css/Cadastro.module.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import FormCadastroAdm from '../ui/components/form/formCadastroAdm';

export default function Cadastro() {
    return (
        <div className={styles.page}>
           
            <div className={styles.cadastro}>
                <div className={styles.title}>
                    <h1>CADASTRO</h1>
                </div>
                <div className={styles.form}>
                    <FormCadastroAdm />
                </div>
            </div>

            <div className={styles.logo}>
                <img src="../elipse 3.png" alt="" className={styles.elipse3} />
                <img src="../elipse 4.png" alt="" className={styles.elipse4} />

                <div className={styles.title}>
                    <h1>Bem-vindo à JUNA!</h1>
                </div>
            </div>

        </div>
    )
}