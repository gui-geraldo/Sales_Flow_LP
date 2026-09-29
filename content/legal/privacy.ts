import { COMPANY, type LegalDoc, type LegalVariant } from "@/lib/legal";

// Política de privacidade da LP, adaptada da política da plataforma
// (talker_flow_many_2.0/src/pages/PoliticaDePrivacidade.tsx) ao que o site
// faz hoje: formulário antes do WhatsApp, cookies do Google e da Meta com
// consentimento, e a plataforma tratando dados em nome dos clientes.
// Só roda no servidor: não vai no pacote de mensagens do navegador.

const { name, cnpj, email, site } = COMPANY;

const ptBR: LegalDoc = {
  metaTitle: "Política de privacidade | Sales Flow by Talker Flow",
  title: "Política de privacidade",
  updated: "Última atualização: {date}",
  back: "Voltar ao início",
  toc: "Nesta página",
  intro: [
    `Esta política explica como a ${name}, inscrita no CNPJ sob o nº ${cnpj}, com sede em São Paulo/SP, Brasil ("Sales Flow", "nós"), coleta, usa, guarda, compartilha e protege os dados pessoais de quem visita este site (${site}), de quem fala com a gente pelo formulário ou pelo WhatsApp e dos clientes da plataforma Sales Flow.`,
    "Seguimos a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, LGPD), o Marco Civil da Internet (Lei nº 12.965/2014) e as demais normas aplicáveis.",
  ],
  sections: [
    {
      title: "Nossos papéis no tratamento de dados",
      body: [
        "Como controladora, decidimos como e por que tratar: os dados de quem visita o site e preenche o formulário, os dados de cadastro e de cobrança dos clientes e os registros de uso da plataforma.",
        "Como operadora, tratamos em nome dos nossos clientes os dados que eles colocam na plataforma: contatos dos clientes deles, conversas de WhatsApp, listas, arquivos e dados de campanhas. Nesses casos o cliente é o controlador e define a finalidade e a base legal. Se você é cliente ou paciente de uma empresa que usa o Sales Flow, exerça seus direitos diretamente com essa empresa.",
      ],
    },
    {
      title: "Quais dados coletamos e para quê",
      body: [
        [
          "Formulário de contato: nome, e-mail e telefone, para falar com você por WhatsApp, e-mail ou telefone sobre o Sales Flow (demonstração, dúvidas, contratação).",
          "Dados da visita: página de origem, parâmetros de campanha do link (por exemplo, utm_source ou o identificador de clique de um anúncio), tempo na página, rolagem, idioma, tipo de aparelho e de navegador, endereço IP e a localização aproximada (país e cidade) que se deduz dele. Servem para saber quais campanhas trazem pessoas interessadas e investir melhor em publicidade.",
          "Cadastro de clientes: nome, e-mail, telefone, empresa, CNPJ e dados de faturamento, para criar e gerenciar a conta, cobrar, dar suporte e enviar comunicações operacionais.",
          "Registros de acesso (IP, data e hora) do site e da plataforma, para segurança e para cumprir o Marco Civil da Internet.",
        ],
      ],
    },
    {
      title: "Bases legais",
      body: [
        [
          "Procedimentos preliminares a um contrato, a seu pedido (art. 7º, V, da LGPD): para responder ao formulário de contato e falar com você sobre o serviço que você pediu para conhecer.",
          "Consentimento (art. 7º, I): para comunicações de marketing. Você pode revogá-lo quando quiser.",
          "Execução de contrato (art. 7º, V): para os dados necessários à prestação do serviço aos clientes.",
          "Cumprimento de obrigação legal (art. 7º, II): para os registros de acesso e dados fiscais.",
          "Legítimo interesse (art. 7º, IX): para medir o desempenho das nossas campanhas e melhorar o site e a plataforma, sempre respeitando os seus direitos. Os cookies de medição podem ser recusados no aviso de cookies.",
        ],
      ],
    },
    {
      title: "Com quem compartilhamos",
      body: [
        "Não vendemos dados pessoais. Compartilhamos apenas o necessário, com fornecedores sujeitos a obrigações de confidencialidade e segurança:",
        [
          "Hospedagem e infraestrutura em nuvem do site e da plataforma.",
          "Ferramentas de automação e CRM com que gerenciamos os contatos, incluindo a própria plataforma Sales Flow.",
          "Meta (WhatsApp), quando conversamos com você e, sob instrução dos clientes, para conectar a plataforma aos números deles.",
          "Google (Google Analytics e Google Ads) e Meta (pixel), para medir visitas e anúncios, conforme a sua escolha no aviso de cookies.",
          "Provedores de inteligência artificial usados nos recursos de IA da plataforma, sob instrução dos clientes.",
          "Processadores de pagamento, para cobrar as assinaturas.",
          "Autoridades públicas, mediante ordem judicial ou requisição legal.",
        ],
      ],
    },
    {
      title: "Transferência internacional",
      body: [
        "Alguns desses fornecedores guardam ou tratam dados fora do Brasil. Nesses casos a transferência segue as hipóteses do art. 33 da LGPD, como cláusulas contratuais e garantias de proteção equivalentes.",
      ],
    },
    {
      title: "Por quanto tempo guardamos",
      body: [
        [
          "Contatos do formulário: enquanto mantivermos a conversa e, no máximo, 24 meses após o último contato se você não se tornar cliente.",
          "Dados de clientes: durante o contrato e, depois, pelos prazos exigidos em lei (por exemplo, fiscais) ou para defesa de direitos.",
          "Registros de acesso: 6 meses, como exige o art. 15 do Marco Civil da Internet.",
          "Dados tratados como operadora: eliminados ou devolvidos ao cliente ao fim do contrato, ressalvados backups e registros mantidos por obrigação legal, pelo tempo estritamente necessário.",
        ],
        "Se você revogar o consentimento, apagamos os dados tratados com base nele, salvo se a lei nos obrigar a mantê-los.",
      ],
    },
    {
      title: "Cookies",
      body: [
        "Cookies são pequenos arquivos guardados no seu navegador. Usamos estes:",
        [
          "sf_consent (nosso, 6 meses): guarda a sua escolha no aviso de cookies.",
          "NEXT_LOCALE e NEXT_CURRENCY (nossos, 1 ano): idioma e moeda da página.",
          "sf_aid e a origem da primeira e da última visita no armazenamento do navegador (nossos, 1 ano): para saber qual anúncio trouxe você se depois falar com a gente.",
          "_ga e _ga_* (Google Analytics, até 2 anos): estatísticas de visita.",
          "_gcl_* (Google Ads, até 90 dias): medição de anúncios do Google.",
          "_fbp e _fbc (Meta, até 90 dias): medição de anúncios do Facebook e do Instagram.",
        ],
        "Você pode recusar os cookies de medição no aviso de cookies ou mudar a escolha quando quiser no link \"Cookies\" no rodapé. Se recusar, eles não são gravados e o Google só recebe sinais sem cookies. Também é possível apagar tudo nas configurações do navegador.",
      ],
    },
    {
      title: "Segurança",
      body: [
        "Adotamos medidas técnicas e administrativas alinhadas às boas práticas de mercado para proteger os dados contra acesso não autorizado, perda, alteração ou destruição, incluindo controle de acesso, criptografia, isolamento dos dados de cada cliente, monitoramento e políticas internas de segurança.",
      ],
    },
    {
      title: "Seus direitos",
      body: [
        `Pela LGPD (art. 18), você pode pedir a qualquer momento, escrevendo para ${email}:`,
        [
          "Confirmação de que tratamos seus dados e acesso a eles.",
          "Correção de dados incompletos, inexatos ou desatualizados.",
          "Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade.",
          "Portabilidade dos dados a outro fornecedor.",
          "Eliminação dos dados tratados com base no consentimento e revogação do consentimento.",
          "Informação sobre com quem compartilhamos seus dados.",
        ],
        "Se achar que não tratamos bem os seus dados, você pode reclamar à Autoridade Nacional de Proteção de Dados (www.gov.br/anpd).",
      ],
    },
    {
      title: "Alterações desta política",
      body: [
        "Podemos atualizar esta política para refletir mudanças nas nossas práticas ou na lei. A data no topo mostra a versão em vigor, e mudanças relevantes são avisadas aos clientes por e-mail ou na plataforma.",
      ],
    },
    {
      title: "Contato e encarregado de dados",
      body: [
        `Para exercer seus direitos ou tirar dúvidas sobre esta política, fale com o nosso encarregado de dados (DPO) pelo e-mail ${email}.`,
      ],
    },
  ],
};

