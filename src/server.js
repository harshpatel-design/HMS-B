dotenv.config();
const PORT = process.env.PORT || 5000;

// create folders safely
fs.mkdirSync("uploads/users", { recursive: true });
fs.mkdirSync("uploads/patients", { recursive: true });
fs.mkdirSync("uploads/appointments", { recursive: true });

const app = express();

// middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// static files
app.use("/uploads/users", express.static(path.join(process.cwd(), "uploads/users")));
app.use("/uploads/patients", express.static(path.join(process.cwd(), "uploads/patients")));
app.use("/uploads/appointments", express.static(path.join(process.cwd(), "uploads/appointments")));

// routes
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/auth", authRoutes);
// ... other routes

app.use(errorHandler);

// start server
const start = async () => {
    await connectDB(process.env.MONGO_URL);
    app.listen(PORT, () => logger.info(`🚀 Server running at port ${PORT}`));
};

start();
