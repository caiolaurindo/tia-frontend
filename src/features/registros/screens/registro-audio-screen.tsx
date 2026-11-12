import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export function RegistroAudioScreen() {
  const router = useRouter();
  const [segundos, setSegundos] = useState(42);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (pausado) return;
    const timer = setInterval(() => {
      setSegundos(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [pausado]);

  const formatarTempo = (totalSegs: number) => {
    const mins = Math.floor(totalSegs / 60);
    const segs = totalSegs % 60;
    return `${String(mins).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
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
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={20} color="#334155" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.badgeTop}>REGISTRO POR ÁUDIO</Text>
          <Text style={styles.mainHeading}>Sua observação, no seu tempo.</Text>
          <Text style={styles.subHeading}>Grave agora. Revise antes de salvar.</Text>
        </View>

        <View style={styles.cardAluno}>
          <View>
            <Text style={styles.labelRegistrando}>REGISTRANDO PARA</Text>
            <View style={styles.alunoRow}>
              <View style={styles.avatarMini}><Text style={styles.avatarMiniText}>MO</Text></View>
              <View>
                <Text style={styles.alunoNome}>Marina Oliveira</Text>
                <Text style={styles.alunoTurma}>English Explorers · 5º A</Text>
              </View>
            </View>
            <View style={styles.aulaEmAndamento}>
              <Ionicons name="calendar-outline" size={14} color="#64748B" />
              <Text style={styles.aulaTexto}>Hoje · Daily routines</Text>
              <Text style={styles.aulaStatus}>Aula em andamento</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Text style={styles.alterarText}>Alterar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardGravacao}>
          <View style={styles.gravandoBadge}>
            <View style={styles.redDot} />
            <Text style={styles.gravandoText}>Gravando agora</Text>
          </View>

          <Text style={styles.timerText}>{formatarTempo(segundos)}</Text>
          <Text style={styles.timerSubText}>Sua observação está sendo capturada</Text>

          <View style={styles.soundWaveContainer}>
            {[12, 24, 18, 35, 42, 20, 30, 15, 25, 38, 45, 22, 16, 28, 34, 19, 12].map((height, i) => (
              <View key={i} style={[styles.soundBar, { height }]} />
            ))}
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity 
              style={styles.controlButtonPausar}
              onPress={() => setPausado(!pausado)}
            >
              <Ionicons name={pausado ? "play" : "pause"} size={16} color="#FFFFFF" />
              <Text style={styles.controlButtonText}>{pausado ? "Retomar" : "Pausar"}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.controlButtonFinalizar}
              onPress={() => alert("Áudio finalizado para transcrição!")}
            >
              <Ionicons name="stop" size={16} color="#0F172A" />
              <Text style={styles.controlButtonFinalizarText}>Finalizar</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cancelarGravacaoButton} onPress={() => router.back()}>
            <Text style={styles.cancelarGravacaoText}>Cancelar gravação</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tipCard}>
          <Ionicons name="information-circle-outline" size={18} color="#2563EB" style={{ marginTop: 2 }} />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.tipTitle}>Sua voz vira texto. Você dá a palavra final.</Text>
            <Text style={styles.tipDesc}>Ao finalizar, revise a transcrição antes de salvar. Nenhum registro é criado durante a gravação.</Text>
          </View>
        </View>

        <View style={styles.cardInstrucoes}>
          <Text style={styles.instrucoesTitulo}>Conte o que você observou</Text>
          <Text style={styles.instrucoesDesc}>Fale o nome da aluna, a atividade e o que aconteceu. Um trecho curto é suficiente.</Text>
          
          <TouchableOpacity 
            style={styles.manualButton}
            onPress={() => router.back()}
          >
            <Feather name="edit-3" size={16} color="#2563EB" />
            <Text style={styles.manualButtonText}>Usar registro manual</Text>
          </TouchableOpacity>
        </View>
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
  closeButton: { padding: 8 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  sectionHeader: { marginBottom: 14 },
  badgeTop: { fontSize: 10, fontWeight: 'bold', color: '#2563EB', letterSpacing: 0.5, marginBottom: 4 },
  mainHeading: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  subHeading: { fontSize: 13, color: '#64748B', marginTop: 2 },
  cardAluno: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  labelRegistrando: { fontSize: 10, color: '#64748B', fontWeight: '600', marginBottom: 6 },
  alunoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  avatarMini: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center' },
  avatarMiniText: { fontSize: 11, fontWeight: 'bold', color: '#15803D' },
  alunoNome: { fontSize: 13, fontWeight: 'bold', color: '#0F172A' },
  alunoTurma: { fontSize: 11, color: '#64748B' },
  aulaEmAndamento: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  aulaTexto: { fontSize: 11, color: '#475569' },
  aulaStatus: { fontSize: 10, color: '#059669', backgroundColor: '#ECFDF5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden', fontWeight: '500' },
  alterarText: { fontSize: 12, color: '#2563EB', fontWeight: '600' },
  cardGravacao: { backgroundColor: '#0F172A', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 14 },
  gravandoBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 12 },
  redDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  gravandoText: { color: '#E2E8F0', fontSize: 11, fontWeight: '500' },
  timerText: { fontSize: 40, fontWeight: 'bold', color: '#FFFFFF', letterSpacing: 1, marginBottom: 4 },
  timerSubText: { fontSize: 12, color: '#94A3B8', marginBottom: 20 },
  soundWaveContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 50, marginBottom: 24 },
  soundBar: { width: 3, backgroundColor: '#60A5FA', borderRadius: 2 },
  controlsRow: { flexDirection: 'row', gap: 10, width: '100%', marginBottom: 16 },
  controlButtonPausar: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155', paddingVertical: 10, borderRadius: 8 },
  controlButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  controlButtonFinalizar: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: '#FFFFFF', paddingVertical: 10, borderRadius: 8 },
  controlButtonFinalizarText: { color: '#0F172A', fontSize: 13, fontWeight: '600' },
  cancelarGravacaoButton: { padding: 4 },
  cancelarGravacaoText: { color: '#94A3B8', fontSize: 12, textDecorationLine: 'underline' },
  tipCard: { flexDirection: 'row', backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', borderRadius: 10, padding: 12, marginBottom: 14 },
  tipTitle: { fontSize: 12, fontWeight: 'bold', color: '#1E3A8A' },
  tipDesc: { fontSize: 11, color: '#3B82F6', marginTop: 2 },
  cardInstrucoes: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 14, alignItems: 'center' },
  instrucoesTitulo: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', marginBottom: 4 },
  instrucoesDesc: { fontSize: 11, color: '#64748B', textAlign: 'center', marginBottom: 12 },
  manualButton: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#BFDBFE', backgroundColor: '#EFF6FF', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  manualButtonText: { color: '#2563EB', fontSize: 12, fontWeight: '600' }
});