import express from 'express'
import session from 'express-session'
import path from 'node:path'
import passport from 'passport'
import userRoutes from './routes/userRoutes'
import pgSession from 'connect-pg-simple'
import pg from 'pg'
import dotenv from 'dotenv'
import './config/passportConfig'
import multer from 'multer'


dotenv.config();
const storage = multer.memoryStorage();
const upload = multer({storage});
const app = express();
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});
const secret = process.env.HAMBURGER || 'default_secret_key';
app.set("views", path.join(__dirname, "src/views"));
app.use("/public", express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const PgStore = pgSession(session);

app.use(session({
  store:new PgStore({
    pool: pool,
    tableName:"session",
    createTableIfMissing:false,
  }),
  secret: secret,
  resave:false,
  saveUninitialized:false,
  cookie:{
    maxAge: 24 * 60 * 60 * 1000,
    secure:false,
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/",userRoutes);
app.use("/upload",userRoutes);
/*

  */
app.listen(3000, () => console.log("app listening on port 3000!"));

/*
async function main() {

}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  */