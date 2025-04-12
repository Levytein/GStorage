import {Router, Request,Response} from 'express'
import {loadInitial,loadFolder,createAccount,login,uploadFile,signUpPage,newFolder,supabase,viewFolder} from '../controllers/userController'
import requireAuth from '../middleware/requireAuth';
import upload from '../config/multerConfig'

const router = Router();


router.post("/newFolder",newFolder);
router.get("/",loadInitial);
router.get("/sign-up",signUpPage);
router.get("/home",requireAuth,loadFolder);
router.get("/folder?:folderId",requireAuth, viewFolder);
router.get("/log-out", requireAuth,async (req :Request, res :Response, next :any) => {
    const {error} = await supabase.auth.signOut();

    if(error){
      console.error("Error logging out:", error.message);

    }
    else{
      console.log("User logged out successfully");
    }
    res.redirect("/");
  });

router.post("/upload",requireAuth,upload.single('file'),uploadFile);

router.post("/sign-up",createAccount);
router.post("/log-in", login);
export default router;
