import styles from '../../pages/css/home.module.css'

export default function Home() {
  return (
    <div classname={styles.home}>
      <div className={styles.img}>
        <img src="../elipse 3.png" alt="" />
      </div>
      <nav className={styles.nav}>
        <a href="/Login">Login </a>
        <a href="/Login">Entre em contato </a>
      </nav>

      <main>
        <div className={styles.main}>
          <h1>                JUNA INFLUÊNCIA
          </h1>

         <div className={styles.btn}>
         <button >ENTRE EM CONTATO</button>
         </div>

        </div>
      </main>
    </div>
  )
}