export type ServiceType = 'coiffure' | 'ongles'

export type Service = {
  id: string
  type: ServiceType
  /** Libellé complet, utilisé dans la réservation et l'admin */
  name: string
  /** Libellé court pour les cartes de prestation */
  shortName?: string
  subtitle?: string
  price: number
  /** Durée de blocage de l'agenda. Interne : ne jamais l'afficher côté client. */
  durationH: number
  deposit: number
  group?: 'installation' | 'resserrage'
  popular?: boolean
}

export const services: Service[] = [
  {
    id: 'manucure-simple',
    type: 'ongles',
    name: 'Manucure simple (VSP / French)',
    shortName: 'Manucure simple',
    subtitle: 'VSP / French — Taille S, M ou L',
    price: 30,
    durationH: 3,
    deposit: 10,
  },
  {
    id: 'manucure-nailart',
    type: 'ongles',
    name: 'Manucure Nail Art',
    subtitle: 'Pose avec décorations personnalisées',
    price: 50,
    durationH: 4,
    deposit: 10,
    popular: true,
  },
  {
    id: 'depose',
    type: 'ongles',
    name: 'Dépose',
    price: 10,
    durationH: 1,
    deposit: 10,
  },
  {
    id: 'depose-exterieure',
    type: 'ongles',
    name: 'Dépose extérieure',
    subtitle: '(pas de résine)',
    price: 15,
    durationH: 1,
    deposit: 10,
  },

  {
    id: 'micro-courts',
    type: 'coiffure',
    name: 'Installation microlocks — Cheveux courts',
    shortName: 'Cheveux courts',
    price: 300,
    durationH: 4,
    deposit: 80,
    group: 'installation',
  },
  {
    id: 'micro-mi-longs',
    type: 'coiffure',
    name: 'Installation microlocks — Cheveux mi-longs',
    shortName: 'Cheveux mi-longs',
    price: 400,
    durationH: 5,
    deposit: 80,
    group: 'installation',
  },
  {
    id: 'micro-longs',
    type: 'coiffure',
    name: 'Installation microlocks — Cheveux longs',
    shortName: 'Cheveux longs',
    price: 500,
    durationH: 6,
    deposit: 80,
    group: 'installation',
  },
  {
    id: 'micro-tres-longs',
    type: 'coiffure',
    name: 'Installation microlocks — Cheveux très longs',
    shortName: 'Cheveux très longs',
    price: 800,
    durationH: 7,
    deposit: 80,
    group: 'installation',
  },
  {
    id: 'resserrage-200-300',
    type: 'coiffure',
    name: 'Resserrage microlocks — 200 à 300 locks',
    shortName: 'De 200 à 300 locks',
    price: 80,
    durationH: 3,
    deposit: 20,
    group: 'resserrage',
  },
  {
    id: 'resserrage-300-500',
    type: 'coiffure',
    name: 'Resserrage microlocks — 300 à 500 locks',
    shortName: 'De 300 à 500 locks',
    price: 100,
    durationH: 4,
    deposit: 20,
    group: 'resserrage',
  },
  {
    id: 'resserrage-500-600',
    type: 'coiffure',
    name: 'Resserrage microlocks — 500 à 600 locks',
    shortName: 'De 500 à 600 locks',
    price: 200,
    durationH: 5,
    deposit: 20,
    group: 'resserrage',
  },
]

export const servicesByType = (type: ServiceType) => services.filter((s) => s.type === type)

export const serviceById = (id: string) => services.find((s) => s.id === id)
