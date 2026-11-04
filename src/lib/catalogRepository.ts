import { catalogProducts } from './catalog'
import type { Product } from './catalogTypes'

/** Storage-neutral read contract. The local adapter makes no network calls. */
export interface CatalogRepository {
  list(collectionId?: string): Promise<Product[]>
  get(id: string): Promise<Product | null>
}

export const localCatalogRepository: CatalogRepository = {
  async list(collectionId) {
    return structuredClone(
      collectionId
        ? catalogProducts.filter((product) => product.collectionId === collectionId)
        : catalogProducts,
    )
  },
  async get(id) {
    return structuredClone(catalogProducts.find((product) => product.id === id) ?? null)
  },
}
