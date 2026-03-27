import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
  const html = `
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2d2d2d;">
  <div style="text-align: center; padding: 24px 0;">
    <img src="https://dreamteamafricamedia.b-cdn.net/logo/dream-team-africa-logo.png" alt="Dream Team Africa" style="height: 60px;" />
  </div>
  <div style="padding: 24px; background: #ffffff; border-radius: 12px; border: 1px solid #e8e4df;">
    <p>Bonjour Lina,</p>
    <p>Nous vous remercions pour votre achat de <strong>2 billets</strong> pour la <strong>Foire d'Afrique Paris — 6ème Édition</strong>.</p>
    <p>Nous tenions à vous informer que vous avez réglé <strong>20\u202F€</strong> (soit 10\u202F€ par billet), alors qu'une offre promotionnelle <strong>"Last Chance"</strong> à <strong>7\u202F€ par billet</strong> était en cours au moment de votre achat. Vous auriez dû en bénéficier.</p>
    <p>Nous nous excusons pour ce désagrément et souhaitons vous proposer deux options\u202F:</p>
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <tr>
        <td style="padding: 12px; background: #f9f7f4; border-radius: 8px 8px 0 0; border-bottom: 1px solid #e8e4df;">
          <strong>Option 1</strong> — Recevoir un remboursement de <strong>6\u202F€</strong> sur votre moyen de paiement d'origine
        </td>
      </tr>
      <tr>
        <td style="padding: 12px; background: #f9f7f4; border-radius: 0 0 8px 8px;">
          <strong>Option 2</strong> — Offrir ces <strong>6\u202F€</strong> à l'association Dream Team Africa, qui œuvre pour la promotion de la culture africaine en France
        </td>
      </tr>
    </table>
    <p>Merci pour votre soutien aux artisans africains et au plaisir de vous accueillir les 1er et 2 mai\u202F!</p>
    <p>Chaleureusement,<br/><strong>L'équipe Dream Team Africa</strong></p>
  </div>
  <div style="text-align: center; padding: 16px 0; font-size: 12px; color: #999;">
    Dream Team Africa — hello@dreamteamafrica.com
  </div>
</div>`;

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: "linajali.jl@gmail.com",
    subject: "Un geste pour vous — Foire d'Afrique Paris 2026",
    html,
  });
  if (error) console.error("ERREUR:", error);
  else console.log("OK linajali.jl@gmail.com (Lina) — id:", data?.id);
}

main();
