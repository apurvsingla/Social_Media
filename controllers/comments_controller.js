const Comment = require('../models/comments');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');


module.exports.create = async function(req, res) {
    try {
        let post = await Post.findById(req.body.post);
        if (post) {
            let comment = await Comment.create({
                    content: req.body.content,
                    post: req.body.post,
                    user: req.user._id
                })
                // handle error
            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user', 'name email').execPopulate();
            // commentsMailer.newComment(comment);
            //name must be same as in worker i.e emails
            let job = queue.create('emails', comment).save(function(err) {
                if (err) {
                    console.log('error in sending to the queue', err);
                }
                console.log('job queued', job.id);

            });

            if (req.xhr) {
                // Similar for comments to fetch the user's id!


                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }


            req.flash('success', 'Comment published!');
            res.redirect('/');
        }
    } catch (error) {
        console.log('Error', err);
        return;
    }
}

//keeping this normal for remembring
module.exports.destroy = function(req, res) {
    Comment.findById(req.params.id, function(err, comment) {
        // .id means converting the object id into string
        if (comment.user == req.user.id) {
            let postId = comment.post;
            comment.remove();
            Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } }, function(err, post) {
                return res.redirect('back');
            })
        } else {
            return res.redirect('back');
        }
    })
}