import 'dotenv/config';
import app from './src/app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SSS Verification Tool running on port ${PORT}`);
  console.log(`LLM Provider: ${process.env.LLM_PROVIDER || 'openai'}`);
});
