# Contact email setup

The contact form saves valid inquiries in MongoDB and delivers them through Resend. The inbox notification uses the visitor's address as `Reply-To`, so replying from your mail client goes directly to the sender.

## 1. Configure Resend

1. Create a Resend account and open **Domains**.
2. Add the domain that will send portfolio mail, for example `yourdomain.com`.
3. Add the SPF and DKIM records shown by Resend to the domain's DNS provider and wait for the sending status to become verified.
4. Create an API key with sending permission and copy it once.
5. Choose a sender on that verified domain, for example `Research Portfolio <contact@yourdomain.com>`.

Official references: [Resend Next.js guide](https://resend.com/docs/send-with-nextjs) and [domain verification guidance](https://resend.com/docs/dashboard/domains/introduction).

## 2. Localhost

Create or update `.env.local` in the project root:

```dotenv
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=re_your_real_api_key
EMAIL_FROM=Research Portfolio <contact@yourdomain.com>
CONTACT_RECIPIENT_EMAIL=your-inbox@gmail.com
```

`CONTACT_RECIPIENT_EMAIL` is the inbox that receives form submissions. You may omit it and set **Admin → Profile → Public email** instead; the environment value has priority.

Restart the development server after changing environment variables:

```bash
npm run dev
```

Submit a real message at `http://localhost:3000/contact`. Confirm all three results:

- the page shows “Message delivered successfully”;
- the destination inbox receives the message;
- Resend **Emails** shows an accepted/sent delivery.

If delivery fails, the form reports that the inquiry was saved but not delivered. Check the Resend Emails log, sender-domain status, and server console. Do not use `onboarding@resend.dev` for launch traffic.

## 3. Deployed version

In Vercel, Railway, or the chosen host, add the same four variables to the deployment's server-side environment settings. Set:

```dotenv
NEXT_PUBLIC_APP_URL=https://your-exact-production-domain.com
```

Use the exact canonical origin, including `www` if the live site uses it. Add the variables to the **Production** environment (and Preview if preview deployments must send), then redeploy so the server picks them up.

Run one end-to-end test from the deployed `/contact` page. Verify the inbox, the Resend Emails event, the MongoDB contact record, and the Reply button in the received message.

## 4. Social contact buttons

Open **Admin → Profile** and add complete HTTPS URLs for:

- LinkedIn
- GitHub
- Facebook
- WhatsApp, using `https://wa.me/COUNTRYCODEANDNUMBER` with digits only

Empty or invalid placeholder values are hidden on the public contact page. Saving the profile refreshes the public pages automatically.

## Launch checks

- Keep the Resend API key only in `.env.local` and deployment secrets; never commit it.
- Keep MongoDB configured so every inquiry has a recoverable database record.
- Send from a verified domain and inspect SPF/DKIM status before launch.
- Test one Gmail/Google Workspace inbox and one Outlook inbox if available.
- Check Spam once, then mark the sender as trusted if necessary.
- Confirm that replying to the notification addresses the original visitor.
