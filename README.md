# Proxy Claude API — Avaliador UX/IHC

Este repositório contém o proxy serverless que protege a API Key da Anthropic,
permitindo que o site público use a IA sem expor credenciais.

---

## Estrutura

```
vercel-proxy/
├── api/
│   └── claude.js     ← função serverless (proxy)
└── vercel.json       ← configuração da Vercel
```

---

## Passo a passo para publicar

### 1. Criar conta na Vercel
- Acesse [vercel.com](https://vercel.com)
- Clique em **Sign Up** → entre com sua conta do **GitHub**

### 2. Fazer upload dos arquivos na Vercel

**Opção A — pelo site (sem terminal):**
1. Acesse [vercel.com/new](https://vercel.com/new)
2. Clique em **"Browse"** ou arraste a pasta `vercel-proxy/`
3. Clique em **Deploy**
4. Aguarde o deploy terminar (~30 segundos)
5. Copie a URL gerada (ex: `https://meu-proxy.vercel.app`)

**Opção B — importar do GitHub:**
1. Suba a pasta `vercel-proxy/` para um repositório GitHub
2. Na Vercel, clique em **"Import Git Repository"**
3. Selecione o repositório e clique **Deploy**

### 3. Configurar a API Key (variável de ambiente)

1. No painel da Vercel, acesse seu projeto
2. Vá em **Settings → Environment Variables**
3. Clique em **Add New**
4. Preencha:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** sua chave da Anthropic (começa com `sk-ant-...`)
5. Clique em **Save**
6. Vá em **Deployments** e clique em **Redeploy** para aplicar

### 4. Obter sua API Key da Anthropic

1. Acesse [console.anthropic.com](https://console.anthropic.com)
2. Faça login ou crie uma conta
3. Vá em **API Keys → Create Key**
4. Copie a chave gerada (guarde em local seguro!)

### 5. Atualizar a URL do proxy no HTML

No arquivo `index.html` do seu GitHub Pages, localize a linha:

```js
const PROXY_URL = 'COLE_AQUI_A_URL_DA_VERCEL';
```

Substitua pela URL do seu proxy, por exemplo:

```js
const PROXY_URL = 'https://meu-proxy.vercel.app/api/claude';
```

Faça o commit e aguarde o GitHub Pages atualizar.

---

## Como funciona

```
Usuário (navegador)
    ↓ POST /api/claude
Vercel (proxy)           ← API Key fica aqui, segura no servidor
    ↓ POST + x-api-key
Anthropic API
    ↓ streaming response
Vercel → Usuário
```

A API Key nunca chega ao navegador do usuário. ✅

---

## Custo estimado

- **Vercel:** gratuito para projetos pessoais/acadêmicos (100GB bandwidth/mês)
- **Anthropic:** ~$0.003 por análise gerada (Claude Sonnet)
  - 1000 análises ≈ $3 USD

---

## Suporte

Em caso de dúvidas, verifique os logs em:
**Vercel → seu projeto → Deployments → Functions → Logs**
