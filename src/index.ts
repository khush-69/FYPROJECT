import { PrismaClient } from "@prisma/client";
import express, { Express, Request, Response } from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import { error } from "console";
const app: Express = express();
const Prisma = new PrismaClient();
app.use(express.json());
app.use(cors());
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

//Customer CRUD Operations
app.get("/customers", async (req, res) => {
  try {
    const customers = await Prisma.customer.findMany();
    if (!customers.length) throw new Error("No Customer Found");
    res.send(customers);
  } catch (error) {
    res.status(404).send("No Customer Found");
  }
});

app.get("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Prisma.customer.findMany({
      where: {
        id: id,
      },
    });
    res.json(customer);
  } catch (error) {
    res.status(404).send("Customer does not exist");
  }
});

app.post("/customers", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const data = {
      ...req.body,
      password: hashedPassword,
    };
    const existingCustomer = await Prisma.customer.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (existingCustomer) throw new Error("Customer already exists");
    const customer = await Prisma.customer.create({
      data: data,
    });
    res.status(201).send(customer);
  } catch (error) {
    res.status(404).send("Unable to Post" + error);
  }
});

app.delete("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Prisma.customer.delete({
      where: {
        id: id,
      },
    });
    res.send("Customer Removed");
  } catch (error) {
    res.status(404).send("Customer Not Found");
  }
});

app.patch("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
    }
    const customer = await Prisma.customer.update({
      where: {
        id: id,
      },
      data: req.body,
    });
    res.send(customer);
  } catch (error) {
    res.status(404).send("Customer Not Found");
  }
});

//Items CRUD Operations

app.get("/items", async (req, res) => {
  try {
    const items = await Prisma.items.findMany();
    if (!items.length) throw new Error("No Items Found");
    res.send(items);
  } catch (error) {
    res.status(404).send("No Items Found" + error);
  }
});

app.get("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Prisma.items.findMany({
      where: {
        id: id,
      },
    });
    res.json(item);
  } catch (error) {
    res.status(404).send("Customer does not exist");
  }
});

app.post("/items", async (req, res) => {
  try {
    const item = await Prisma.items.create({
      data: req.body,
    });
    res.status(201).send(item);
  } catch (error) {
    res.status(404).send("Unable to Post" + error);
  }
});

app.delete("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Prisma.items.delete({
      where: {
        id: id,
      },
    });
    res.send("item Removed");
  } catch (error) {
    res.status(404).send("item Not Found");
  }
});

app.patch("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Prisma.items.update({
      where: {
        id: id,
      },
      data: req.body,
    });
    res.send(item);
  } catch (error) {
    res.status(404).send("Item Not Found");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
