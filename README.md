# Kaosoff

Site da marca **Kaosoff** — peças artesanais autorais (cerâmica, crochê, macramê, chapéus, balaclavas e amigurumi). Modelo de drops e pronta entrega, com peças únicas.

## Stack

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS 4**
- **TypeScript**
- **Lucide React** (ícones)

## Como rodar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Build de produção

```bash
npm run build
npm start
```

## Estrutura do projeto

```
src/
├── app/
│   ├── (site)/              # Páginas públicas (Header + Footer)
│   │   ├── page.tsx         # Home
│   │   ├── produtos/        # Catálogo e produto individual
│   │   ├── drops/           # Coleções e lançamentos
│   │   ├── encomendas/      # Formulário + consulta de pedido
│   │   ├── checkout/        # Fluxo de pagamento (mock)
│   │   ├── sobre/
│   │   ├── contato/
│   │   └── politicas/
│   ├── admin/
│   │   ├── login/           # Login do painel
│   │   └── (panel)/         # Área restrita (CRUD)
│   └── api/                 # Route handlers (mock + admin)
├── components/
│   ├── layout/              # Header, Footer
│   ├── product/             # ProductCard, Gallery, filtros
│   ├── drop/                # DropHero, CountdownTimer
│   ├── admin/               # AdminNav
│   └── ui/                  # Button, Input, Badge, Stepper...
└── lib/
    ├── types.ts             # Tipos TypeScript
    ├── mock-data.ts         # Dados mockados + SITE_CONFIG
    ├── api.ts               # Camada de dados (substituir por backend)
    └── utils.ts             # Helpers (preço, CPF, canPurchase...)
```

## Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Home — banner do drop, lançamentos, categorias, sobre |
| `/produtos` | Catálogo com filtro por categoria e ordenação |
| `/produtos/[slug]` | Página de produto com galeria e compra |
| `/drops` | Coleções ativas, futuras e histórico |
| `/drops/[slug]` | Drop individual com produtos |
| `/encomendas` | Solicitar encomenda ou consultar por CPF + pedido |
| `/checkout?produto=` | Checkout com Pix/cartão (simulado) |
| `/sobre` | História e processo criativo |
| `/contato` | WhatsApp, e-mail, Instagram, formulário |
| `/politicas` | Envio, trocas, pagamento |
| `/admin` | Painel administrativo |

## Painel admin

Acesso em `/admin/login`.

**Credenciais de desenvolvimento (mock):**
- E-mail: `admin@kaosoff.com.br`
- Senha: `kaosoff2026`

Funcionalidades:
- CRUD de produtos (criar, remover, marcar como vendido)
- CRUD de drops com data de lançamento
- Gestão de encomendas (atualizar status)
- Visualização de pagamentos de checkout

## Configuração da marca

Edite `src/lib/mock-data.ts` → `SITE_CONFIG`:

- E-mail, WhatsApp, Instagram
- Texto sobre a marca
- Substituir imagens Unsplash por fotos reais

## Integrações pendentes (produção)

| Área | Arquivo / rota | O que integrar |
|------|----------------|----------------|
| Banco de dados | `src/lib/api.ts` | Supabase, Firebase ou API REST |
| Pagamento | `src/app/api/checkout/` | Mercado Pago, Stripe ou Pagar.me |
| Webhook pagamento | `src/app/api/checkout/confirm/` | Confirmação automática + marcar produto vendido |
| Autenticação admin | `src/app/api/admin/login/` | NextAuth, Clerk ou JWT |
| E-mail contato | `src/app/(site)/contato/` | Resend, SendGrid |
| Upload de imagens | Admin produtos/drops | Cloudinary, S3 |
| Variável de ambiente | `.env.local` | `NEXT_PUBLIC_SITE_URL` para sitemap/SEO |

Comentários `TODO` no código indicam cada ponto de integração.

## Design

- Paleta: preto, branco e cinzas (`globals.css`)
- Tipografia: **Josefin Sans** (títulos) + **Arial** (corpo)
- Mobile first, micro-interações sutis
- Peças artesanais como protagonista visual

## Licença

Projeto privado — Kaosoff © 2026.
