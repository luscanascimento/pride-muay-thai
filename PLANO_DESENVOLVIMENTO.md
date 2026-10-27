# Plano de desenvolvimento — Pride Muay Thai

## 1. Objetivo

Evoluir o site atual da Pride Muay Thai, preservando sua identidade visual e a hospedagem na Vercel, para incluir:

- link do canal oficial da Pride no YouTube;
- área pública de eventos, com tabela paginada e página de detalhes;
- área pública de alunos, com tabela paginada, khan atual e página de trajetória;
- painel administrativo para gerenciar eventos e alunos;
- autenticação e autorização restritas a Lucas Nascimento, Paulo Roberto e Renan Fernandes;
- progressão cumulativa pelos 16 khans;
- estrutura preparada para imagens de alunos e eventos no futuro, sem implementar upload nesta versão.

Canal oficial do YouTube:

`https://www.youtube.com/@pridemuaythaifighter`

Esta primeira versão terá somente conteúdo textual para alunos e eventos.

A área de eventos deve funcionar como um mini-CMS semelhante a um blog, especializado em eventos da equipe. Os administradores poderão criar publicações sobre competições, graduações, seminários, treinos especiais e outros acontecimentos, salvar como rascunho, revisar, publicar, editar, cancelar e manter o conteúdo disponível para consulta pública. Não deve ser implementada como uma agenda estática codificada no projeto.

## 2. Estado atual do projeto

O projeto é uma SPA construída com:

- React 19;
- Vite 6;
- TypeScript;
- Tailwind CSS;
- roteamento manual com `window.location.hash` em `src/App.tsx`;
- deploy estático na Vercel.

O projeto não usa React Router, não possui backend, banco de dados ou autenticação.

Rotas existentes incluem:

- `#/desenvolvedor`;
- `#/professores/:id`;
- âncoras da página inicial.

Os 16 khans já estão descritos em `src/data/gymsAndTeamData.ts`, por meio de `KHAN_RANKS_DATA` e `ALL_KHANS_SYSTEM`. Os componentes `PrajiedBadge` e `PrajiedRope`, em `src/components/ui/PrajiedBadge.tsx`, já representam visualmente os khans e devem ser reutilizados nas telas de alunos.

Não migrar o projeto para Next.js e não introduzir React Router nesta primeira implementação, salvo se uma limitação concreta do roteamento atual for identificada e documentada antes da mudança.

## 3. Arquitetura recomendada

Usar:

- Vercel para site e frontend;
- Supabase Postgres para persistência;
- Supabase Auth para autenticação por e-mail e senha;
- Row Level Security (RLS) para autorização;
- cliente `@supabase/supabase-js` diretamente no frontend;
- migrations SQL versionadas no repositório.

Não tentar executar um container persistente de banco de dados na Vercel. A Vercel executa funções sob demanda e não substitui uma VPS com disco persistente.

Não é necessário criar uma API própria nesta versão. O frontend pode acessar a Data API do Supabase com uma chave publicável, desde que todas as tabelas tenham grants e policies RLS corretos.

Nunca expor uma secret key ou `service_role` no frontend. Toda variável Vite é incorporada ao JavaScript público.

## 4. Administradores e contas

Administradores iniciais:

| Nome de exibição | Função inicial |
| --- | --- |
| Lucas Nascimento | Administrador/desenvolvedor |
| Paulo Roberto | Administrador/professor |
| Renan Fernandes | Administrador/mestre |

O Supabase Auth usa e-mail ou telefone como identificador de login. Portanto, os nomes acima serão armazenados como `display_name`, e cada pessoa precisará informar um e-mail individual para entrar no sistema.

As contas devem ser criadas manualmente no dashboard do Supabase depois que o projeto e os e-mails forem definidos:

1. Abrir **Authentication → Users**.
2. Criar o usuário com seu e-mail real e uma senha temporária forte.
3. Marcar o e-mail como confirmado, se apropriado ao fluxo escolhido.
4. Copiar o UUID criado pelo Supabase Auth.
5. Inserir o UUID e o nome em `admin_users`.
6. Entregar a senha temporária diretamente à pessoa, fora do Git.
7. Solicitar troca da senha no primeiro acesso ou logo após a entrega.

