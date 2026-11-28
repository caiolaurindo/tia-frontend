# TIA App — Teaching Intelligent Assistant

Aplicação multiplataforma para acompanhamento do desenvolvimento de alunos de inglês. O TIA ajuda professores a registrar acontecimentos das aulas, consultar o histórico individual dos estudantes e acompanhar conquistas de aprendizagem ao longo do ano letivo.

## 📚 Sobre o projeto

O TIA é uma plataforma voltada para professores de inglês que trabalham com crianças de até 12 anos.

A aplicação busca transformar observações do cotidiano escolar em informações organizadas e acessíveis, permitindo que o professor acompanhe o desenvolvimento individual dos estudantes ao longo do ano letivo.

Entre as informações acompanhadas estão:

- Participação;
- Atividades realizadas;
- Dificuldades;
- Conquistas;
- Comportamento;
- Acontecimentos relevantes;
- Evolução;
- Desenvolvimento das habilidades esperadas.

A ideia central do projeto é:

**Registrar → Organizar → Consultar → Acompanhar**

O objetivo é centralizar informações importantes sobre os estudantes e reduzir a dependência de registros espalhados ou da memória do professor.

## 👥 Integrantes da equipe

O projeto é desenvolvido pelos seguintes integrantes:

| Integrante | Matrícula |
|---|---|
| Yasmin Marcelly Vasconcelos de Arruda | 00000859573 |
| Adriano José Valença Gomes Filho | 00000860049 |
| Hallysson Araújo Laurindo Silva | 00000859534 |
| Josielly Rayssa Cruz Santos | 00000860060 |
| Moisés Carlos de Araújo Neto | 00000859890 |
| Caio Lucas Laurindo da Silva | 00000859629 |

## 📱 Sobre a aplicação

O TIA App é responsável pela interface e pela experiência de utilização da plataforma.

A aplicação permite que os professores interajam com os recursos do sistema por meio de uma interface multiplataforma, desenvolvida com React Native e Expo.

Entre as funcionalidades da aplicação estão:

- Autenticação de professores;
- Gerenciamento de turmas;
- Cadastro e acompanhamento de alunos;
- Planejamento e acompanhamento de aulas;
- Gerenciamento de conquistas de aprendizagem;
- Registro de acontecimentos e observações;
- Consulta de informações relacionadas ao desenvolvimento dos estudantes.

O frontend se comunica com o backend por meio de serviços e requisições HTTP, permitindo a integração e persistência das informações.

## ⚙️ Tecnologias utilizadas

O projeto utiliza as seguintes tecnologias:

| Tecnologia | Finalidade |
|---|---|
| React Native | Desenvolvimento da interface multiplataforma |
| Expo | Ambiente e ferramentas de desenvolvimento |
| Expo Router | Gerenciamento de rotas e navegação |
| TypeScript | Tipagem estática e segurança no desenvolvimento |
| React | Construção de interfaces e componentes |
| Context API | Gerenciamento de estados globais |
| Fetch API | Comunicação com o backend |
| AsyncStorage | Persistência local de informações de autenticação |

## 🚀 Como executar o projeto

Com o terminal aberto na pasta raiz do projeto, entre no diretório da aplicação:

