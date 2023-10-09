import { Product } from 'models/product.types';
import { v4 as uuid } from 'uuid';

export const mockProducts: Product[] = [
  {
    id: uuid(),
    title: "Assassin's Creed Mirage",
    description: 'A new year a new AC',
    price: 70,
    count: 111,
  },
  {
    id: uuid(),
    title: 'Factorio',
    description: "Let's build a Factory",
    price: 32,
    count: 26,
  },
  {
    id: uuid(),
    title: 'Call of Duty: Modern Warfare 3',
    description: 'A new year a new COD',
    price: 70,
    count: 1234,
  },
  {
    id: uuid(),
    title: "Baldur's Gate 3",
    description: 'GOTY',
    price: 72,
    count: 152,
  },
  {
    id: uuid(),
    title: 'Days Gone',
    description: 'Motorcycle && Zombies === 🔥',
    price: 30,
    count: 86,
  },
  {
    id: uuid(),
    title: 'Lies of P',
    description: 'Soulslike Pinocchio',
    price: 60,
    count: 948,
  },
];
