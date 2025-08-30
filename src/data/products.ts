import { Product } from '../contexts/AppContext';

// Import product images
import iphoneImage from '../assets/iphone-15-pro-max.jpg';
import samsungImage from '../assets/samsung-s24-ultra.jpg';
import macbookImage from '../assets/macbook-pro-14.jpg';
import dellImage from '../assets/dell-xps-13.jpg';
import sonyImage from '../assets/sony-wh1000xm5.jpg';
import ipadImage from '../assets/ipad-pro-129.jpg';
import samsungTvImage from '../assets/samsung-neo-qled-tv.jpg';
import nintendoImage from '../assets/nintendo-switch-oled.jpg';

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    price: 134900,
    image: iphoneImage,
    specs: {
      ram: '8GB',
      storage: '256GB',
      display: '6.7" Super Retina XDR',
      processor: 'A17 Pro'
    },
    priceComparison: {
      amazon: 139900,
      flipkart: 136900,
      myntra: 142000,
      meesho: 135000
    },
    category: 'smartphones'
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    price: 121999,
    image: samsungImage,
    specs: {
      ram: '12GB',
      storage: '256GB',
      display: '6.8" Dynamic AMOLED 2X',
      processor: 'Snapdragon 8 Gen 3'
    },
    priceComparison: {
      amazon: 125999,
      flipkart: 123999,
      myntra: 127000,
      meesho: 124500
    },
    category: 'smartphones'
  },
  {
    id: '3',
    name: 'MacBook Pro 14"',
    brand: 'Apple',
    price: 194900,
    image: macbookImage,
    specs: {
      ram: '16GB',
      storage: '512GB SSD',
      display: '14.2" Liquid Retina XDR',
      processor: 'M3 Pro'
    },
    priceComparison: {
      amazon: 199900,
      flipkart: 196900,
      myntra: 201000,
      meesho: 197500
    },
    category: 'laptops'
  },
  {
    id: '4',
    name: 'Dell XPS 13',
    brand: 'Dell',
    price: 89999,
    image: dellImage,
    specs: {
      ram: '16GB',
      storage: '512GB SSD',
      display: '13.4" FHD+ InfinityEdge',
      processor: 'Intel Core i7-1355U'
    },
    priceComparison: {
      amazon: 92999,
      flipkart: 91499,
      myntra: 94000,
      meesho: 90500
    },
    category: 'laptops'
  },
  {
    id: '5',
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    price: 29990,
    image: sonyImage,
    specs: {
      display: 'Wireless Noise Canceling',
      processor: 'V1 Processor'
    },
    priceComparison: {
      amazon: 31990,
      flipkart: 30990,
      myntra: 32500,
      meesho: 30500
    },
    category: 'audio'
  },
  {
    id: '6',
    name: 'iPad Pro 12.9"',
    brand: 'Apple',
    price: 112900,
    image: ipadImage,
    specs: {
      ram: '8GB',
      storage: '256GB',
      display: '12.9" Liquid Retina XDR',
      processor: 'M2'
    },
    priceComparison: {
      amazon: 115900,
      flipkart: 114500,
      myntra: 117000,
      meesho: 113500
    },
    category: 'tablets'
  },
  {
    id: '7',
    name: 'Samsung 55" Neo QLED 4K TV',
    brand: 'Samsung',
    price: 89999,
    image: samsungTvImage,
    specs: {
      display: '55" Neo QLED 4K',
      processor: 'Neo Quantum Processor 4K'
    },
    priceComparison: {
      amazon: 92999,
      flipkart: 91499,
      myntra: 94500,
      meesho: 90999
    },
    category: 'tv'
  },
  {
    id: '8',
    name: 'Nintendo Switch OLED',
    brand: 'Nintendo',
    price: 34999,
    image: nintendoImage,
    specs: {
      ram: '4GB',
      storage: '64GB',
      display: '7" OLED Screen',
      processor: 'Custom NVIDIA Tegra'
    },
    priceComparison: {
      amazon: 36999,
      flipkart: 35999,
      myntra: 37500,
      meesho: 35500
    },
    category: 'gaming'
  }
];

export const categories = [
  { id: 'all', name: 'All Products', icon: '📱' },
  { id: 'smartphones', name: 'Smartphones', icon: '📱' },
  { id: 'laptops', name: 'Laptops', icon: '💻' },
  { id: 'tablets', name: 'Tablets', icon: '📱' },
  { id: 'audio', name: 'Audio', icon: '🎧' },
  { id: 'tv', name: 'TV & Display', icon: '📺' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' }
];