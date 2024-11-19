import styles from '../../pages/css/home.module.css'
import Link from 'next/link'; 


export default function Home() {
  return (
    <div classname={styles.home}>
     
      <nav className={styles.nav}>
        <img src="./logo.png" alt="logo" width="50px" height="50px" /> 
        <Link href="/Login" className={styles.link}>SAIBA +</Link>
      
        <Link href="/Login" className={styles.link}>LOGIN</Link>
      </nav>

      <main>
        <div className={styles.main}>
          <h1>           
          A plataforma que <div className={styles.black}> VOCÊ PRECISA</div> para gerenciar os seus  <div className={styles.black}>CONTEÚDOS.</div>    
          </h1>

          <div className={styles.button}>
            <button className={styles.btn}>
              ACESSAR
            </button>
          </div>

        </div>
      </main>

    
    </div>
  )
}