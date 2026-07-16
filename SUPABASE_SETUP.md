# Configuração do Supabase para Kaosoff

## 1. Criar as tabelas

Execute no SQL Editor do Supabase:

```sql
create table if not exists products (
  id text primary key,
  slug text unique not null,
  name text not null,
  description text not null,
  materials text,
  dimensions text,
  price numeric not null,
  original_price numeric,
  category text not null,
  images jsonb default '[]'::jsonb,
  status text not null default 'available',
  is_unique boolean default true,
  is_custom_order boolean default false,
  drop_id text,
  available_at text,
  created_at text not null
);

create table if not exists drops (
  id text primary key,
  slug text unique not null,
  name text not null,
  description text not null,
  launch_date text not null,
  cover_image text not null,
  product_ids jsonb default '[]'::jsonb,
  is_active boolean default true
);

create table if not exists custom_orders (
  id text primary key,
  order_number text unique not null,
  customer_cpf text not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  description text not null,
  category text not null,
  status text not null,
  created_at text not null,
  updated_at text not null
);

create table if not exists checkout_orders (
  id text primary key,
  order_number text unique not null,
  customer_cpf text not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  product_id text not null,
  amount numeric not null,
  payment_method text not null,
  status text not null,
  created_at text not null
);
```

## 2. Criar usuário admin no Auth

No painel do Supabase Auth, crie um usuário com e-mail/senha que você queira usar para acessar o painel.

O login do painel da Kaosoff usa exatamente esse usuário do Supabase Auth. Não é necessário criar nenhuma credencial manual no SQL; basta criar o usuário no Auth e usar o mesmo e-mail/senha para entrar no painel.

## 3. Variáveis de ambiente

O projeto já lê estas chaves do arquivo .env:

```env
supabase_url=https://<project>.supabase.co
supabase_key=<anon-or-service-role-key>
```

## 4. Observação

A implementação atual usa a chave anon para autenticação do painel. Em produção, use uma chave de serviço apenas em rotas server-side e mantenha o fluxo com políticas de RLS adequadas.
