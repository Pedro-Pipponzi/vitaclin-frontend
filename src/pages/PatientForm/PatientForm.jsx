import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import styles from './PatientForm.module.css';

const emptyForm = {
  name: '',
  birthDate: '',
  phone: '',
  email: '',
  specialty: '',
  observations: '',
};

export default function PatientForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEditing) {
      api.get(`/patients/${id}`)
        .then((res) => {
          const p = res.data;
          setForm({
            name: p.name || '',
            birthDate: p.birthDate ? p.birthDate.split('T')[0] : '',
            phone: p.contact?.phone || '',
            email: p.contact?.email || '',
            specialty: p.specialty || '',
            observations: p.observations || '',
          });
        })
        .catch(() => navigate('/'))
        .finally(() => setFetching(false));
    }
  }, [id, isEditing, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!form.birthDate) newErrors.birthDate = 'Data de nascimento é obrigatória';
    if (!form.specialty) newErrors.specialty = 'Especialidade é obrigatória';
    if (!form.phone && !form.email) newErrors.contact = 'Informe pelo menos um contato (telefone ou e-mail)';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (name === 'phone' || name === 'email') {
      setErrors((prev) => ({ ...prev, contact: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const payload = {
      name: form.name,
      birthDate: form.birthDate,
      contact: {
        phone: form.phone,
        email: form.email,
      },
      specialty: form.specialty,
      observations: form.observations,
    };

    try {
      if (isEditing) {
        await api.put(`/patients/${id}`, payload);
      } else {
        await api.post('/patients', payload);
      }
      setSuccess(true);
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Erro ao salvar. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.center}><p>Carregando...</p></div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>

        <div className={styles.breadcrumb}>
          <button className={styles.backBtn} onClick={() => navigate('/')}>
            ← Pacientes
          </button>
          <span className={styles.sep}>/</span>
          <span>{isEditing ? 'Editar paciente' : 'Novo paciente'}</span>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1 className={styles.title}>
              {isEditing ? 'Editar paciente' : 'Cadastrar novo paciente'}
            </h1>
            <p className={styles.subtitle}>
              {isEditing
                ? 'Atualize as informações do paciente abaixo'
                : 'Preencha as informações para adicionar um novo paciente'}
            </p>
          </div>

          {errors.submit && (
            <div className={styles.errorBox}>{errors.submit}</div>
          )}

          {success && (
            <div className={styles.successBox}>
              ✓ Paciente {isEditing ? 'atualizado' : 'cadastrado'} com sucesso! Redirecionando...
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Dados pessoais</h2>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Nome completo *</label>
                  <input
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    name="name"
                    type="text"
                    placeholder="Ex: Ana Paula Silva"
                    value={form.name}
                    onChange={handleChange}
                  />
                  {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Data de nascimento *</label>
                  <input
                    className={`${styles.input} ${errors.birthDate ? styles.inputError : ''}`}
                    name="birthDate"
                    type="date"
                    value={form.birthDate}
                    onChange={handleChange}
                  />
                  {errors.birthDate && <span className={styles.errorMsg}>{errors.birthDate}</span>}
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Contato</h2>
              {errors.contact && <span className={styles.errorMsg}>{errors.contact}</span>}
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Telefone</label>
                  <input
                    className={`${styles.input} ${errors.contact ? styles.inputError : ''}`}
                    name="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>E-mail</label>
                  <input
                    className={`${styles.input} ${errors.contact ? styles.inputError : ''}`}
                    name="email"
                    type="email"
                    placeholder="paciente@email.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Atendimento</h2>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Especialidade *</label>
                  <select
                    className={`${styles.input} ${styles.select} ${errors.specialty ? styles.inputError : ''}`}
                    name="specialty"
                    value={form.specialty}
                    onChange={handleChange}
                  >
                    <option value="">Selecione uma especialidade</option>
                    <option value="fisioterapia">Fisioterapia</option>
                    <option value="nutrição">Nutrição</option>
                    <option value="psicologia">Psicologia</option>
                  </select>
                  {errors.specialty && <span className={styles.errorMsg}>{errors.specialty}</span>}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Observações</label>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  name="observations"
                  placeholder="Informações relevantes sobre o paciente, histórico, restrições, etc."
                  value={form.observations}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>

            <div className={styles.formFooter}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => navigate('/')}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading || success}
              >
                {loading ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Cadastrar paciente'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}