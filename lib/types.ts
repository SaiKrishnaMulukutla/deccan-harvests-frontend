export interface ProductImage {
  url: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  variety: string | null;
  shuMin: number | null;
  shuMax: number | null;
  astaValue: string | null;
  moisture: string | null;
  description: string | null;
  images: ProductImage[];
}

export interface Certification {
  id: string;
  name: string;
  issuingBody: string;
  certNumber: string | null;
  issuedAt: string;
  expiresAt: string | null;
  fileUrl: string;
  active: boolean;
}
