import type { Design, Product } from './catalog'
// Integration boundaries: production implementations belong on a trusted backend.
export interface AIProvider {
  generate(
    prompt: string,
    signal?: AbortSignal,
  ): Promise<{
    artworkUrl: string
  }>
}
export interface CatalogProvider {
  list(signal?: AbortSignal): Promise<Product[]>
}
export interface DesignRepository {
  list(): Promise<Design[]>
  save(design: Design): Promise<void>
}
export interface PaymentProvider {
  createCheckout(cartId: string): Promise<{
    redirectUrl: string
  }>
}
export class IntegrationUnavailableError extends Error {
  constructor(service: string) {
    super(`${service} is not connected in Phase 1.`)
    this.name = 'IntegrationUnavailableError'
  }
}
export const integrations = { ai: false, auth: false, payments: false, newsletter: false } as const
