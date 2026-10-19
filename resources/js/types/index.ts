export type * from './auth';
export type * from './navigation';
export type * from './ui';

export interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    isActive?: boolean;
    permission?: string;
    children?: NavItem[];
}