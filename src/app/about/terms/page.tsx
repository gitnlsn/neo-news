import { PublicLayout } from "~/components/layout/public-layout";
import { Container } from "~/components/ui/container";
import { Typography } from "~/components/ui/typography";

export default function TermsPage() {
  return (
    <PublicLayout>
      <Container className="py-8 space-y-8">
        <div className="space-y-4">
          <Typography.H1>Termos de Uso</Typography.H1>
          <Typography.P className="text-muted-foreground">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </Typography.P>
        </div>

        <section className="space-y-4">
          <Typography.H2>1. Aceitação dos Termos</Typography.H2>
          <Typography.P>
            Ao acessar e utilizar esta plataforma, você concorda em cumprir e
            estar vinculado aos seguintes termos e condições de uso. Se você não
            concordar com qualquer parte destes termos, não deverá usar nossos
            serviços.
          </Typography.P>
        </section>

        <section className="space-y-4">
          <Typography.H2>2. Uso da Plataforma</Typography.H2>
          <Typography.P>
            2.1. Você deve ter pelo menos 18 anos de idade para usar este
            serviço.
          </Typography.P>
          <Typography.P>
            2.2. Você é responsável por manter a confidencialidade de sua conta
            e senha.
          </Typography.P>
          <Typography.P>
            2.3. Você concorda em não usar a plataforma para fins ilegais ou não
            autorizados.
          </Typography.P>
        </section>

        <section className="space-y-4">
          <Typography.H2>3. Conteúdo do Usuário</Typography.H2>
          <Typography.P>
            3.1. Ao publicar conteúdo em nossa plataforma, você mantém seus
            direitos autorais, mas concede uma licença não exclusiva para usar,
            modificar, executar publicamente e exibir o conteúdo.
          </Typography.P>
          <Typography.P>
            3.2. Você é inteiramente responsável por qualquer conteúdo que
            publique.
          </Typography.P>
        </section>

        <section className="space-y-4">
          <Typography.H2>4. Propriedade Intelectual</Typography.H2>
          <Typography.P>
            4.1. Todo o conteúdo original desta plataforma, incluindo textos,
            gráficos, logos e código, é propriedade exclusiva nossa e está
            protegido por leis de direitos autorais.
          </Typography.P>
        </section>

        <section className="space-y-4">
          <Typography.H2>5. Limitação de Responsabilidade</Typography.H2>
          <Typography.P>
            5.1. A plataforma é fornecida "como está", sem garantias de qualquer
            tipo.
          </Typography.P>
          <Typography.P>
            5.2. Não nos responsabilizamos por quaisquer danos diretos,
            indiretos, incidentais ou consequenciais.
          </Typography.P>
        </section>

        <section className="space-y-4">
          <Typography.H2>6. Modificações dos Termos</Typography.H2>
          <Typography.P>
            6.1. Reservamos o direito de modificar estes termos a qualquer
            momento. As alterações entram em vigor imediatamente após sua
            publicação na plataforma.
          </Typography.P>
        </section>

        <section className="space-y-4">
          <Typography.H2>7. Contato</Typography.H2>
          <Typography.P>
            7.1. Para questões relacionadas a estes termos de uso, entre em
            contato conosco através do email: contato@plataforma.com
          </Typography.P>
        </section>
      </Container>
    </PublicLayout>
  );
}
