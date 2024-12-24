import { LayoutDashboard, Smartphone, FolderTree, ImageIcon, Layers, Palette, RulerIcon } from 'lucide-react';

export const routes = [
  {
    label: 'Overview',
    icon: LayoutDashboard,
    href: '/dashboard',
    pattern: /^\/dashboard$/,
  },
  {
    label: 'Products',
    icon: Smartphone,
    href: '/dashboard/products',
    pattern: /^\/dashboard\/products/,
  },
  {
    label: 'Product variants',
    icon: Layers,
    href: '/dashboard/product-variants',
    pattern: /^\/dashboard\/product-variants/,
  },
  {
    label: 'Experimental variants',
    icon: FolderTree,
    href: '/dashboard/variants',
    pattern: /^\/dashboard\/variants/,
  },
  {
    label: 'Colors',
    icon: Palette,
    href: '/dashboard/colors',
    pattern: /^\/dashboard\/colors/,
  },
  {
    label: 'Sizes',
    icon: RulerIcon,
    href: '/dashboard/sizes',
    pattern: /^\/dashboard\/sizes/,
  },
  {
    label: 'Categories',
    icon: FolderTree,
    href: '/dashboard/categories',
    pattern: /^\/dashboard\/categories/,
  },
  {
    label: 'Billboards',
    icon: ImageIcon,
    href: '/dashboard/billboards',
    pattern: /^\/dashboard\/billboards/,
  },
];

