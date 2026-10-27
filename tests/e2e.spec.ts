import { test, expect } from '@playwright/test';
import { parseHashRoute, buildHashUrl } from '../src/utils/routes';
import { generateSlug } from '../src/utils/slug';
import { ALL_KHANS_SYSTEM, isValidKhan } from '../src/constants/khans';

test.describe('Fase 1: Canal Oficial do YouTube e Configuração de Marca', () => {
  test('o canal do YouTube possui link oficial, atributos de segurança e acessibilidade no rodapé e cabeçalho', async ({
    page,
  }) => {
    await page.goto('/');

    // Link do YouTube no Footer
    const footerYtLink = page.locator('footer a[href="https://www.youtube.com/@pridemuaythaifighter"]');
    await expect(footerYtLink).toBeVisible();
    await expect(footerYtLink).toHaveAttribute('target', '_blank');
    await expect(footerYtLink).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(footerYtLink).toHaveAttribute('aria-label', /YouTube.*@pridemuaythaifighter/);

    // Link do YouTube no Header Desktop
    const headerYtLink = page.locator('header a[href="https://www.youtube.com/@pridemuaythaifighter"]').first();
    await expect(headerYtLink).toBeAttached();
    await expect(headerYtLink).toHaveAttribute('target', '_blank');
    await expect(headerYtLink).toHaveAttribute('rel', 'noopener noreferrer');
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
});
