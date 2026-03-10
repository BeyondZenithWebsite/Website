import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { ensureGeoSetup, prisma } from './config/db';
import { authRouter } from './routes/auth';
import { poiRouter } from './routes/pois';
import { roamingRouter } from './routes/roaming';
import { storyRouter } from './routes/stories';
import { prefRouter } from './routes/preferences';
import { interactionRouter } from './routes/interactions';
import { adminRouter } from './routes/admin';

const app = express();
app.use(cors({ origin: [env.webOrigin, '*'] }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/auth', authRouter);
app.use('/pois', poiRouter);
app.use('/roaming', roamingRouter);
app.use('/stories', storyRouter);
app.use(prefRouter);
app.use(interactionRouter);
app.use(adminRouter);

const boot = async () => {
  await ensureGeoSetup();
  app.listen(env.port, () => console.log(`API on :${env.port}`));
};

boot().catch((e) => {
  console.error(e);
  process.exit(1);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
