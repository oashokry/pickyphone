import { Link } from "wouter";

export default function Breadcrumbs({ items }: { items: Array<{ name: string; href: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-muted-foreground mb-6">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index > 0 && <span className="text-primary/40">/</span>}
            <Link href={item.href} className={index === items.length - 1 ? "text-primary font-medium" : "hover:text-primary transition-colors"}>
              {item.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
