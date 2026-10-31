# SEO técnico — PROCHOCO

Esta revisão mantém a aplicação Angular e acrescenta uma saída estática pré-renderizada. Não foi introduzido um servidor SSR. O HTML inicial contém o conteúdo das páginas; a aplicação Angular continua a arrancar no navegador para disponibilizar as interações.

## URLs e indexação

| Conteúdo | Português de Portugal | Inglês |
| --- | --- | --- |
| Catálogo e apresentação | `/` | `/en/` |
| Privacidade | `/privacy/` | `/en/privacy/` |
| Termos | `/terms/` | `/en/terms/` |
| Cookies | `/cookies/` | `/en/cookies/` |

Cada página tem um título, uma descrição e um canonical próprios. Os alternates `pt-PT`, `en` e `x-default` apontam para as versões correspondentes da mesma página. O atributo `lang` acompanha o idioma do URL. Mudar de idioma preserva a página e, quando aplicável, a âncora e os parâmetros do URL.

O domínio canónico configurado é `https://www.prochoco.com`. As oito páginas canónicas constam de `/sitemap.xml`, gerado por `generate-sitemap.js`. As âncoras dos produtos não são documentos independentes e foram removidas do sitemap. Não é atribuído um `lastmod` artificial a cada build.

`robots.txt` permite a pesquisa das páginas públicas e referencia o sitemap na raiz. Os ficheiros de SEO e o feed são copiados para a saída de produção. `404.html` e a rota desconhecida apresentam uma página de erro com `noindex`, sem canonical que a faça passar pelo catálogo.

O servidor local devolve HTTP 404 para recursos e páginas inexistentes e redireciona diretórios para o URL com barra final. O comportamento real do alojamento, incluindo redirecionamentos de HTTP, variantes do domínio e URLs antigas, deve ser confirmado após publicação.

## Metadados e dados estruturados

`SeoService` atualiza os metadados quando o utilizador navega ou muda de idioma. Os documentos pré-renderizados incluem estes valores sem depender da execução de JavaScript pelo motor de pesquisa:

- Título, descrição e instruções de indexação.
- Canonical e alternates linguísticos.
- Open Graph e Twitter Cards, com URL e imagem de partilha.
- JSON-LD com `Organization`, `WebSite` e `WebPage`.
- `BreadcrumbList` nas páginas legais.
- Dez objetos `Product` nas páginas do catálogo, com descrições no idioma correto e características reais da fonte de produtos.

Não foram acrescentados preços, disponibilidade, avaliações, classificações, ofertas, moradas adicionais, artigos ou FAQs. Foi removida a ação de pesquisa que apontava para uma funcionalidade inexistente. A presença de JSON-LD não garante a apresentação de resultados enriquecidos.

O feed público `/assets/products.json` corresponde à fonte utilizada pela interface e pelos dados estruturados. Não constitui uma página adicional do sitemap nem substitui o conteúdo visível do catálogo.

## Gerar e verificar localmente

Em Windows PowerShell:

```powershell
npm.cmd run build:static
npm.cmd run test:static
npm.cmd run verify:site
npm.cmd run preview
```

Nos restantes terminais, substituir `npm.cmd` por `npm`. Os scripts de validação necessitam da saída atualizada em `dist/static`. O pré-renderizador gere o seu próprio servidor e não aceita o consentimento de Analytics em nome dos visitantes. Os pedidos a terceiros são bloqueados durante a geração.

As verificações estáticas abrangem as oito páginas, uma única H1, títulos e descrições distintos, idioma, canonical, hreflang, JSON-LD válido, correspondência dos produtos, ligações locais, recursos, sitemap, robots e 404. As verificações de integração abrangem também navegação, filtros, formulários inválidos, consentimento e ausência de overflow nas larguras configuradas. Consultar o relatório da revisão para distinguir o que foi executado dos comandos disponibilizados.

Para uma auditoria Lighthouse, utilizar a saída de produção servida por HTTP local e registar a mesma versão do navegador, viewport e perfil de simulação antes e depois. Não apresentar como medições reais as estimativas de transferência do compilador nem os orçamentos de bundle.

## Ações que dependem do exterior

Após uma publicação autorizada:

1. Confirmar HTTPS, redirecionamentos para `https://www.prochoco.com`, barras finais, respostas HTTP das páginas legais e verdadeiro status 404.
2. Confirmar `/sitemap.xml`, `/robots.txt`, `/assets/products.json` e todos os recursos no domínio público.
3. Verificar a propriedade no Google Search Console e submeter `https://www.prochoco.com/sitemap.xml`.
4. Inspecionar páginas PT/EN no Search Console para confirmar acesso ao HTML renderizado, canonical escolhido e cobertura de indexação.
5. Validar os dados estruturados publicados no [Rich Results Test](https://search.google.com/test/rich-results) e, quando necessário, no [Schema Markup Validator](https://validator.schema.org/).
6. Rever cache, compressão e cabeçalhos de segurança no alojamento. O servidor local demonstra estas opções, mas não altera as políticas de GitHub Pages.
7. Configurar e testar o envio EmailJS e verificar Analytics apenas com consentimento, caso esses serviços sejam utilizados.
8. Acompanhar Core Web Vitals com dados de utilização real, quando disponíveis, e investigar problemas no Search Console.

Nenhuma submissão ao Search Console, validação do domínio público ou configuração de servidor foi efetuada nesta implementação local. Resultados Lighthouse, conformidade integral WCAG e posições na pesquisa não são garantidos pelo código nem pela presença destas verificações.
