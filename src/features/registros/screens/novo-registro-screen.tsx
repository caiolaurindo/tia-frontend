import React, { type ComponentRef, useEffect, useRef, useState } from 'react';
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
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CategoriaRegistro, DetalheRapido } from '../types/registros.types';
import { ApiError } from '@/services/api';
import { alunoService, turmaConquistaService } from '@/services/aluno.service';
import { AulaApi, aulaService } from '@/services/aula.service';
import { RegistroPayload, registroService } from '@/services/registro.service';

const ROTA_DASHBOARD = '/home' as any;

type EtapaRegistro = 'conteudo' | 'acontecimento' | 'detalhes';

type AlunoItem = {
  id: number;
  nome: string;
  turmaId?: number;
  turma_id?: number;
};

type ConquistaTurmaItem = { conquistaId: number; nome: string };

function formatarDataISO(date = new Date()): string {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function avisar(titulo: string, mensagem: string) {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
}

function montarPayloadRegistro(params: {
  alunoId: number;
  aulaId?: number | null;
  conquistaId?: number | null;
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
    data: params.data ?? formatarDataISO(),
  };
  if (params.aulaId) payload.aulaId = params.aulaId;

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
      if (params.conquistaId) {
        // Conquista estruturada: sem o prefixo "Conquista:".
        payload.conquistaId = params.conquistaId;
        payload.observacoesLivres = textoLivre;
      } else {
        payload.observacoesLivres = `Conquista: ${textoComposto}`;
      }
      break;
    case 'observacao_livre':
      payload.observacoesLivres = textoLivre;
      break;
  }

  return payload;
}

