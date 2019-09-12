let express = require("express");
let cors = require("cors")();

let app = express();

app.use(express.json());

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/express-in-action", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Products = mongoose.model(
  "Products",
  new mongoose.Schema({
    title: String
  })
);

// Products.insertMany([
//     {title: 'Apple'},
//     {title: 'Banana'},
//     {title: 'Cat'},
// ])

app.use("/static", express.static("public"));

app.use(cors);

app.get("/products", async (req, res) => {
  //   res.send(await Products.find());
  // skip表示跳过N条数据，limit表示取前N条数据
  const data1 = await Products.find()
    .skip(6)
    .limit(2);
  // where后面可以跟查询的对象值
  const data2 = await Products.find().where({
    title: "Apple"
  });
  // order 中 id参数为-1时倒序排序，1时正序排序
  const data3 = await Products.find().sort({
    id: -1
  });

  res.send(data3);
});

app.get('/products/:id', async (req,res)=>{
    const data = await Products.findById(req.params.id);
    res.send(data);
})

//新增数据
app.post("/products", async (req,res)=>{
  const data = req.body;
  const product = await Products.create(data);
  res.send(product);
})

//修改数据
app.put('/products/:id', async (req, res) => {
  const product = await Products.findById(req.params.id);
  product.title = req.body.title;
  await product.save();
  res.send(product);
});

//删除数据
app.delete('/products/:id', async (req, res) => {
  await Products.deleteOne({_id:req.params.id});
  res.send({
    success: true
  });
});

app.listen(4000, () => {
  console.log("app listening on port 4000!");
});
