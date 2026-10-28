export type AppRoute =
  | { type: 'home'; anchor?: string }
  | { type: 'developer' }
  | { type: 'professor-detail'; professorId: string }
  | { type: 'events-list'; searchParams: URLSearchParams }
  | { type: 'event-detail'; slug: string }
  | { type: 'students-list'; searchParams: URLSearchParams }
  | { type: 'student-detail'; slug: string }
  | { type: 'admin-login' }
  | { type: 'admin-dashboard' }
  | { type: 'admin-events-list'; searchParams: URLSearchParams }
  | { type: 'admin-event-create' }
  | { type: 'admin-event-edit'; id: string }
  | { type: 'admin-students-list'; searchParams: URLSearchParams }
  | { type: 'admin-student-create' }
  | { type: 'admin-student-detail'; id: string }
  | { type: 'admin-student-edit'; id: string }
  | { type: 'admin-users-list' };
