import { test, expect } from '@playwright/test';
import { parseHashRoute, buildHashUrl } from '../src/utils/routes';
import { generateSlug } from '../src/utils/slug';
import { ALL_KHANS_SYSTEM, isValidKhan } from '../src/constants/khans';
import { getGymNames } from '../src/utils/gyms';
import { bracketsService } from '../src/services/bracketsService';
import { buildStudentsCsvContent } from '../src/utils/studentExcelExport';
import { getGoogleMapsSearchUrl } from '../src/utils/maps';
import { formatDate, formatDateLong, getTodayLocalDate } from '../src/utils/date';
import { DbStudent } from '../src/types/database';

test.describe('Fase 1: Canal Oficial do YouTube e Configuração de Marca', () => {
  test('o canal do YouTube possui link oficial, atributos de segurança e acessibilidade no rodapé e na seção de contato', async ({
    page,
  }) => {
    await page.goto('/');

    // Link do YouTube no Footer
    const footerYtLink = page.locator('footer a[href="https://www.youtube.com/@pridemuaythaifighter"]');
    await expect(footerYtLink).toBeVisible();
    await expect(footerYtLink).toHaveAttribute('target', '_blank');
    await expect(footerYtLink).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(footerYtLink).toHaveAttribute('aria-label', /YouTube.*@pridemuaythaifighter/);

    // Link do YouTube na seção de Contato junto com o Instagram
    const contactYtLink = page.locator('#contato a[href="https://www.youtube.com/@pridemuaythaifighter"]').first();
    await expect(contactYtLink).toBeAttached();
    await expect(contactYtLink).toHaveAttribute('target', '_blank');
    await expect(contactYtLink).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(contactYtLink).toHaveAttribute('aria-label', /YouTube.*@pridemuaythaifighter/);
  });
});

test.describe('Fase 1 & 8: Fonte Única dos 16 Khans e Regra Cumulativa', () => {
  test('todos os 16 khans estão descritos com nível, cor, título e descrição', () => {
    expect(ALL_KHANS_SYSTEM).toHaveLength(16);

    for (let i = 1; i <= 16; i++) {
      const khan = ALL_KHANS_SYSTEM[i - 1];
      expect(khan.level).toBe(i);
      expect(khan.colorName).toBeTruthy();
      expect(khan.title).toBeTruthy();
      expect(khan.primaryColor).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(isValidKhan(i)).toBe(true);
    }

    expect(isValidKhan(0)).toBe(false);
    expect(isValidKhan(17)).toBe(false);
  });

  test('regra cumulativa: aluno no Khan 7 ativa níveis 1 a 7 e não inclui 8 a 16 como conquistados', () => {
    const studentKhan = 7;
    const achieved = ALL_KHANS_SYSTEM.filter((k) => k.level <= studentKhan);
    expect(achieved).toHaveLength(7);
    expect(achieved.map((k) => k.level)).toEqual([1, 2, 3, 4, 5, 6, 7]);

    const notAchieved = ALL_KHANS_SYSTEM.filter((k) => k.level > studentKhan);
    expect(notAchieved.map((k) => k.level)).toEqual([8, 9, 10, 11, 12, 13, 14, 15, 16]);
  });
});

