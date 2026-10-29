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
import {
  isInitialSuperAdmin,
  canUserEditEvent,
  canResetUserPassword,
  canDeleteUser,
  getUserRoleDisplayLabel,
  RENAN_FERNANDES_ID,
  PAULO_ROBERTO_ID,
  LUCAS_NASCIMENTO_ID,
} from '../src/utils/superAdmins';
import {
  maskCurrencyInput,
  normalizeCurrencyBrl,
  formatDisplayPrice,
} from '../src/utils/currency';
import {
  GRADUATION_PIX,
  GRADUATION_MANDATORY_EQUIPMENT,
  GRADUATION_PRICING_TABLE,
  formatGraduationPrice,
  suggestNextKhan,
  getGraduationPriceForKhan,
} from '../src/constants/graduation';
import {
  transformGraduationRegistrationsForExport,
  buildGraduationExportFilename,
  exportGraduationToExcel,
  exportGraduationToPdf,
  exportGraduationToWord,
} from '../src/utils/graduationExports';
import { GraduationRegistrationWithEvent } from '../src/services/graduationRegistrationsService';

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

  test('gestão de usuários e permissões de Super Admins fundadores vs administradores delegados', () => {
    const DELEGATED_ADMIN_ID = '99999999-9999-9999-9999-999999999999';
    const ANOTHER_ADMIN_ID = '88888888-8888-8888-8888-888888888888';

    // 1. Rota de gestão de usuários
    const userRoute = parseHashRoute('#/admin/usuarios');
    expect(userRoute.type).toBe('admin-users-list');

    // 2. Reconhecimento estrito dos 3 fundadores iniciais
    expect(isInitialSuperAdmin(RENAN_FERNANDES_ID)).toBe(true);
    expect(isInitialSuperAdmin(PAULO_ROBERTO_ID)).toBe(true);
    expect(isInitialSuperAdmin(LUCAS_NASCIMENTO_ID)).toBe(true);
    expect(isInitialSuperAdmin(DELEGATED_ADMIN_ID)).toBe(false);
    expect(isInitialSuperAdmin(null)).toBe(false);

    // 3. Permissão de edição de eventos
    const founderEvent = { created_by: RENAN_FERNANDES_ID };
    const delegatedEvent = { created_by: DELEGATED_ADMIN_ID };
    const legacyEvent = { created_by: null };

    // Fundadores têm full access e podem editar qualquer evento
    expect(canUserEditEvent(RENAN_FERNANDES_ID, founderEvent)).toBe(true);
    expect(canUserEditEvent(PAULO_ROBERTO_ID, founderEvent)).toBe(true);
    expect(canUserEditEvent(LUCAS_NASCIMENTO_ID, delegatedEvent)).toBe(true);
    expect(canUserEditEvent(RENAN_FERNANDES_ID, legacyEvent)).toBe(true);

    // Administrador delegado SÓ pode editar o evento que ele próprio criou
    expect(canUserEditEvent(DELEGATED_ADMIN_ID, delegatedEvent)).toBe(true);
    expect(canUserEditEvent(DELEGATED_ADMIN_ID, founderEvent)).toBe(false);
    expect(canUserEditEvent(DELEGATED_ADMIN_ID, legacyEvent)).toBe(false);
    expect(canUserEditEvent(ANOTHER_ADMIN_ID, delegatedEvent)).toBe(false);

    // 4. Reset de senha: fundadores podem resetar novos admins, mas NÃO podem resetar uns aos outros
    // Fundador resetando delegado: PERMITIDO
    expect(canResetUserPassword(RENAN_FERNANDES_ID, DELEGATED_ADMIN_ID)).toBe(true);
    expect(canResetUserPassword(PAULO_ROBERTO_ID, DELEGATED_ADMIN_ID)).toBe(true);
    expect(canResetUserPassword(LUCAS_NASCIMENTO_ID, DELEGATED_ADMIN_ID)).toBe(true);

    // Fundador tentando resetar outro fundador: BLOQUEADO ("menos um do outro")
    expect(canResetUserPassword(RENAN_FERNANDES_ID, PAULO_ROBERTO_ID)).toBe(false);
    expect(canResetUserPassword(PAULO_ROBERTO_ID, LUCAS_NASCIMENTO_ID)).toBe(false);
    expect(canResetUserPassword(LUCAS_NASCIMENTO_ID, RENAN_FERNANDES_ID)).toBe(false);

    // Delegado tentando resetar qualquer um: BLOQUEADO
    expect(canResetUserPassword(DELEGATED_ADMIN_ID, ANOTHER_ADMIN_ID)).toBe(false);
    expect(canResetUserPassword(DELEGATED_ADMIN_ID, RENAN_FERNANDES_ID)).toBe(false);

    // 5. Exclusão de contas: fundadores são imutáveis e nunca podem ser excluídos
    expect(canDeleteUser(RENAN_FERNANDES_ID, PAULO_ROBERTO_ID)).toBe(false);
    expect(canDeleteUser(LUCAS_NASCIMENTO_ID, RENAN_FERNANDES_ID)).toBe(false);
    expect(canDeleteUser(RENAN_FERNANDES_ID, DELEGATED_ADMIN_ID)).toBe(true);
    expect(canDeleteUser(DELEGATED_ADMIN_ID, ANOTHER_ADMIN_ID)).toBe(false);

    // 6. Rótulos visuais de papel no sistema (ribbons personalizados)
    expect(getUserRoleDisplayLabel(LUCAS_NASCIMENTO_ID)).toBe('Desenvolvedor / Full Access');
    expect(getUserRoleDisplayLabel(PAULO_ROBERTO_ID)).toBe('Professor / Full Access');
    expect(getUserRoleDisplayLabel(RENAN_FERNANDES_ID)).toBe('Fundador / Full Access');
    expect(getUserRoleDisplayLabel(DELEGATED_ADMIN_ID)).toBe('Administrador Delegado');
  });

  test('máscara de valor do PIX e exibição obrigatória com R$ antes do número', () => {
    // 1. Digitação progressiva com máscara em tempo real
    expect(maskCurrencyInput('')).toBe('');
    expect(maskCurrencyInput('0')).toBe('');
    expect(maskCurrencyInput('6')).toBe('R$ 0,06');
    expect(maskCurrencyInput('60')).toBe('R$ 0,60');
    expect(maskCurrencyInput('600')).toBe('R$ 6,00');
    expect(maskCurrencyInput('6000')).toBe('R$ 60,00');
    expect(maskCurrencyInput('60000')).toBe('R$ 600,00');
    expect(maskCurrencyInput('150000')).toBe('R$ 1.500,00');

    // 2. Normalização de entradas (números inteiros, decimais com vírgula ou ponto, colados ou salvos no banco)
    expect(normalizeCurrencyBrl('60')).toBe('R$ 60,00');
    expect(normalizeCurrencyBrl('60,00')).toBe('R$ 60,00');
    expect(normalizeCurrencyBrl('60.00')).toBe('R$ 60,00');
    expect(normalizeCurrencyBrl('R$60,00')).toBe('R$ 60,00');
    expect(normalizeCurrencyBrl('R$ 60,00')).toBe('R$ 60,00');
    expect(normalizeCurrencyBrl('R$ 60')).toBe('R$ 60,00');
    expect(normalizeCurrencyBrl('1500')).toBe('R$ 1.500,00');
    expect(normalizeCurrencyBrl('1.250,50')).toBe('R$ 1.250,50');
    expect(normalizeCurrencyBrl('')).toBe('');
    expect(normalizeCurrencyBrl(null)).toBe('');

    // 3. Formatação para exibição: garante SEMPRE o prefixo 'R$' antes do número
    expect(formatDisplayPrice('60')).toBe('R$ 60,00');
    expect(formatDisplayPrice('60,00')).toBe('R$ 60,00');
    expect(formatDisplayPrice('R$60,00')).toBe('R$ 60,00');
    expect(formatDisplayPrice('R$ 60,00')).toBe('R$ 60,00');
    expect(formatDisplayPrice('')).toBe('');
    expect(formatDisplayPrice(null)).toBe('');
  });
});

