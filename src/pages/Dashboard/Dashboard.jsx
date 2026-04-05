import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import styles from './Dashboard.module.css';

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

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    let result = patients;
    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.contact?.email?.toLowerCase().includes(search.toLowerCase()) ||
        p.contact?.phone?.includes(search)
      );
    }
    if (specialtyFilter) {
      result = result.filter(p => p.specialty === specialtyFilter);
    }
    setFiltered(result);
  }, [search, specialtyFilter, patients]);

  const fetchPatients = async () => {
    try {
      const res = await api.get('/patients');
      setPatients(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/patients/${deleteId}`);
      setPatients(prev => prev.filter(p => p._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Pacientes</h1>
            <p className={styles.subtitle}>{patients.length} paciente{patients.length !== 1 ? 's' : ''} cadastrado{patients.length !== 1 ? 's' : ''}</p>
          </div>
          <button className={styles.addBtn} onClick={() => navigate('/patients/new')}>
            + Novo paciente
          </button>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {patients.filter(p => p.specialty === 'fisioterapia').length}
            </span>
            <span className={styles.statLabel}>Fisioterapia</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {patients.filter(p => p.specialty === 'nutrição').length}
            </span>
            <span className={styles.statLabel}>Nutrição</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {patients.filter(p => p.specialty === 'psicologia').length}
            </span>
            <span className={styles.statLabel}>Psicologia</span>
          </div>
        </div>

        <div className={styles.filters}>
          <input
            className={styles.search}
            type="text"
            placeholder="Buscar por nome, e-mail ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className={styles.select}
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
          >
            <option value="">Todas as especialidades</option>
            <option value="fisioterapia">Fisioterapia</option>
            <option value="nutrição">Nutrição</option>
            <option value="psicologia">Psicologia</option>
          </select>
        </div>

        {loading ? (
          <div className={styles.empty}>
            <p>Carregando...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🌿</span>
            <p>Nenhum paciente encontrado</p>
            <button className={styles.addBtnSm} onClick={() => navigate('/patients/new')}>
              Cadastrar primeiro paciente
            </button>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Nascimento</th>
                  <th>Contato</th>
                  <th>Especialidade</th>
                  <th>Observações</th>
                  <th>Cadastrado em</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((patient) => (
                  <tr key={patient._id}>
                    <td>
                      <div
                        className={styles.patientName}
                        onClick={() => navigate(`/patients/${patient._id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className={styles.avatar}>
                          {patient.name.charAt(0).toUpperCase()}
                        </div>
                        <span className={styles.nameLink}>{patient.name}</span>
                      </div>
                    </td>
                    <td>{formatDate(patient.birthDate)}</td>
                    <td>
                      <div className={styles.contact}>
                        {patient.contact?.phone && <span>{patient.contact.phone}</span>}
                        {patient.contact?.email && <span className={styles.email}>{patient.contact.email}</span>}
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.tag} ${SPECIALTY_COLORS[patient.specialty]}`}>
                        {SPECIALTY_LABELS[patient.specialty] || patient.specialty}
                      </span>
                    </td>
                    <td>
                      <span className={styles.obs}>
                        {patient.observations || '—'}
                      </span>
                    </td>
                    <td>
                      <span className={styles.date}>
                        {formatDate(patient.createdAt)}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.editBtn}
                          onClick={() => navigate(`/patients/${patient._id}/edit`)}
                        >
                          Editar
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => setDeleteId(patient._id)}
                        >
                          Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {deleteId && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Remover paciente</h3>
            <p className={styles.modalText}>
              Tem certeza que deseja remover este paciente? Essa ação não pode ser desfeita.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteId(null)}>
                Cancelar
              </button>
              <button className={styles.confirmBtn} onClick={handleDelete}>
                Confirmar remoção
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}