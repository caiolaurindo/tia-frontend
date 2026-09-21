# TIA App

Aplicação multiplataforma para acompanhamento do desenvolvimento de alunos de inglês. O TIA ajuda professores a registrar acontecimentos das aulas, consultar o histórico individual dos estudantes e acompanhar conquistas de aprendizagem ao longo do ano letivo.

## Como executar o projeto

Com o terminal aberto na pasta raiz `tia-project-pi4`, execute:

```bash
cd tia-app
npm install
npm start
```

O `npm install` instala as dependências em `node_modules`. O `npm start` inicia o servidor de desenvolvimento do Expo e exibe um QR Code e os atalhos para abrir a aplicação.

Depois que o Expo iniciar, escolha onde executar:

- **celular:** instale o Expo Go, mantenha o aparelho e o computador na mesma rede e leia o QR Code;
- **Android:** pressione `a` no terminal ou execute `npm run android`;
- **Web:** pressione `w` no terminal ou execute `npm run web`;
- **iOS:** pressione `i` no macOS ou execute `npm run ios`.

Para uma instalação limpa e reproduzível, especialmente em integração contínua, substitua `npm install` por:

```bash
npm ci
```

### Pré-requisitos

- [Node.js](https://nodejs.org/) em uma versão LTS recente;
- npm, instalado junto com o Node.js;
- Expo Go para executar em um celular físico;
- Android Studio e Android SDK para usar um emulador Android;
- macOS e Xcode para usar o simulador iOS;
- um navegador moderno para executar a versão Web.

O projeto ainda não utiliza variáveis de ambiente nem exige configuração de serviços externos.

> **Status do projeto:** em desenvolvimento inicial. Atualmente, o repositório contém a base técnica em Expo/React Native e a estrutura planejada dos módulos. As funcionalidades de negócio descritas neste documento representam o escopo do MVP e ainda não estão disponíveis na tela inicial.

## Sobre o projeto

O TIA nasceu para resolver uma necessidade central: transformar observações do cotidiano escolar em um histórico organizado e fácil de consultar. O acompanhamento não é baseado apenas em notas; ele considera participação, atividades, compreensão de comandos, dificuldades, conquistas e outras observações relevantes.

O fluxo principal do produto é:

```text
Professor
   ↓
Cria uma turma e cadastra os alunos
   ↓
Define as conquistas de aprendizagem esperadas
   ↓
Registra uma aula e os acontecimentos observados
   ↓
O sistema organiza os registros por aluno
   ↓
O professor consulta o histórico e acompanha a evolução
```

O princípio do MVP é simples: **registrar o que aconteceu, encontrar essa informação depois e acompanhar como o aluno está evoluindo**.

## Escopo do MVP

O produto foi planejado para oferecer:

- cadastro e autenticação de professores;
- criação e edição de turmas, com série, ano letivo, faixa etária, período e descrição;
- cadastro manual de alunos e acesso ao perfil individual;
- definição de conquistas de aprendizagem por turma ou série;
- cadastro de aulas, conteúdos, atividades e conquistas trabalhadas;
- registros de participação, realização de atividades, resposta a comandos, dificuldades, conquistas e observações livres;
- histórico individual apresentado de forma cronológica;
- visão das conquistas em diferentes estágios de desenvolvimento;
- reunião dos registros da semana para apoiar o relatório semanal;
- dashboard com resumo das turmas e acontecimentos recentes.

### Situação atual da implementação

Neste momento, a aplicação exibe somente uma tela inicial de desenvolvimento. Ainda não há backend, banco de dados, autenticação, cadastro, importação ou persistência de informações implementados. Os diretórios em `src/features` reservam a organização dos módulos futuros.

## Tecnologias

- [Expo](https://expo.dev/) SDK 57;
- [React Native](https://reactnative.dev/) 0.86;
- [React](https://react.dev/) 19;
- [TypeScript](https://www.typescriptlang.org/) com modo estrito;
- [Expo Router](https://docs.expo.dev/router/introduction/) para rotas baseadas em arquivos;
- React Native Web para execução no navegador.

## Scripts disponíveis

| Comando | Finalidade |
| --- | --- |
| `npm start` | Inicia o servidor de desenvolvimento do Expo. |
| `npm run android` | Inicia o Expo e tenta abrir o app no Android. |
| `npm run ios` | Inicia o Expo e tenta abrir o app no simulador iOS. |
| `npm run web` | Inicia a versão web da aplicação. |
| `npm run lint` | Inicia a análise estática do Expo; ainda requer a configuração inicial do ESLint. |

O `package.json` ainda contém o script `reset-project`, herdado do template, mas o arquivo ao qual ele se refere não está presente. Portanto, esse comando não deve ser usado no estado atual do repositório.

## Estrutura atual do projeto

A estrutura existente no repositório é:

```text
tia-project-pi4/
└── tia-app/
    ├── .claude/                # Configurações locais de ferramentas
    ├── .vscode/                # Recomendações e configurações do VS Code
    ├── assets/                 # Ícones, splash screen e imagens estáticas
    ├── node_modules/           # Dependências geradas pelo npm install
    ├── src/
    │   ├── app/                # Telas e rotas do Expo Router
    │   │   ├── _layout.tsx     # Navegador raiz da aplicação
    │   │   └── index.tsx       # Tela inicial atual
    │   ├── components/
    │   │   ├── layout/         # Componentes estruturais compartilhados
    │   │   └── ui/             # Componentes visuais reutilizáveis
    │   ├── constants/          # Constantes da aplicação
    │   ├── contexts/           # Contextos globais do React
    │   ├── features/           # Módulos organizados por domínio
    │   │   ├── alunos/
    │   │   ├── aulas/
    │   │   ├── auth/
    │   │   ├── conquistas/
    │   │   ├── historico/
    │   │   ├── registros/
    │   │   ├── relatorios/
    │   │   └── turmas/
    │   ├── hooks/              # Hooks compartilhados
    │   ├── services/           # Integrações, APIs e persistência
    │   ├── theme/              # Cores, tipografia e tokens visuais
    │   ├── types/              # Tipos e interfaces compartilhados
    │   └── utils/              # Funções utilitárias
    ├── .gitignore              # Arquivos ignorados pelo Git
    ├── app.json                # Configuração do projeto Expo
    ├── LICENSE                 # Licença do projeto
    ├── package-lock.json       # Versões exatas das dependências
    ├── package.json            # Dependências e scripts npm
    ├── README.md               # Documentação do projeto
    └── tsconfig.json           # TypeScript e aliases de importação
```

`node_modules` é criado automaticamente e não deve ser editado ou enviado ao Git. Os diretórios de arquitetura dentro de `src` já existem, mas, nesta fase, a maioria contém apenas arquivos `.gitkeep`. Eles serão preenchidos conforme o MVP for implementado.

### Rotas e imports

O Expo Router transforma arquivos de `src/app` em rotas. Atualmente:

- `src/app/_layout.tsx` define o `Stack` de navegação principal;
- `src/app/index.tsx` representa a rota inicial `/`.

O TypeScript também disponibiliza o alias `@/` para `src/`. Por exemplo:

```ts
import { algumServico } from "@/services/algum-servico";
```

## Verificações de desenvolvimento

Antes de enviar alterações, verifique os tipos:

```bash
npx tsc --noEmit
```

O script `npm run lint` já está declarado, mas o ESLint ainda não foi configurado. Na primeira execução, a CLI do Expo tentará instalar e criar essa configuração. Também ainda não existe uma suíte de testes automatizados no projeto.

## Solução de problemas

### O Expo iniciou, mas alterações não aparecem

Limpe o cache do bundler e reinicie:

```bash
npx expo start --clear
```

### O celular não consegue abrir o projeto

- confirme que celular e computador estão na mesma rede;
- verifique se o firewall permite a comunicação do Node.js/Expo;
- confirme que o Expo Go instalado é compatível com o SDK utilizado pelo projeto;
- no terminal do Expo, tente alterar o tipo de conexão disponível.

### O Android não abre

Verifique se o Android Studio possui um dispositivo virtual configurado e iniciado e se as ferramentas do Android SDK estão acessíveis no ambiente.

### O iOS não abre

O simulador de iOS exige macOS e Xcode. Em Windows ou Linux, use Android, Web ou um dispositivo físico compatível.

## Evoluções futuras

Depois que o fluxo principal estiver validado, os documentos funcionais preveem:

- importação de alunos por CSV ou XLSX, com confirmação antes da gravação;
- registro por áudio, transcrição e revisão antes de salvar;
- resumos e relatórios automáticos;
- árvore visual de progresso;
- notificações e sugestões de atividades;
- acesso limitado para pais e responsáveis;
- identificação de padrões e sugestões pedagógicas com inteligência artificial.

A inteligência artificial será uma ferramenta de apoio: ela poderá organizar, resumir e sugerir, mas a interpretação e as decisões continuarão sob responsabilidade do professor. Da mesma forma, registros internos não deverão ser compartilhados automaticamente com responsáveis.

## Privacidade

Como a plataforma lidará com dados de estudantes, a implementação deve aplicar controle de acesso, coleta mínima de dados, armazenamento seguro e regras claras de compartilhamento. Dados reais de alunos não devem ser incluídos no repositório, em exemplos públicos ou em registros de depuração.

## Licença

Este repositório inclui uma licença MIT. Consulte o arquivo [LICENSE](./LICENSE) para conhecer os termos.
