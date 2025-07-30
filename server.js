//Point d'entrée de l'application
require('dotenv').config(); //Charge les variables d'environnement
const express = require('express');
const app = express();
const DB_URI = process.env.DB_URI;
const port = process.env.PORT || 3000;
const connectDB = require('./config/database');


//Connexion à la base de données
connectDB(DB_URI);

//Middleware
app.use(express.json());

const AuthRoutes = require('./Routes/authRoutes');
app.use('/api/auth', AuthRoutes);

const OfferRoutes = require('./Routes/offerRoutes');
app.use('/api/offers', OfferRoutes);

const StageRoutes = require('./Routes/stageRoutes');
app.use('/api/stages', StageRoutes);

const EvaluationRoutes = require('./Routes/evaluationRoutes');
app.use('/api/evaluations', EvaluationRoutes);

//Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
