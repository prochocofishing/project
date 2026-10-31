# PROCHOCO — website e catálogo

Website da PROCHOCO em Angular 20, com componentes standalone e deteção de alterações sem Zone.js. Mantém o catálogo de 10 modelos, os 14 revendedores, os contactos e as páginas legais. Português de Portugal e inglês têm URLs próprias.

O trabalho desta revisão é local. Não foi efetuada uma publicação.

## Preparação

Utilizar Node.js 22.12 ou superior da linha 22 e npm; a integração contínua utiliza Node.js 22. Numa instalação nova, executar:

```powershell
npm.cmd ci
npm.cmd start
```

Em PowerShell, `npm.cmd` evita problemas com a política de execução de `npm.ps1`. Nos restantes terminais, utilizar `npm` nos mesmos comandos.

O servidor de desenvolvimento apresenta o URL local quando estiver disponível. As dependências são descritas em `package.json` e fixadas em `package-lock.json`.

## Comandos principais

```powershell
npm.cmd run build:prod
npm.cmd run build:static
npm.cmd run test:static
npm.cmd run verify:site
npm.cmd run preview
```

- `build:prod`: gera o sitemap e o bundle Angular de produção em `dist/prochoco`.
- `build:static`: produz o bundle e pré-renderiza as páginas em `dist/static`, incluindo os recursos necessários para publicação.
- `validate-static.js`: valida os documentos estáticos, metadados, JSON-LD, ligações locais, sitemap, robots e imagens do catálogo.
- `verify-site.cjs`: executa verificações de integração em navegador headless contra a saída estática, sem enviar pedidos a serviços externos. Guarda o resumo em `.qa/integration-results.json`.
- `static-server.js dist/static`: apresenta a saída de produção em `http://127.0.0.1:8080/`, com respostas 404, redirecionamentos para diretórios, gzip e cache local dos bundles com hash.

Os scripts `test:static`, `verify:site` e `preview` executam os três ficheiros Node acima. `preview:app` serve o bundle Angular de `dist/prochoco` com fallback para as rotas da aplicação; a verificação final deve utilizar `dist/static`.

O pré-renderizador inicia e encerra o seu próprio servidor. Não é necessário executar `npm start` em paralelo. No Windows pode utilizar o Microsoft Edge instalado; também aceita `CHROME_PATH` com o caminho de um navegador Chromium compatível. Se não existir um navegador disponível, instalar o Chromium de Playwright:

```powershell
npm.cmd run prerender:install-browsers
```

Os cabeçalhos do servidor local não configuram automaticamente os cabeçalhos do alojamento público.

## Conteúdos e arquitetura

| Localização | Finalidade |
| --- | --- |
| `src/main.ts` | Arranque Angular, rotas e carregamento diferido das páginas |
| `src/components/` | Header, hero, catálogo, marca, contacto, footer, consentimento e páginas legais |
| `src/assets/products.json` | Fonte única dos 10 modelos e respetivas descrições PT/EN |
| `src/app/data/products.ts` | Tipos e acesso ao mesmo catálogo pela aplicação e pelo SEO |
| `src/app/i18n/` | Textos da interface PT/EN |
| `src/app/services/translate.service.ts` | Idioma determinado pelo URL e navegação entre versões |
| `src/app/services/seo.service.ts` | Metadados por página, canonical, hreflang e JSON-LD |
| `src/images/` | Imagens e logótipos, incluindo versões WebP utilizadas na interface |
| `generate-sitemap.js` | Geração das oito entradas canónicas |
| `prerender.js` | Geração dos documentos estáticos localizados e da página 404 |

As páginas públicas são `/`, `/en/`, `/privacy/`, `/terms/`, `/cookies/` e os três equivalentes legais em `/en/`. Os produtos continuam no catálogo, com âncoras como `/#product-5`; não existem páginas individuais de produto. A pasta antiga `prerendered/` não é a saída atual de publicação.

Ao editar produtos, manter identificadores únicos, dados reais, descrições PT/EN e caminhos de imagens existentes. O mesmo ficheiro alimenta a interface, o feed público `/assets/products.json` e os dados estruturados. Atualizar as duas traduções da interface quando forem introduzidos novos textos.

Depois de alterar os PNG originais, executar `npm.cmd run optimize:images` para recriar as versões WebP com `sharp`. O script preserva os originais e regista os tamanhos em `.qa/image-optimization.json`. Voltar a executar a build estática antes de validar ou publicar.

## Contactos e EmailJS

O formulário mantém nome, loja, email e mensagem opcional, com validação, honeypot e proteção contra envios duplicados. Sem configuração EmailJS válida, a ação **Preparar email** abre a aplicação de email do visitante. O visitante conclui aí o envio; a interface conserva os dados e não afirma que a mensagem foi enviada.

Para ativar o envio direto, configurar `emailjs.serviceId`, `emailjs.templateId` e `emailjs.userId` em `src/environments/environment.ts` e `src/environments/environment.prod.ts`, de acordo com a conta e o template EmailJS existentes. O template recebe `name`, `storeName`, `email` e `message`. A build de produção utiliza `environment.prod.ts`.

Não colocar chaves privadas, palavras-passe ou credenciais de servidor no frontend. Validar a configuração, os domínios permitidos e a entrega efetiva numa operação separada antes de anunciar o envio direto como disponível.

## Consentimento e vídeo

O Google Analytics só pode carregar após consentimento, em produção. A decisão é guardada em `localStorage` na chave `prochoco_analytics_consent`. O footer permite desativar Analytics e reabrir as preferências. A secção de vídeos, logo a seguir ao hero, apresenta os dois vídeos com miniaturas locais sempre visíveis. O leitor YouTube só é carregado depois de clicar em reproduzir; apenas um vídeo toca de cada vez e fechar repõe a miniatura.

## Publicação existente

A integração GitHub Actions em `.github/workflows/deploy.yml` está preparada para compilar, pré-renderizar, validar e publicar `dist/static` no ramo de GitHub Pages quando houver um push para `main`. Preserva o domínio `www.prochoco.com`. Um push para esse ramo pode, por isso, desencadear publicação automática.

O comando `npm.cmd run deploy:prerender` mantém compatibilidade com o fluxo de publicação local e também desencadeia uma publicação; não faz parte da validação local.

Consultar [SEO_README.md](SEO_README.md) para a configuração de indexação e ações externas, e [docs/REDESIGN_REPORT.md](docs/REDESIGN_REPORT.md) para a auditoria, alterações e estado das verificações desta revisão.
