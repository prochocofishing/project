# Relatório da revisão PROCHOCO

Data: 31 de outubro de 2026. Alterações realizadas no projeto local existente, sem publicação ou alteração dos serviços externos.

## Problemas prioritários encontrados

- A versão portuguesa apresentava chaves de tradução em falta no título principal e no header. O idioma do documento inicial não correspondia ao conteúdo português.
- O hero tinha um texto muito extenso e carregava um iframe de vídeo no primeiro acesso. O catálogo utilizava cartões longos, imagens recortadas e filtros de categoria sem utilidade prática, porque todos os produtos pertenciam à mesma categoria.
- A navegação por âncoras não regressava corretamente ao catálogo a partir das páginas legais. O menu mobile tinha estados visuais e de acessibilidade inconsistentes.
- O feed de produtos estava desatualizado face aos dez modelos da interface. O sitemap tratava âncoras como páginas e atribuía datas de modificação à geração, em vez de refletir alterações reais.
- Existia uma referência linguística a `/en/` sem uma versão independente e coerente das páginas. Os metadados não acompanhavam completamente a página e o idioma.
- A configuração de recursos não copiava todos os ficheiros de SEO e de catálogo para a build. O `baseHref` absoluto prejudicava a validação local e o pré-rendering.
- O fluxo de snapshots produzia ficheiros e cópias redundantes, dependia de um servidor lançado à parte e não criava uma saída de publicação completa nas rotas efetivas.
- O formulário podia apresentar uma confirmação de envio depois de apenas abrir uma aplicação de email. As mensagens desapareciam automaticamente e faltava feedback de validação associado aos campos.
- Desativar Analytics e aceitar novamente na mesma sessão podia manter o carregamento bloqueado. O mecanismo de remoção de cookies não abrangia corretamente o domínio pai.
- A documentação descrevia quantidades antigas de produtos, caminhos obsoletos, comandos que não correspondiam ao projeto e funcionalidades ainda não implementadas.

## Design, navegação e conversão

Foi mantida a identidade PROCHOCO e a estrutura Angular. A direção visual utiliza azul-marinho, fundos claros no catálogo e no contacto, acentos turquesa, tipografia de sistema e uma hierarquia de títulos e espaçamentos mais consistente.

O header tem navegação real entre páginas e secções, botões PT/EN, menu mobile com nome acessível, estado expandido e fecho por Escape. O hero passa a apresentar uma mensagem curta, produto real em destaque e acesso direto ao catálogo e aos revendedores. O vídeo permanece disponível por ação do visitante.

O catálogo mantém os dez modelos e respetivas especificações. Permite filtrar por série e tamanho, apresenta o número de resultados e oferece recuperação quando não há correspondências. As descrições completas continuam disponíveis em elementos `details`, as imagens são apresentadas sem recorte e os catorze revendedores foram preservados.

A secção da marca mantém os textos existentes, incluindo a história longa num bloco expansível. O contacto destaca os pedidos de revenda e o email, e encaminha os consumidores para os revendedores. O footer agrega navegação, contactos, redes sociais e preferências de privacidade.

Não foram acrescentados preços, avaliações, estatísticas comerciais ou promessas de resposta. O formulário só anuncia envio após uma resposta bem-sucedida do serviço configurado. Sem EmailJS configurado, prepara a mensagem na aplicação de email e conserva os dados introduzidos.

## SEO implementado

- Oito rotas canónicas PT/EN com títulos e descrições específicos, idioma correto, canonical, hreflang e `x-default`.
- Open Graph e Twitter Cards atualizados na navegação e incluídos no HTML pré-renderizado.
- JSON-LD centralizado de `Organization`, `WebSite` e `WebPage`, breadcrumbs nas páginas legais e dez produtos reais nas páginas do catálogo.
- Catálogo visível, feed público e dados estruturados alimentados pela mesma fonte JSON, com descrições PT/EN.
- Sitemap limitado a documentos canónicos, sem fragmentos nem datas artificiais; `robots.txt` e feed incluídos na saída de produção.
- Página 404 com `noindex`, sem canonical enganador; servidor local com status HTTP 404 e redirecionamentos para as rotas com barra final.
- Pré-rendering adaptado à arquitetura estática, com oito documentos localizados, `404.html` e recursos em `dist/static`.

