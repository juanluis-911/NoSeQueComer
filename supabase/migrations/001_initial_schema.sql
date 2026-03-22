create table recipes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  tipo text not null check (tipo in ('desayuno','comida','cena')),
  tiempo_min integer not null,
  dificultad text not null check (dificultad in ('fácil','media','difícil')),
  porciones integer default 2,
  ingredientes jsonb not null, -- [{"cantidad":"2","unidad":"pzas","item":"huevos"}]
  pasos jsonb not null,        -- ["Paso 1...","Paso 2..."]
  tags text[] default '{}',    -- ["sin_carne","rapido","economico"]
  imagen_url text,             -- null hasta fase de imágenes
  imagen_placeholder text,     -- color hex ej: "#F4A261"
  activa boolean default true,
  created_at timestamptz default now()
);

create table user_swipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  recipe_id uuid references recipes(id) on delete cascade,
  liked boolean not null,
  cocinada boolean default false,
  created_at timestamptz default now(),
  unique(user_id, recipe_id)
);

create table user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  sin_carne boolean default false,
  tiempo_max integer default 60,
  updated_at timestamptz default now()
);

-- RLS
alter table recipes enable row level security;
alter table user_swipes enable row level security;
alter table user_preferences enable row level security;

create policy "recipes_read" on recipes for select to authenticated using (activa = true);
create policy "swipes_own" on user_swipes for all to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "prefs_own" on user_preferences for all to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);

create index on recipes(tipo);
create index on user_swipes(user_id, liked);
