import styles from './css/Login.module.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import FormLogin from '../ui/components/form/formLogin';
import './css/global.css' 


export default function Login() {
    return (
        <div className={styles.page}>
            <div className={styles.logo}>
                <img src="../elipse1.png" alt="" className={styles.elipse1} />
                <img src="../elipse2.png" alt="" className={styles.elipse2} />

               

                <div className={styles.title}>
                    <h1>Bem-vindo de volta!</h1>
                </div>
            </div>
            <div className={styles.login}>
                
                <div className={styles.form}>
                    <FormLogin />
                </div>
            </div>

        </div>
    )
}