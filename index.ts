const express:any = require('express');
const { body, validationResult} = require("express-validator");
const app:any = express();

const dotenv:any = require('dotenv');
const jwt:any = require('jsonwebtoken');

dotenv.config();


const url = require('url');

const mongoServer = require(__dirname + '/config/db.ts');
mongoServer();


const nodemailer:any = require('nodemailer');

const bodyParser:any = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.json());

app.use(express.static(__dirname + '/Form/styles'));


const User = require("./model/user");

const multer  = require('multer')
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const uuid= require("uuid")


const {S3Client, PutObjectCommand, GetObjectCommand} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const bucketName=process.env.BUCKET_NAME;
const bucketRegion=process.env.BUCKET_REGION;
const accessKey=process.env.ACCESS_KEY;
const secretAccessKey=process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
    },
    region: bucketRegion,
})

app.get('/login', (req:any, res:any) => {
    res.sendFile(__dirname+'/Form/src/login.html');
});

app.post('/login',[
    body("email", "Please enter a valid Email").isEmail(),
    body("password", "Password Should be atleast 6 characters").isLength({
        min: 6
    })
], async (req:any, res:any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {email , password} = req.body;
    try{
        let user = await User.findOne({
            email
        });
        if(!user){
            return res.status(400).json({message: "User Not Exist"});      
        }

        if (user.password !== password)
          return res.status(400).json({
            message: "Incorrect Password!"
        });
  
        const payload = {
            user: {
              id: user.id
            }
          };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);  
        res.send({status:200, message: 'Success', jwt_token:token})
    }
    catch(err){
        console.log(err);
    }

})

app.get('/register', (req:any, res: any) => {
    res.sendFile(__dirname+'/Form/src/signup.html');
})

app.post('/register',[
    body("first_name", "Please Enter a Valid first name")
    .not()
    .isEmpty(),
    body("last_name", "Please Enter a Valid last name")
    .not()
    .isEmpty(),
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Password should be at least 6 characters").isLength({
        min: 6
    }),
    body("age", "Please enter a valid age").not().isEmpty(),
    body("city", "Please enter a valid city").not().isEmpty(),
],
 async (req:any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {email, password, first_name, last_name, age, city} = req.body;
    let payload, token;
    try{
        let user = await User.findOne({
            email
        });
        if (user) {
            return res.status(400).json({
                msg: "User Already Exists"
            });
        }
        user = new User({
            email, password, first_name, last_name, age, city
        })

        await user.save();

        payload = {
            user: {
                id: user.id
            }
        };

        token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

    }
    catch(err) {
        console.log(err);
        res.status(500).send("Error in saving User");
    }
    try {
        let transport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'yash.gaur.e@gmail.com',
                pass: 'eiqbfwlsymtwxxev'
            }
        });

        let mailOptions = {
            from: 'Yash gaur',
            to : email,
            subject: "Email Confirmation",
            text: "Thank you for registering at zekademy Project. We are happy to have you aboard."
        }

        transport.sendMail(mailOptions, (err:any) => {
            if(err) console.log(err)
            else {
                console.log("message sent!");
            }
        })
        if(token)
            res.send({status:200, message: 'Success', jwt_token:token})
    } catch(err) {
        console.log(err);
    }
})


app.post('/upload', upload.single('image'),  async (req:any, res:any) => {
    console.log(req.file);
    const params = {
        Bucket: bucketName,
        Key: uuid.v4(),
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    }

    const command = new PutObjectCommand(params);

try{
    await s3.send(command);
    res.send({
        status: 200,
        message: "Success",
        img_id: params.Key,
    })
} 
catch(err){
    console.log(err);
    res.send({
        status:500,
        message: "Error Uploading Image"
    })
}
})

app.get('/:imageId', async(req: any, res:any) => {
    const myUrl = req.url;
    const imageId = myUrl.slice(1);
    console.log(imageId);
    const getObjparams = {
        Bucket: bucketName,
        Key: imageId
    }
    const command = new GetObjectCommand(getObjparams);
    try{
        const imageURL =  await getSignedUrl(s3, command);
        console.log(imageURL);
        res.send(imageURL);
    }
    catch(err) {
        console.log(err);
    }
})

    
const port:any = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}..`));
