import HeskBreadcrumb from './HeskBreadcrumb';

interface BreadcrumbItem {
  url?: string;
  title: string;
}

interface HeskHeaderProps {
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
  children: React.ReactNode;
}

export default function HeskHeader({ title = 'Support Desk', breadcrumbs, children }: HeskHeaderProps) {
  return (
    <>
      <a href="#maincontent" className="skiplink">Skip to Main Content</a>
      <div className="wrapper">
        <main className="main" id="maincontent">
          <header className="header">
            <div className="contr">
              <div className="header__inner">
                <a href="/" className="header__logo">
                  <span>{title}</span>
                </a>
              </div>
            </div>
          </header>

          {breadcrumbs && <HeskBreadcrumb items={breadcrumbs} />}

          {children}
        </main>
      </div>
    </>
  );
}