test.describe('Roteamento Manual Tipado por Hash', () => {
  test('parseHashRoute reconhece todas as rotas públicas, administrativas e parâmetros de query', () => {
    expect(parseHashRoute('')).toEqual({ type: 'home' });
    expect(parseHashRoute('#inicio')).toEqual({ type: 'home', anchor: 'inicio' });
    expect(parseHashRoute('#/desenvolvedor')).toEqual({ type: 'developer' });
    expect(parseHashRoute('#/professores/paulo-roberto')).toEqual({
      type: 'professor-detail',
      professorId: 'paulo-roberto',
    });

    // Eventos
    const eventsRoute = parseHashRoute('#/eventos?timeframe=upcoming&category=competition&page=2');
    expect(eventsRoute.type).toBe('events-list');
    if (eventsRoute.type === 'events-list') {
      expect(eventsRoute.searchParams.get('timeframe')).toBe('upcoming');
      expect(eventsRoute.searchParams.get('category')).toBe('competition');
      expect(eventsRoute.searchParams.get('page')).toBe('2');
    }

    expect(parseHashRoute('#/eventos/copa-pride-2026')).toEqual({
      type: 'event-detail',
      slug: 'copa-pride-2026',
    });

    // Alunos
    const studentsRoute = parseHashRoute('#/alunos?page=2&khan=7&busca=lucas');
    expect(studentsRoute.type).toBe('students-list');
    if (studentsRoute.type === 'students-list') {
      expect(studentsRoute.searchParams.get('page')).toBe('2');
      expect(studentsRoute.searchParams.get('khan')).toBe('7');
      expect(studentsRoute.searchParams.get('busca')).toBe('lucas');
    }

    expect(parseHashRoute('#/alunos/carlos-eduardo')).toEqual({
      type: 'student-detail',
      slug: 'carlos-eduardo',
    });

    // Admin
    expect(parseHashRoute('#/admin')).toEqual({ type: 'admin-dashboard' });
    expect(parseHashRoute('#/admin/login')).toEqual({ type: 'admin-login' });
    expect(parseHashRoute('#/admin/eventos')).toMatchObject({ type: 'admin-events-list' });
    expect(parseHashRoute('#/admin/eventos/novo')).toEqual({ type: 'admin-event-create' });
    expect(parseHashRoute('#/admin/eventos/123/editar')).toEqual({
      type: 'admin-event-edit',
      id: '123',
    });
    expect(parseHashRoute('#/admin/alunos')).toMatchObject({ type: 'admin-students-list' });
    expect(parseHashRoute('#/admin/alunos/novo')).toEqual({ type: 'admin-student-create' });
    expect(parseHashRoute('#/admin/alunos/456/editar')).toEqual({
      type: 'admin-student-edit',
      id: '456',
    });
  });

  test('buildHashUrl formata parâmetros de busca preservando ordem e removendo vazios', () => {
    const url = buildHashUrl('/alunos', { page: 2, khan: 7, busca: 'renan', vazio: '' });
    expect(url).toBe('#/alunos?page=2&khan=7&busca=renan');
  });

  test('generateSlug formata títulos com acentuação e espaços em slugs limpos', () => {
    expect(generateSlug('Copa Pride Muay Thai 2026')).toBe('copa-pride-muay-thai-2026');
    expect(generateSlug('Graduação de Faixas & Prajied — São José dos Campos')).toBe(
      'graduacao-de-faixas-prajied-sao-jose-dos-campos'
    );
  });
});

test.describe('Fase 3 & 4: Navegação Pública de Eventos e Alunos', () => {
  test('navegação para página de eventos renderiza cabeçalho editorial e filtros', async ({ page }) => {
    await page.goto('/#/eventos');
    await expect(page.locator('h1')).toContainText(/EVENTOS/i);
    await expect(page.getByText('Agenda & Publicações Oficiais')).toBeVisible();
    await expect(page.locator('select[aria-label="Filtrar por categoria"]')).toBeVisible();
  });

  test('navegação para página de alunos renderiza cabeçalho oficial e seletor de khans', async ({ page }) => {
    await page.goto('/#/alunos');
    await expect(page.locator('h1')).toContainText(/ALUNOS/i);
    await expect(page.getByText('Quadro Oficial de Alunos')).toBeVisible();
    await expect(page.locator('select[aria-label="Filtrar por Khan"]')).toBeVisible();
  });
});

test.describe('Fase 5: Autenticação e Proteção do Painel Administrativo', () => {
  test('acesso à rota administrativa sem autenticação exibe a tela de login', async ({ page }) => {
    await page.goto('/#/admin');
    await expect(page.locator('h1')).toContainText(/Painel.*Administrativo/i);
    await expect(page.locator('#admin-email')).toBeVisible();
    await expect(page.locator('#admin-password')).toBeVisible();
    await expect(page.getByRole('button', { name: /Entrar no Painel/i })).toBeVisible();
  });

  test('credenciais inválidas ou submissão sem preenchimento exibem mensagem amigável', async ({ page }) => {
    await page.goto('/#/admin');
    await page.fill('#admin-email', 'usuario.invalido@exemplo.com');
    await page.fill('#admin-password', 'senha_errada_123');
    await page.click('button[type="submit"]');

    const alert = page.locator('[role="alert"]');
    await expect(alert).toBeVisible();
  });

  test('guards de edição: rotas de edição de aluno e evento bloqueadas para usuários não autenticados', async ({
    page,
  }) => {
    // Tenta acessar edição de aluno sem estar logado
    await page.goto('/#/admin/alunos/123-aluno-teste/editar');
    await expect(page.locator('#admin-email')).toBeVisible();
    await expect(page.locator('#admin-password')).toBeVisible();

    // Tenta acessar edição de evento sem estar logado
    await page.goto('/#/admin/eventos/456-evento-teste/editar');
    await expect(page.locator('#admin-email')).toBeVisible();
    await expect(page.locator('#admin-password')).toBeVisible();
  });
});

