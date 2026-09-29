import { COMPANY, type LegalDoc, type LegalVariant } from "@/lib/legal";

// Termos de uso, adaptados dos termos da plataforma
// (talker_flow_many_2.0/src/pages/TermosDeUso.tsx) ao modelo comercial atual:
// assinatura mensal sem fidelidade + cobrança por automação, mensagens da
// API oficial faturadas pela Meta direto ao cliente, recursos de IA.
// Só roda no servidor: não vai no pacote de mensagens do navegador.

const { name, cnpj, email, site } = COMPANY;

const ptBR: LegalDoc = {
  metaTitle: "Termos de uso | Sales Flow",
  title: "Termos de uso",
  updated: "Última atualização: {date}",
  back: "Voltar ao início",
  toc: "Nesta página",
  intro: [
    `Estes termos regem o uso do Sales Flow, plataforma de atendimento, CRM e automação por WhatsApp oferecida pela ${name}, inscrita no CNPJ sob o nº ${cnpj}, com sede em São Paulo/SP, Brasil, e-mail ${email} ("Sales Flow", "nós"), incluindo o site ${site}, o painel, as APIs e as integrações ("Plataforma").`,
    "Ao criar uma conta, contratar um plano ou usar a Plataforma, você (\"Cliente\") declara que leu e aceita estes termos e a política de privacidade.",
  ],
  sections: [
    {
      title: "Serviços",
      body: [
        "O Sales Flow reúne atendimento multiusuário por WhatsApp, CRM, automações e follow-ups, recursos de inteligência artificial e relatórios de anúncios, com integrações a canais de mensagem (incluindo a API oficial do WhatsApp Business), redes sociais e outras ferramentas.",
        "As funcionalidades podem variar por plano, versão e integrações ativas. Serviços de terceiros podem exigir credenciais, aprovações ou contratação própria do Cliente.",
        "A Plataforma se destina a empresas e profissionais que a usam na sua atividade.",
      ],
    },
    {
      title: "Conta e responsabilidades do Cliente",
      body: [
        "O Cliente deve ter capacidade e poderes para contratar em nome próprio ou da empresa que representa, e é responsável:",
        [
          "Pela veracidade dos dados de cadastro.",
          "Pela guarda de logins, senhas e chaves de API.",
          "Pelo uso da Plataforma pela sua equipe.",
          "Pelas configurações de automações, fluxos, respostas da IA e mensagens enviadas.",
          "Por cumprir as leis aplicáveis e as políticas dos canais integrados, incluindo as regras do WhatsApp Business e da Meta.",
        ],
        "Irregularidades como spam, listas sem autorização, mensagens fora das regras de templates ou conteúdo proibido podem levar a limitações ou bloqueios pelos provedores dos canais. Nesses casos podemos suspender o uso para evitar sanções externas.",
      ],
    },
    {
      title: "Uso permitido e proibições",
      body: [
        "É proibido: violar leis (por exemplo, LGPD, Marco Civil da Internet e Código de Defesa do Consumidor); infringir direitos de terceiros; coletar ou usar dados sem base legal; enviar mensagens a quem não autorizou o contato; enviar conteúdo ilícito, discriminatório, abusivo ou enganoso; fazer engenharia reversa, scraping indevido ou ataques de segurança.",
        "Podemos investigar violações e adotar as medidas cabíveis, incluindo a suspensão ou o encerramento da conta.",
      ],
    },
    {
      title: "Planos, preços e pagamentos",
      body: [
        [
          "A contratação é por assinatura mensal, cobrada antecipadamente a cada ciclo, pelo preço do plano publicado no momento da contratação ou combinado por escrito.",
          "Além da assinatura, cada automação executada pela Plataforma (webhook acionado, disparo ou follow-up enviado) é cobrada por uso, pelo valor publicado na página de preços.",
          "As mensagens enviadas por template da API oficial do WhatsApp são cobradas pela Meta diretamente ao Cliente. Não cobramos comissão sobre elas.",
          "O não pagamento pode levar à suspensão do acesso a partir do 5º dia após o vencimento, sem prejuízo da cobrança dos valores devidos.",
          "Os valores pagos não são reembolsáveis por períodos usados parcialmente, salvo disposição legal em contrário.",
          "Tributos ficam a cargo de quem a lei indicar.",
          "Podemos atualizar preços e planos com aviso prévio razoável, valendo a partir do ciclo seguinte.",
        ],
      ],
    },
    {
      title: "Mudança de plano",
      body: [
        "Upgrades valem imediatamente ou no ciclo seguinte, conforme a condição comercial. Downgrades valem no ciclo seguinte e podem reduzir funcionalidades e limites.",
      ],
    },
    {
      title: "Integrações com terceiros",
      body: [
        "A Plataforma se integra a serviços de terceiros, como Meta (WhatsApp Business, Instagram, Facebook), Google e CRMs, que têm termos e políticas próprios e podem mudá-los por conta própria.",
        "O Cliente é responsável por obter autorizações, números, templates e por cumprir as regras de uso desses serviços. Não respondemos por indisponibilidades, mudanças de regras, bloqueios ou custos impostos por terceiros.",
      ],
    },
    {
      title: "Inteligência artificial",
      body: [
        "Os recursos de IA (respostas automáticas, identificação de dados e de temperatura do lead, transcrição de áudios, entre outros) geram conteúdo de forma automática e podem cometer erros. O Cliente define as instruções, revisa as configurações e responde pelas mensagens enviadas em seu nome.",
        "Para esses recursos, os dados necessários são tratados por provedores de IA contratados por nós, sob as mesmas obrigações de confidencialidade e proteção de dados.",
      ],
    },
    {
      title: "Proteção de dados",
      body: [
        "As partes cumprem a LGPD e as demais normas aplicáveis. Nos fluxos de atendimento, o Cliente é o controlador e o Sales Flow é o operador, tratando os dados em nome do Cliente e conforme as suas instruções.",
        "O Cliente declara ter base legal para os tratamentos que realiza, inclusive para dados sensíveis, como dados de saúde de pacientes, e se compromete a respeitar os direitos dos titulares.",
        "Ao fim do contrato, eliminamos ou devolvemos os dados tratados como operador, ressalvados backups e registros mantidos por obrigação legal, pelo tempo estritamente necessário. Os detalhes podem constar de um acordo de tratamento de dados (DPA), quando aplicável. Mais informações na política de privacidade.",
      ],
    },
    {
      title: "Conteúdo e propriedade intelectual",
      body: [
        "Dados, listas, mensagens, arquivos, fluxos, prompts e templates do Cliente continuam sendo do Cliente, que nos concede licença não exclusiva para tratá-los apenas para prestar os serviços.",
        "A Plataforma, seu código, marcas, layouts e documentação são da Talker Flow Tecnologia e protegidos por direitos de propriedade intelectual. É proibido reproduzi-los, modificá-los ou distribuí-los sem autorização escrita.",
      ],
    },
    {
      title: "Disponibilidade e suporte",
      body: [
        "Empregamos esforços comercialmente razoáveis para manter a Plataforma disponível e segura. Manutenções podem ocorrer, de preferência fora dos horários de pico.",
        "O suporte é prestado nos canais e horários divulgados e pode variar conforme o plano.",
      ],
    },
    {
      title: "Garantias e limitação de responsabilidade",
      body: [
        "A Plataforma é fornecida no estado em que se encontra e conforme disponibilidade. Não garantimos resultados comerciais específicos, funcionamento ininterrupto ou livre de erros, compatibilidade com qualquer sistema de terceiros nem ausência de bloqueios por provedores externos.",
        "Salvo dolo, culpa grave ou disposição legal em contrário, nossa responsabilidade total por danos diretos fica limitada ao valor pago pelo Cliente nos 3 meses anteriores ao evento. Ficam excluídos, na máxima extensão permitida, danos indiretos, lucros cessantes e perda de chance.",
      ],
    },
    {
      title: "Indenização",
      body: [
        "O Cliente se compromete a indenizar o Sales Flow por perdas, danos e custos decorrentes de uso indevido da Plataforma, violação destes termos, descumprimento de leis ou das políticas dos canais e dos conteúdos e dados que fornecer.",
      ],
    },
    {
      title: "Vigência, cancelamento e rescisão",
      body: [
        "O contrato vale por prazo indeterminado enquanto houver assinatura ativa, sem fidelidade.",
        "O Cliente pode cancelar quando quiser, com efeito ao fim do ciclo em curso. Valores já pagos não são reembolsados.",
        "Podemos suspender ou encerrar o acesso por inadimplência, violação destes termos, ordem legal ou risco à segurança e à estabilidade do serviço. Encerrado o contrato, o acesso é interrompido e os dados seguem o previsto em \"Proteção de dados\".",
      ],
    },
    {
      title: "Comunicações",
      body: [
        `Comunicados operacionais podem ser enviados ao e-mail cadastrado, pelo painel ou pelos canais de suporte. Notificações formais devem ser enviadas para ${email}.`,
      ],
    },
    {
      title: "Anticorrupção",
      body: [
        "As partes cumprem a legislação anticorrupção aplicável e não oferecem nem solicitam vantagens indevidas. A violação desta cláusula permite o encerramento do contrato.",
      ],
    },
    {
      title: "Alterações destes termos",
      body: [
        "Podemos atualizar estes termos para refletir mudanças legais, técnicas ou comerciais. Mudanças relevantes são avisadas com antecedência razoável e valem a partir do ciclo seguinte ou do prazo indicado no aviso. Continuar usando a Plataforma depois disso significa concordar com a nova versão.",
      ],
    },
    {
      title: "Disposições gerais",
      body: [
        "Se uma cláusula for considerada inválida, as demais continuam valendo. O Cliente não pode ceder estes termos sem a nossa concordância; podemos cedê-los em caso de reorganização societária.",
        "Aplica-se a lei brasileira. Fica eleito o foro da Comarca de São Paulo/SP, salvo foro legal do consumidor, quando aplicável.",
      ],
    },
  ],
};

