import { Hono } from "hono";
import checkRoute from "./check";
import uploadRoute from "./upload";
import downloadRoute from "./download";
import deleteRoute from "./delete";

const router = new Hono();

router.route("/", checkRoute);
router.route("/", uploadRoute);
router.route("/", downloadRoute);
router.route("/", deleteRoute);

export default router;
