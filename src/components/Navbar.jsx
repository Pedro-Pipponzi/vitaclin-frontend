import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>✦</span>
        <span className={styles.brandName}>VitaClin</span>
      </div>
      <div className={styles.right}>
        <span className={styles.greeting}>Olá, {user?.name?.split(' ')[0]}</span>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Sair
        </button>
      </div>
    </nav>
  );
}