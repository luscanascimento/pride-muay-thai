-- ==============================================================================
-- Migration 002: Adiciona suporte a academias opcionais para alunos
-- ==============================================================================

alter table public.students
  add column if not exists gym_ids text[] not null default '{}';

comment on column public.students.gym_ids is 'Lista de identificadores ou nomes das academias onde o aluno treina (opcional).';

create index if not exists idx_students_gym_ids on public.students using gin(gym_ids);
