import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CategoriaRegistro, DetalheRapido } from '../types/registros.types';
import { ApiError } from '@/services/api';
import { AulaApi, aulaService } from '@/services/aula.service';
import { RegistroPayload, registroService } from '@/services/registro.service';

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

  const textoComposto = partes.length > 0 ? partes.join(' - ') : 'Registrado';
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

export function NovoRegistroScreen() {
  const router = useRouter();

  const [etapaAtiva, setEtapaAtiva] = useState<'conteudo' | 'acontecimento' | 'detalhes'>('acontecimento');
  const [aulas, setAulas] = useState<AulaApi[]>([]);
  const [aulaSelecionada, setAulaSelecionada] = useState<AulaApi | null>(null);
  const [alunoIdManual, setAlunoIdManual] = useState('1');
  const [aulaIdManual, setAulaIdManual] = useState('1');
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [modalAulaVisivel, setModalAulaVisivel] = useState(false);

  const [categoria, setCategoria] = useState<CategoriaRegistro>('participou');
  const [detalhesSelecionados, setDetalhesSelecionados] = useState<DetalheRapido[]>(['Espontaneamente']);
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregarAulas() {
      try {
        setCarregandoDados(true);
        const [resAulas] = await Promise.allSettled([aulaService.listar()]);

        if (!ativo) return;

        const listaAulas = resAulas.status === 'fulfilled' ? resAulas.value : [];
        setAulas(listaAulas);

        const aulaInicial = listaAulas[0] ?? null;
        setAulaSelecionada(aulaInicial);
        if (aulaInicial?.id) {
          setAulaIdManual(String(aulaInicial.id));
        }
      } finally {
        if (ativo) setCarregandoDados(false);
      }
    }

    carregarAulas();
    return () => {
      ativo = false;
    };
  }, []);

  const handleSelecionarAula = (aula: AulaApi) => {
    setAulaSelecionada(aula);
    setAulaIdManual(String(aula.id));
    setModalAulaVisivel(false);
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

    const alunoIdFinal = Number(alunoIdManual);
    const aulaIdFinal = aulaSelecionada?.id ?? Number(aulaIdManual);

    if (
      !Number.isInteger(alunoIdFinal) ||
      alunoIdFinal <= 0 ||
      !Number.isInteger(aulaIdFinal) ||
      aulaIdFinal <= 0
    ) {
      Alert.alert('Atenção', 'Informe um ID válido para o aluno e para a aula antes de salvar.');
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
        observacao,
      });

      await registroService.criar(payload);

      Alert.alert('Sucesso', 'Registro salvo com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
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
        <View style={styles.headerTitleRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>T</Text>
          </View>
          <Text style={styles.headerTitle}>Novo registro</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={20} color="#334155" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.mainHeading}>Novo registro</Text>
          <Text style={styles.subHeading}>Registre um acontecimento em poucos cliques durante a aula.</Text>
        </View>

        <TouchableOpacity
          style={styles.audioBanner}
          onPress={() => router.push('/registros/audio' as any)}
        >
          <View style={styles.audioBannerHeader}>
            <View>
              <Text style={styles.audioBannerTitle}>Registro por áudio</Text>
              <Text style={styles.audioBannerSubtitle}>Grave um trecho curto e a transcrição aparece aqui para revisão.</Text>
            </View>
            <View style={styles.mvpBadge}>
              <Text style={styles.mvpBadgeText}>MVP</Text>
            </View>
          </View>
          <View style={styles.audioBannerAction}>
            <View style={styles.micIconContainer}>
              <Ionicons name="mic" size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.audioBannerActionText}>Clique para gravar e gerar texto</Text>
          </View>
          <View style={styles.audioBannerTags}>
            <View style={styles.tagItem}>
              <Feather name="mic" size={12} color="#2563EB" />
              <Text style={styles.tagText}>Gravar</Text>
            </View>
            <View style={styles.tagItem}>
              <MaterialCommunityIcons name="text-recognition" size={12} color="#059669" />
              <Text style={[styles.tagText, { color: '#059669' }]}>Transcrição</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.stepsContainer}>
          <TouchableOpacity style={styles.stepInactive} onPress={() => setEtapaAtiva('conteudo')}>
            <Text style={styles.stepTextInactive}>1. Contexto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.stepActive, etapaAtiva === 'acontecimento' && styles.stepActiveSelected]}
            onPress={() => setEtapaAtiva('acontecimento')}
          >
            <Text style={styles.stepTextActive}>2. Acontecimento</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stepInactive} onPress={() => setEtapaAtiva('detalhes')}>
            <Text style={styles.stepTextInactive}>3. Detalhes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quem e em qual aula?</Text>

          {carregandoDados ? (
            <ActivityIndicator color="#2563EB" style={{ marginVertical: 12 }} />
          ) : (
            <>
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

              {aulas.length > 0 ? (
                <TouchableOpacity
                  style={[styles.dropdownField, { marginTop: 10 }]}
                  onPress={() => setModalAulaVisivel(true)}
                >
                  <View style={styles.dropdownLeft}>
                    <Ionicons name="calendar-outline" size={20} color="#2563EB" style={{ marginRight: 8 }} />
                    <View>
                      <Text style={styles.fieldLabelSmall}>AULA</Text>
                      <Text style={styles.fieldValue}>
                        {aulaSelecionada
                          ? `${aulaSelecionada.nome}${aulaSelecionada.assunto ? ` · ${aulaSelecionada.assunto}` : ''}`
                          : 'Selecionar aula'}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-down" size={18} color="#64748B" />
                </TouchableOpacity>
              ) : (
                <View style={{ marginTop: 10 }}>
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

        <View style={styles.card}>
          <Text style={styles.cardTitle}>O que aconteceu?</Text>

          <View style={styles.gridContainer}>
            {[
              { id: 'participou', label: 'Participou', icon: 'hand-left-outline' },
              { id: 'realizou_atividade', label: 'Realizou atividade', icon: 'book-outline' },
              { id: 'respondeu_comandos', label: 'Respondeu comandos', icon: 'chatbubbles-outline' },
              { id: 'dificuldade', label: 'Dificuldade', icon: 'alert-circle-outline', alert: true },
              { id: 'conquista', label: 'Conquista', icon: 'ribbon-outline' },
              { id: 'observacao_livre', label: 'Observação livre', icon: 'document-text-outline' },
            ].map((item) => {
              const isSelected = categoria === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.gridItem,
                    isSelected && styles.gridItemSelected,
                    item.alert && isSelected && styles.gridItemAlertSelected,
                  ]}
                  onPress={() => setCategoria(item.id as CategoriaRegistro)}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={isSelected ? (item.alert ? '#DC2626' : '#2563EB') : '#64748B'}
                  />
                  <Text style={[styles.gridItemText, isSelected && styles.gridItemTextSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Detalhes rápidos</Text>

          <View style={styles.chipsContainer}>
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

          <TextInput
            style={styles.textArea}
            placeholder="Adicionar uma observação opcional..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            value={observacao}
            onChangeText={setObservacao}
          />
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
                  onPress={() => handleSelecionarAula(aula)}
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoBadge: { width: 32, height: 32, backgroundColor: '#2563EB', borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  logoText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1E293B' },
  notificationButton: { padding: 8 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  sectionHeader: { marginBottom: 16 },
  mainHeading: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },
  subHeading: { fontSize: 13, color: '#64748B', marginTop: 2 },
  audioBanner: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', borderRadius: 12, padding: 14, marginBottom: 16 },
  audioBannerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  audioBannerTitle: { fontSize: 14, fontWeight: 'bold', color: '#1E3A8A' },
  audioBannerSubtitle: { fontSize: 12, color: '#3B82F6', marginTop: 2, maxWidth: '85%' },
  mvpBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  mvpBadgeText: { fontSize: 10, fontWeight: 'bold', color: '#1D4ED8' },
  audioBannerAction: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, backgroundColor: '#2563EB', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'flex-start' },
  micIconContainer: { width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  audioBannerActionText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  audioBannerTags: { flexDirection: 'row', gap: 12, marginTop: 10 },
  tagItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tagText: { fontSize: 11, fontWeight: '500', color: '#2563EB' },
  stepsContainer: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 8, padding: 3, marginBottom: 16 },
  stepInactive: { flex: 1, paddingVertical: 6, alignItems: 'center' },
  stepTextInactive: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  stepActive: { flex: 1, paddingVertical: 6, alignItems: 'center', borderRadius: 6 },
  stepActiveSelected: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 2 },
  stepTextActive: { fontSize: 12, color: '#0F172A', fontWeight: '600' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#E2E8F0' },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 10 },
  dropdownField: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 10 },
  dropdownLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  fieldLabelSmall: { fontSize: 10, color: '#64748B', fontWeight: '500', marginBottom: 4 },
  fieldValue: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  idInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 10, fontSize: 13, color: '#0F172A' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gridItem: { width: '31%', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center', minHeight: 74 },
  gridItemSelected: { backgroundColor: '#EFF6FF', borderColor: '#2563EB' },
  gridItemAlertSelected: { backgroundColor: '#FEF2F2', borderColor: '#DC2626' },
  gridItemText: { fontSize: 11, color: '#475569', textAlign: 'center', marginTop: 6, fontWeight: '500' },
  gridItemTextSelected: { color: '#1E3A8A', fontWeight: '600' },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  chipActive: { backgroundColor: '#EFF6FF', borderColor: '#93C5FD' },
  chipText: { fontSize: 12, color: '#475569' },
  chipTextActive: { color: '#1D4ED8', fontWeight: '600' },
  textArea: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 10, fontSize: 13, color: '#0F172A', textAlignVertical: 'top', height: 70 },
  saveButton: { backgroundColor: '#2563EB', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  saveButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 15, fontWeight: 'bold', color: '#0F172A', marginBottom: 12 },
  modalOption: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalOptionText: { fontSize: 14, color: '#1E293B' },
});