const ptPT: LegalDoc = {
  metaTitle: "Política de privacidade | Sales Flow by Talker Flow",
  title: "Política de privacidade",
  updated: "Última atualização: {date}",
  back: "Voltar ao início",
  toc: "Nesta página",
  intro: [
    `Esta política explica como a ${name}, sociedade brasileira inscrita no CNPJ sob o n.º ${cnpj}, com sede em São Paulo, Brasil ("Sales Flow", "nós"), recolhe, usa, conserva, partilha e protege os dados pessoais de quem visita este site (${site}), de quem nos contacta pelo formulário ou pelo WhatsApp e dos clientes da plataforma Sales Flow.`,
    "Cumprimos o Regulamento Geral sobre a Proteção de Dados (Regulamento (UE) 2016/679, RGPD), a Lei n.º 58/2019, a Lei n.º 41/2004 (cookies) e, enquanto empresa brasileira, a Lei Geral de Proteção de Dados (LGPD).",
  ],
  sections: [
    {
      title: "Os nossos papéis no tratamento de dados",
      body: [
        "Como responsável pelo tratamento, decidimos como e porquê tratar: os dados de quem visita o site e preenche o formulário, os dados de registo e faturação dos clientes e os registos de utilização da plataforma.",
        "Como subcontratante, tratamos por conta dos nossos clientes os dados que estes colocam na plataforma: contactos dos seus clientes ou pacientes, conversas de WhatsApp, listas, ficheiros e dados de campanhas. Nesses casos o cliente é o responsável pelo tratamento e define a finalidade e o fundamento jurídico (artigo 28.º do RGPD). Se é cliente ou paciente de uma empresa que usa o Sales Flow, exerça os seus direitos diretamente junto dessa empresa.",
      ],
    },
    {
      title: "Que dados recolhemos e para quê",
      body: [
        [
          "Formulário de contacto: nome, e-mail e telefone, para o contactar por WhatsApp, e-mail ou telefone sobre o Sales Flow (demonstração, dúvidas, contratação).",
          "Dados da visita: página de origem, parâmetros de campanha do link (por exemplo, utm_source ou o identificador de clique de um anúncio), tempo na página, deslocamento, idioma, tipo de dispositivo e de navegador, endereço IP e a localização aproximada (país e cidade) que dele se deduz. Servem para saber que campanhas trazem pessoas interessadas e investir melhor em publicidade.",
          "Registo de clientes: nome, e-mail, telefone, empresa, número de identificação fiscal e dados de faturação, para criar e gerir a conta, faturar, prestar apoio e enviar comunicações operacionais.",
          "Registos de acesso (IP, data e hora) do site e da plataforma, para segurança.",
        ],
      ],
    },
    {
      title: "Fundamento jurídico",
      body: [
        [
          "Diligências pré-contratuais a seu pedido (artigo 6.º, n.º 1, alínea b) do RGPD): para responder ao formulário de contacto sobre o serviço que pediu para conhecer.",
          "Consentimento (alínea a)): para comunicações de marketing e para os cookies de medição e publicidade (artigo 5.º da Lei n.º 41/2004). Pode retirá-lo quando quiser, sem afetar o tratamento feito antes.",
          "Execução de contrato (alínea b)): para os dados necessários à prestação do serviço aos clientes.",
          "Obrigação legal (alínea c)): para dados fiscais e contabilísticos.",
          "Interesse legítimo (alínea f)): para os dados de campanha que acompanham o formulário, a segurança do site e a melhoria da plataforma.",
        ],
      ],
    },
    {
      title: "Com quem partilhamos",
      body: [
        "Não vendemos dados pessoais. Partilhamos apenas o necessário, com fornecedores vinculados a obrigações de confidencialidade e segurança:",
        [
          "Alojamento e infraestrutura em nuvem do site e da plataforma.",
          "Ferramentas de automação e CRM com que gerimos os contactos, incluindo a própria plataforma Sales Flow.",
          "Meta (WhatsApp), quando conversamos consigo e, por instrução dos clientes, para ligar a plataforma aos números deles.",
          "Google (Google Analytics e Google Ads) e Meta (píxel), para medir visitas e anúncios, apenas se aceitar os cookies.",
          "Fornecedores de inteligência artificial usados nas funcionalidades de IA da plataforma, por instrução dos clientes.",
          "Processadores de pagamento, para faturar as subscrições.",
          "Autoridades públicas, mediante ordem judicial ou obrigação legal.",
        ],
      ],
    },
    {
      title: "Transferências internacionais",
      body: [
        "Somos uma empresa com sede no Brasil e alguns dos nossos fornecedores tratam dados fora do Espaço Económico Europeu. Essas transferências fazem-se com as garantias exigidas pelo capítulo V do RGPD, como decisões de adequação ou cláusulas contratuais-tipo da Comissão Europeia.",
      ],
    },
    {
      title: "Durante quanto tempo conservamos os dados",
      body: [
        [
          "Contactos do formulário: enquanto mantivermos a conversa e, no máximo, 24 meses após o último contacto se não se tornar cliente.",
          "Dados de clientes: durante o contrato e, depois, pelos prazos legais (por exemplo, fiscais) ou para defesa de direitos.",
          "Registos de acesso: 6 meses.",
          "Dados tratados como subcontratante: apagados ou devolvidos ao cliente no fim do contrato, salvo cópias de segurança e registos conservados por obrigação legal, pelo tempo estritamente necessário.",
        ],
        "Se retirar o consentimento, apagamos os dados tratados com base nele, salvo se a lei nos obrigar a conservá-los.",
      ],
    },
    {
      title: "Cookies",
      body: [
        "Cookies são pequenos ficheiros guardados no seu navegador. Usamos estes:",
        [
          "sf_consent (próprio, 6 meses, necessário): guarda a sua escolha no aviso de cookies.",
          "NEXT_LOCALE e NEXT_CURRENCY (próprios, 1 ano, necessários): idioma e moeda da página.",
          "sf_aid e a origem da primeira e da última visita no armazenamento do navegador (próprios, 1 ano, só com consentimento): para saber que anúncio o trouxe se depois nos contactar.",
          "_ga e _ga_* (Google Analytics, até 2 anos, só com consentimento): estatísticas de visita.",
          "_gcl_* (Google Ads, até 90 dias, só com consentimento): medição de anúncios da Google.",
          "_fbp e _fbc (Meta, até 90 dias, só com consentimento): medição de anúncios do Facebook e do Instagram.",
        ],
        "Pode aceitá-los ou rejeitá-los no aviso de cookies e mudar a sua escolha quando quiser no link \"Cookies\" no rodapé. Se os rejeitar, não são guardados e a Google só recebe sinais sem cookies. Também os pode apagar nas definições do navegador.",
      ],
    },
    {
      title: "Segurança",
      body: [
        "Adotamos medidas técnicas e organizativas alinhadas com as boas práticas do mercado para proteger os dados contra acesso não autorizado, perda, alteração ou destruição, incluindo controlo de acessos, cifragem, isolamento dos dados de cada cliente, monitorização e políticas internas de segurança.",
      ],
    },
    {
      title: "Os seus direitos",
      body: [
        `Pode exercer a qualquer momento, escrevendo para ${email}, os direitos de:`,
        [
          "Acesso aos seus dados.",
          "Retificação de dados inexatos ou incompletos.",
          "Apagamento.",
          "Limitação do tratamento.",
          "Oposição ao tratamento baseado em interesse legítimo.",
          "Portabilidade.",
          "Retirada do consentimento, sem afetar o tratamento feito antes.",
        ],
        "Se considerar que não tratámos bem os seus dados, pode apresentar reclamação à Comissão Nacional de Proteção de Dados (www.cnpd.pt).",
      ],
    },
    {
      title: "Alterações a esta política",
      body: [
        "Podemos atualizar esta política para refletir mudanças nas nossas práticas ou na lei. A data no topo indica a versão em vigor, e as alterações relevantes são comunicadas aos clientes por e-mail ou na plataforma.",
      ],
    },
    {
      title: "Contacto e encarregado da proteção de dados",
      body: [
        `Para exercer os seus direitos ou esclarecer dúvidas sobre esta política, contacte o nosso encarregado da proteção de dados (DPO) pelo e-mail ${email}.`,
      ],
    },
  ],
};