Não registrar senhas reais ou temporárias neste arquivo, no código, em migrations, em commits, em issues ou em logs. As sugestões de senha fornecidas durante o planejamento devem ser tratadas como comprometidas por já terem sido compartilhadas em conversa e não devem ser utilizadas em produção. Criar novas senhas exclusivas no momento do provisionamento.

Desabilitar cadastro público. Estar autenticado não é suficiente para administrar: o UUID do usuário também deve existir em `admin_users`.

## 5. Variáveis de ambiente

Instalar:

```bash
npm install @supabase/supabase-js
```

Adicionar ao `.env.example`:

```env
VITE_MAPBOX_ACCESS_TOKEN=
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Criar:

```text
src/lib/supabase.ts
src/types/database.ts
src/services/authService.ts
src/services/eventsService.ts
src/services/studentsService.ts
supabase/migrations/001_initial_schema.sql
```

O cliente deve validar as variáveis obrigatórias e apresentar erro claro em desenvolvimento quando elas não estiverem configuradas.

## 6. Modelo de dados

### 6.1. `admin_users`

Campos:

- `user_id uuid primary key references auth.users(id) on delete cascade`;
- `display_name text not null`;
- `created_at timestamptz not null default now()`.

Somente administração feita pelo dashboard ou por migration controlada pode adicionar administradores. Um usuário não pode inserir a si próprio nessa tabela.

### 6.2. `events`

Campos:

- `id uuid primary key default gen_random_uuid()`;
- `slug text not null unique`;
- `category text not null` com valores iniciais `competition`, `graduation`, `seminar`, `special_training` ou `other`;
- `title text not null`;
- `summary text not null`;
- `description text not null`;
- `event_date timestamptz not null`;
- `end_date timestamptz null`;
- `location text not null`;
- `requirements text null`;
- `registration_info text null`;
- `registration_url text null`;
- `contact text null`;
- `status text not null` com valores `draft`, `published` ou `cancelled`;
- `published_at timestamptz null`;
- `image_url text null`, reservado para uso futuro;
- `created_at timestamptz not null default now()`;
- `updated_at timestamptz not null default now()`;
- `created_by uuid references auth.users(id)`;
- `updated_by uuid references auth.users(id)`.

Limites recomendados:

- título: 120 caracteres;
- resumo: 300;
- descrição: 5.000;
- local: 200;
- requisitos: 2.000;
- instruções de inscrição: 2.000;
- contato: 200.

Aplicar limites tanto no formulário quanto por constraints no banco.

### 6.3. `students`

Campos:

- `id uuid primary key default gen_random_uuid()`;
- `name text not null`;
- `slug text not null unique`;
- `current_khan integer not null check (current_khan between 1 and 16)`;
- `is_active boolean not null default true`;
- `is_published boolean not null default true`;
- `image_url text null`, reservado para uso futuro;
- `created_at timestamptz not null default now()`;
- `updated_at timestamptz not null default now()`;
- `created_by uuid references auth.users(id)`;
- `updated_by uuid references auth.users(id)`.

O site público mostrará apenas nome, khan e informações públicas da trajetória. Não adicionar telefone, documento, endereço, data de nascimento ou outras informações pessoais.

### 6.4. `student_graduations`

Campos:

- `id uuid primary key default gen_random_uuid()`;
- `student_id uuid not null references students(id) on delete cascade`;
- `khan_level integer not null check (khan_level between 1 and 16)`;
- `achieved_at date null`;
- `created_at timestamptz not null default now()`;
- `created_by uuid references auth.users(id)`;
- constraint única em `(student_id, khan_level)`.

A data é opcional na primeira versão. Isso permite registrar por quais khans o aluno passou mesmo quando as datas antigas não forem conhecidas.

### 6.5. Índices

Criar índices para:

- `events(status, event_date)`;
- `events(category, event_date)`;
- `events(event_date)`;
- `students(name)`;
- `students(current_khan)`;
- `students(is_active, is_published)`;
- `student_graduations(student_id, khan_level)`;
- slugs únicos de eventos e alunos.

Para busca por nome sem distinção de maiúsculas e acentos, avaliar `pg_trgm` e `unaccent`. Se isso aumentar desnecessariamente a primeira entrega, usar busca case-insensitive inicialmente e documentar a limitação de acentos.

## 7. Regra cumulativa dos khans

O banco não deve armazenar 16 colunas booleanas. `students.current_khan` representa a maior graduação atual, e `student_graduations` registra os níveis conquistados.

Na interface administrativa, mostrar os 16 khans como switches ou botões selecionáveis usando a ordem de `ALL_KHANS_SYSTEM`:

- aluno no khan 1: nível 1 ativo;
- aluno no khan 7: níveis 1 a 7 ativos;
- aluno no khan 16: níveis 1 a 16 ativos;
- clicar no nível 7 define o khan atual como 7 e ativa automaticamente 1 a 7;
- avançar de 7 para 10 cria os registros ausentes 8, 9 e 10;
- não permitir lacunas na progressão;
- clicar em um nível inferior ao atual exige confirmação explícita.

Criar uma função SQL/RPC transacional, por exemplo `set_student_khan(student_id, target_khan, achieved_at, correction_mode)`, que:

1. confirme que o usuário é administrador;
2. valide o intervalo de 1 a 16;
3. crie graduações ausentes até o nível escolhido;
4. atualize `students.current_khan`;
5. atualize `updated_at` e `updated_by`;
6. evite duplicatas;
7. faça rollback integral em caso de erro.

Existem duas intenções diferentes:

- **Registrar graduação:** somente avança e preserva todo o histórico.
- **Corrigir graduação:** pode reduzir o khan e remover registros superiores, mas exige confirmação clara.

Não permitir que o formulário altere `current_khan` diretamente sem sincronizar o histórico.

## 8. Fonte única dos khans

Antes de implementar alunos, revisar integralmente:

- `src/data/gymsAndTeamData.ts`;
- `src/components/ui/PrajiedBadge.tsx`;
- `src/components/ui/AllKhansCuriosityTable.tsx`;
- `src/components/sections/TeamSection.tsx`;
- `src/components/sections/KhanGraduationShowcase.tsx`.

Não criar uma segunda lista com nomes, cores, títulos ou ordem dos khans. Se necessário, extrair `KHAN_RANKS_DATA`, `ALL_KHANS_SYSTEM` e `getKhanRank` para um módulo compartilhado, preservando os imports ou atualizando-os mecanicamente.

Reutilizar:

- `PrajiedBadge` para o ribbon do khan atual;
- `PrajiedRope` para progressão e detalhes;
- cor, nome, título e descrição já existentes.

## 9. Link do YouTube

Centralizar o endereço em `src/constants/brand.ts`.

Adicionar:

- ícone do YouTube no rodapé;
- item “YouTube” no menu móvel;
- ícone próximo ao CTA do cabeçalho desktop, se houver espaço sem prejudicar o layout.

Usar:

```tsx
target="_blank"
rel="noopener noreferrer"
```

Incluir `aria-label` descritivo e garantir navegação por teclado.

Não incorporar vídeo ou iframe nesta fase. O requisito é apontar para o canal oficial.

## 10. Rotas públicas

Estender o parser central de hash em `src/App.tsx`. Evitar estados booleanos separados para cada nova página; criar um modelo discriminado de rota para reduzir combinações inválidas.

Rotas:

```text
#/eventos
#/eventos/:slug
#/alunos
#/alunos/:slug
```

### 10.1. Lista de eventos

Criar:

```text
src/components/pages/EventsPage.tsx
src/components/events/EventTable.tsx
src/components/events/EventCard.tsx
src/components/events/EventStatusBadge.tsx
```

Requisitos:

- tabela paginada;
- somente eventos públicos;
- apresentação editorial semelhante a um blog, com resumo na listagem e conteúdo completo na página de detalhes;
- próximos eventos ordenados do mais próximo ao mais distante;
- eventos anteriores do mais recente ao mais antigo;
- opção de filtrar próximos, anteriores, cancelados e categoria;
- categorias iniciais: competição, graduação, seminário, treino especial e outros;
- colunas: categoria, título, resumo, data, local, situação e ação “Ver detalhes”;
- 10 registros por página inicialmente;
- carregamento, erro com tentativa novamente e estado vazio;
- datas em `pt-BR` e fuso `America/Sao_Paulo`;
- tabela responsiva, podendo virar cards no celular;
- não usar `dangerouslySetInnerHTML`.

### 10.2. Detalhe do evento

Criar `src/components/pages/EventDetailPage.tsx`.

Mostrar:

- título;
- categoria;
- situação;
- data e horário;
- local;
- resumo e descrição;
- requisitos;
- como se inscrever;
- contato;
- link de inscrição;
- mensagem destacada se cancelado;
- botão de retorno à tabela preservando página e filtros.

### 10.3. Lista de alunos

Criar:

```text
src/components/pages/StudentsPage.tsx
src/components/students/StudentTable.tsx
src/components/students/StudentCard.tsx
```

Requisitos:

- tabela paginada pública;
- mostrar somente `is_active = true` e `is_published = true`;
- colunas: nome, khan atual, `PrajiedBadge` e ação “Ver trajetória”;
- busca por nome;
- filtro por khan atual;
- ordenação padrão por nome;
- 10 ou 20 registros por página, escolhendo um padrão único;
- busca ou mudança de filtro retorna à página 1;
- tabela responsiva, podendo virar cards no celular;
- paginação e filtros representados no hash/query para permitir voltar sem perder contexto.

Exemplo:

```text
#/alunos?page=2&khan=7&busca=lucas
```

### 10.4. Detalhe do aluno

Criar `src/components/pages/StudentDetailPage.tsx`.

Mostrar:

- nome;
- khan atual em destaque com `PrajiedBadge`;
- todos os khans conquistados, do primeiro ao atual;
- `PrajiedRope`, número, cor, título e descrição de cada khan;
- data da graduação quando disponível;
- destaque visual maior para o khan atual;
- botão de retorno preservando filtros e página.

Enquanto não houver foto, usar uma composição visual com o logotipo e o Prajied. Não criar avatar fotográfico falso.

## 11. Autenticação e painel administrativo

Criar:

```text
src/contexts/AuthContext.tsx
src/hooks/useAuth.ts
src/components/admin/AdminRoute.tsx
src/components/pages/AdminLoginPage.tsx
src/components/pages/AdminDashboardPage.tsx
```

Rotas:

```text
#/admin
#/admin/eventos
#/admin/eventos/novo
#/admin/eventos/:id/editar
#/admin/alunos
#/admin/alunos/novo
#/admin/alunos/:id
#/admin/alunos/:id/editar
```

Login:

- e-mail e senha;
- `supabase.auth.signInWithPassword`;
- sem tela pública de cadastro;
- erro genérico para credenciais inválidas;
- sessão restaurada ao recarregar;
- estado de carregamento antes de decidir se a rota é permitida;
- conferir `admin_users` após autenticação;
- encerrar ou recusar a sessão de usuário autenticado que não seja administrador;
- botão de logout;
- exibir o `display_name` do administrador conectado.

## 12. Administração de eventos

Tabela administrativa com:

- título;
- categoria;
- data;
- local;
- status;
- atualização;
- ações.

Recursos:

- paginação server-side;
- busca por título;
- filtro por status e categoria;
- criar;
- editar;
- publicar/despublicar;
- cancelar;
- visualizar como público;
- excluir somente após confirmação.

Formulário:

- validar todos os campos e limites;
- gerar slug a partir do título, permitindo ajuste;
- exigir uma categoria;
- garantir unicidade do slug;
- desabilitar envio durante salvamento;
- prevenir submissão duplicada;
- preservar o conteúdo se a chamada falhar;
- feedback claro de sucesso e erro;
- não incluir campo de imagem nesta versão.

O fluxo editorial deve ser semelhante ao de um blog:

1. administrador cria a publicação como rascunho;
2. preenche título, categoria, resumo, texto completo, data, local, requisitos e inscrição;
3. revisa a página de detalhes em uma pré-visualização administrativa;
4. publica quando estiver pronta;
5. pode editar posteriormente sem recriar a publicação;
6. pode cancelar o evento mantendo a publicação e exibindo o cancelamento publicamente;
7. depois da data, a publicação passa automaticamente para a visualização de eventos anteriores, sem ser apagada.

`published_at` deve ser preenchido na primeira publicação. Edições futuras não devem substituir essa data; `updated_at` registra as alterações posteriores.

## 13. Administração de alunos

Criar:

```text
src/components/admin/StudentsAdmin.tsx
src/components/admin/StudentForm.tsx
src/components/admin/KhanProgressSelector.tsx
src/components/admin/GraduationHistory.tsx
```

Tabela administrativa:

- nome;
- khan atual;
- `PrajiedBadge`;
- publicado/oculto;
- ativo/arquivado;
- última atualização;
- ações;
- paginação server-side;
- busca por nome;
- filtro por khan;
- filtro por publicação;
- filtro por atividade.

Formulário:

- nome;
- slug gerado automaticamente e editável;
- publicado;
- ativo;
- seletor cumulativo dos 16 khans;
- data opcional da nova graduação;
- não incluir upload de imagem.

Ações:

- criar;
- editar nome e slug;
- publicar/ocultar;
- arquivar/reativar;
- registrar graduação;
- corrigir khan após confirmação;
- ver página pública;
- não oferecer exclusão definitiva na primeira versão.

## 14. Paginação server-side

Todas as tabelas públicas e administrativas devem paginar no Supabase. Não baixar todos os registros para paginar no navegador.

Padrão conceitual:

```ts
const from = (page - 1) * pageSize;
const to = from + pageSize - 1;