A entrega de HTML pré-renderizado foi escolhida por se adequar ao alojamento estático e ao catálogo existente, tendo em conta as [estratégias de renderização do Angular](https://angular.dev/guide/routing/rendering-strategies) e as orientações do [Google para SEO com JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics). As versões linguísticas seguem URLs próprias com [hreflang recíproco](https://developers.google.com/search/docs/specialty/international/localized-versions).

Não foram introduzidos `SearchAction` para pesquisa inexistente, FAQs, ofertas ou avaliações fictícias. Dados estruturados válidos não garantem resultados enriquecidos ou posições específicas na pesquisa.

## Performance e acessibilidade

Foram removidos os pedidos de fontes externas da interface e o carregamento inicial do vídeo. Foram criadas versões WebP das imagens, preservando os PNG originais, e acrescentadas dimensões, descodificação assíncrona e carregamento diferido onde apropriado. O produto do hero tem prioridade de carregamento.

As páginas são carregadas por componentes diferidos. A build tem orçamentos de tamanho e hashes para os bundles. O servidor local disponibiliza gzip e cache dos bundles com hash; estas opções não alteram automaticamente a configuração do alojamento público.

A navegação inicial do Angular aguarda o carregamento da rota antes de substituir o HTML estático. A correção eliminou o salto de layout observado durante a medição intermédia. O Angular foi atualizado dentro da versão principal 20: runtime 20.3.34 e ferramentas CLI/build 20.3.42. A auditoria `npm audit --omit=dev` terminou com zero vulnerabilidades nas dependências de produção; o resultado não representa uma auditoria de segurança integral ou das dependências de desenvolvimento.

Foram implementados ligação para saltar para o conteúdo, hierarquia semântica, estados de foco, respeito por movimento reduzido, controlos de filtros com estado, formulário com autocomplete e erros associados, estado de envio anunciado e banner de consentimento utilizável por teclado. O consentimento pode ser revisto no footer, e Analytics permanece condicionado à escolha do visitante.

Estas alterações não constituem uma certificação integral WCAG. A validação automática de dimensões não substitui a revisão visual nem testes com tecnologias de apoio.

## Ficheiros alterados

As pastas `.qa` e `dist` contêm artefactos locais ignorados pelo Git.

### Interface e conteúdos

- `src/components/header.component.ts`
- `src/components/hero.component.ts`
- `src/components/products.component.ts`
- `src/components/about.component.ts`
- `src/components/contact.component.ts`
- `src/components/footer.component.ts`
- `src/components/consent-banner.component.ts`
- `src/components/not-found.component.ts` — novo
- `src/global_styles.css`
- `src/app/i18n/pt-PT.ts`
- `src/app/i18n/en.ts`

### Aplicação, dados e SEO

- `src/main.ts`
- `src/index.html`
- `src/app/services/translate.service.ts`
- `src/app/services/seo.service.ts` — novo
- `src/app/services/analytics.service.ts`
- `src/app/data/products.ts` — novo
- `src/assets/products.json`
- `src/assets/robots.txt`
- `robots.txt`
- `generate-sitemap.js`
- `sitemap.xml` e `src/assets/sitemap.xml` — gerados a partir das oito rotas canónicas

### Build, pré-rendering, validação e publicação preparada

- `angular.json`
- `tsconfig.json`
- `package.json`
- `package-lock.json`
- `.gitignore`
- `prerender.js`
- `scripts/deploy-prerender.js`
- `scripts/static-server.js` — novo
- `scripts/validate-static.js` — novo
- `scripts/verify-site.cjs` — novo
- `scripts/optimize-images.cjs` — novo
- `.github/workflows/deploy.yml`

### Imagens WebP acrescentadas

- `src/images/logo.webp`
- `src/images/logo2.webp`
- `src/images/logomascot.webp`
- `src/images/products/cavala2.5.webp`
- `src/images/products/zebra2.5.webp`
- `src/images/products/uvabrava2.5.webp`
- `src/images/products/matador2.5.webp`
- `src/images/products/lulachamas2.5.webp`
- `src/images/products/cobra2.5.webp`
- `src/images/products/circus2.5.webp`
- `src/images/products/circus3.0.webp`
- `src/images/products/pintas2.5.webp`
- `src/images/products/pintas3.0.webp`

### Documentação

- `README.md`
- `SEO_README.md`
- `docs/REDESIGN_REPORT.md` — novo

## Estado da validação

| Verificação | Estado desta revisão |
| --- | --- |
| Build inicial de referência | Medida: 333,69 kB iniciais brutos; 84,40 kB de transferência estimada pelo Angular |
| TypeScript final | Passou: `tsc --noEmit -p tsconfig.app.json` |
| Build de produção e pré-rendering final | Passou: `npm.cmd run build:static`; oito rotas e 404 em `dist/static` |
| Validação dos oito documentos, SEO, recursos e 404 | Passou: `npm.cmd run test:static` |
| Integração em navegador headless | 11 grupos aprovados, zero falhas; rotas, links, recursos, filtros, idioma, menu, formulário, consentimento e erros de execução |
| Responsividade automática a 320, 360, 768 e 1440 px | Passou nas oito rotas, sem overflow horizontal; imagem do hero dentro do espaço reservado |
| Conteúdo sem JavaScript | Oito páginas com HTML, metadados e descrições reais; detalhes nativos utilizáveis; formulário inativo oculto e email disponível |
| Dependências de produção | `npm audit --omit=dev`: zero vulnerabilidades reportadas |
| Lighthouse antes/depois | Concluído em mobile e desktop; resultados abaixo |
| Revisão visual e screenshots | Não realizada: o acesso CUA à aplicação ficou indisponível após timeout de autorização |
| Publicação | Não executada |

A build inicial de referência desativou apenas o inlining das fontes para contornar uma indisponibilidade de rede. Os tamanhos de transferência apresentados pelo Angular são estimativas do compilador, não medições de tráfego de visitantes.

## Métricas

| Métrica | Antes | Depois |
| --- | --- | --- |
| Bundle inicial total bruto, relatório Angular | 333,69 kB | 399,33 kB |
| Transferência inicial estimada, relatório Angular | 84,40 kB | 110,59 kB |
| Conversão dos 13 PNG originais em WebP | 6 831 852 B | 458 578 B, menos 93,3% |
| Lighthouse mobile: Performance / Accessibility / Best Practices / SEO | 72 / 89 / 96 / 100 | 98 / 100 / 100 / 100 |
| Lighthouse desktop: Performance / Accessibility / Best Practices / SEO | 66 / 94 / 96 / 100 | 100 / 100 / 100 / 100 |
| LCP mobile, laboratório | 16,5 s | 2,1 s |
| LCP desktop, laboratório | 2,8 s | 0,7 s |
| CLS mobile, laboratório | 0,043 | 0 |
| CLS desktop, laboratório | 0,392 | 0 |
| Total Blocking Time mobile, laboratório | 150 ms | 30 ms |
| Total Blocking Time desktop, laboratório | 0 ms | 0 ms |
| Transferência total da página, mobile | 8 276 KiB | 294 KiB |
| Transferência total da página, desktop | 8 280 KiB | 575 KiB |
| LCP / INP / CLS de utilização real | Não medidos | Não medidos |

O bundle inicial aumentou; não se afirma uma redução de JavaScript. O chunk diferido da página inicial tem mais 78,98 kB brutos / 18,05 kB de transferência estimada. O ganho global observado resulta sobretudo das imagens, do vídeo carregado por ação do visitante, da remoção de fontes externas e da estabilidade do arranque.

Foram usados Lighthouse 12.8.2, Edge headless e o mesmo servidor local com gzip, com uma execução de referência e uma final por perfil. Os resultados são de laboratório e podem variar entre execuções e no alojamento público. Não medem INP nem Core Web Vitals de visitantes reais. Na build de referência desativou-se apenas o inlining das fontes para permitir a compilação; a referência conserva o pedido externo de fonte original. A execução final não tem avisos Lighthouse. Não houve consentimento automático para Analytics nem conteúdo diferenciado para as medições.

Artefactos locais: [mobile antes](../.qa/lighthouse-before-mobile.report.html), [mobile depois](../.qa/lighthouse-after-mobile.report.html), [desktop antes](../.qa/lighthouse-before-desktop.report.html), [desktop depois](../.qa/lighthouse-after-desktop.report.html), [testes de integração](../.qa/integration-results.json), [reflow a 320 px](../.qa/responsive320-results.json), [imagens](../.qa/image-optimization.json), [auditoria de produção](../.qa/production-audit.json) e [build final](../.qa/final-build.log).

## Ações externas ainda necessárias

A revisão local não confirma a indexação no Google, os redirecionamentos de domínio, a política de cache e compressão do alojamento ou a entrega EmailJS. Após publicação autorizada, devem ser confirmados HTTPS e domínio canónico, status HTTP das páginas, recursos e sitemap públicos, dados estruturados publicados e configuração efetiva dos serviços.

A submissão do sitemap e a inspeção de URLs exigem acesso à propriedade Google Search Console. A medição de Core Web Vitals com utilização real depende de dados de campo disponíveis. O envio direto do formulário exige configurar e testar EmailJS; até lá, o envio é concluído pelo visitante na sua aplicação de email. A atualização da configuração GitHub Actions fica preparada no código, mas não representa uma publicação realizada nesta sessão.

## Atualização — slideshow de fotografias

As duas fotografias fornecidas pelo utilizador passam a ocupar a caixa do hero num slideshow. As imagens são apresentadas integralmente com `object-fit: contain`, sem recortes, e têm variantes WebP responsivas; as cópias JPEG preservam os originais e os ficheiros no Desktop permanecem intactos.

A rotação automática ocorre a cada 6 segundos. Existem controlos anterior/seguinte, seleção direta e reprodução/pausa, com navegação por teclado, pausa durante interação e reprodução inicialmente desativada quando está ativa a preferência por movimento reduzido.

A build estática, a verificação TypeScript e `test:static` passaram após esta alteração. Os 12 grupos de integração passaram, incluindo reprodução automática, controlos, teclado, pausa por interação e visibilidade, movimento reduzido e enquadramento das duas fotografias. Resultados em [integração](../.qa/integration-results.json) e [galeria](../.qa/gallery-results.json).

Foram atualizados `src/components/hero.component.ts`, `src/index.html` e `scripts/verify-site.cjs`, e acrescentadas as imagens em `src/images/hero/`. As métricas das tabelas anteriores foram medidas antes da introdução destas fotografias e não foram novamente medidas para este slideshow.

## Atualização — retoque das fotografias

As duas fotografias foram retocadas com a ferramenta imagegen integrada. Na coleção PREDADOR foram reduzidas as sombras duras e uniformizados o fundo e a iluminação; na fotografia de pesca foi ajustada a luz para dar maior legibilidade aos palhaços. Foram revistas visualmente as duas saídas, com atenção aos seis modelos e ao enquadramento.

Os originais foram preservados. Os PNG retocados e os prompts completos estão em `source-assets/hero/`; o slideshow usa as variantes `*-retouched*.webp` de `src/images/hero/`. O comando `node scripts/prepare-retouched-hero.cjs` recria os tamanhos WebP a partir desses PNG, sem voltar a gerar as imagens. As medições Lighthouse anteriores não foram repetidas para este retoque.

## Correção — fotografias originais

O utilizador rejeitou as versões reconstruídas por IA por alterarem os detalhes reais dos produtos e escolheu recortes reais da fotografia enviada. O catálogo utiliza agora seis recortes do JPEG original em `src/images/products/predador-original/`, preparados por `scripts/prepare-original-predador-products.cjs`. A seleção recorta apenas a zona de cada produto e exclui os produtos vizinhos; mantém os pixels reais, incluindo padrões, marcações, penas, agulhas, iluminação e sombras. As faixas e informações das fotografias antigas são legendas HTML separadas. O slideshow também voltou às fotografias originais em WebP, sem retoque generativo. As versões geradas ficam apenas como material anterior sem referências na interface atual.
