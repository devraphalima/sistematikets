interface HeskBreadcrumbItem {
  url?: string;
  title: string;
}

interface HeskBreadcrumbProps {
  items: HeskBreadcrumbItem[];
}

export default function HeskBreadcrumb({ items }: HeskBreadcrumbProps) {
  return (
    <div className="breadcrumbs">
      <div className="contr">
        <div className="breadcrumbs__inner">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;

            return (
              <span key={`${item.title}-${i}`} className="breadcrumbs__item">
                {isLast ? (
                  <div className="last">{item.title}</div>
                ) : (
                  <>
                    <a href={item.url || '#'}>
                      <span>{item.title}</span>
                    </a>
                    <svg className="icon icon-chevron-right" aria-hidden="true">
                      <use xlinkHref="/hesk/img/sprite.svg#icon-chevron-right" />
                    </svg>
                  </>
                )}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
