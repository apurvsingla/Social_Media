const nodemailer = require('../config/nodemailer');

// This is another way of exporting a method 
exports.newComment = (comment) => {
    // console.log('inside newComment Mailer', comment);
    //inside render template data, relative path
    let htmlString = nodemailer.renderTemplate({ comment: comment }, '/comments/new_comment.ejs')

    nodemailer.transporter.sendMail({
        from: 'email@gmail.com',
        to: comment.user.email,
        subject: "New Comment Published",
        html: htmlString
    }, (err, info) => {
        if (err) {
            console.log('Error in Sending mail', err);
            return;
        }
        // console.log('Mail Delivered', info);
        return;
    });
}
