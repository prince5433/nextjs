// import './home.css';  
import styles from './home.module.css';
import './home.scss';


const Home = () => {
  return (
    <>
      <div className={styles['home']}>
        <h1 className={styles['title']}>Home Page</h1>
        <p className={styles['text']}>Welcome to our website!</p>
      </div>
    </>
  );
};

export default Home;