export interface ConfiguracoesPreferencias {
  lembreteDiario: boolean;
  alertaSemRegistro7Dias: boolean;
  transcricaoAutomatica: boolean;
  notificacoesPush: boolean;
  somAoRegistrar: boolean;
}

export interface EditarPerfilInput {
  nome: string;
  email: string;
  escola: string;
  telefone?: string;
}

export interface AlterarSenhaInput {
  senhaAtual: string;
  novaSenha: string;
  confirmarNovaSenha: string;
}