const query = supabase
  .from('students')
  .select('*', { count: 'exact' })
  .range(from, to);
```

Calcular o total de páginas com a contagem retornada. Tratar página inexistente após filtros ou exclusões, redirecionando para a última página válida.

Criar um componente reutilizável de paginação acessível.

## 15. Segurança e RLS

Criar função SQL `is_admin()` que compare `auth.uid()` com `admin_users.user_id`. Defini-la cuidadosamente para não introduzir recursão de RLS ou escalada de privilégio.

### Eventos

- visitante: `SELECT` somente de eventos publicados e dos cancelados previamente públicos, conforme regra definida;
- administrador: `SELECT`, `INSERT`, `UPDATE` e `DELETE`;
- usuário autenticado não administrador: nenhuma escrita e somente a mesma leitura pública de um visitante.

### Alunos

- visitante: `SELECT` somente de alunos ativos e publicados;
- administrador: CRUD;
- usuário autenticado não administrador: somente leitura pública.

### Graduações

- visitante: `SELECT` somente quando o aluno relacionado estiver ativo e publicado;
- administrador: CRUD preferencialmente por RPC;
- usuário autenticado não administrador: somente leitura pública.

### Administradores

- não disponibilizar lista pública;
- nenhum usuário pode promover a si próprio;
- inserções e remoções feitas por dashboard, migration segura ou ambiente confiável.

Usar grants e RLS em conjunto. Esconder botões no frontend não constitui autorização.

## 16. Preparação para imagens futuras

Nesta versão:

- não instalar biblioteca de upload;
- não criar bucket;
- não criar seletor de arquivo;
- não implementar compressão ou recorte;
- não exibir controles vazios de imagem.

Preparação permitida:

- `image_url nullable` em `students` e `events`;
- tipos TypeScript aceitando `image_url: string | null`;
- componentes públicos com uma região visual que possa receber imagem no futuro;
- fallback atual baseado em identidade visual, logotipo e Prajied.

Quando imagens forem implementadas, usar Supabase Storage ou outro serviço de objetos; não armazenar binários no Postgres nem no filesystem da Vercel.

## 17. Acessibilidade e experiência

- reutilizar `Button`, `Badge`, `SkipLink` e padrões existentes;
- labels reais em todos os campos;
- erros associados aos inputs;
- foco visível;
- navegação por teclado;
- switches com nome acessível e estado `aria-checked`;
- confirmação acessível ao reduzir khan ou excluir evento;
- não depender apenas de cor para indicar estado;
- respeitar `prefers-reduced-motion`;
- layouts funcionais em celular;
- estados de carregamento, vazio, sucesso e erro;
- datas e textos em português do Brasil.

## 18. Testes obrigatórios

### Qualidade estática

Ao final de cada fase:

```bash
npm run lint
npm run typecheck
npm run build
```

### Playwright

Cobrir, no mínimo:

1. canal do YouTube abre corretamente;
2. página pública de eventos carrega;
3. visitante não vê rascunho;
4. detalhe de evento mostra todas as informações;
5. paginação de eventos funciona;
6. página pública de alunos carrega;
7. busca e filtro de alunos funcionam;
8. detalhe do aluno mostra khans de 1 até o atual;
9. aluno no khan 7 não mostra khans 8–16 como conquistados;
10. rota administrativa sem sessão abre o login;
11. credenciais inválidas mostram erro genérico;
12. administrador válido entra;
13. usuário autenticado fora de `admin_users` não entra;
14. Lucas, Paulo e Renan têm acesso após provisionamento;
15. admin cria, edita e publica evento;
16. evento publicado aparece publicamente;
17. admin cria aluno;
18. selecionar khan 7 ativa 1–7;
19. avançar para 10 cria 8–10 sem duplicar 1–7;
20. redução de khan exige confirmação;
21. aluno oculto não aparece publicamente;
22. aluno arquivado não aparece publicamente;
23. logout volta a proteger o painel.

Testar RLS diretamente, além dos testes de interface, com:

- visitante anônimo;
- Lucas, Paulo ou Renan como administrador;
- um quarto usuário autenticado sem linha em `admin_users`.

Nunca executar testes destrutivos contra o banco de produção.

## 19. Fases de implementação

### Fase 1 — YouTube e organização

- adicionar canal oficial;
- revisar roteamento;
- organizar fonte única dos khans;
- garantir que o build permaneça verde.

### Fase 2 — Supabase e schema

- instalar SDK;
- criar cliente tipado;
- escrever migration completa;
- criar índices, triggers, funções e RLS;
- testar policies localmente ou em projeto de desenvolvimento.

### Fase 3 — Eventos públicos

- tabela;
- filtros;
- paginação;
- detalhe;
- menu e navegação.

### Fase 4 — Alunos públicos

- tabela;
- busca e filtro;
- paginação;
- ribbons;
- trajetória e detalhe.

### Fase 5 — Autenticação

- login;
- restauração de sessão;
- verificação de administrador;
- logout;
- rotas protegidas.

### Fase 6 — CRUD de eventos

- tabela administrativa;
- formulário;
- publicação, cancelamento e exclusão;
- validações.

### Fase 7 — CRUD de alunos

- tabela administrativa;
- formulário;
- seletor cumulativo;
- RPC transacional;
- publicação e arquivamento.

### Fase 8 — Testes e deploy

- testes de interface e RLS;
- acessibilidade;
- responsividade;
- lint, typecheck e build;
- variáveis na Vercel;
- validação em produção.

Cada fase deve ser entregue em commit separado e pequeno. Não misturar refatorações visuais não relacionadas ao escopo.

## 20. Provisionamento e deploy

### Supabase

1. Criar projeto de desenvolvimento.
2. Escolher a região mais próxima disponível.
3. Aplicar migrations.
4. Desabilitar cadastro público.
5. Obter os e-mails de Lucas, Paulo e Renan.
6. Criar as três contas com senhas temporárias novas.
7. Inserir seus UUIDs em `admin_users` com os nomes de exibição.
8. Criar um quarto usuário de teste sem acesso administrativo.
9. Testar todas as policies.
10. Configurar URLs autorizadas do domínio de produção.

### Vercel

1. Configurar `VITE_SUPABASE_URL`.
2. Configurar `VITE_SUPABASE_PUBLISHABLE_KEY`.
3. Confirmar que nenhuma secret key foi adicionada.
4. Fazer deploy.
5. testar em janela anônima;
6. testar login dos três administradores;
7. testar tabelas, detalhes, paginação e responsividade;
8. verificar logs sem dados sensíveis.

## 21. Critérios de conclusão

O trabalho estará concluído quando:

- o canal correto do YouTube estiver acessível;
- eventos públicos tiverem tabela paginada e detalhe;
- alunos públicos tiverem tabela paginada, ribbon e trajetória;
- os 16 khans existentes forem reutilizados;
- seleção cumulativa estiver consistente no frontend e no banco;
- Lucas, Paulo e Renan forem os únicos administradores iniciais;
- usuários não administradores não conseguirem escrever nem acessar o painel;
- não houver senhas ou chaves secretas no repositório;
- não houver upload de imagens nesta versão;
- o schema estiver preparado para imagens futuras;
- testes de RLS e Playwright passarem;
- `lint`, `typecheck` e `build` passarem;
- a versão de produção estiver validada em desktop e celular.

## 22. Instrução resumida para o agente executor

Implemente o plano em fases, inspecionando o código existente antes de cada alteração. Preserve a arquitetura React/Vite, o roteamento por hash e a identidade visual. Reutilize os dados e componentes atuais dos 16 khans. Use Supabase Auth, Postgres e RLS, permitindo escrita somente aos UUIDs presentes em `admin_users`. Todas as listas devem ter paginação server-side e todas as entidades públicas devem ter página de detalhes. A versão inicial é textual e não terá upload de imagens. Não exponha secrets nem grave credenciais no repositório. Ao final de cada fase, execute lint, typecheck, build e os testes relevantes, corrigindo regressões antes de continuar.
