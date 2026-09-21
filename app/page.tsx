import HeskHeader from '@/components/HeskHeader';

export default function HomePage() {
  return (
    <HeskHeader
      title="Support Desk"
      breadcrumbs={[
        { url: '/', title: 'Site' },
        { title: 'Support Desk' },
      ]}
    >
      <div className="main__content">
        <div className="contr">
          <div style={{ marginBottom: '20px' }} />

          <div className="help-search">
            <h1 className="search__title">Olá, como podemos ajudar?</h1>
          </div>

          <div className="nav">
            <a href="/tickets/new" className="navlink">
              <span className="icon-in-circle" aria-hidden="true">
                <svg className="icon icon-submit-ticket">
                  <use xlinkHref="/hesk/img/sprite.svg#icon-submit-ticket" />
                </svg>
              </span>
              <div>
                <h3 className="navlink__title">Enviar chamado</h3>
                <div className="navlink__descr">Envie uma nova solicitação para um departamento</div>
              </div>
            </a>

            <a href="/tickets" className="navlink">
              <span className="icon-in-circle" aria-hidden="true">
                <svg className="icon icon-document">
                  <use xlinkHref="/hesk/img/sprite.svg#icon-document" />
                </svg>
              </span>
              <div>
                <h3 className="navlink__title">Ver chamados</h3>
                <div className="navlink__descr">Consulte os chamados que você já enviou</div>
              </div>
            </a>
          </div>

          <div className="article__footer" aria-hidden="true" />
        </div>
      </div>
    </HeskHeader>
  );
}
