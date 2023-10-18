  // =======================================================================\\
 // ==============="RESPECTER LE MVC "MODELE VIEW CONTROLLER"=============== \\
//============================================================================\\
const express = require('express')
const morgan = require('morgan')
const serveFavicon = require('serve-favicon')
const sequelize = require('./db/sequelize')
const app = express()
const port = 3005

const cors = require('cors')

// sequelize.initDb()

// Middleware
app
    .use(morgan('dev'))
    .use(serveFavicon(__dirname + '/favicon.ico'))
    .use(express.json())
    .use(cors())

    // je stocke dans une variable les routes de coworking
const coworkingRouter = require('./routes/coworkingRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')

// je dis à mon app d'utiliser les routes de coworking
app.use('/api/coworkings', coworkingRouter)
app.use('/api/users', userRouter)
app.use('/api/reviews',reviewRouter)

app.listen(port, () => {
    console.log(`L'app sur le port ${port}`)
})