const es: LegalDoc = {
  metaTitle: "Política de privacidad | Sales Flow by Talker Flow",
  title: "Política de privacidad",
  updated: "Última actualización: {date}",
  back: "Volver al inicio",
  toc: "En esta página",
  intro: [
    `Esta política explica cómo ${name}, sociedad brasileña inscrita con el CNPJ n.º ${cnpj} y domicilio en São Paulo, Brasil ("Sales Flow", "nosotros"), recoge, usa, conserva, comparte y protege los datos personales de quienes visitan esta web (${site}), de quienes nos escriben por el formulario o por WhatsApp y de los clientes de la plataforma Sales Flow.`,
    "Cumplimos el Reglamento General de Protección de Datos (Reglamento (UE) 2016/679, RGPD), la Ley Orgánica 3/2018 (LOPDGDD), la Ley 34/2002 (LSSI) y, como empresa brasileña, la Lei Geral de Proteção de Dados (LGPD).",
  ],
  sections: [
    {
      title: "Nuestro papel en el tratamiento de datos",
      body: [
        "Como responsables del tratamiento, decidimos cómo y para qué se tratan: los datos de quienes visitan la web y rellenan el formulario, los datos de registro y facturación de los clientes y los registros de uso de la plataforma.",
        "Como encargados del tratamiento, tratamos por cuenta de nuestros clientes los datos que ellos cargan en la plataforma: contactos de sus clientes o pacientes, conversaciones de WhatsApp, listas, archivos y datos de campañas. En esos casos la clínica o empresa cliente es la responsable y define la finalidad y la base legal (artículo 28 del RGPD). Si eres paciente o cliente de una empresa que usa Sales Flow, ejerce tus derechos directamente ante esa empresa.",
      ],
    },
    {
      title: "Qué datos recogemos y para qué",
      body: [
        [
          "Formulario de contacto: nombre, email y teléfono, para contactarte por WhatsApp, email o teléfono sobre Sales Flow (demo, dudas, contratación).",
          "Datos de tu visita: página desde la que llegaste, parámetros de campaña del enlace (por ejemplo, utm_source o el identificador de clic de un anuncio), tiempo en la página, desplazamiento, idioma, tipo de dispositivo y de navegador, dirección IP y la ubicación aproximada (país y ciudad) que se deduce de ella. Sirven para saber qué campañas traen a personas interesadas e invertir mejor en publicidad.",
          "Registro de clientes: nombre, email, teléfono, empresa, NIF y datos de facturación, para crear y gestionar la cuenta, facturar, dar soporte y enviar comunicaciones operativas.",
          "Registros de acceso (IP, fecha y hora) de la web y de la plataforma, por seguridad.",
        ],
      ],
    },
    {
      title: "Base legal",
      body: [
        [
          "Aplicación de medidas precontractuales a petición tuya (artículo 6.1.b del RGPD): para responder al formulario de contacto sobre el servicio que pediste conocer.",
          "Consentimiento (artículo 6.1.a): para las comunicaciones comerciales y las cookies de medición y publicidad (artículo 22.2 de la LSSI). Puedes retirarlo cuando quieras, sin que afecte a lo tratado antes.",
          "Ejecución de un contrato (artículo 6.1.b): para los datos necesarios para prestar el servicio a los clientes.",
          "Obligación legal (artículo 6.1.c): para los datos fiscales y contables.",
          "Interés legítimo (artículo 6.1.f): para los datos de campaña que acompañan al formulario, la seguridad de la web y la mejora de la plataforma.",
        ],
      ],
    },
    {
      title: "Con quién los compartimos",
      body: [
        "No vendemos datos personales. Solo compartimos lo necesario, con proveedores sujetos a obligaciones de confidencialidad y seguridad:",
        [
          "Alojamiento e infraestructura en la nube de la web y de la plataforma.",
          "Herramientas de automatización y CRM con las que gestionamos los contactos, incluida la propia plataforma Sales Flow.",
          "Meta (WhatsApp), cuando conversamos contigo y, por instrucción de los clientes, para conectar la plataforma a sus números.",
          "Google (Google Analytics y Google Ads) y Meta (píxel), para medir visitas y anuncios, solo si aceptas las cookies.",
          "Proveedores de inteligencia artificial usados en las funciones de IA de la plataforma, por instrucción de los clientes.",
          "Procesadores de pago, para cobrar las suscripciones.",
          "Autoridades públicas, cuando lo exija una orden judicial o la ley.",
        ],
      ],
    },
    {
      title: "Transferencias internacionales",
      body: [
        "Somos una empresa con sede en Brasil y algunos de nuestros proveedores tratan datos fuera del Espacio Económico Europeo. Esas transferencias se hacen con las garantías que exige el capítulo V del RGPD, como decisiones de adecuación o cláusulas contractuales tipo de la Comisión Europea.",
      ],
    },
    {
      title: "Cuánto tiempo los conservamos",
      body: [
        [
          "Contactos del formulario: mientras mantengamos la conversación y, como máximo, 24 meses desde el último contacto si no llegas a ser cliente.",
          "Datos de clientes: durante el contrato y, después, durante los plazos legales (por ejemplo, fiscales) o para la defensa de derechos.",
          "Registros de acceso: 6 meses.",
          "Datos tratados como encargados: se borran o se devuelven al cliente al terminar el contrato, salvo copias de seguridad y registros conservados por obligación legal, durante el tiempo estrictamente necesario.",
        ],
        "Si retiras tu consentimiento, borramos los datos tratados en base a él, salvo que una ley nos obligue a conservarlos.",
      ],
    },
    {
      title: "Cookies",
      body: [
        "Las cookies son pequeños archivos que se guardan en tu navegador. Usamos estas:",
        [
          "sf_consent (propia, 6 meses, necesaria): guarda tu elección en el aviso de cookies.",
          "NEXT_LOCALE y NEXT_CURRENCY (propias, 1 año, necesarias): idioma y moneda de la página.",
          "sf_aid y el origen de tu primera y última visita en el almacenamiento del navegador (propias, 1 año, solo con consentimiento): para saber qué anuncio te trajo si después nos escribes.",
          "_ga y _ga_* (Google Analytics, hasta 2 años, solo con consentimiento): estadísticas de visitas.",
          "_gcl_* (Google Ads, hasta 90 días, solo con consentimiento): medición de anuncios de Google.",
          "_fbp y _fbc (Meta, hasta 90 días, solo con consentimiento): medición de anuncios de Facebook e Instagram.",
        ],
        "Puedes aceptarlas o rechazarlas en el aviso de cookies y cambiar tu elección cuando quieras en el enlace «Cookies» al pie de la página. Si las rechazas, no se guardan y Google solo recibe señales sin cookies. También puedes borrarlas desde la configuración de tu navegador.",
      ],
    },
    {
      title: "Seguridad",
      body: [
        "Aplicamos medidas técnicas y organizativas alineadas con las buenas prácticas del mercado para proteger los datos frente a accesos no autorizados, pérdida, alteración o destrucción, entre ellas control de accesos, cifrado, aislamiento de los datos de cada cliente, monitorización y políticas internas de seguridad.",
      ],
    },
    {
      title: "Tus derechos",
      body: [
        `Puedes ejercer en cualquier momento, escribiendo a ${email}, tus derechos de:`,
        [
          "Acceso a tus datos.",
          "Rectificación de datos inexactos o incompletos.",
          "Supresión.",
          "Limitación del tratamiento.",
          "Oposición al tratamiento basado en interés legítimo.",
          "Portabilidad.",
          "Retirada del consentimiento, sin que afecte a lo tratado antes.",
        ],
        "Si crees que no hemos tratado bien tus datos, puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).",
      ],
    },
    {
      title: "Cambios en esta política",
      body: [
        "Podemos actualizar esta política para reflejar cambios en nuestras prácticas o en la ley. La fecha de arriba indica la versión vigente, y los cambios relevantes se comunican a los clientes por email o en la plataforma.",
      ],
    },
    {
      title: "Contacto y delegado de protección de datos",
      body: [
        `Para ejercer tus derechos o resolver dudas sobre esta política, escribe a nuestro delegado de protección de datos (DPO) en ${email}.`,
      ],
    },
  ],
};

