# TIA — Teaching Intelligent Assistant

Este repositório contém o **frontend** do **TIA (Teaching Intelligent Assistant)**, projeto acadêmico desenvolvido inicialmente na disciplina de **Projeto Integrador IV (PI 4)**.

## 📚 Sobre o projeto

O TIA é uma plataforma web voltada para professores de inglês que trabalham com crianças de até 12 anos.

O projeto busca facilitar o acompanhamento individual dos alunos durante o ano letivo, permitindo que o professor registre e consulte informações como:

* participação nas aulas;
* atividades realizadas;
* dificuldades observadas;
* conquistas;
* comportamento;
* evolução;
* acontecimentos relevantes;
* desenvolvimento das habilidades esperadas.

A ideia central do TIA é:

**registrar → organizar → consultar → acompanhar**

O objetivo é reduzir a dependência da memória do professor e centralizar informações que normalmente ficam distribuídas entre anotações, relatórios, documentos ou planilhas.

## 💻 Frontend

Este repositório é responsável pela interface do TIA.

Por meio do frontend, o professor poderá interagir com funcionalidades como cadastro e visualização de turmas e alunos, registros das aulas, histórico dos estudantes e acompanhamento de conquistas e evolução.

---

# 🌿 Guia básico de Git

Esta seção contém os principais comandos utilizados durante o desenvolvimento do projeto.

## Clonar o projeto

Para baixar o repositório pela primeira vez:

```bash
git clone URL_DO_REPOSITORIO
```

Depois, entre na pasta:

```bash
cd tia-frontend
```

---

## Verificar o estado do projeto

Antes de realizar um commit, é recomendado verificar quais arquivos foram modificados:

```bash
git status
```

---

## Criar uma nova branch

Antes de desenvolver uma funcionalidade, crie uma branch específica:

```bash
git switch -c nome-da-branch
```

Exemplo:

```bash
git switch -c feature/login
```

Outros exemplos:

```text
feature/cadastro-aluno
feature/listagem-turmas
fix/correcao-login
```

---

## Ver as branches

```bash
git branch
```

A branch atual será indicada com `*`.

---

## Trocar de branch

```bash
git switch nome-da-branch
```

Exemplo:

```bash
git switch main
```

---

## Atualizar sua branch

Antes de começar a trabalhar, é recomendado atualizar a `main`:

```bash
git switch main
git pull origin main
```

Depois, volte para sua branch:

```bash
git switch nome-da-branch
```

---

## Adicionar alterações

Para adicionar todas as alterações:

```bash
git add .
```

Para adicionar apenas um arquivo:

```bash
git add nome-do-arquivo
```

---

## Criar um commit

Depois de adicionar as alterações:

```bash
git commit -m "mensagem do commit"
```

Exemplo:

```bash
git commit -m "feat: adiciona tela de login"
```

Procure escrever mensagens curtas que expliquem o que foi feito.

Alguns prefixos que podem ser utilizados:

```text
feat: nova funcionalidade
fix: correção de problema
docs: alteração na documentação
refactor: refatoração de código
style: alterações visuais ou formatação
test: criação ou alteração de testes
```

Exemplos:

```bash
git commit -m "feat: adiciona cadastro de aluno"

git commit -m "fix: corrige validação do formulário"

git commit -m "docs: atualiza README"
```

---

## Enviar a branch para o GitHub

Na primeira vez que uma branch for enviada:

```bash
git push -u origin nome-da-branch
```

Exemplo:

```bash
git push -u origin feature/login
```

Depois disso, normalmente será suficiente utilizar:

```bash
git push
```

---

## Baixar atualizações

Para atualizar sua branch com alterações disponíveis no repositório remoto:

```bash
git pull
```

---

# 🔄 Fluxo básico de trabalho

Um fluxo comum durante o desenvolvimento será:

```bash
# Ir para a main
git switch main

# Atualizar a main
git pull origin main

# Criar uma nova branch
git switch -c feature/nome-da-feature

# Desenvolver...

# Verificar alterações
git status

# Adicionar arquivos
git add .

# Criar commit
git commit -m "feat: descrição da alteração"

# Enviar a branch
git push -u origin feature/nome-da-feature
```

Depois de enviar a branch, poderá ser criado um **Pull Request (PR)** no GitHub para que as alterações sejam revisadas antes de entrarem na `main`.

## ⚠️ Importante

Evite desenvolver diretamente na branch `main`.

Para novas funcionalidades ou correções, prefira criar uma branch separada e posteriormente abrir um Pull Request.

---

## 🎓 Contexto acadêmico

O TIA é desenvolvido como projeto de finalização de curso, iniciado na disciplina de **Projeto Integrador IV (PI 4)**.

O projeto poderá evoluir ao longo das próximas etapas, incorporando e validando recursos como acompanhamento visual, histórico de desenvolvimento, registros simplificados e funcionalidades apoiadas por Inteligência Artificial.
