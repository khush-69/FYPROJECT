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

//orders query

app.get("/orders", async (req, res) => {
  try {
    const orders = await Prisma.order.findMany();
    if (!orders.length) throw new Error("No orders Found");
    res.send(orders);
  } catch (error) {
    res.status(404).send("No orders Found" + error);
  }
});

app.get("/order/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Prisma.order.findMany({
      where: {
        id: id,
      },
    });
    res.json(order);
  } catch (error) {
    res.status(404).send("Order does not exist");
  }
});

app.post("/orders", async (req, res) => {
  try {
    const { itemId } = req.body;

    const item = await Prisma.items.findFirst({
      where: {
        id: itemId,
      },
    });

    if (!item) {
      return res.status(404).send("Item not found");
    }
    console.log("req.body", req.body);
    try {
      const order = await Prisma.order.create({
        data: {
          customerid: req.body.customerId,
          date: req.body.date,
          netamount: req.body.netAmount,
          status: req.body.status,
          // addresses: {
          //   connect: {
          //     id: req.body.addressId,
          //   },
          // },
          customercomment: req.body.customercomments,
          // payment: {
          //   connect: {
          //     id: req.body.paymentId,
          //   },
          // },
          items: {
            connect: {
              id: itemId,
            },
          },
        },
      });
      res.status(201).send(order);
    } catch (error) {
      console.log("erro", error);
    }
  } catch (error) {
    res.status(500).send("Unable to create order: " + error);
  }
});
app.delete("/order/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Prisma.order.delete({
      where: {
        id: id,
      },
    });
    res.send("Order Removed");
  } catch (error) {
    res.status(404).send("Order Not Found");
  }
});

app.patch("/order/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        customerid: req.body.customerId,
        date: req.body.date,
        netamount: req.body.netamount,
        status: req.body.status,
        customercomment: req.body.customercomments,
      },
    });

    res.status(200).send(order);
  } catch (error) {
    res.status(500).send("Unable to update order: " + error);
  }
});

//address query
app.get("/address", async (req, res) => {
  try {
    const address = await Prisma.addresses.findMany();
    if (!address.length) throw new Error("No address Found");
    res.send(address);
  } catch (error) {
    res.status(404).send("No address Found" + error);
  }
});

app.get("/address/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Prisma.addresses.findMany({
      where: {
        id: id,
      },
    });
    res.json(address);
  } catch (error) {
    res.status(404).send("address does not exist");
  }
});

app.post("/address", async (req, res) => {
  try {
    const { customerId } = req.body;
    const customer = await Prisma.customer.findFirst({
      where: {
        id: customerId,
      },
    });
    if (!customer) {
      return res.status(404).send("Customer not found");
    }
    const address = await Prisma.addresses.create({
      data: {
        customerId: req.body.customerId,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        zipCode: req.body.zipCode,
        middleName: req.body.middleName,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
      },
    });
    res.status(201).send(address);
  } catch (error) {
    res.status(404).send("Unable to Post" + error);
  }
});

app.patch("/address/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Prisma.addresses.update({
      where: {
        id: id,
      },
      data: {
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        zipCode: req.body.zipCode,
        middleName: req.body.middleName,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
      },
    });
    res.send(address);
  } catch (error) {
    res.status(404).send("address Not Found " + error);
  }
});

app.delete("/address/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Prisma.addresses.delete({
      where: {
        id: id,
      },
    });
    res.send("Address Removed");
  } catch (error) {
    res.status(404).send("address Not Found");
  }
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
