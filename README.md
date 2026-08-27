# MAHA INGLÊS 2.0

App de vocabulário de inglês com revisão progressiva (bloco de notas + revelação por nível de pesquisa) e painel de administrador, com sincronização real em nuvem.

## Por que precisa do GitHub (não é drag-and-drop)

Esse app usa duas coisas que só funcionam com o site publicado de verdade, via deploy conectado ao GitHub:
- **Netlify Functions**: fazem a tradução e buscam frases no dicionário pelo servidor (evita bloqueio de CORS do navegador).
- **Netlify Blobs**: banco de dados na nuvem, para sincronizar entre todos os aparelhos.

Um zip solto arrastado no Netlify não roda as Functions nem tem acesso ao Blobs.

## Passo a passo para subir

1. Crie um repositório novo no GitHub (pode ser privado) e suba todos os arquivos desta pasta nele.
2. No Netlify: **Add new site → Import an existing project → conecte o GitHub** e escolha esse repositório.
3. Configurações de build:
   - Build command: (deixe em branco)
   - Publish directory: `.`
   - Functions directory: `netlify/functions` (o `netlify.toml` já configura isso sozinho)
4. Clique em Deploy. O Netlify instala a dependência `@netlify/blobs` sozinho.
5. Pronto — acesse a URL gerada. Login inicial: **André / 160402** (dá pra trocar a senha dentro do app, em Perfil).

## Estrutura

- `index.html` — o app inteiro (frontend)
- `netlify/functions/data.js` — leitura/gravação na nuvem (Netlify Blobs)
- `netlify/functions/translate.js` — tradução (proxy para evitar CORS)
- `netlify/functions/dictionary.js` — frases de exemplo do dicionário
- `manifest.json`, `icon-192.png`, `icon-512.png` — ícone e configuração de PWA (dá pra "instalar" no celular)
