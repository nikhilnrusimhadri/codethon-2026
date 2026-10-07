export function cn(...classes: Array<string | false | null | undefined>) { return classes.filter(Boolean).join(' '); }
export function formatDate(value: Date | string) { return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(new Date(value)); }
export function formatDateTime(value: Date | string) { return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(value)); }
export function statusClass(status: string) { return status.toLowerCase().replaceAll('_','-'); }
export function publicBranch(branch: string) { return branch === 'MECHANICAL' ? 'Mechanical' : branch === 'CIVIL' ? 'Civil' : branch; }