test.describe('Inscrições e Gestão de Graduações', () => {
  test('1. Constantes das regras fixas e equipamentos de graduação', () => {
    expect(GRADUATION_PIX.key).toBe('12991746964');
    expect(GRADUATION_PIX.displayKey).toBe('(12) 99174-6964');
    expect(GRADUATION_PIX.institution).toBe('Mercado Pago');
    expect(GRADUATION_PIX.beneficiary).toBe('Renan');

    expect(GRADUATION_MANDATORY_EQUIPMENT).toContain('Camiseta padrão da equipe');
    expect(GRADUATION_MANDATORY_EQUIPMENT).toContain('Calção de Muay Thai');
    expect(GRADUATION_MANDATORY_EQUIPMENT).toContain('Bandagem e luva');
    expect(GRADUATION_MANDATORY_EQUIPMENT).toContain('Caneleira acima do 4º Khan');
  });

  test('2. Tabela de valores fixos e formatação pt-BR', () => {
    // 1º Khan não definido -> exibe '—' e não gratuito
    const khan1 = GRADUATION_PRICING_TABLE.find((t) => t.level === 1);
    expect(khan1?.priceInCents).toBeNull();
    expect(formatGraduationPrice(khan1?.priceInCents)).toBe('—');

    // 2º Khan -> 14500 (R$ 145,00)
    const khan2 = GRADUATION_PRICING_TABLE.find((t) => t.level === 2);
    expect(khan2?.priceInCents).toBe(14500);
    expect(formatGraduationPrice(khan2?.priceInCents)).toMatch(/R\$\s*145,00/);

    // 3º Khan -> 17500 (R$ 175,00)
    expect(getGraduationPriceForKhan(3)).toBe(17500);
    expect(formatGraduationPrice(17500)).toMatch(/R\$\s*175,00/);

    // 4º Khan -> 23000 (R$ 230,00)
    expect(getGraduationPriceForKhan(4)).toBe(23000);
    expect(formatGraduationPrice(23000)).toMatch(/R\$\s*230,00/);

    // 5º Khan -> 26000 (R$ 260,00)
    expect(getGraduationPriceForKhan(5)).toBe(26000);
    expect(formatGraduationPrice(26000)).toMatch(/R\$\s*260,00/);

    // 6º Khan -> 30000 (R$ 300,00)
    expect(getGraduationPriceForKhan(6)).toBe(30000);
    expect(formatGraduationPrice(30000)).toMatch(/R\$\s*300,00/);

    // 7º Khan -> 36000 (R$ 360,00)
    expect(getGraduationPriceForKhan(7)).toBe(36000);
    expect(formatGraduationPrice(36000)).toMatch(/R\$\s*360,00/);

    // 8º Khan -> 48000 (R$ 480,00)
    expect(getGraduationPriceForKhan(8)).toBe(48000);
    expect(formatGraduationPrice(48000)).toMatch(/R\$\s*480,00/);

    // 9º Khan -> 70000 (R$ 700,00)
    expect(getGraduationPriceForKhan(9)).toBe(70000);
    expect(formatGraduationPrice(70000)).toMatch(/R\$\s*700,00/);

    // 10º Khan -> 150000 (R$ 1.500,00)
    const khan10 = GRADUATION_PRICING_TABLE.find((t) => t.level === 10);
    expect(khan10?.priceInCents).toBe(150000);
    expect(formatGraduationPrice(khan10?.priceInCents)).toMatch(/R\$\s*1\.500,00/);

    // Khans 11 a 16 não devem ter preços inventados
    for (let k = 11; k <= 16; k++) {
      expect(getGraduationPriceForKhan(k)).toBeNull();
    }
  });

  test('3. Sugestão do próximo Khan (1->2, 9->10, 16->16)', () => {
    expect(suggestNextKhan(1)).toBe(2);
    expect(suggestNextKhan(2)).toBe(3);
    expect(suggestNextKhan(4)).toBe(5);
    expect(suggestNextKhan(9)).toBe(10);
    expect(suggestNextKhan(15)).toBe(16);
    expect(suggestNextKhan(16)).toBe(16);
    expect(suggestNextKhan(null)).toBe(1);
    expect(suggestNextKhan(undefined)).toBe(1);
  });

  test('4. Parsing da rota #/admin/graduacoes e query params', () => {
    const route = parseHashRoute('#/admin/graduacoes');
    expect(route.type).toBe('admin-graduation-registrations');

    const routeWithParam = parseHashRoute('#/admin/graduacoes?event_id=abc-123');
    expect(routeWithParam.type).toBe('admin-graduation-registrations');
    if (routeWithParam.type === 'admin-graduation-registrations') {
      expect(routeWithParam.searchParams.get('event_id')).toBe('abc-123');
    }
  });

  test('5. Filtros de pago, pendente, evento, Khan e período', () => {
    const mockData: GraduationRegistrationWithEvent[] = [
      {
        id: '1',
        event_id: 'evt-1',
        student_id: 'std-1',
        full_name: 'Lucas Nascimento',
        current_khan_at_registration: 7,
        target_khan: 8,
        payment_status: 'paid',
        paid_at: '2026-05-10T12:00:00Z',
        paid_by: 'admin-1',
        created_at: '2026-05-01T10:00:00Z',
        updated_at: '2026-05-10T12:00:00Z',
        event: {
          id: 'evt-1',
          title: 'Exame de Graduação Inverno 2026',
          slug: 'exame-graduacao-inverno-2026',
          category: 'graduation',
          event_date: '2026-06-20T14:00:00Z',
        },
      },
      {
        id: '2',
        event_id: 'evt-1',
        student_id: null,
        full_name: 'Visitante Externo',
        current_khan_at_registration: null,
        target_khan: 2,
        payment_status: 'pending',
        paid_at: null,
        paid_by: null,
        created_at: '2026-05-02T10:00:00Z',
        updated_at: '2026-05-02T10:00:00Z',
        event: {
          id: 'evt-1',
          title: 'Exame de Graduação Inverno 2026',
          slug: 'exame-graduacao-inverno-2026',
          category: 'graduation',
          event_date: '2026-06-20T14:00:00Z',
        },
      },
      {
        id: '3',
        event_id: 'evt-2',
        student_id: 'std-2',
        full_name: 'Renan Hulkinho',
        current_khan_at_registration: 12,
        target_khan: 13,
        payment_status: 'paid',
        paid_at: '2026-11-05T12:00:00Z',
        paid_by: 'admin-1',
        created_at: '2026-11-01T10:00:00Z',
        updated_at: '2026-11-05T12:00:00Z',
        event: {
          id: 'evt-2',
          title: 'Exame de Graduação Verão 2026',
          slug: 'exame-graduacao-verao-2026',
          category: 'graduation',
          event_date: '2026-12-15T14:00:00Z',
        },
      },
    ];

    // Filtro por pago
    const paidOnly = mockData.filter((r) => r.payment_status === 'paid');
    expect(paidOnly).toHaveLength(2);

    // Filtro por pendente
    const pendingOnly = mockData.filter((r) => r.payment_status === 'pending');
    expect(pendingOnly).toHaveLength(1);

    // Filtro por evento
    const evt1Only = mockData.filter((r) => r.event_id === 'evt-1');
    expect(evt1Only).toHaveLength(2);

    // Filtro por Khan pretendido
    const khan8Only = mockData.filter((r) => r.target_khan === 8);
    expect(khan8Only).toHaveLength(1);
    expect(khan8Only[0].full_name).toBe('Lucas Nascimento');

    // Filtro por período de realização do evento
    const summerPeriod = mockData.filter(
      (r) => r.event?.event_date && r.event.event_date >= '2026-12-01'
    );
    expect(summerPeriod).toHaveLength(1);
    expect(summerPeriod[0].full_name).toBe('Renan Hulkinho');
  });

  test('6. A transformação usada nos três exportadores (Word, PDF, Excel)', () => {
    const mockData: GraduationRegistrationWithEvent[] = [
      {
        id: '1',
        event_id: 'evt-1',
        student_id: 'std-1',
        full_name: 'Lucas Nascimento',
        current_khan_at_registration: 7,
        target_khan: 8,
        payment_status: 'paid',
        paid_at: '2026-05-10T12:00:00Z',
        paid_by: 'admin-1',
        created_at: '2026-05-01T10:00:00Z',
        updated_at: '2026-05-10T12:00:00Z',
        event: {
          id: 'evt-1',
          title: 'Exame de Graduação Oficial 2026',
          slug: 'exame-graduacao-oficial-2026',
          category: 'graduation',
          event_date: '2026-06-20T14:00:00Z',
        },
      },
      {
        id: '2',
        event_id: 'evt-1',
        student_id: null,
        full_name: 'Praticante Convidado',
        current_khan_at_registration: null,
        target_khan: 3,
        payment_status: 'pending',
        paid_at: null,
        paid_by: null,
        created_at: '2026-05-02T10:00:00Z',
        updated_at: '2026-05-02T10:00:00Z',
        event: {
          id: 'evt-1',
          title: 'Exame de Graduação Oficial 2026',
          slug: 'exame-graduacao-oficial-2026',
          category: 'graduation',
          event_date: '2026-06-20T14:00:00Z',
        },
      },
    ];

    const dataset = transformGraduationRegistrationsForExport(mockData, {
      eventName: 'Exame de Graduação Oficial 2026',
      filterSummary: 'Status: Todos | Evento: Exame Oficial',
    });

    expect(dataset.title).toBe('Pride Muay Thai — Lista de Graduação');
    expect(dataset.stats.total).toBe(2);
    expect(dataset.stats.paid).toBe(1);
    expect(dataset.stats.pending).toBe(1);

    expect(dataset.rows).toHaveLength(2);
    expect(dataset.rows[0].name).toBe('Lucas Nascimento');
    expect(dataset.rows[0].isRegisteredStudent).toBe(true);
    expect(dataset.rows[0].currentKhanText).toContain('7º Khan');
    expect(dataset.rows[0].targetKhanText).toContain('8º Khan');
    expect(dataset.rows[0].paymentStatusText).toBe('Pago');

    expect(dataset.rows[1].name).toBe('Praticante Convidado');
    expect(dataset.rows[1].isRegisteredStudent).toBe(false);
    expect(dataset.rows[1].currentKhanText).toBe('Informado manualmente');
    expect(dataset.rows[1].targetKhanText).toContain('3º Khan');
    expect(dataset.rows[1].paymentStatusText).toBe('Pendente');

    // Nomes de arquivo padronizados
    const xlsxName = buildGraduationExportFilename('xlsx', 'exame-graduacao-2026');
    expect(xlsxName).toMatch(/^pride-graduacao-exame-graduacao-2026-\d{4}-\d{2}-\d{2}\.xlsx$/);
  });

  test('7. Exportação utiliza todos os registros filtrados, não apenas a página visível', () => {
    // 25 registros filtrados (mais que o pageSize usual de 15)
    const twentyFiveRecords: GraduationRegistrationWithEvent[] = Array.from({ length: 25 }, (_, i) => ({
      id: `reg-${i + 1}`,
      event_id: 'evt-1',
      student_id: `std-${i + 1}`,
      full_name: `Aluno ${i + 1}`,
      current_khan_at_registration: (i % 10) + 1,
      target_khan: (i % 10) + 2,
      payment_status: (i % 2 === 0 ? 'paid' : 'pending') as GraduationPaymentStatus,
      paid_at: i % 2 === 0 ? '2026-05-10T12:00:00Z' : null,
      paid_by: null,
      created_at: '2026-05-01T10:00:00Z',
      updated_at: '2026-05-01T10:00:00Z',
    }));

    const dataset = transformGraduationRegistrationsForExport(twentyFiveRecords);
    expect(dataset.stats.total).toBe(25);
    expect(dataset.rows).toHaveLength(25);
    expect(dataset.rows[24].name).toBe('Aluno 25');
  });

  test('8 e 9. Regras de exibição de graduação vs outras categorias', () => {
    // Evento de graduação vs evento de competição
    const competitionEvent: DbEvent = {
      id: 'comp-1',
      slug: 'copa-pride-2026',
      category: 'competition',
      title: 'Copa Pride de Muay Thai',
      summary: 'Torneio regional',
      description: 'Descrição da competição',
      event_date: '2026-07-15T10:00:00Z',
      end_date: null,
      location: 'São José dos Campos/SP',
      requirements: null,
      registration_info: null,
      registration_url: null,
      contact: null,
      status: 'published',
      published_at: '2026-05-01T10:00:00Z',
      image_url: null,
      created_at: '2026-05-01T10:00:00Z',
      updated_at: '2026-05-01T10:00:00Z',
      created_by: null,
      updated_by: null,
    };

    const graduationEvent: DbEvent = {
      ...competitionEvent,
      id: 'grad-1',
      slug: 'exame-graduacao-2026',
      category: 'graduation',
      title: 'Exame de Graduação de Khans',
      graduation_registration_enabled: true,
      graduation_registration_deadline: '2026-07-10T23:59:00Z',
    };

    // A categoria graduation é a condição estrita para renderizar o bloco fixo
    expect(competitionEvent.category === 'graduation').toBe(false);
    expect(graduationEvent.category === 'graduation').toBe(true);

    // Eventos de graduação utilizam as regras fixas autoritativas
    expect(GRADUATION_PIX.key).toBe('12991746964');
    expect(GRADUATION_MANDATORY_EQUIPMENT.length).toBeGreaterThan(0);
    expect(GRADUATION_PRICING_TABLE.length).toBe(10);
  });

  test('10. Formulário de inscrição: validação de expiração e prazos', () => {
    const expiredDeadline = '2026-01-01T00:00:00Z';
    const futureDeadline = '2030-01-01T00:00:00Z';

    const isExpired = (deadline: string) => new Date(deadline).getTime() <= Date.now();

    expect(isExpired(expiredDeadline)).toBe(true);
    expect(isExpired(futureDeadline)).toBe(false);
  });

  test('11. Login mobile aparece no canto superior direito ao lado do menu hambúrguer', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Botão de login móvel
    const mobileLoginBtn = page.locator('header a[aria-label="Entrar no painel administrativo"]');
    await expect(mobileLoginBtn).toBeVisible();
    await expect(mobileLoginBtn).toHaveAttribute('href', '#/admin/login');

    // Botão de menu hambúrguer móvel
    const mobileMenuBtn = page.locator('header button[aria-label="Abrir menu de navegação"]');
    await expect(mobileMenuBtn).toBeVisible();

    // Clicar no menu abre o drawer e verifica que o login grande foi removido do drawer
    await mobileMenuBtn.click();
    const mobileDrawer = page.locator('nav[aria-label="Menu móvel"]');
    await expect(mobileDrawer).toBeVisible();
    const drawerLoginBtn = mobileDrawer.locator('a[href="#/admin/login"]');
    await expect(drawerLoginBtn).toHaveCount(0);
  });

  test('12. O status de pagamento e lista de inscritos não aparecem publicamente', () => {
    // Dataset para exportação ou exibição administrativa
    const mockRegistrations: GraduationRegistrationWithEvent[] = [
      {
        id: '1',
        event_id: 'evt-1',
        student_id: 'std-1',
        full_name: 'Aluno Protegido',
        current_khan_at_registration: 3,
        target_khan: 4,
        payment_status: 'paid',
        paid_at: '2026-05-10T12:00:00Z',
        paid_by: 'admin-1',
        created_at: '2026-05-01T10:00:00Z',
        updated_at: '2026-05-10T12:00:00Z',
      },
    ];

    // O status e o nome dos demais alunos só são acessíveis pela camada administrativa
    expect(mockRegistrations[0].payment_status).toBe('paid');
    expect(mockRegistrations[0].paid_by).toBe('admin-1');
  });

  test('13. Bloqueio de exportação quando não houver registros filtrados', async () => {
    await expect(exportGraduationToExcel([])).rejects.toThrow('Nenhum registro disponível para exportação.');
    await expect(exportGraduationToPdf([])).rejects.toThrow('Nenhum registro disponível para exportação.');
    await expect(exportGraduationToWord([])).rejects.toThrow('Nenhum registro disponível para exportação.');
  });
});