const ptPT: LegalDoc = {
  metaTitle: "Termos de utilização | Sales Flow",
  title: "Termos de utilização",
  updated: "Última atualização: {date}",
  back: "Voltar ao início",
  toc: "Nesta página",
  intro: [
    `Estes termos regem a utilização do Sales Flow, plataforma de atendimento, CRM e automação por WhatsApp disponibilizada pela ${name}, sociedade brasileira inscrita no CNPJ sob o n.º ${cnpj}, com sede em São Paulo, Brasil, e-mail ${email} ("Sales Flow", "nós"), incluindo o site ${site}, o painel, as APIs e as integrações ("Plataforma").`,
    "Ao criar uma conta, contratar um plano ou utilizar a Plataforma, o cliente (\"Cliente\") declara que leu e aceita estes termos e a política de privacidade.",
  ],
  sections: [
    {
      title: "Serviços",
      body: [
        "O Sales Flow reúne atendimento multiutilizador por WhatsApp, CRM, automações e seguimentos, funcionalidades de inteligência artificial e relatórios de anúncios, com integrações a canais de mensagens (incluindo a API oficial do WhatsApp Business), redes sociais e outras ferramentas.",
        "As funcionalidades podem variar por plano, versão e integrações ativas. Serviços de terceiros podem exigir credenciais, aprovações ou contratação própria do Cliente.",
        "A Plataforma destina-se a empresas e profissionais que a utilizam na sua atividade, e não a consumidores.",
      ],
    },
    {
      title: "Conta e responsabilidades do Cliente",
      body: [
        "O Cliente deve ter capacidade e poderes para contratar em nome próprio ou da empresa que representa, e é responsável:",
        [
          "Pela veracidade dos dados de registo.",
          "Pela guarda de credenciais, palavras-passe e chaves de API.",
          "Pela utilização da Plataforma pela sua equipa.",
          "Pelas configurações de automações, fluxos, respostas da IA e mensagens enviadas.",
          "Pelo cumprimento da lei aplicável e das políticas dos canais integrados, incluindo as regras do WhatsApp Business e da Meta.",
        ],
        "Irregularidades como spam, listas sem autorização, mensagens fora das regras de modelos ou conteúdo proibido podem levar a limitações ou bloqueios pelos fornecedores dos canais. Nesses casos podemos suspender a utilização para evitar sanções externas.",
      ],
    },
    {
      title: "Utilização permitida e proibições",
      body: [
        "É proibido: violar a lei (por exemplo, o RGPD e a legislação de comunicações eletrónicas); infringir direitos de terceiros; recolher ou usar dados sem fundamento jurídico; enviar mensagens a quem não autorizou o contacto; enviar conteúdo ilícito, discriminatório, abusivo ou enganoso; fazer engenharia inversa, extração abusiva de dados ou ataques de segurança.",
        "Podemos investigar violações e adotar as medidas adequadas, incluindo a suspensão ou o encerramento da conta.",
      ],
    },
    {
      title: "Planos, preços e pagamentos",
      body: [
        [
          "A contratação é feita por subscrição mensal, paga antecipadamente em cada ciclo, pelo preço do plano publicado no momento da contratação ou acordado por escrito.",
          "Além da subscrição, cada automação executada pela Plataforma (webhook acionado, envio ou seguimento enviado) é cobrada por utilização, pelo valor publicado na página de preços.",
          "As mensagens enviadas por modelo da API oficial do WhatsApp são faturadas pela Meta diretamente ao Cliente. Não cobramos comissão sobre elas.",
          "A falta de pagamento pode levar à suspensão do acesso a partir do 5.º dia após o vencimento, sem prejuízo da cobrança dos valores em dívida.",
          "Os valores pagos não são reembolsáveis por períodos utilizados parcialmente, salvo disposição legal em contrário.",
          "Os impostos ficam a cargo de quem a lei determinar.",
          "Podemos atualizar preços e planos com aviso prévio razoável, com efeito a partir do ciclo seguinte.",
        ],
      ],
    },
    {
      title: "Mudança de plano",
      body: [
        "As subidas de plano produzem efeito de imediato ou no ciclo seguinte, conforme a condição comercial. As descidas produzem efeito no ciclo seguinte e podem reduzir funcionalidades e limites.",
      ],
    },
    {
      title: "Integrações com terceiros",
      body: [
        "A Plataforma integra-se com serviços de terceiros, como a Meta (WhatsApp Business, Instagram, Facebook), a Google e CRM, que têm termos e políticas próprios e os podem alterar unilateralmente.",
        "O Cliente é responsável por obter autorizações, números e modelos e por cumprir as regras de utilização desses serviços. Não respondemos por indisponibilidades, alterações de regras, bloqueios ou custos impostos por terceiros.",
      ],
    },
    {
      title: "Inteligência artificial",
      body: [
        "As funcionalidades de IA (respostas automáticas, identificação de dados e da temperatura do contacto, transcrição de áudios, entre outras) geram conteúdo de forma automática e podem cometer erros. O Cliente define as instruções, revê as configurações e responde pelas mensagens enviadas em seu nome.",
        "Para essas funcionalidades, os dados necessários são tratados por fornecedores de IA contratados por nós, com as mesmas obrigações de confidencialidade e proteção de dados.",
      ],
    },
    {
      title: "Proteção de dados",
      body: [
        "As partes cumprem o RGPD e a restante legislação aplicável. Nos fluxos de atendimento, o Cliente é o responsável pelo tratamento e o Sales Flow é o subcontratante, tratando os dados por conta do Cliente e segundo as suas instruções (artigo 28.º do RGPD).",
        "O Cliente declara ter fundamento jurídico para os tratamentos que realiza, incluindo categorias especiais de dados, como dados de saúde de pacientes (artigo 9.º do RGPD), e compromete-se a respeitar os direitos dos titulares.",
        "No fim do contrato, apagamos ou devolvemos os dados tratados como subcontratante, salvo cópias de segurança e registos conservados por obrigação legal, pelo tempo estritamente necessário. Os pormenores constam de um acordo de tratamento de dados (DPA), disponível mediante pedido. Mais informações na política de privacidade.",
      ],
    },
    {
      title: "Conteúdo e propriedade intelectual",
      body: [
        "Os dados, listas, mensagens, ficheiros, fluxos, prompts e modelos do Cliente continuam a pertencer ao Cliente, que nos concede uma licença não exclusiva para os tratar apenas para prestar os serviços.",
        "A Plataforma, o seu código, marcas, layouts e documentação pertencem à Talker Flow Tecnologia e estão protegidos por direitos de propriedade intelectual. É proibido reproduzi-los, modificá-los ou distribuí-los sem autorização escrita.",
      ],
    },
    {
      title: "Disponibilidade e apoio",
      body: [
        "Empregamos esforços comercialmente razoáveis para manter a Plataforma disponível e segura. Podem ocorrer manutenções, de preferência fora das horas de maior utilização.",
        "O apoio é prestado nos canais e horários divulgados e pode variar consoante o plano.",
      ],
    },
    {
      title: "Garantias e limitação de responsabilidade",
      body: [
        "A Plataforma é fornecida no estado em que se encontra e conforme disponibilidade. Não garantimos resultados comerciais específicos, funcionamento ininterrupto ou isento de erros, compatibilidade com qualquer sistema de terceiros nem ausência de bloqueios por fornecedores externos.",
        "Salvo dolo, culpa grave ou disposição legal imperativa em contrário, a nossa responsabilidade total por danos diretos fica limitada ao valor pago pelo Cliente nos 3 meses anteriores ao facto. Ficam excluídos, na máxima medida permitida, danos indiretos, lucros cessantes e perda de oportunidade.",
      ],
    },
    {
      title: "Indemnização",
      body: [
        "O Cliente compromete-se a indemnizar o Sales Flow por perdas, danos e custos resultantes de utilização indevida da Plataforma, violação destes termos, incumprimento da lei ou das políticas dos canais e dos conteúdos e dados que fornecer.",
      ],
    },
    {
      title: "Vigência, cancelamento e resolução",
      body: [
        "O contrato vigora por tempo indeterminado enquanto houver subscrição ativa, sem período de fidelização.",
        "O Cliente pode cancelar quando quiser, com efeito no fim do ciclo em curso. Os valores já pagos não são reembolsados.",
        "Podemos suspender ou terminar o acesso por falta de pagamento, violação destes termos, ordem legal ou risco para a segurança e a estabilidade do serviço. Terminado o contrato, o acesso é interrompido e os dados seguem o previsto em \"Proteção de dados\".",
      ],
    },
    {
      title: "Comunicações",
      body: [
        `As comunicações operacionais podem ser enviadas para o e-mail registado, pelo painel ou pelos canais de apoio. As notificações formais devem ser enviadas para ${email}.`,
      ],
    },
    {
      title: "Anticorrupção",
      body: [
        "As partes cumprem a legislação anticorrupção aplicável e não oferecem nem solicitam vantagens indevidas. A violação desta cláusula permite terminar o contrato.",
      ],
    },
    {
      title: "Alterações a estes termos",
      body: [
        "Podemos atualizar estes termos para refletir mudanças legais, técnicas ou comerciais. As alterações relevantes são comunicadas com antecedência razoável e produzem efeito a partir do ciclo seguinte ou do prazo indicado no aviso. Continuar a utilizar a Plataforma depois disso significa aceitar a nova versão.",
      ],
    },
    {
      title: "Disposições gerais",
      body: [
        "Se uma cláusula for considerada inválida, as restantes mantêm-se em vigor. O Cliente não pode ceder estes termos sem o nosso acordo; podemos cedê-los em caso de reorganização societária.",
        "Aplica-se a lei brasileira e é competente o foro da Comarca de São Paulo (Brasil), sem prejuízo das normas imperativas que se apliquem ao Cliente no seu país.",
      ],
    },
  ],
};