const en: LegalDoc = {
  metaTitle: "Privacy policy | Sales Flow by Talker Flow",
  title: "Privacy policy",
  updated: "Last updated: {date}",
  back: "Back to home",
  toc: "On this page",
  intro: [
    `This policy explains how ${name}, a Brazilian company registered under CNPJ ${cnpj} and based in São Paulo, Brazil ("Sales Flow", "we"), collects, uses, stores, shares and protects the personal data of visitors to this website (${site}), of people who contact us through the form or on WhatsApp, and of customers of the Sales Flow platform.`,
    "We comply with the General Data Protection Regulation (Regulation (EU) 2016/679, GDPR) where it applies, with Brazil's General Data Protection Law (LGPD) and with other applicable laws.",
  ],
  sections: [
    {
      title: "Our role in processing data",
      body: [
        "As a controller, we decide how and why we process: data about visitors who browse the website and fill in the form, customers' account and billing data, and platform usage logs.",
        "As a processor, we handle, on behalf of our customers, the data they put into the platform: contacts of their own clients or patients, WhatsApp conversations, lists, files and campaign data. In those cases the customer is the controller and sets the purpose and legal basis (Article 28 GDPR). If you are a client or patient of a business that uses Sales Flow, please exercise your rights directly with that business.",
      ],
    },
    {
      title: "What data we collect and why",
      body: [
        [
          "Contact form: name, email and phone number, to contact you on WhatsApp, by email or by phone about Sales Flow (demo, questions, sign-up).",
          "Visit data: the page you came from, campaign parameters in the link (for example utm_source or an ad click identifier), time on page, scroll depth, language, device and browser type, IP address and the approximate location (country and city) derived from it. We use it to understand which campaigns bring interested people and to invest better in advertising.",
          "Customer accounts: name, email, phone number, company, tax ID and billing details, to create and manage the account, bill, provide support and send operational messages.",
          "Access logs (IP, date and time) for the website and the platform, for security.",
        ],
      ],
    },
    {
      title: "Legal basis",
      body: [
        [
          "Steps taken at your request before entering into a contract (Article 6(1)(b) GDPR): to respond to the contact form about the service you asked to learn about.",
          "Consent (Article 6(1)(a)): for marketing messages and measurement and advertising cookies (under the ePrivacy rules). You can withdraw it at any time, without affecting earlier processing.",
          "Performance of a contract (Article 6(1)(b)): for the data needed to provide the service to customers.",
          "Legal obligation (Article 6(1)(c)): for tax and accounting records.",
          "Legitimate interest (Article 6(1)(f)): for the campaign data sent with the form, website security and improving the platform.",
        ],
      ],
    },
    {
      title: "Who we share it with",
      body: [
        "We don't sell personal data. We only share what is necessary, with providers bound by confidentiality and security obligations:",
        [
          "Cloud hosting and infrastructure for the website and the platform.",
          "Automation and CRM tools we use to manage contacts, including the Sales Flow platform itself.",
          "Meta (WhatsApp), when we talk to you and, on customers' instructions, to connect the platform to their numbers.",
          "Google (Google Analytics and Google Ads) and Meta (pixel), to measure visits and ads, only if you accept cookies.",
          "Artificial intelligence providers used in the platform's AI features, on customers' instructions.",
          "Payment processors, to bill subscriptions.",
          "Public authorities, when required by a court order or by law.",
        ],
      ],
    },
    {
      title: "International transfers",
      body: [
        "We are based in Brazil and some of our providers process data in other countries. Where the GDPR applies, those transfers rely on the safeguards in Chapter V, such as adequacy decisions or the European Commission's standard contractual clauses.",
      ],
    },
    {
      title: "How long we keep it",
      body: [
        [
          "Form contacts: while we are in touch and, at most, 24 months after the last contact if you don't become a customer.",
          "Customer data: for the duration of the contract and then for the periods required by law (for example, tax) or to defend legal claims.",
          "Access logs: 6 months.",
          "Data processed on behalf of customers: deleted or returned to the customer when the contract ends, except for backups and logs kept by legal obligation, for as long as strictly necessary.",
        ],
        "If you withdraw your consent, we delete the data processed on that basis unless the law requires us to keep it.",
      ],
    },
    {
      title: "Cookies",
      body: [
        "Cookies are small files stored in your browser. We use these:",
        [
          "sf_consent (ours, 6 months, necessary): stores your choice in the cookie notice.",
          "NEXT_LOCALE and NEXT_CURRENCY (ours, 1 year, necessary): page language and currency.",
          "sf_aid and the source of your first and latest visit in browser storage (ours, 1 year, consent only): so we know which ad brought you if you contact us later.",
          "_ga and _ga_* (Google Analytics, up to 2 years, consent only): visit statistics.",
          "_gcl_* (Google Ads, up to 90 days, consent only): Google ad measurement.",
          "_fbp and _fbc (Meta, up to 90 days, consent only): Facebook and Instagram ad measurement.",
        ],
        "You can accept or reject them in the cookie notice and change your choice at any time with the \"Cookies\" link in the page footer. If you reject them, nothing is stored and Google only receives cookieless signals. You can also delete them in your browser settings.",
      ],
    },
    {
      title: "Security",
      body: [
        "We apply technical and organisational measures in line with industry best practice to protect data against unauthorised access, loss, alteration or destruction, including access control, encryption, isolation of each customer's data, monitoring and internal security policies.",
      ],
    },
    {
      title: "Your rights",
      body: [
        `You can exercise these rights at any time by writing to ${email}:`,
        [
          "Access to your data.",
          "Rectification of inaccurate or incomplete data.",
          "Erasure.",
          "Restriction of processing.",
          "Objection to processing based on legitimate interest.",
          "Data portability.",
          "Withdrawal of consent, without affecting earlier processing.",
        ],
        "If you believe we have not handled your data properly, you can lodge a complaint with the data protection authority of your country (in Spain, the AEPD at www.aepd.es; in Brazil, the ANPD at www.gov.br/anpd).",
      ],
    },
    {
      title: "Changes to this policy",
      body: [
        "We may update this policy to reflect changes in our practices or in the law. The date at the top shows the current version, and we notify customers of significant changes by email or in the platform.",
      ],
    },
    {
      title: "Contact and data protection officer",
      body: [
        `To exercise your rights or ask about this policy, contact our data protection officer (DPO) at ${email}.`,
      ],
    },
  ],
};

export const PRIVACY: Record<LegalVariant, LegalDoc> = { "pt-BR": ptBR, "pt-PT": ptPT, es, en };