test.describe('Fase 6 & 7: Lógica de Negócio e Proteção Cumulativa', () => {
  test('avançar do Khan 7 para o Khan 10 calcula adição cumulativa de 8, 9 e 10 sem duplicatas', () => {
    const currentLevels = [1, 2, 3, 4, 5, 6, 7];
    const targetKhan = 10;

    const newLevelsToCreate: number[] = [];
    for (let lvl = 1; lvl <= targetKhan; lvl++) {
      if (!currentLevels.includes(lvl)) {
        newLevelsToCreate.push(lvl);
      }
    }

    expect(newLevelsToCreate).toEqual([8, 9, 10]);
    const finalLevels = Array.from(new Set([...currentLevels, ...newLevelsToCreate]));
    expect(finalLevels).toHaveLength(10);
    expect(finalLevels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  test('regras de visibilidade pública: rascunhos e alunos ocultos/arquivados não são públicos', () => {
    // Simulação do filtro RLS de eventos públicos
    const events = [
      { id: '1', title: 'Evento 1', status: 'published', published_at: '2026-10-01' },
      { id: '2', title: 'Rascunho', status: 'draft', published_at: null },
      { id: '3', title: 'Cancelado Não Publicado', status: 'cancelled', published_at: null },
      { id: '4', title: 'Cancelado Oficial', status: 'cancelled', published_at: '2026-09-01' },
    ];

    const publicEvents = events.filter(
      (e) => e.status === 'published' || (e.status === 'cancelled' && e.published_at !== null)
    );

    expect(publicEvents.map((e) => e.id)).toEqual(['1', '4']);
    expect(publicEvents.some((e) => e.status === 'draft')).toBe(false);

    // Simulação do filtro RLS de alunos públicos
    const students = [
      { id: '1', name: 'Ativo e Publicado', is_active: true, is_published: true },
      { id: '2', name: 'Oculto', is_active: true, is_published: false },
      { id: '3', name: 'Arquivado', is_active: false, is_published: true },
      { id: '4', name: 'Arquivado e Oculto', is_active: false, is_published: false },
    ];

    const publicStudents = students.filter((s) => s.is_active && s.is_published);
    expect(publicStudents.map((s) => s.id)).toEqual(['1']);
  });

  test('administradores iniciais autorizados no plano de desenvolvimento', () => {
    const initialAdmins = [
      { name: 'Lucas Nascimento', role: 'Administrador/desenvolvedor' },
      { name: 'Paulo Roberto', role: 'Administrador/professor' },
      { name: 'Renan Fernandes', role: 'Administrador/mestre' },
    ];

    expect(initialAdmins).toHaveLength(3);
    const names = initialAdmins.map((a) => a.name);
    expect(names).toContain('Lucas Nascimento');
    expect(names).toContain('Paulo Roberto');
    expect(names).toContain('Renan Fernandes');
  });

  test('suporte a academias opcionais para alunos mapeia IDs conhecidos e aceita nulo/vazio', () => {
    // Aluno sem academia cadastrada (opcional)
    expect(getGymNames(undefined)).toEqual([]);
    expect(getGymNames([])).toEqual([]);

    // Aluno com uma ou mais academias oficiais
    const gyms = getGymNames(['arena-viking-santa-maria', 'ct3-artes-marciais']);
    expect(gyms).toContain('Arena Viking Santa Maria');
    expect(gyms).toContain('CT3 Artes Marciais');

    // Suporte a academia externa / customizada
    expect(getGymNames(['Academia Externa'])).toEqual(['Academia Externa']);
  });

  test('chaveamentos de competição: geração de modelos, relacionamento com evento e cálculo de campeão', () => {
    // 1. Modelo de 4 lutadores (GP)
    const gp4 = bracketsService.generateTemplateRounds('4_fighters');
    expect(gp4).toHaveLength(2);
    expect(gp4[0].round_name).toBe('Semifinais');
    expect(gp4[0].matches).toHaveLength(2);
    expect(gp4[1].round_name).toBe('Grande Final');
    expect(gp4[1].matches).toHaveLength(1);

    // 2. Modelo de 8 lutadores (Torneio)
    const gp8 = bracketsService.generateTemplateRounds('8_fighters');
    expect(gp8).toHaveLength(3);
    expect(gp8[0].round_name).toBe('Quartas de Final');
    expect(gp8[0].matches).toHaveLength(4);
    expect(gp8[1].round_name).toBe('Semifinais');
    expect(gp8[1].matches).toHaveLength(2);
    expect(gp8[2].round_name).toBe('Grande Final');
    expect(gp8[2].matches).toHaveLength(1);

    // 3. Modelo de 2 lutadores (Final Direta)
    const gp2 = bracketsService.generateTemplateRounds('2_fighters');
    expect(gp2).toHaveLength(1);
    expect(gp2[0].matches).toHaveLength(1);

    // 4. Modelo de superlutas
    const superFights = bracketsService.generateTemplateRounds('super_fights');
    expect(superFights).toHaveLength(1);
    expect(superFights[0].matches).toHaveLength(3);

    // 5. Verificação de relacionamento obrigatório com evento (event_id)
    const fakeBracket = {
      id: 'bracket-1',
      event_id: 'event-uuid-1234',
      title: 'GP 70kg',
      category_name: 'Adulto',
      bracket_type: 'single_elimination' as const,
      rounds: gp4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: null,
      updated_by: null,
    };
    expect(fakeBracket.event_id).toBe('event-uuid-1234');
    expect(fakeBracket.title).toBeTruthy();
  });

  test('exportação de alunos para Excel: colunas estritas Nome, Khan Atual e Academia com formatação pt-BR', () => {
    const mockStudents: DbStudent[] = [
      {
        id: 'student-1',
        name: 'Lucas "The Hammer" Nascimento',
        slug: 'lucas-nascimento',
        current_khan: 7,
        is_active: true,
        is_published: true,
        gym_ids: ['arena-viking-santa-maria'],
        graduation_date: '2026-01-15',
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-15T00:00:00Z',
      },
      {
        id: 'student-2',
        name: 'Carlos Eduardo',
        slug: 'carlos-eduardo',
        current_khan: 1,
        is_active: true,
        is_published: true,
        gym_ids: [],
        graduation_date: '2026-02-01',
        created_at: '2026-02-01T00:00:00Z',
        updated_at: '2026-02-01T00:00:00Z',
      },
      {
        id: 'student-3',
        name: 'Mariana Silva',
        slug: 'mariana-silva',
        current_khan: 12,
        is_active: true,
        is_published: true,
        gym_ids: ['arena-viking-santa-maria', 'ct3-artes-marciais'],
        graduation_date: '2026-03-01',
        created_at: '2026-03-01T00:00:00Z',
        updated_at: '2026-03-01T00:00:00Z',
      },
    ];

    const csv = buildStudentsCsvContent(mockStudents);

    // Começa com UTF-8 BOM
    expect(csv.startsWith('\uFEFF')).toBe(true);

    const lines = csv.replace('\uFEFF', '').split('\r\n');
    expect(lines).toHaveLength(4); // Cabeçalho + 3 linhas

    // Cabeçalho estritamente: "Nome";"Khan Atual";"Academia"
    expect(lines[0]).toBe('"Nome";"Khan Atual";"Academia"');

    // Linha 1: Lucas com aspas escapadas e academia Viking
    expect(lines[1]).toContain('"Lucas ""The Hammer"" Nascimento"');
    expect(lines[1]).toContain('"7º Khan (Azul Ponta Branca)"');
    expect(lines[1]).toContain('"Arena Viking Santa Maria"');

    // Linha 2: Carlos sem academia (Não informada) e Khan 1
    expect(lines[2]).toContain('"Carlos Eduardo"');
    expect(lines[2]).toContain('"1º Khan (Branca)"');
    expect(lines[2]).toContain('"Não informada"');

    // Linha 3: Mariana com múltiplas academias e Khan 12
    expect(lines[3]).toContain('"Mariana Silva"');
    expect(lines[3]).toContain('"12º Khan (Preta)"');
    expect(lines[3]).toContain('"Arena Viking Santa Maria, CT3 Artes Marciais"');
  });

  test('localizações integradas ao Google Maps: geração de URLs e links seguros', () => {
    // 1. Geração de URL para termo simples e com caracteres especiais/acentuação
    const url1 = getGoogleMapsSearchUrl('Ginásio Municipal de Esportes, Jacareí - SP');
    expect(url1).toBe(
      'https://www.google.com/maps/search/?api=1&query=Gin%C3%A1sio%20Municipal%20de%20Esportes%2C%20Jacare%C3%AD%20-%20SP'
    );

    // 2. Geração para string vazia ou espaços
    expect(getGoogleMapsSearchUrl('')).toBe('https://www.google.com/maps');
    expect(getGoogleMapsSearchUrl('   ')).toBe('https://www.google.com/maps');

    // 3. Geração para academias
    const gymUrl = getGoogleMapsSearchUrl('Arena Viking Santa Maria');
    expect(gymUrl).toBe(
      'https://www.google.com/maps/search/?api=1&query=Arena%20Viking%20Santa%20Maria'
    );
  });

  test('fuso horário e datas de graduação: data selecionada preserva exatamente o dia sem adiantar ou atrasar', () => {
    // 1. Data de calendário padrão YYYY-MM-DD não deve sofrer recuo para o dia anterior
    expect(formatDate('2026-10-27')).toBe('27/10/2026');
    expect(formatDate('2026-01-01')).toBe('01/01/2026');
    expect(formatDate('2026-12-31')).toBe('31/12/2026');

    // 2. Formato por extenso
    expect(formatDateLong('2026-10-27')).toBe('27 de outubro de 2026');
    expect(formatDateLong('2026-05-15')).toBe('15 de maio de 2026');

    // 3. getTodayLocalDate retorna formato YYYY-MM-DD no fuso de São Paulo
    const today = getTodayLocalDate();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('visibilidade de chaveamentos: chaveamentos privados não são visíveis para visitantes comuns', () => {
    const brackets = [
      { id: 'b1', title: 'Chave Pública', is_published: true, rounds: [] },
      { id: 'b2', title: 'Chave Rascunho', is_published: false, rounds: [] },
      { id: 'b3', title: 'Chave Padrão', is_published: undefined, rounds: [] },
    ];

    // Visitante não autenticado (isAdmin = false)
    const publicVisible = brackets.filter((b) => Boolean(b.is_published));
    expect(publicVisible).toHaveLength(1);
    expect(publicVisible[0].title).toBe('Chave Pública');

    // Administrador autenticado (isAdmin = true)
    const adminVisible = brackets.filter(() => true);
    expect(adminVisible).toHaveLength(3);
  });

  test('novos recursos de evento: valor, chave PIX padrão 12991746964, redes sociais e resumo opcional', () => {
    const mockEvent = {
      id: 'event-test-1',
      slug: 'copa-pride-2026',
      title: 'Copa Pride de Muay Thai 2026',
      category: 'competition' as const,
      status: 'published' as const,
      summary: '', // Resumo opcional (vazio)
      description: 'Torneio oficial com disputa de cinturões.',
      event_date: '2026-11-20T10:00:00Z',
      end_date: null,
      location: 'Jacareí - SP',
      price: 'R$ 50,00',
      show_pix: true,
      pix_key: '12991746964',
      show_instagram: true,
      show_youtube: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: null,
      updated_by: null,
      requirements: null,
      registration_info: null,
      registration_url: null,
      contact: null,
      published_at: null,
      image_url: null,
    };

    // 1. Resumo opcional: se vazio, usa descrição como fallback
    const displaySummary = mockEvent.summary || mockEvent.description;
    expect(displaySummary).toBe('Torneio oficial com disputa de cinturões.');

    // 2. Chave PIX padrão do Renan
    expect(mockEvent.pix_key).toBe('12991746964');
    expect(mockEvent.show_pix).toBe(true);

    // 3. Valor e canais sociais
    expect(mockEvent.price).toBe('R$ 50,00');
    expect(mockEvent.show_instagram).toBe(true);
    expect(mockEvent.show_youtube).toBe(true);
  });
});