```bash
cd tia-app
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento do Expo:

```bash
npm start
```

O comando inicia o servidor de desenvolvimento e exibe um QR Code e os atalhos para abrir a aplicação.

### Executando a aplicação

Depois que o Expo iniciar, escolha onde executar:

**Celular:**
- Instale o Expo Go.
- Mantenha o aparelho e o computador na mesma rede.
- Leia o QR Code exibido no terminal.

**Android:**

Pressione `a` no terminal ou execute:

```bash
npm run android
```

**Web:**

Pressione `w` no terminal ou execute:

```bash
npm run web
```

**iOS:**

Pressione `i` no macOS ou execute:

```bash
npm run ios
```

Para uma instalação limpa e reproduzível, especialmente em integração contínua, substitua `npm install` por:

```bash
npm ci
```

## 📋 Pré-requisitos

Para executar o projeto, são necessários:

- Node.js em uma versão compatível com as dependências do projeto;
- npm, instalado junto com o Node.js;
- Expo Go para executar em um celular físico;
- Android Studio e Android SDK para utilizar um emulador Android;
- macOS e Xcode para utilizar o simulador iOS;
- Navegador moderno para executar a versão Web.

## 🔗 Integração com o backend

O frontend realiza a comunicação com o backend do TIA por meio de uma camada de serviços responsável pelas requisições à API.

A configuração do endereço da API é realizada por meio da variável de ambiente:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

O endereço deve ser ajustado conforme o ambiente de execução.

Em dispositivos físicos, deve ser utilizado o endereço IP da máquina que executa o backend, garantindo que ambos estejam acessíveis pela mesma rede.

A aplicação também possui tratamento específico para os endereços de conexão utilizados em ambientes Web, Android e Expo.

A autenticação utiliza token armazenado localmente para manter a sessão do professor.

## 🧩 Módulos da aplicação

A aplicação está organizada em módulos que representam as principais funcionalidades do sistema.

### Turmas

Responsável pelo gerenciamento das turmas cadastradas pelo professor.

Entre suas funcionalidades estão:

- Listagem de turmas;
- Cadastro e edição de turmas;
- Visualização dos detalhes;
- Consulta dos alunos vinculados;
- Consulta das aulas relacionadas;
- Filtros de turmas ativas e arquivadas;
- Arquivamento e desarquivamento;
- Exclusão de turmas com confirmação.

### Alunos

Responsável pelo cadastro e acompanhamento individual dos estudantes.

O módulo contempla a organização das informações dos alunos e sua relação com as turmas.

### Aulas

Responsável pelo planejamento e acompanhamento das aulas.

Entre suas funcionalidades estão:

- Planejamento de aulas por turma, data e horário;
- Registro do título e conteúdo trabalhado;
- Cadastro de atividades planejadas;
- Associação de conquistas de aprendizagem;
- Edição das informações das aulas;
- Acompanhamento do andamento;
- Controle dos status de aula planejada, em andamento e concluída.

### Conquistas

Responsável pelo gerenciamento das conquistas de aprendizagem esperadas para os estudantes.

O módulo permite relacionar habilidades e objetivos de aprendizagem às atividades e aulas planejadas.

### Registros

Responsável pela organização dos acontecimentos observados durante as aulas, incluindo participação, dificuldades, conquistas e outras observações relevantes.

### Histórico

Organiza as informações registradas ao longo do tempo, permitindo consultar o desenvolvimento individual dos estudantes.

### Relatórios

Previsto para reunir informações sobre o desenvolvimento dos alunos e apoiar o acompanhamento periódico realizado pelo professor.

## 📊 Situação atual da implementação

O frontend encontra-se em desenvolvimento, com integração progressiva aos serviços do backend.

Atualmente, destacam-se:

- Integração dos módulos de Turmas, Aulas e Conquistas com a API;
- Comunicação com o backend por meio de serviços organizados;
- Gerenciamento global de estados utilizando Context API;
- Persistência do token de autenticação;
- Listagem e gerenciamento de turmas;
- Planejamento, edição e acompanhamento de aulas;
- Associação de conquistas às aulas;
- Organização da navegação entre os módulos.

Os demais recursos continuam sendo desenvolvidos e aprimorados conforme a evolução do projeto.

## 🗂️ Estrutura do projeto

A aplicação utiliza uma organização modular, separando telas, componentes, serviços, contextos e funcionalidades.

A estrutura principal é:

```text
tia-frontend/
├── assets/                     # Imagens, ícones e recursos estáticos
├── src/
│   ├── app/                    # Rotas e telas do Expo Router
│   ├── components/
│   │   ├── layout/             # Componentes estruturais compartilhados
│   │   └── ui/                 # Componentes visuais reutilizáveis
│   ├── constants/              # Constantes da aplicação
│   ├── contexts/               # Contextos globais do React
│   ├── features/               # Módulos organizados por domínio
│   │   ├── alunos/
│   │   ├── aulas/
│   │   ├── auth/
│   │   ├── conquistas/
│   │   ├── historico/
│   │   ├── registros/
│   │   ├── relatorios/
│   │   └── turmas/
│   ├── hooks/                  # Hooks compartilhados
│   ├── services/               # Comunicação com APIs e serviços
│   ├── theme/                  # Cores, tipografia e estilos
│   ├── types/                  # Tipos e interfaces compartilhados
│   └── utils/                  # Funções utilitárias
├── .gitignore
├── app.json                    # Configuração do Expo
├── package.json                # Dependências e scripts npm
├── package-lock.json           # Versões das dependências
├── tsconfig.json               # Configuração do TypeScript
└── README.md                   # Documentação do projeto
```

A organização permite separar responsabilidades e facilita a manutenção, evolução e implementação de novos módulos.

## 🧭 Navegação e gerenciamento de estado

O Expo Router é utilizado para organizar as rotas e a navegação da aplicação.

Os contextos globais são organizados por responsabilidade, permitindo compartilhar informações entre diferentes telas e módulos.

Entre os principais provedores estão:

- AuthProvider;
- TurmasProvider;
- AlunosProvider;
- ConquistasProvider;
- AulasProvider.

Essa organização facilita o compartilhamento de dados e a integração entre as funcionalidades da aplicação.

## 📜 Scripts disponíveis

| Comando | Finalidade |
|---|---|
| `npm start` | Inicia o servidor de desenvolvimento do Expo. |
| `npm run android` | Inicia a aplicação no Android. |
| `npm run ios` | Inicia a aplicação no simulador iOS. |
| `npm run web` | Inicia a versão Web. |
| `npm run lint` | Executa a análise estática do projeto, conforme a configuração disponível. |

## 🧪 Verificações de desenvolvimento

Antes de enviar alterações, recomenda-se executar a verificação de tipos do TypeScript:

```bash
npx tsc --noEmit
```

Também é importante verificar o funcionamento das telas e dos fluxos de navegação após cada alteração.

## 🌿 Guia básico de Git

O desenvolvimento utiliza branches para organizar funcionalidades e correções, evitando alterações diretas na branch principal.

### Atualizar a main

Antes de iniciar uma nova tarefa:

```bash
git switch main
git pull origin main
```

### Criar uma branch

Cada funcionalidade ou correção deve ser desenvolvida em uma branch própria.

```bash
git switch -c nome-da-branch
```

Exemplos:

```bash
git switch -c feature/modulo-alunos
git switch -c feature/relatorios
git switch -c fix/integracao-aulas
git switch -c fix/autenticacao
```

### Verificar alterações

```bash
git status
```

### Adicionar alterações

```bash
git add .
```

### Criar um commit

```bash
git commit -m "feat: descrição da alteração"
```

Prefixos recomendados:

| Prefixo | Finalidade |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de problema |
| `docs` | Documentação |
| `refactor` | Refatoração |
| `style` | Formatação |
| `test` | Testes |

Exemplos:

```bash
git commit -m "feat: integra modulo de turmas com backend"