const es: LegalDoc = {
  metaTitle: "Términos de uso | Sales Flow",
  title: "Términos de uso",
  updated: "Última actualización: {date}",
  back: "Volver al inicio",
  toc: "En esta página",
  intro: [
    `Estos términos regulan el uso de Sales Flow, plataforma de atención, CRM y automatización por WhatsApp ofrecida por ${name}, sociedad brasileña inscrita con el CNPJ n.º ${cnpj}, con domicilio en São Paulo, Brasil, email ${email} ("Sales Flow", "nosotros"), incluida la web ${site}, el panel, las APIs y las integraciones ("Plataforma").`,
    "Al crear una cuenta, contratar un plan o usar la Plataforma, tú (\"Cliente\") declaras que has leído y aceptas estos términos y la política de privacidad.",
  ],
  sections: [
    {
      title: "Servicios",
      body: [
        "Sales Flow reúne atención multiusuario por WhatsApp, CRM, automatizaciones y seguimientos, funciones de inteligencia artificial e informes de anuncios, con integraciones con canales de mensajería (incluida la API oficial de WhatsApp Business), redes sociales y otras herramientas.",
        "Las funciones pueden variar según el plan, la versión y las integraciones activas. Los servicios de terceros pueden requerir credenciales, aprobaciones o contratación propia del Cliente.",
        "La Plataforma está dirigida a empresas y profesionales, como clínicas, que la usan en su actividad, y no a consumidores.",
      ],
    },
    {
      title: "Cuenta y responsabilidades del Cliente",
      body: [
        "El Cliente debe tener capacidad y poderes para contratar en nombre propio o de la empresa que representa, y es responsable de:",
        [
          "La veracidad de los datos de registro.",
          "La custodia de usuarios, contraseñas y claves de API.",
          "El uso de la Plataforma por parte de su equipo.",
          "La configuración de automatizaciones, flujos, respuestas de la IA y mensajes enviados.",
          "Cumplir la ley aplicable y las políticas de los canales integrados, incluidas las normas de WhatsApp Business y Meta.",
        ],
        "Las irregularidades como spam, listas sin autorización, mensajes fuera de las normas de plantillas o contenido prohibido pueden provocar limitaciones o bloqueos por parte de los proveedores de los canales. En esos casos podemos suspender el uso para evitar sanciones externas.",
      ],
    },
    {
      title: "Uso permitido y prohibiciones",
      body: [
        "Está prohibido: incumplir la ley (por ejemplo, el RGPD y la LSSI); infringir derechos de terceros; recoger o usar datos sin base legal; enviar mensajes a quien no ha autorizado el contacto; enviar contenido ilícito, discriminatorio, abusivo o engañoso; hacer ingeniería inversa, extracción abusiva de datos o ataques de seguridad.",
        "Podemos investigar los incumplimientos y adoptar las medidas oportunas, incluida la suspensión o el cierre de la cuenta.",
      ],
    },
    {
      title: "Planes, precios y pagos",
      body: [
        [
          "La contratación es por suscripción mensual, pagada por adelantado en cada ciclo, al precio del plan publicado en el momento de la contratación o acordado por escrito.",
          "Además de la suscripción, cada automatización que ejecuta la Plataforma (webhook activado, envío o seguimiento enviado) se cobra por uso, al importe publicado en la página de precios.",
          "Los mensajes enviados con plantilla por la API oficial de WhatsApp los factura Meta directamente al Cliente. No cobramos comisión sobre ellos.",
          "El impago puede provocar la suspensión del acceso a partir del 5.º día tras el vencimiento, sin perjuicio del cobro de lo adeudado.",
          "Los importes pagados no se reembolsan por periodos usados parcialmente, salvo disposición legal en contrario.",
          "Los impuestos corren a cargo de quien determine la ley.",
          "Podemos actualizar precios y planes con un preaviso razonable, con efecto desde el ciclo siguiente.",
        ],
      ],
    },
    {
      title: "Cambio de plan",
      body: [
        "Las subidas de plan se aplican de inmediato o en el ciclo siguiente, según la condición comercial. Las bajadas se aplican en el ciclo siguiente y pueden reducir funciones y límites.",
      ],
    },
    {
      title: "Integraciones con terceros",
      body: [
        "La Plataforma se integra con servicios de terceros, como Meta (WhatsApp Business, Instagram, Facebook), Google y CRMs, que tienen sus propios términos y políticas y pueden cambiarlos unilateralmente.",
        "El Cliente es responsable de obtener autorizaciones, números y plantillas y de cumplir las normas de uso de esos servicios. No respondemos de caídas, cambios de normas, bloqueos o costes impuestos por terceros.",
      ],
    },
    {
      title: "Inteligencia artificial",
      body: [
        "Las funciones de IA (respuestas automáticas, detección de datos y de la temperatura del contacto, transcripción de audios, entre otras) generan contenido de forma automática y pueden cometer errores. El Cliente define las instrucciones, revisa la configuración y responde de los mensajes enviados en su nombre.",
        "Para esas funciones, los datos necesarios los tratan proveedores de IA contratados por nosotros, con las mismas obligaciones de confidencialidad y protección de datos.",
      ],
    },
    {
      title: "Protección de datos",
      body: [
        "Las partes cumplen el RGPD, la LOPDGDD y el resto de normas aplicables. En los flujos de atención, el Cliente es el responsable del tratamiento y Sales Flow es el encargado, que trata los datos por cuenta del Cliente y según sus instrucciones (artículo 28 del RGPD).",
        "El Cliente declara contar con base legal para los tratamientos que realiza, incluidas categorías especiales de datos, como los datos de salud de pacientes (artículo 9 del RGPD), y se compromete a respetar los derechos de los interesados.",
        "Al terminar el contrato, borramos o devolvemos los datos tratados como encargados, salvo copias de seguridad y registros conservados por obligación legal, durante el tiempo estrictamente necesario. El detalle consta en un contrato de encargo del tratamiento (DPA), disponible bajo solicitud. Más información en la política de privacidad.",
      ],
    },
    {
      title: "Contenido y propiedad intelectual",
      body: [
        "Los datos, listas, mensajes, archivos, flujos, prompts y plantillas del Cliente siguen siendo del Cliente, que nos concede una licencia no exclusiva para tratarlos solo para prestar los servicios.",
        "La Plataforma, su código, marcas, diseños y documentación pertenecen a Talker Flow Tecnologia y están protegidos por derechos de propiedad intelectual. Está prohibido reproducirlos, modificarlos o distribuirlos sin autorización escrita.",
      ],
    },
    {
      title: "Disponibilidad y soporte",
      body: [
        "Hacemos esfuerzos comercialmente razonables para mantener la Plataforma disponible y segura. Puede haber mantenimientos, preferentemente fuera de las horas punta.",
        "El soporte se presta en los canales y horarios publicados y puede variar según el plan.",
      ],
    },
    {
      title: "Garantías y limitación de responsabilidad",
      body: [
        "La Plataforma se ofrece tal cual y según disponibilidad. No garantizamos resultados comerciales concretos, un funcionamiento ininterrumpido o libre de errores, la compatibilidad con cualquier sistema de terceros ni la ausencia de bloqueos por proveedores externos.",
        "Salvo dolo, culpa grave o norma imperativa en contrario, nuestra responsabilidad total por daños directos se limita al importe pagado por el Cliente en los 3 meses anteriores al hecho. Quedan excluidos, en la máxima medida permitida, los daños indirectos, el lucro cesante y la pérdida de oportunidad.",
      ],
    },
    {
      title: "Indemnización",
      body: [
        "El Cliente se compromete a indemnizar a Sales Flow por las pérdidas, daños y costes derivados del uso indebido de la Plataforma, del incumplimiento de estos términos, de la ley o de las políticas de los canales y de los contenidos y datos que aporte.",
      ],
    },
    {
      title: "Duración, cancelación y resolución",
      body: [
        "El contrato es de duración indefinida mientras haya una suscripción activa, sin permanencia.",
        "El Cliente puede cancelar cuando quiera, con efecto al final del ciclo en curso. Los importes ya pagados no se reembolsan.",
        "Podemos suspender o cancelar el acceso por impago, incumplimiento de estos términos, orden legal o riesgo para la seguridad y la estabilidad del servicio. Terminado el contrato, se corta el acceso y los datos siguen lo previsto en \"Protección de datos\".",
      ],
    },
    {
      title: "Comunicaciones",
      body: [
        `Las comunicaciones operativas pueden enviarse al email registrado, por el panel o por los canales de soporte. Las notificaciones formales deben enviarse a ${email}.`,
      ],
    },
    {
      title: "Anticorrupción",
      body: [
        "Las partes cumplen la normativa anticorrupción aplicable y no ofrecen ni solicitan ventajas indebidas. Su incumplimiento permite resolver el contrato.",
      ],
    },
    {
      title: "Cambios en estos términos",
      body: [
        "Podemos actualizar estos términos para reflejar cambios legales, técnicos o comerciales. Los cambios relevantes se comunican con antelación razonable y se aplican desde el ciclo siguiente o en el plazo indicado en el aviso. Seguir usando la Plataforma después supone aceptar la nueva versión.",
      ],
    },
    {
      title: "Disposiciones generales",
      body: [
        "Si una cláusula se declara inválida, las demás siguen vigentes. El Cliente no puede ceder estos términos sin nuestro consentimiento; nosotros podemos cederlos en caso de reorganización societaria.",
        "Se aplica la ley brasileña y son competentes los tribunales de São Paulo (Brasil), sin perjuicio de las normas imperativas que se apliquen al Cliente en su país.",
      ],
    },
  ],
};

