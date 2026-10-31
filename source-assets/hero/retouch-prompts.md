# Retoque das fotografias do slideshow

Ferramenta: imagegen integrada, em modo de edição com as fotografias originais como referência.

Os JPEG originais em `src/images/hero` são preservados. As versões retocadas estão guardadas nesta pasta como PNG; o slideshow utiliza variantes WebP em `src/images/hero` com o sufixo `-retouched`.

Para recriar apenas os tamanhos WebP: `node scripts/prepare-retouched-hero.cjs`.

## Fotografia 1 — coleção PREDADOR

Use case: lighting-weather.
Asset type: real product photograph for the PROCHOCO website hero slideshow.
Input image 1 is the EDIT TARGET, not an inspiration image.
Retouch this exact photograph of six fishing jigs on a white surface for a professional product presentation. Remove the very large hard dark cast shadows behind the jigs and uneven yellow/grey lighting on the background. Replace the lighting with broad diffuse soft studio lighting, neutral clean off-white background and only very faint realistic contact shadows immediately under the products. Correct exposure and white balance gently, bring out the real fabric weave, metallic hooks and eyes, without oversaturation or fake shine.
CRITICAL INVARIANTS: preserve all six actual products exactly, their precise colours and colour boundaries, every existing printed pattern and marking, their silhouettes, sizes, metal weights, eyes, feathers, hook crowns, their angles and positions in the composition. Do not redraw, redesign, replace or simplify the lures. Preserve the striped dark grey jig at top right, blue/gold jig at left upper middle, turquoise/lilac jig at right middle, pink/blue jig at left middle, green/gold jig at right lower middle, and lilac/pink jig at left bottom. Preserve all visible hooks in full, without cropping. No additional lures, no text, no invented logos, no border or watermark. Retouch illumination and background only; treat the product pixels as protected. Retain the original landscape composition and approximately 1600:1164 aspect ratio.

## Fotografia 2 — pesca ao choco

Use case: lighting-weather.
Asset type: real fishing/product photograph for the PROCHOCO website hero slideshow.
Input image 1 is the EDIT TARGET, not an inspiration image.
Professionally retouch this exact vertical photograph of real cuttlefish with six PROCHOCO fishing jigs arranged down the left side. Improve exposure and neutral white balance, gently reduce harsh specular hotspots and muddy shadows, and make the actual fishing jigs easier to see with restrained local clarity/contrast. Keep the authentic fishing context, natural wet textures and realistic look. The result should be cleaner, better balanced and more readable for a premium fishing equipment website, without looking synthetic or overprocessed.
CRITICAL INVARIANTS: preserve the exact count, shape, real colours, patterns and printed markings of every jig, all eyes, feathers, metal weights and hook crowns. Preserve their exact positions and orientation; do not rebuild or redesign the products. Keep the catch itself, all visible cuttlefish and their arrangement, realistic and unchanged. Do not add or remove any animals or products; do not fabricate catch results. Do not add graphic overlays, labels, text, branding, watermarks, artificial glow, heavy blur or new scenery. Preserve the original portrait framing and full visible composition, approximately 1028:2048 aspect ratio. Only photographic lighting and restrained tonal/clarity corrections.

