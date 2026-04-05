import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };
  if (showForgot) {
    return (
      <div className={styles.page}>
        <div className={styles.left}>
          <div className={styles.leftContent}>
            <div className={styles.brand}>
              <span className={styles.brandIcon}>✦</span>
              <span className={styles.brandName}>VitaClin</span>
            </div>
            <h1 className={styles.headline}>
              Recuperar<br />
              <em>acesso</em>
            </h1>
            <p className={styles.sub}>
              Enviaremos as instruções<br />
              para o seu e-mail cadastrado.
            </p>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.card}>
            <h2 className={styles.title}>Recuperar senha</h2>
            <p className={styles.subtitle}>Digite seu e-mail para receber as instruções</p>
            <div className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>E-mail</label>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="seu@email.com"
                />
              </div>
              <button className={styles.btn}>
                Enviar instruções
              </button>
              <button
                type="button"
                className={styles.forgotBtn}
                onClick={() => setShowForgot(false)}
              >
                ← Voltar para o login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>✦</span>
            <span className={styles.brandName}>VitaClin</span>
          </div>
          <h1 className={styles.headline}>
            Cuidar começa<br />
            <em>pela organização</em>
          </h1>
          <p className={styles.sub}>
            Gestão de pacientes simples,<br />
            humana e eficiente.
          </p>
          <div className={styles.badges}>
            <span className={styles.badge}>Fisioterapia</span>
            <span className={styles.badge}>Nutrição</span>
            <span className={styles.badge}>Psicologia</span>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <h2 className={styles.title}>Entrar na plataforma</h2>
          <p className={styles.subtitle}>Acesso exclusivo para a equipe VitaClin</p>

          {error && (
            <div className={styles.errorBox}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>E-mail</label>
              <input
                className={styles.input}
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Senha</label>
              <input
                className={styles.input}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              className={styles.btn}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <button
              type="button"
              className={styles.forgotBtn}
              onClick={() => setShowForgot(true)}
            >
              Esqueci minha senha
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}