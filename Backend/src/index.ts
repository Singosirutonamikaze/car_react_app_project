import mongoose from "mongoose";
import server from "./server";
import createDefaultAdmin from "./scripts/initAdmin";

const PORT = process.env.PORT || 5000;

mongoose.connection.once('open', async () => {
  console.log('Connecté à MongoDB');
  await createDefaultAdmin();
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
