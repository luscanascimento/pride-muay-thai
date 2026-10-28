-- ==============================================================================
-- Migration 005: Novos campos para eventos (Valor, PIX, Instagram, YouTube e Resumo opcional)
-- ==============================================================================

-- Torna o campo summary opcional (drop not null)
alter table public.events
  alter column summary drop not null;

-- Adiciona campos para Valor, Chave PIX e botões de Redes Sociais
alter table public.events
  add column if not exists price text null,
  add column if not exists show_pix boolean not null default false,
  add column if not exists pix_key text null default '12991746964',
  add column if not exists show_instagram boolean not null default false,
  add column if not exists show_youtube boolean not null default false;

comment on column public.events.price is 'Valor de entrada ou inscrição do evento (ex: R$ 50,00, Gratuito, etc.).';
comment on column public.events.show_pix is 'Indica se a chave PIX deve ser exibida publicamente na página do evento.';
comment on column public.events.pix_key is 'Chave PIX para pagamento/inscrição (padrão: 12991746964).';
comment on column public.events.show_instagram is 'Indica se o botão para o Instagram oficial deve ser exibido no evento.';
comment on column public.events.show_youtube is 'Indica se o botão para o canal oficial do YouTube deve ser exibido no evento.';
