import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet, 
  SafeAreaView,
  Alert 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CategoriaRegistro, DetalheRapido } from '../types/registros.types';

export function NovoRegistroScreen() {
  const router = useRouter();
  
  const [etapaAtiva, setEtapaAtiva] = useState<'conteudo' | 'acontecimento' | 'detalhes'>('acontecimento');
  const [alunoSelecionado, setAlunoSelecionado] = useState('Marina Oliveira');
  const [aulaSelecionada, setAulaSelecionada] = useState('Hoje · Daily routines');
  const [categoria, setCategoria] = useState<CategoriaRegistro>('participou');
  const [detalhesSelecionados, setDetalhesSelecionados] = useState<DetalheRapido[]>(['Espontaneamente']);
  const [observacao, setObservacao] = useState('');

  const toggleDetalhe = (detalhe: DetalheRapido) => {
    if (detalhesSelecionados.includes(detalhe)) {
      setDetalhesSelecionados(detalhesSelecionados.filter(d => d !== detalhe));
    } else {
      setDetalhesSelecionados([...detalhesSelecionados, detalhe]);
    }
  };

  const handleSalvar = () => {
    console.log({
      aluno: alunoSelecionado,
      aula: aulaSelecionada,
      categoria,
      detalhes: detalhesSelecionados,
      observacao,
    });

    Alert.alert("Sucesso", "Registro salvo com sucesso!", [
      { text: "OK", onPress: () => router.back() }
    ]);
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
          <TouchableOpacity style={[styles.stepActive, etapaAtiva === 'acontecimento' && styles.stepActiveSelected]} onPress={() => setEtapaAtiva('acontecimento')}>
            <Text style={styles.stepTextActive}>2. Acontecimento</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stepInactive} onPress={() => setEtapaAtiva('detalhes')}>
            <Text style={styles.stepTextInactive}>3. Detalhes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quem e em qual aula?</Text>
          
          <TouchableOpacity style={styles.dropdownField}>
            <View style={styles.dropdownLeft}>
              <View style={styles.avatarMini}><Text style={styles.avatarMiniText}>MO</Text></View>
              <View>
                <Text style={styles.fieldLabelSmall}>ALUNO</Text>
                <Text style={styles.fieldValue}>{alunoSelecionado}</Text>
              </View>
            </View>
            <Ionicons name="chevron-down" size={18} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.dropdownField, { marginTop: 10 }]}>
            <View style={styles.dropdownLeft}>
              <Ionicons name="calendar-outline" size={20} color="#2563EB" style={{ marginRight: 8 }} />
              <View>
                <Text style={styles.fieldLabelSmall}>AULA</Text>
                <Text style={styles.fieldValue}>{aulaSelecionada}</Text>
              </View>
            </View>
            <Ionicons name="chevron-down" size={18} color="#64748B" />
          </TouchableOpacity>
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
                  style={[styles.gridItem, isSelected && styles.gridItemSelected, item.alert && isSelected && styles.gridItemAlertSelected]}
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

        <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
          <Text style={styles.saveButtonText}>Salvar registro</Text>
        </TouchableOpacity>
      </ScrollView>
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
  avatarMini: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center' },
  avatarMiniText: { fontSize: 12, fontWeight: 'bold', color: '#15803D' },
  fieldLabelSmall: { fontSize: 10, color: '#64748B', fontWeight: '500' },
  fieldValue: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
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
  saveButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' }
});