const en: LegalDoc = {
  metaTitle: "Terms of use | Sales Flow",
  title: "Terms of use",
  updated: "Last updated: {date}",
  back: "Back to home",
  toc: "On this page",
  intro: [
    `These terms govern the use of Sales Flow, a WhatsApp customer service, CRM and automation platform provided by ${name}, a Brazilian company registered under CNPJ ${cnpj}, based in São Paulo, Brazil, email ${email} ("Sales Flow", "we"), including the website ${site}, the dashboard, the APIs and the integrations (the "Platform").`,
    "By creating an account, subscribing to a plan or using the Platform, you (the \"Customer\") confirm that you have read and accept these terms and the privacy policy.",
  ],
  sections: [
    {
      title: "Services",
      body: [
        "Sales Flow combines multi-user WhatsApp customer service, CRM, automations and follow-ups, artificial intelligence features and ad reporting, with integrations with messaging channels (including the official WhatsApp Business API), social networks and other tools.",
        "Features may vary by plan, version and active integrations. Third-party services may require the Customer's own credentials, approvals or subscriptions.",
        "The Platform is intended for businesses and professionals, such as clinics, using it in the course of their business, and not for consumers.",
      ],
    },
    {
      title: "Account and Customer responsibilities",
      body: [
        "The Customer must have the capacity and authority to contract on their own behalf or on behalf of the business they represent, and is responsible for:",
        [
          "The accuracy of the account details.",
          "Keeping logins, passwords and API keys safe.",
          "Their team's use of the Platform.",
          "The setup of automations, flows, AI replies and messages sent.",
          "Complying with applicable law and the policies of integrated channels, including WhatsApp Business and Meta rules.",
        ],
        "Irregularities such as spam, unauthorised lists, messages outside template rules or prohibited content may lead channel providers to limit or block the account. In such cases we may suspend use to avoid external sanctions.",
      ],
    },
    {
      title: "Acceptable use",
      body: [
        "You must not: break the law (for example, data protection and electronic communications rules); infringe third-party rights; collect or use data without a legal basis; message people who have not agreed to be contacted; send unlawful, discriminatory, abusive or misleading content; reverse engineer the Platform, scrape it improperly or attack its security.",
        "We may investigate breaches and take appropriate action, including suspending or closing the account.",
      ],
    },
    {
      title: "Plans, prices and payment",
      body: [
        [
          "Subscriptions are monthly and paid in advance for each billing cycle, at the plan price published at the time of purchase or agreed in writing.",
          "On top of the subscription, each automation run by the Platform (webhook triggered, broadcast or follow-up sent) is charged per use, at the amount published on the pricing page.",
          "Template messages sent through the official WhatsApp API are billed by Meta directly to the Customer. We charge no commission on them.",
          "Non-payment may lead to suspension of access from the 5th day after the due date, without prejudice to collecting the amounts owed.",
          "Amounts paid are not refundable for partially used periods, unless the law provides otherwise.",
          "Taxes are borne by whoever the law designates.",
          "We may update prices and plans with reasonable prior notice, effective from the next billing cycle.",
        ],
      ],
    },
    {
      title: "Changing plans",
      body: [
        "Upgrades take effect immediately or at the next cycle, depending on the commercial terms. Downgrades take effect at the next cycle and may reduce features and limits.",
      ],
    },
    {
      title: "Third-party integrations",
      body: [
        "The Platform integrates with third-party services such as Meta (WhatsApp Business, Instagram, Facebook), Google and CRMs, which have their own terms and policies and may change them unilaterally.",
        "The Customer is responsible for obtaining authorisations, numbers and templates and for following those services' rules. We are not liable for outages, rule changes, blocks or costs imposed by third parties.",
      ],
    },
    {
      title: "Artificial intelligence",
      body: [
        "AI features (automatic replies, detection of contact details and lead temperature, audio transcription and others) generate content automatically and can make mistakes. The Customer sets the instructions, reviews the setup and is responsible for the messages sent on their behalf.",
        "For these features, the necessary data is processed by AI providers we engage, under the same confidentiality and data protection obligations.",
      ],
    },
    {
      title: "Data protection",
      body: [
        "Both parties comply with applicable data protection law, including the GDPR where it applies and Brazil's LGPD. In customer service flows, the Customer is the controller and Sales Flow is the processor, handling data on the Customer's behalf and following their instructions (Article 28 GDPR).",
        "The Customer confirms they have a legal basis for their processing, including special categories of data such as patients' health data (Article 9 GDPR), and undertakes to respect data subjects' rights.",
        "When the contract ends, we delete or return the data processed as a processor, except for backups and logs kept by legal obligation, for as long as strictly necessary. Details are set out in a data processing agreement (DPA), available on request. See the privacy policy for more information.",
      ],
    },
    {
      title: "Content and intellectual property",
      body: [
        "The Customer's data, lists, messages, files, flows, prompts and templates remain the Customer's, who grants us a non-exclusive licence to process them solely to provide the services.",
        "The Platform, its code, brands, layouts and documentation belong to Talker Flow Tecnologia and are protected by intellectual property rights. They may not be reproduced, modified or distributed without written permission.",
      ],
    },
    {
      title: "Availability and support",
      body: [
        "We use commercially reasonable efforts to keep the Platform available and secure. Maintenance may take place, preferably outside peak hours.",
        "Support is provided through the published channels and hours and may vary by plan.",
      ],
    },
    {
      title: "Warranties and limitation of liability",
      body: [
        "The Platform is provided as is and as available. We do not guarantee specific business results, uninterrupted or error-free operation, compatibility with every third-party system or the absence of blocks by external providers.",
        "Except in cases of wilful misconduct, gross negligence or mandatory law, our total liability for direct damages is limited to the amount paid by the Customer in the 3 months before the event. Indirect damages, loss of profit and loss of opportunity are excluded to the fullest extent permitted.",
      ],
    },
    {
      title: "Indemnity",
      body: [
        "The Customer agrees to indemnify Sales Flow for losses, damages and costs arising from misuse of the Platform, breach of these terms, breach of the law or channel policies, and the content and data they provide.",
      ],
    },
    {
      title: "Term, cancellation and termination",
      body: [
        "The contract runs indefinitely while a subscription is active, with no minimum term.",
        "The Customer may cancel at any time, effective at the end of the current cycle. Amounts already paid are not refunded.",
        "We may suspend or end access for non-payment, breach of these terms, legal order or risk to the security and stability of the service. When the contract ends, access stops and data is handled as described under \"Data protection\".",
      ],
    },
    {
      title: "Notices",
      body: [
        `Operational notices may be sent to the registered email, through the dashboard or through support channels. Formal notices must be sent to ${email}.`,
      ],
    },
    {
      title: "Anti-corruption",
      body: [
        "Both parties comply with applicable anti-corruption laws and do not offer or request undue advantages. A breach of this clause allows the contract to be terminated.",
      ],
    },
    {
      title: "Changes to these terms",
      body: [
        "We may update these terms to reflect legal, technical or commercial changes. Significant changes are notified with reasonable advance notice and apply from the next cycle or from the date stated in the notice. Continuing to use the Platform afterwards means accepting the new version.",
      ],
    },
    {
      title: "General",
      body: [
        "If any clause is held invalid, the rest remain in force. The Customer may not assign these terms without our consent; we may assign them in a corporate reorganisation.",
        "These terms are governed by Brazilian law and the courts of São Paulo (Brazil) have jurisdiction, without prejudice to mandatory rules that apply to the Customer in their country.",
      ],
    },
  ],
};

export const TERMS: Record<LegalVariant, LegalDoc> = { "pt-BR": ptBR, "pt-PT": ptPT, es, en };
