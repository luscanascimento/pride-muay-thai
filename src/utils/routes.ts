import { AppRoute } from '../types/routes';

/**
 * Parses the current window.location.hash into a strongly-typed AppRoute.
 * Handles paths and query strings (e.g. #/alunos?page=2&khan=7&busca=lucas)
 */
export function parseHashRoute(rawHash: string): AppRoute {
  const hash = (rawHash || '').trim();

  // If empty or plain # or #/
  if (!hash || hash === '#' || hash === '#/') {
    return { type: 'home' };
  }

  // Anchor on home page (e.g. #inicio, #nossa-equipe, #onde-treinar)
  if (!hash.startsWith('#/')) {
    const anchor = hash.replace(/^#/, '');
    return { type: 'home', anchor };
  }

  // Extract path and query params from hash
  // e.g. "#/alunos?page=2&khan=7" -> path: "/alunos", queryString: "page=2&khan=7"
  const cleanHash = hash.slice(1); // remove leading '#'
  const [pathWithNoQuery, queryString] = cleanHash.split('?');
  const searchParams = new URLSearchParams(queryString || '');
  const path = pathWithNoQuery.replace(/\/+$/, '') || '/';

  // Developer page
  if (path === '/desenvolvedor' || path === '/lucas-nascimento' || path === '/dev') {
    return { type: 'developer' };
  }

  // Professor detail: #/professores/:id or #/professor/:id
  const profMatch = path.match(/^\/(?:professores|professor)\/([^/]+)$/);
  if (profMatch) {
    return { type: 'professor-detail', professorId: decodeURIComponent(profMatch[1]) };
  }

  // Events list & detail
  if (path === '/eventos') {
    return { type: 'events-list', searchParams };
  }
  const eventDetailMatch = path.match(/^\/eventos\/([^/]+)$/);
  if (eventDetailMatch) {
    return { type: 'event-detail', slug: decodeURIComponent(eventDetailMatch[1]) };
  }

  // Students list & detail
  if (path === '/alunos') {
    return { type: 'students-list', searchParams };
  }
  const studentDetailMatch = path.match(/^\/alunos\/([^/]+)$/);
  if (studentDetailMatch) {
    return { type: 'student-detail', slug: decodeURIComponent(studentDetailMatch[1]) };
  }

  // Admin routes
  if (path === '/admin/login') {
    return { type: 'admin-login' };
  }
  if (path === '/admin' || path === '/admin/dashboard') {
    return { type: 'admin-dashboard' };
  }
  if (path === '/admin/eventos/novo') {
    return { type: 'admin-event-create' };
  }
  const adminEventEditMatch = path.match(/^\/admin\/eventos\/([^/]+)\/editar$/);
  if (adminEventEditMatch) {
    return { type: 'admin-event-edit', id: decodeURIComponent(adminEventEditMatch[1]) };
  }
  if (path === '/admin/eventos') {
    return { type: 'admin-events-list', searchParams };
  }

  if (path === '/admin/alunos/novo') {
    return { type: 'admin-student-create' };
  }
  const adminStudentEditMatch = path.match(/^\/admin\/alunos\/([^/]+)\/editar$/);
  if (adminStudentEditMatch) {
    return { type: 'admin-student-edit', id: decodeURIComponent(adminStudentEditMatch[1]) };
  }
  const adminStudentDetailMatch = path.match(/^\/admin\/alunos\/([^/]+)$/);
  if (adminStudentDetailMatch) {
    return { type: 'admin-student-detail', id: decodeURIComponent(adminStudentDetailMatch[1]) };
  }
  if (path === '/admin/alunos') {
    return { type: 'admin-students-list', searchParams };
  }

  if (path === '/admin/graduacoes') {
    return { type: 'admin-graduation-registrations', searchParams };
  }

  if (path === '/admin/usuarios') {
    return { type: 'admin-users-list' };
  }

  // Fallback to home
  return { type: 'home' };
}

/**
 * Builds a hash URL with optional query parameters.
 */
export function buildHashUrl(path: string, params?: Record<string, string | number | undefined | null>): string {
  if (!params) return `#${path}`;

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      searchParams.set(key, String(value));
    }
  }

  const queryStr = searchParams.toString();
  return queryStr ? `#${path}?${queryStr}` : `#${path}`;
}

export function navigateTo(hash: string, options?: { replace?: boolean; smoothScroll?: boolean }): void {
  const targetHash = hash.startsWith('#') ? hash : `#${hash}`;

  if (options?.replace) {
    const url = new URL(window.location.href);
    url.hash = targetHash;
    window.location.replace(url.href);
  } else {
    window.location.hash = targetHash;
  }

  if (options?.smoothScroll !== false && !targetHash.startsWith('#/')) {
    const targetId = targetHash.replace(/^#/, '');
    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
    }
  }
}

/**
 * Valida se uma URL externa é estritamente HTTP ou HTTPS,
 * prevenindo ataques de execução de script via javascript: ou data: URIs.
 */
export function isSafeHttpUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function sanitizeExternalUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (isSafeHttpUrl(trimmed)) {
    return trimmed;
  }
  return null;
}