git commit -m "fix: corrige persistencia das aulas"

git commit -m "refactor: reorganiza contexto de alunos"

git commit -m "docs: atualiza README"
```

### Enviar uma branch

Na primeira vez:

```bash
git push -u origin nome-da-branch
```

Depois de configurar a branch:

```bash
git push
```

Após o envio, deverá ser criado um Pull Request (PR) no GitHub para revisão e integração das alterações na branch principal.

## 🔄 Fluxo básico de desenvolvimento

O fluxo recomendado para o desenvolvimento é:

**Antes de iniciar:**

```bash
git switch main
git pull origin main
git switch -c feature/nome-da-feature
```

**Depois de desenvolver:**

```bash
git status
git add .
git commit -m "feat: descrição da alteração"
git push -u origin feature/nome-da-feature
```

Depois, abra um Pull Request no GitHub.

## ⚠️ Boas práticas

- Evite realizar alterações diretamente na `main`.
- Utilize branches para cada funcionalidade ou correção.
- Mantenha os componentes reutilizáveis.
- Separe as responsabilidades entre telas, contextos e serviços.
- Utilize TypeScript para manter a tipagem do projeto.
- Evite duplicação de código.
- Verifique a integração com o backend antes de enviar alterações.
- Não envie arquivos de configuração local ou credenciais ao repositório.
- Não versione a pasta `node_modules`.

## 🔮 Evoluções futuras

Entre as evoluções previstas para o TIA estão:

- Aprimoramento do histórico individual dos estudantes;
- Relatórios periódicos de desenvolvimento;
- Importação de alunos por CSV ou XLSX;
- Registro por áudio, com transcrição e revisão;
- Resumos automáticos;
- Visualização gráfica da evolução das conquistas;
- Notificações e sugestões de atividades;
- Acesso limitado para pais e responsáveis;
- Identificação de padrões e sugestões pedagógicas com inteligência artificial.

A inteligência artificial será uma ferramenta de apoio ao professor, podendo organizar informações, elaborar resumos e sugerir atividades. A interpretação dos dados e as decisões pedagógicas continuarão sob responsabilidade do professor.

## 🔐 Privacidade e segurança

Como a plataforma trabalha com informações relacionadas a estudantes, o desenvolvimento deve considerar:

- Controle de acesso às informações;
- Coleta mínima de dados;
- Armazenamento seguro;
- Proteção dos dados pessoais;
- Regras claras de compartilhamento;
- Restrição de acesso a informações individuais.

Dados reais de alunos não devem ser incluídos no repositório, em exemplos públicos ou em registros de depuração.

## 🎓 Contexto acadêmico

O TIA é um projeto acadêmico desenvolvido inicialmente na disciplina de Projeto Integrador IV (PI 4).

A aplicação frontend é parte da solução, trabalhando em conjunto com o backend para oferecer uma plataforma de acompanhamento do desenvolvimento individual dos estudantes.

O projeto busca contribuir para a organização do trabalho docente, oferecendo ferramentas que auxiliem no registro, consulta e acompanhamento contínuo da aprendizagem.

## 📄 Licença

Este projeto inclui uma licença MIT. Consulte o arquivo `LICENSE` para conhecer os termos de utilização.
