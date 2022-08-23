export interface Link {
  type: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  href: string;
}
