import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CategoriaRegistro, DetalheRapido } from '../types/registros.types';
import { AudioWave } from '../components/audio-wave';
import { ApiError } from '@/services/api';
import { alunoService } from '@/services/aluno.service';
import { AulaApi, aulaService } from '@/services/aula.service';
import { RegistroPayload, registroService } from '@/services/registro.service';

const ROTA_DASHBOARD = '/home' as any;

type AlunoItem = {
  id: number;
  nome: string;
  turmaId?: number;
  turma_id?: number;
};

function formatarDataISO(date = new Date()): string {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function montarPayloadRegistro(params: {
  alunoId: number;
  aulaId: number;
  data?: string;
  categoria: CategoriaRegistro;
  detalhes: DetalheRapido[];
  observacao: string;
}): RegistroPayload {
  const partes: string[] = [];
  if (params.detalhes.length > 0) {
    partes.push(params.detalhes.join(', '));
  }
  if (params.observacao.trim()) {
    partes.push(params.observacao.trim());
  }

  const textoComposto = partes.length > 0 ? partes.join(' - ') : 'Registrado por áudio';
  const textoLivre =
    partes.length > 0 ? partes.join(' - ') : params.observacao.trim() || null;

  const payload: RegistroPayload = {
    alunoId: params.alunoId,
    aulaId: params.aulaId,
    data: params.data ?? formatarDataISO(),
  };

  switch (params.categoria) {
    case 'participou':
      payload.participacao = textoComposto;
      break;
    case 'realizou_atividade':
      payload.realizouAtividade = textoComposto;
      break;
    case 'respondeu_comandos':
      payload.seguiuComandos = textoComposto;
      break;
    case 'dificuldade':
      payload.dificuldades = textoComposto;
      break;
    case 'conquista':
      payload.observacoesLivres = `Conquista: ${textoComposto}`;
      break;
    case 'observacao_livre':
      payload.observacoesLivres = textoLivre;
      break;
  }

  return payload;
}

export function RegistroAudioScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ alunoId?: string; aulaId?: string }>();

  const [estadoGravacao, setEstadoGravacao] = useState<'parado' | 'gravando' | 'pausado' | 'finalizado'>('parado');
  const [tempoGravacao, setTempoGravacao] = useState(0);
  const [textoTranscrito, setTextoTranscrito] = useState('');

  const [aulas, setAulas] = useState<AulaApi[]>([]);
  const [aulaSelecionada, setAulaSelecionada] = useState<AulaApi | null>(null);
  const [alunos, setAlunos] = useState<AlunoItem[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState<AlunoItem | null>(null);

  const [alunoIdManual, setAlunoIdManual] = useState('1');
  const [aulaIdManual, setAulaIdManual] = useState('1');
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [modalAulaVisivel, setModalAulaVisivel] = useState(false);
  const [modalAlunoVisivel, setModalAlunoVisivel] = useState(false);

  const [categoria, setCategoria] = useState<CategoriaRegistro>('participou');
  const [detalhesSelecionados, setDetalhesSelecionados] = useState<DetalheRapido[]>(['Espontaneamente']);

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      try {
        setCarregandoDados(true);
        const [resAulas, resAlunos] = await Promise.allSettled([
          aulaService.listar(),
          alunoService.listar(),
        ]);

        if (!ativo) return;

        const listaAulas = resAulas.status === 'fulfilled' ? resAulas.value : [];
        setAulas(listaAulas);

        const aulaParamId = Number(params.aulaId);
        const aulaInicial =
          listaAulas.find((a) => a.id === aulaParamId) ?? listaAulas[0] ?? null;
        setAulaSelecionada(aulaInicial);
        if (aulaInicial?.id) {
          setAulaIdManual(String(aulaInicial.id));
        }

        const listaAlunos: AlunoItem[] =
          resAlunos.status === 'fulfilled' && Array.isArray(resAlunos.value)
            ? resAlunos.value
            : [];
        setAlunos(listaAlunos);

        const alunoParamId = Number(params.alunoId);
        const alunoInicial =
          listaAlunos.find((al) => al.id === alunoParamId) ?? listaAlunos[0] ?? null;
        setAlunoSelecionado(alunoInicial);
        if (alunoInicial?.id) {
          setAlunoIdManual(String(alunoInicial.id));
        }
      } finally {
        if (ativo) setCarregandoDados(false);
      }
    }

    carregarDados();
    return () => {
      ativo = false;
    };
  }, [params.alunoId, params.aulaId]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (estadoGravacao === 'gravando') {
      interval = setInterval(() => {
        setTempoGravacao((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [estadoGravacao]);

  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleIniciarGravacao = () => {
    setEstadoGravacao('gravando');
    setTempoGravacao(0);
    setTextoTranscrito('');
  };

  const handlePausarRetomar = () => {
    setEstadoGravacao((prev) => (prev === 'gravando' ? 'pausado' : 'gravando'));
  };

  const handleFinalizarGravacao = () => {
    setEstadoGravacao('finalizado');
    if (!textoTranscrito.trim()) {
      setTextoTranscrito('Aluno participou da atividade oral em inglês com boa pronúncia.');
    }
  };

  const toggleDetalhe = (detalhe: DetalheRapido) => {
    if (detalhesSelecionados.includes(detalhe)) {
      setDetalhesSelecionados(detalhesSelecionados.filter((d) => d !== detalhe));
    } else {
      setDetalhesSelecionados([...detalhesSelecionados, detalhe]);
    }
  };

  const handleSalvar = async () => {
    if (salvando) return;

    const alunoIdFinal = alunoSelecionado?.id ?? Number(alunoIdManual);
    const aulaIdFinal = aulaSelecionada?.id ?? Number(aulaIdManual);

    if (
      !Number.isInteger(alunoIdFinal) ||
      alunoIdFinal <= 0 ||
      !Number.isInteger(aulaIdFinal) ||
      aulaIdFinal <= 0
    ) {
      Alert.alert('Atenção', 'Selecione um aluno e uma aula válidos antes de salvar.');
      return;
    }

    try {
      setSalvando(true);

      const dataRegistro = aulaSelecionada?.data
        ? aulaSelecionada.data.slice(0, 10)
        : formatarDataISO();

      const payload = montarPayloadRegistro({
        alunoId: alunoIdFinal,
        aulaId: aulaIdFinal,
        data: dataRegistro,
        categoria,
        detalhes: detalhesSelecionados,
        observacao: textoTranscrito,
      });

      await registroService.criar(payload);

      Alert.alert('Sucesso', 'Registro por áudio salvo com sucesso!', [
        { text: 'OK', onPress: () => router.replace(ROTA_DASHBOARD) },
      ]);
    } catch (error) {
      const mensagem =
        error instanceof ApiError
          ? error.message
          : 'Não foi possível salvar o registro. Tente novamente.';
      Alert.alert('Erro ao salvar', mensagem);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeftGroup}>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => router.replace(ROTA_DASHBOARD)}
          >
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.replace(ROTA_DASHBOARD)}
          >
            <Image
              source={require('../../../../assets/expo.icon/Assets/logo.png')}
              style={styles.appIconImage}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.headerTitle}>Registro por áudio</Text>

        <TouchableOpacity
          style={styles.circleButton}
          onPress={() => router.replace(ROTA_DASHBOARD)}
        >
          <Ionicons name="home-outline" size={20} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contexto do registro</Text>

          {carregandoDados ? (
            <ActivityIndicator color="#2563EB" style={{ marginVertical: 12 }} />
          ) : (
            <>
              {alunos.length > 0 ? (
                <TouchableOpacity
                  style={styles.dropdownField}
                  onPress={() => setModalAlunoVisivel(true)}
                >
                  <View>
                    <Text style={styles.fieldLabelSmall}>ALUNO</Text>
                    <Text style={styles.fieldValue}>
                      {alunoSelecionado
                        ? `${alunoSelecionado.nome} (#${alunoSelecionado.id})`
                        : 'Selecionar aluno'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down" size={18} color="#64748B" />
                </TouchableOpacity>
              ) : (
                <View>
                  <Text style={styles.fieldLabelSmall}>ID DO ALUNO</Text>
                  <TextInput
                    style={styles.idInput}
                    keyboardType="number-pad"
                    placeholder="Ex: 1"
                    placeholderTextColor="#94A3B8"
                    value={alunoIdManual}
                    onChangeText={setAlunoIdManual}
                  />
                </View>
              )}

              {aulas.length > 0 ? (
                <TouchableOpacity
                  style={[styles.dropdownField, { marginTop: 12 }]}
                  onPress={() => setModalAulaVisivel(true)}
                >
                  <View>
                    <Text style={styles.fieldLabelSmall}>AULA</Text>
                    <Text style={styles.fieldValue}>
                      {aulaSelecionada
                        ? `${aulaSelecionada.nome}${aulaSelecionada.assunto ? ` · ${aulaSelecionada.assunto}` : ''}`
                        : 'Selecionar aula'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down" size={18} color="#64748B" />
                </TouchableOpacity>
              ) : (
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.fieldLabelSmall}>ID DA AULA</Text>
                  <TextInput
                    style={styles.idInput}
                    keyboardType="number-pad"
                    placeholder="Ex: 1"
                    placeholderTextColor="#94A3B8"
                    value={aulaIdManual}
                    onChangeText={setAulaIdManual}
                  />
                </View>
              )}
            </>
          )}
        </View>

        <View style={styles.recorderCard}>
          <AudioWave active={estadoGravacao === 'gravando'} />
          <Text style={styles.timerText}>{formatarTempo(tempoGravacao)}</Text>
          <Text style={styles.statusText}>
            {estadoGravacao === 'parado' && 'Pronto para gravar'}
            {estadoGravacao === 'gravando' && 'Gravando áudio...'}
            {estadoGravacao === 'pausado' && 'Gravação pausada'}
            {estadoGravacao === 'finalizado' && 'Gravação concluída'}
          </Text>

          <View style={styles.controlsRow}>
            {(estadoGravacao === 'parado' || estadoGravacao === 'finalizado') && (
              <TouchableOpacity style={styles.recordButton} onPress={handleIniciarGravacao}>
                <Ionicons name="mic" size={20} color="#FFFFFF" />
                <Text style={styles.recordButtonText}>
                  {estadoGravacao === 'finalizado' ? 'Gravar novamente' : 'Iniciar gravação'}
                </Text>
              </TouchableOpacity>
            )}

            {(estadoGravacao === 'gravando' || estadoGravacao === 'pausado') && (
              <>
                <TouchableOpacity style={styles.secondaryButton} onPress={handlePausarRetomar}>
                  <Ionicons
                    name={estadoGravacao === 'gravando' ? 'pause' : 'play'}
                    size={18}
                    color="#0F172A"
                  />
                  <Text style={styles.secondaryButtonText}>
                    {estadoGravacao === 'gravando' ? 'Pausar' : 'Retomar'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.finishButton} onPress={handleFinalizarGravacao}>
                  <Ionicons name="stop" size={18} color="#FFFFFF" />
                  <Text style={styles.finishButtonText}>Finalizar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Transcrição / Observação</Text>
          <TextInput
            style={styles.textArea}
            placeholder="A transcrição ou observação aparecerá aqui para revisão..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            value={textoTranscrito}
            onChangeText={setTextoTranscrito}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Categoria e detalhes</Text>

          <View style={styles.chipsContainer}>
            {(
              [
                { id: 'participou', label: 'Participou' },
                { id: 'realizou_atividade', label: 'Realizou atividade' },
                { id: 'respondeu_comandos', label: 'Respondeu comandos' },
                { id: 'dificuldade', label: 'Dificuldade' },
                { id: 'conquista', label: 'Conquista' },
                { id: 'observacao_livre', label: 'Observação livre' },
              ] as { id: CategoriaRegistro; label: string }[]
            ).map((item) => {
              const active = categoria === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setCategoria(item.id)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={[styles.chipsContainer, { marginTop: 10 }]}>
            {(['Espontaneamente', 'Com apoio', 'Em dupla', 'Grupo todo'] as DetalheRapido[]).map((detalhe) => {
              const active = detalhesSelecionados.includes(detalhe);
              return (
                <TouchableOpacity
                  key={detalhe}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => toggleDetalhe(detalhe)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{detalhe}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, (salvando || carregandoDados) && { opacity: 0.7 }]}
          onPress={handleSalvar}
          disabled={salvando || carregandoDados}
        >
          {salvando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar registro</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={modalAlunoVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalAlunoVisivel(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalAlunoVisivel(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o aluno</Text>
            <ScrollView style={{ maxHeight: 280 }}>
              {alunos.map((aluno) => (
                <TouchableOpacity
                  key={aluno.id}
                  style={styles.modalOption}
                  onPress={() => {
                    setAlunoSelecionado(aluno);
                    setAlunoIdManual(String(aluno.id));
                    setModalAlunoVisivel(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>
                    {aluno.nome} (#{aluno.id})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={modalAulaVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalAulaVisivel(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalAulaVisivel(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione a aula</Text>
            <ScrollView style={{ maxHeight: 280 }}>
              {aulas.map((aula) => (
                <TouchableOpacity
                  key={aula.id}
                  style={styles.modalOption}
                  onPress={() => {
                    setAulaSelecionada(aula);
                    setAulaIdManual(String(aula.id));
                    setModalAulaVisivel(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>
                    {aula.nome}
                    {aula.assunto ? ` · ${aula.assunto}` : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appIconImage: {
    width: 34,
    height: 34,
    borderRadius: 10,
  },
  circleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  fieldLabelSmall: { fontSize: 11, color: '#64748B', fontWeight: '600', marginBottom: 4 },
  fieldValue: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  idInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0F172A',
  },
  dropdownField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
  },
  recorderCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    alignItems: 'center',
  },
  timerText: { fontSize: 28, fontWeight: '800', color: '#1E3A8A' },
  statusText: { fontSize: 13, color: '#2563EB', marginTop: 4, marginBottom: 14, fontWeight: '500' },
  controlsRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center' },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  recordButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  secondaryButtonText: { color: '#0F172A', fontSize: 13, fontWeight: '600' },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DC2626',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  finishButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  textArea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#0F172A',
    textAlignVertical: 'top',
    minHeight: 96,
  },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: { backgroundColor: '#EFF6FF', borderColor: '#2563EB' },
  chipText: { fontSize: 12, color: '#475569', fontWeight: '500' },
  chipTextActive: { color: '#1D4ED8', fontWeight: '700' },
  saveButton: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18 },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  modalOption: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalOptionText: { fontSize: 14, color: '#0F172A' },
});