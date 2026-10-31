import catalogue from '../../assets/products.json';

export interface Product {
  id: number;
  name: string;
  shortName: string;
  series: string;
  categoryKey: string;
  sizeNumber: string;
  sizeLength: string;
  weight: string;
  sinking: string;
  image: string;
  finish?: string;
  description: string;
  descriptionEn: string;
  featureKeys: string[];
}

/** The public product feed and the displayed catalogue share the same data. */
export const PRODUCTS: readonly Product[] = catalogue;
