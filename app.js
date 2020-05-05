const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
var hbs = exphbs.create({ /* config */ });
const app = express();
var config = require('./config/secret');
//-------------------------------------------------------------------------

app.engine('handlebars',exphbs());
app.set('view engine', 'handlebars');


//--------------------------------------------------------------------------
// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));
// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//---------------------------------------------------------------------------
app.get('/', (req, res) => {
  res.render('form',{layout: false});
});

app.post('/send', (req, res) => {
  const output = `
    <p>Birthday Invite</p>
    <ul>  
      <li>Person Inviting: ${req.body.name}</li>
      <li>Bday Boy/Girl: ${req.body.bday_boy_girl}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

//=========================================================================================
// create reusable transporter object using the default SMTP transport
 
      let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
          user: config.email, // generated ethereal user
          pass:  config.pw// generated ethereal password
      } ,
      tls:{
        rejectUnauthorized:false
      }
    });
  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Pals@Bday Invitation" <config.email>', // sender address
      to: config.users, // list of receivers
      subject: 'Bday Celebration Invitation', // Subject line
      text: 'Here your Invitation Link !', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      else
      {//res.render('form',{layout: false});
        console.log("Successfully Sent");
        res.redirect('/');
      }

      
  });
});

//============================================================================
app.listen(3000, () => console.log('Server started...'));