export function NovoRegistroScreen() {
  const router = useRouter();
    const params = useLocalSearchParams<{ alunoId?: string; aulaId?: string; turmaId?: string }>();

  const scrollViewRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const posicoesSecoes = useRef<Record<EtapaRegistro, number>>({
    conteudo: 0,
    acontecimento: 0,
    detalhes: 0,
  });

  const [etapaAtiva, setEtapaAtiva] = useState<EtapaRegistro>('conteudo');
  const [aulas, setAulas] = useState<AulaApi[]>([]);
  const [aulaSelecionada, setAulaSelecionada] = useState<AulaApi | null>(null);
  const [alunos, setAlunos] = useState<AlunoItem[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState<AlunoItem | null>(null);
  const [conquistasTurma, setConquistasTurma] = useState<ConquistaTurmaItem[]>([]);
  const [conquistaSelecionada, setConquistaSelecionada] = useState<ConquistaTurmaItem | null>(null);
  const [modalConquistaVisivel, setModalConquistaVisivel] = useState(false);

  const [alunoIdManual, setAlunoIdManual] = useState(params.alunoId ?? '');
  const [aulaIdManual, setAulaIdManual] = useState('');
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [modalAulaVisivel, setModalAulaVisivel] = useState(false);
  const [modalAlunoVisivel, setModalAlunoVisivel] = useState(false);

  const [categoria, setCategoria] = useState<CategoriaRegistro>('participou');
  const [detalhesSelecionados, setDetalhesSelecionados] = useState<DetalheRapido[]>(['Espontaneamente']);
  const [observacao, setObservacao] = useState('');

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

        const todasAulas = resAulas.status === 'fulfilled' ? resAulas.value : [];
        // Só aulas da turma do aluno escolhido (o backend exige a mesma turma).
        const turmaDoAluno = params.turmaId;
        const listaAulas = turmaDoAluno
          ? todasAulas.filter((a) => {
              const t = a.turmaId ?? a.turma?.id;
              return t === undefined || String(t) === turmaDoAluno;
            })
          : todasAulas;
        setAulas(listaAulas);

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
   }, [params.alunoId, params.aulaId, params.turmaId]);

       useEffect(() => {
    const turmaDoAluno =
      params.turmaId ??
      (alunoSelecionado?.turmaId ?? alunoSelecionado?.turma_id)?.toString();

    // Troca de aluno/turma: limpa a conquista escolhida antes de carregar a nova lista.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConquistaSelecionada(null);
    if (!turmaDoAluno) {
      setConquistasTurma([]);
      return;
    }

    let ativo = true;
    turmaConquistaService
      .listarPorTurma(turmaDoAluno)
      .then((lista) => {
        if (!ativo) return;
        setConquistasTurma(
          lista.map((v) => ({
            conquistaId: v.conquistaId,
            nome: v.conquista?.nome ?? `Conquista ${v.conquistaId}`,
          }))
        );
      })
      .catch(() => {
        if (ativo) setConquistasTurma([]);
      });
    return () => {
      ativo = false;
    };
  }, [params.turmaId, alunoSelecionado]);

  const irParaEtapa = (etapa: EtapaRegistro) => {
    setEtapaAtiva(etapa);
    const destinoY = Math.max(0, posicoesSecoes.current[etapa] - 12);
    scrollViewRef.current?.scrollTo({ y: destinoY, animated: true });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y + 80;
    const { conteudo, acontecimento, detalhes } = posicoesSecoes.current;

    if (detalhes > 0 && scrollY >= detalhes) {
      setEtapaAtiva('detalhes');
    } else if (acontecimento > 0 && scrollY >= acontecimento) {
      setEtapaAtiva('acontecimento');
    } else if (conteudo > 0) {
      setEtapaAtiva('conteudo');
    }
  };

    const handleSelecionarAula = (aula: AulaApi | null) => {
    setAulaSelecionada(aula);
    setAulaIdManual(aula ? String(aula.id) : '');
    setModalAulaVisivel(false);
  };

  const handleSelecionarAluno = (aluno: AlunoItem) => {
    setAlunoSelecionado(aluno);
    setAlunoIdManual(String(aluno.id));
    setModalAlunoVisivel(false);
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

    if (!Number.isInteger(alunoIdFinal) || alunoIdFinal <= 0) {
      avisar('Atenção', 'Selecione um aluno antes de salvar.');
      return;
    }

    const aulaIdFinal = aulaSelecionada?.id ?? null;

    try {
      setSalvando(true);

      // Com aula, usa a data dela; sem aula, a data de hoje.
      const dataRegistro = aulaSelecionada?.data
        ? aulaSelecionada.data.slice(0, 10)
        : formatarDataISO();

      const payload = montarPayloadRegistro({
        alunoId: alunoIdFinal,
        aulaId: aulaIdFinal,
        conquistaId: conquistaSelecionada?.conquistaId ?? null,
        data: dataRegistro,
        categoria,
        detalhes: detalhesSelecionados,
        observacao,
      });

      await registroService.criar(payload);

      if (Platform.OS === 'web') {
        router.back();
      } else {
        Alert.alert('Sucesso', 'Registro salvo com sucesso!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      const mensagem =
        error instanceof ApiError
          ? error.message
          : 'Não foi possível salvar o registro. Tente novamente.';
      avisar('Erro ao salvar', mensagem);
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
              contentFit="cover"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.headerTitle}>Novo registro</Text>

        <TouchableOpacity
          style={styles.circleButton}
          onPress={() => router.replace(ROTA_DASHBOARD)}
        >
          <Ionicons name="home-outline" size={20} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.mainHeading}>Novo registro</Text>
          <Text style={styles.subHeading}>Registre um acontecimento em poucos cliques durante a aula.</Text>
        </View>

        <TouchableOpacity
          style={styles.audioBanner}
          activeOpacity={0.85}
          onPress={() => router.push('/registros/audio' as any)}
        >
          <View style={styles.audioBannerHeader}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.audioBannerTitle}>Registro por áudio</Text>
              <Text style={styles.audioBannerSubtitle}>
                Grave um trecho curto e a transcrição aparece aqui para revisão.
              </Text>
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
              <Feather name="mic" size={13} color="#2563EB" />
              <Text style={styles.tagText}>Gravar</Text>
            </View>
            <View style={styles.tagItem}>
              <MaterialCommunityIcons name="text-recognition" size={13} color="#059669" />
              <Text style={[styles.tagText, { color: '#059669' }]}>Transcrição</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.stepsContainer}>
          <TouchableOpacity
            style={[styles.stepTab, etapaAtiva === 'conteudo' && styles.stepTabSelected]}
            onPress={() => irParaEtapa('conteudo')}
          >
            <Text style={[styles.stepText, etapaAtiva === 'conteudo' && styles.stepTextSelected]}>
              1. Contexto
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.stepTab, etapaAtiva === 'acontecimento' && styles.stepTabSelected]}
            onPress={() => irParaEtapa('acontecimento')}
          >
            <Text style={[styles.stepText, etapaAtiva === 'acontecimento' && styles.stepTextSelected]}>
              2. Acontecimento
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.stepTab, etapaAtiva === 'detalhes' && styles.stepTabSelected]}
            onPress={() => irParaEtapa('detalhes')}
          >
            <Text style={[styles.stepText, etapaAtiva === 'detalhes' && styles.stepTextSelected]}>
              3. Detalhes
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[styles.card, etapaAtiva === 'conteudo' && styles.cardActive]}
          onLayout={(e) => {
            posicoesSecoes.current.conteudo = e.nativeEvent.layout.y;
          }}
        >
          <Text style={styles.cardTitle}>Quem e em qual aula?</Text>

          {carregandoDados ? (
            <ActivityIndicator color="#2563EB" style={{ marginVertical: 12 }} />
          ) : (
            <>
              {alunos.length > 0 ? (
                              <TouchableOpacity
                style={[styles.dropdownField, { marginTop: 12 }]}
                onPress={() => setModalAulaVisivel(true)}
              >
                <View style={styles.dropdownLeft}>
                  <Ionicons name="calendar-outline" size={20} color="#2563EB" />
                  <View>
                    <Text style={styles.fieldLabelSmall}>AULA (OPCIONAL)</Text>
                    <Text style={styles.fieldValue}>
                      {aulaSelecionada
                        ? `${aulaSelecionada.nome}${aulaSelecionada.assunto ? ` · ${aulaSelecionada.assunto}` : ''}`
                        : 'Sem aula (data de hoje)'}
                    </Text>
                  </View>
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
                  <View style={styles.dropdownLeft}>
                    <Ionicons name="calendar-outline" size={20} color="#2563EB" />
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
              ) : params.turmaId ? (
                <Text style={[styles.fieldLabelSmall, { marginTop: 12 }]}>
                  A turma deste aluno ainda não tem aulas. Cadastre uma aula na
                  tela de Aulas antes de registrar.
                </Text>
              ) :
               (
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

        <View
          style={[styles.card, etapaAtiva === 'acontecimento' && styles.cardActive]}
          onLayout={(e) => {
            posicoesSecoes.current.acontecimento = e.nativeEvent.layout.y;
          }}
        >
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
                  <Text
                    style={[
                      styles.gridItemText,
                      isSelected && styles.gridItemTextSelected,
                      item.alert && isSelected && { color: '#B91C1C' },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
                    {categoria === 'conquista' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Qual conquista?</Text>
            {conquistasTurma.length > 0 ? (
              <TouchableOpacity
                style={styles.dropdownField}
                onPress={() => setModalConquistaVisivel(true)}
              >
                <View style={styles.dropdownLeft}>
                  <Ionicons name="ribbon-outline" size={20} color="#2563EB" />
                  <View>
                    <Text style={styles.fieldLabelSmall}>CONQUISTA DA TURMA</Text>
                    <Text style={styles.fieldValue}>
                      {conquistaSelecionada?.nome ?? 'Selecionar conquista'}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-down" size={18} color="#64748B" />
              </TouchableOpacity>
            ) : (
              <Text style={styles.fieldLabelSmall}>
                A turma deste aluno não tem conquistas vinculadas. O registro será salvo
                como texto.
              </Text>
            )}
          </View>
        )}
        <View
          style={[styles.card, etapaAtiva === 'detalhes' && styles.cardActive]}
          onLayout={(e) => {
            posicoesSecoes.current.detalhes = e.nativeEvent.layout.y;
          }}
        >
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
                  onPress={() => handleSelecionarAluno(aluno)}
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
                      <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleSelecionarAula(null)}
              >
                <Text style={styles.modalOptionText}>Sem aula (data de hoje)</Text>
              </TouchableOpacity>

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
            <Modal
        visible={modalConquistaVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalConquistaVisivel(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalConquistaVisivel(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione a conquista</Text>
            <ScrollView style={{ maxHeight: 280 }}>
              {conquistasTurma.map((c) => (
                <TouchableOpacity
                  key={c.conquistaId}
                  style={styles.modalOption}
                  onPress={() => {
                    setConquistaSelecionada(c);
                    setModalConquistaVisivel(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{c.nome}</Text>
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
  sectionHeader: { marginBottom: 16 },
  mainHeading: { fontSize: 26, fontWeight: '800', color: '#0F172A', letterSpacing: -0.4 },
  subHeading: { fontSize: 14, color: '#64748B', marginTop: 4, lineHeight: 20 },
  audioBanner: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  audioBannerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  audioBannerTitle: { fontSize: 15, fontWeight: '700', color: '#1E3A8A' },
  audioBannerSubtitle: { fontSize: 13, color: '#2563EB', marginTop: 3, lineHeight: 18 },
  mvpBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  mvpBadgeText: { fontSize: 11, fontWeight: '700', color: '#1D4ED8' },
  audioBannerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  micIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioBannerActionText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  audioBannerTags: { flexDirection: 'row', gap: 14, marginTop: 12 },
  tagItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  tagText: { fontSize: 12, fontWeight: '600', color: '#2563EB' },
  stepsContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 3,
    marginBottom: 16,
  },
  stepTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 9 },
  stepTabSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  stepText: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  stepTextSelected: { color: '#0F172A', fontWeight: '700' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardActive: {
    borderColor: '#93C5FD',
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
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
  dropdownLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
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
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  gridItem: {
    width: '31.5%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  gridItemSelected: { backgroundColor: '#EFF6FF', borderColor: '#2563EB' },
  gridItemAlertSelected: { backgroundColor: '#FEF2F2', borderColor: '#DC2626' },
  gridItemText: { fontSize: 12, color: '#475569', textAlign: 'center', marginTop: 6, fontWeight: '500' },
  gridItemTextSelected: { color: '#1E3A8A', fontWeight: '700' },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
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
  textArea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#0F172A',
    textAlignVertical: 'top',
    minHeight: 84,
  },
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