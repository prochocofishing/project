# Recortes reais — PREDADOR

Origem: `src/images/hero/collection-predador.jpg`, cópia exata do JPEG fornecido pelo utilizador (`WhatsApp Image 2026-10-31 at 00.43.07 (1).jpeg`).

Estas seis imagens resultam exclusivamente de recorte e seleção de regiões da fotografia original. Não existe geração, reconstrução, retoque generativo, alteração de cores, nitidez artificial ou remoção das sombras reais. As seleções nas extremidades excluem partes dos produtos vizinhos sem redesenhar os produtos.

Os PNG conservam os pixels originais à resolução de origem, com transparência fora da seleção. `crop-regions.json` regista as coordenadas. A versão de apresentação em `src/images/products/predador-original/` redimensiona o recorte para um enquadramento de 1200 × 800 e comprime em WebP. Para evitar cantos vazios, o fundo exterior da seleção usa uma zona de papel sem produtos retirada do mesmo JPEG (x1320, y1040, 200 × 100); os produtos não são preenchidos nem reconstruídos. As legendas e faixas são HTML independente da fotografia.

Para recriar: `node scripts/prepare-original-predador-products.cjs`.
