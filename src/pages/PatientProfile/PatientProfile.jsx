import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import styles from './PatientProfile.module.css';

const SPECIALTY_LABELS = {
  fisioterapia: 'Fisioterapia',
  'nutrição': 'Nutrição',
  psicologia: 'Psicologia',
};

const SPECIALTY_COLORS = {
  fisioterapia: styles.tagFisio,
  'nutrição': styles.tagNutri,
  psicologia: styles.tagPsico,
};

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/patients/${id}`)
      .then((res) => setPatient(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (loading) {
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
          <span>{patient.name}</span>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.avatar}>
              {patient.name.charAt(0).toUpperCase()}
            </div>
            <div className={styles.headerInfo}>
              <h1 className={styles.name}>{patient.name}</h1>
              <span className={`${styles.tag} ${SPECIALTY_COLORS[patient.specialty]}`}>
                {SPECIALTY_LABELS[patient.specialty] || patient.specialty}
              </span>
            </div>
            <div className={styles.headerActions}>
              <button
                className={styles.editBtn}
                onClick={() => navigate(`/patients/${id}/edit`)}
              >
                Editar
              </button>
            </div>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Dados pessoais</h2>
              <div className={styles.grid}>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Nome completo</span>
                  <span className={styles.fieldValue}>{patient.name}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Data de nascimento</span>
                  <span className={styles.fieldValue}>{formatDate(patient.birthDate)}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Cadastrado em</span>
                  <span className={styles.fieldValue}>{formatDate(patient.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Contato</h2>
              <div className={styles.grid}>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Telefone</span>
                  <span className={styles.fieldValue}>{patient.contact?.phone || '—'}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>E-mail</span>
                  <span className={styles.fieldValue}>{patient.contact?.email || '—'}</span>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Atendimento</h2>
              <div className={styles.grid}>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Especialidade</span>
                  <span className={styles.fieldValue}>
                    {SPECIALTY_LABELS[patient.specialty] || patient.specialty}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Observações</h2>
              <p className={styles.observations}>
                {patient.observations || 'Nenhuma observação registrada.'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}